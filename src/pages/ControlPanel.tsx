import React, { useEffect, useState, useRef } from 'react';
import SensorCard from '../components/SensorCard';
import AlertModal from '../components/AlertModal';
import * as api from '../api/backend';

type Profile = { id: string; name: string; oxygenWarn?: number; oxygenDanger?: number };
type AlertItem = { id: string; message: string; level?: 'info' | 'warn' | 'danger'; visible?: boolean };

const defaultProfiles: Profile[] = [
    { id: 'commander', name: 'Commander', oxygenWarn: 19.5, oxygenDanger: 18.5 },
    { id: 'engineer', name: 'Engineer', oxygenWarn: 19.0, oxygenDanger: 18.0 },
];

const AUTO_DISMISS_MS = 2000;
const FADE_MS = 500;

const ControlPanel: React.FC = () => {
    const [env, setEnv] = useState<Record<string, any>>({
        humidity: null,
        temperature: null,
        oxygen: null,
        water_detected: null,
        light: null,
        water_conductivity: null,
    });
    const [history, setHistory] = useState<Record<string, number[]>>({});
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [profiles] = useState<Profile[]>(defaultProfiles);
    const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0].id);
    const [ledOn, setLedOn] = useState(false);
    const [fanOn, setFanOn] = useState(false);
    const pollingRef = useRef<number | null>(null);

    const alertTimersRef = useRef<Record<string, { fade?: number; remove?: number }>>({});

    const prevOxygenRef = useRef<number | null>(null);
    const prevWaterRef = useRef<boolean | null>(null);

    const activeProfile = profiles.find((p) => p.id === activeProfileId)!;

    const addAlert = (alert: AlertItem, autoDismiss = true) => {
        const withVisible: AlertItem = { ...alert, visible: true };
        setAlerts((prev) => [...prev, withVisible]);

        if (autoDismiss) {
            const existing = alertTimersRef.current[alert.id];
            if (existing) {
                if (existing.fade) clearTimeout(existing.fade);
                if (existing.remove) clearTimeout(existing.remove);
            }

            const fadeDelay = Math.max(0, AUTO_DISMISS_MS - FADE_MS);
            const fadeTimer = window.setTimeout(() => {
                setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, visible: false } : a)));
            }, fadeDelay);

            const removeTimer = window.setTimeout(() => {
                closeAlert(alert.id);
            }, AUTO_DISMISS_MS);

            alertTimersRef.current[alert.id] = { fade: fadeTimer, remove: removeTimer };
        }
    };

    const closeAlert = (id: string) => {
        // clear any scheduled timers
        const timers = alertTimersRef.current[id];
        if (timers) {
            if (timers.fade) clearTimeout(timers.fade);
            if (timers.remove) clearTimeout(timers.remove);
            delete alertTimersRef.current[id];
        }
        // remove from state immediately
        setAlerts((a) => a.filter((x) => x.id !== id));
    };

    useEffect(() => {
        let mounted = true;

        const pushHistory = (data: Record<string, any>) => {
            setHistory((prev) => {
                const next = { ...prev };
                Object.entries(data).forEach(([k, v]) => {
                    const n = typeof v === 'number' ? v : NaN;
                    const arr = [...(next[k] || []), isNaN(n) ? 0 : n].slice(-60);
                    next[k] = arr;
                });
                return next;
            });
        };

        const checkAlerts = (data: Record<string, any>) => {
            // Oxygen: generate a single alert when oxygen first drops below the profile's warn threshold.
            // Do not spam repeated alerts while oxygen remains below the warning threshold.
            const oxygen = typeof data.oxygen === 'number' ? data.oxygen : NaN;
            const prevO = prevOxygenRef.current;
            const warn = activeProfile?.oxygenWarn;
            const danger = activeProfile?.oxygenDanger;

            if (!isNaN(oxygen) && warn !== undefined) {
                // If previously above warn (or unknown) and now <= warn -> alert once.
                if ((prevO === null || prevO > warn) && oxygen <= warn) {
                    const level = danger !== undefined && oxygen <= danger ? 'danger' : 'warn';
                    addAlert({ id: `oxy-${Date.now()}`, message: `Oxygen low: ${oxygen}%`, level });
                }
            }

            // Water: reverse logic — alert when THERE ISN'T water (water_detected === false).
            // Only alert once when it changes from true (or unknown) to false.
            const waterPresent = data.water_detected === true;
            const prevWater = prevWaterRef.current;
            if (waterPresent === false) {
                if (prevWater === null || prevWater === true) {
                    addAlert({ id: `water-missing-${Date.now()}`, message: `Water not detected in the system!`, level: 'warn' });
                }
            }

            // Update previous values for edge detection
            prevOxygenRef.current = isNaN(oxygen) ? prevOxygenRef.current : oxygen;
            prevWaterRef.current = waterPresent === true ? true : waterPresent === false ? false : prevWaterRef.current;
        };

        const normalizePercent = (raw: any): number | null => {
            if (raw === null || raw === undefined) return null;
            // If already a number, use it.
            if (typeof raw === 'number') return raw;
            // If string, strip non-numeric characters (handles trailing nulls/nonprintables) and parse.
            if (typeof raw === 'string') {
                const cleaned = raw.replace(/[^\d.\-eE+]/g, '').trim();
                if (!cleaned) return null;
                const parsed = parseFloat(cleaned);
                return Number.isFinite(parsed) ? parsed : null;
            }
            return null;
        };

        const doFetch = async () => {
            try {
                const raw = await api.getEnvironment();
                if (!mounted) return;

                // Normalize the incoming payload, specifically light and water_conductivity (6-byte strings -> float %)
                const normalized: Record<string, any> = { ...raw };
                normalized.light = normalizePercent(raw.light);
                normalized.water_conductivity = normalizePercent(raw.water_conductivity);

                setEnv(normalized);
                pushHistory(normalized);
                checkAlerts(normalized);
            } catch (err) {
                // keep backend-error persistent (don't auto-dismiss) and avoid duplicates
                setAlerts((prev) => {
                    if (prev.some((a) => a.id === 'backend-error')) return prev;
                    // use addAlert with autoDismiss=false for this one
                    addAlert({ id: 'backend-error', message: `Cannot reach backend: ${(err as Error).message}`, level: 'warn' }, false);
                    return prev; // addAlert already appended
                });
            }
        };

        doFetch();
        pollingRef.current = window.setInterval(doFetch, 2000);

        return () => {
            mounted = false;
            if (pollingRef.current) clearInterval(pollingRef.current);

            // clear any pending alert timers
            Object.values(alertTimersRef.current).forEach((t) => {
                if (t.fade) clearTimeout(t.fade);
                if (t.remove) clearTimeout(t.remove);
            });
            alertTimersRef.current = {};
        };
    }, [activeProfileId]); // re-run when profile changes

    const handleToggleLed = async () => {
        const target = !ledOn;
        setLedOn(target); // optimistic update
        const res = await api.setLed({ on: target });
        if (res.simulated) {
            addAlert({ id: `led-sim-${Date.now()}`, message: `LED ${target ? 'ON' : 'OFF'} (simulated)`, level: 'info' });
        } else if (!res.success) {
            setLedOn((s) => !s); // revert
            addAlert({ id: `led-err-${Date.now()}`, message: `LED command failed: ${res.message ?? 'unknown'}`, level: 'warn' });
        } else {
            addAlert({ id: `led-${Date.now()}`, message: `LED ${target ? 'ON' : 'OFF'}`, level: 'info' });
        }
    };

    const handleToggleFan = async () => {
        const target = !fanOn;
        setFanOn(target);
        const res = await api.setFan({ on: target });
        if (res.simulated) {
            addAlert({ id: `fan-sim-${Date.now()}`, message: `Fan ${target ? 'activated' : 'stopped'} (simulated)`, level: 'info' });
        } else if (!res.success) {
            setFanOn((s) => !s);
            addAlert({ id: `fan-err-${Date.now()}`, message: `Fan command failed: ${res.message ?? 'unknown'}`, level: 'warn' });
        } else {
            addAlert({ id: `fan-${Date.now()}`, message: `Fan ${target ? 'activated' : 'stopped'}`, level: 'info' });
        }
    };

    const sensorOrder = ['temperature', 'humidity', 'oxygen', 'light', 'water_conductivity', 'water_detected', 'camera'];

    return (
        <div className="p-6">
            <header className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Control Panel</h2>
                <div className="flex items-center space-x-4">
                    <select value={activeProfileId} onChange={(e) => setActiveProfileId(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded">
                        {profiles.map((p) => (
                            <option value={p.id} key={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {sensorOrder.map((key) => (
                    <SensorCard
                        key={key}
                        label={key === 'water_detected' ? 'Water Detected' : key === 'water_conductivity' ? 'Water Conductivity' : key.charAt(0).toUpperCase() + key.slice(1)}
                        value={env[key]}
                        unit={key === 'oxygen' || key === 'light' || key === 'water_conductivity' ? '%' : key === 'temperature' ? '*C' : key === 'humidity' ? '%' : undefined}
                        history={history[key]}
                        warningThreshold={key === 'oxygen' ? activeProfile?.oxygenWarn : undefined}
                        dangerThreshold={key === 'oxygen' ? activeProfile?.oxygenDanger : undefined}
                        onAction={null}
                        isWebcam={key === 'camera'}
                        iframeSrc={key === 'camera' ? 'http://192.168.137.250:9081' : undefined}
                        iframeTitle=""
                    />
                ))}

                <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 shadow-sm w-full">
                    <div className="text-sm text-gray-400 mb-2">Actuators</div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="text-sm">LED</div>
                            <div className="text-xs text-gray-400">Control indicator LED on Pi (simulated if backend missing)</div>
                        </div>
                        <div>
                            <button
                                onClick={handleToggleLed}
                                className={`px-3 py-1 rounded ${ledOn ? 'bg-green-500' : 'bg-gray-700'} hover:opacity-90`}
                            >
                                {ledOn ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="text-sm">Fan</div>
                            <div className="text-xs text-gray-400">Ventilation fan (simulated if backend missing)</div>
                        </div>
                        <div>
                            <button
                                onClick={handleToggleFan}
                                className={`px-3 py-1 rounded ${fanOn ? 'bg-green-500' : 'bg-gray-700'} hover:opacity-90`}
                            >
                                {fanOn ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                        Example controls — extend by adding real endpoints in <code className="bg-gray-800 px-1 rounded">backend_server.py</code>.
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">Raw telemetry</h3>
                <pre className="bg-gray-900 border border-gray-800 p-3 rounded text-xs overflow-auto max-h-48">
                    {JSON.stringify(env, null, 2)}
                </pre>
            </section>

            <AlertModal alerts={alerts} onClose={closeAlert} />
        </div>
    );
};

export default ControlPanel;