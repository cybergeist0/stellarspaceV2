// ...existing code...
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
        const timers = alertTimersRef.current[id];
        if (timers) {
            if (timers.fade) clearTimeout(timers.fade);
            if (timers.remove) clearTimeout(timers.remove);
            delete alertTimersRef.current[id];
        }
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
            const oxygen = typeof data.oxygen === 'number' ? data.oxygen : NaN;
            const prevO = prevOxygenRef.current;
            const warn = activeProfile?.oxygenWarn;
            const danger = activeProfile?.oxygenDanger;

            if (!isNaN(oxygen) && warn !== undefined) {
                if ((prevO === null || prevO > warn) && oxygen <= warn) {
                    const level = danger !== undefined && oxygen <= danger ? 'danger' : 'warn';
                    addAlert({ id: `oxy-${Date.now()}`, message: `Oxygen low: ${oxygen}%`, level });
                }
            }

            const waterPresent = data.water_detected === true;
            const prevWater = prevWaterRef.current;
            if (waterPresent === false) {
                if (prevWater === null || prevWater === true) {
                    addAlert({ id: `water-missing-${Date.now()}`, message: `Water not detected in the system!`, level: 'warn' });
                }
            }

            prevOxygenRef.current = isNaN(oxygen) ? prevOxygenRef.current : oxygen;
            prevWaterRef.current = waterPresent === true ? true : waterPresent === false ? false : prevWaterRef.current;
        };

        const normalizePercent = (raw: any): number | null => {
            if (raw === null || raw === undefined) return null;
            if (typeof raw === 'number') return raw;
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

                const normalized: Record<string, any> = { ...raw };
                normalized.light = normalizePercent(raw.light);
                normalized.water_conductivity = normalizePercent(raw.water_conductivity);

                setEnv(normalized);
                pushHistory(normalized);
                checkAlerts(normalized);
            } catch (err) {
                setAlerts((prev) => {
                    if (prev.some((a) => a.id === 'backend-error')) return prev;
                    addAlert({ id: 'backend-error', message: `Cannot reach backend: ${(err as Error).message}`, level: 'warn' }, false);
                    return prev;
                });
            }
        };

        doFetch();
        pollingRef.current = window.setInterval(doFetch, 2000);

        return () => {
            mounted = false;
            if (pollingRef.current) clearInterval(pollingRef.current);
            Object.values(alertTimersRef.current).forEach((t) => {
                if (t.fade) clearTimeout(t.fade);
                if (t.remove) clearTimeout(t.remove);
            });
            alertTimersRef.current = {};
        };
    }, [activeProfileId]);

    // send numeric RGB values to device
    const sendRgbState = async (r: number, g: number, b: number) => {
        const url = `http://192.168.137.246/?r=${r}&g=${g}&b=${b}`;
        try {
            const resp = await fetch(url, { method: 'GET' });
            if (!resp.ok) {
                const text = await resp.text().catch(() => resp.statusText);
                throw new Error(`Device responded ${resp.status}: ${text}`);
            }
            addAlert({ id: `rgb-${Date.now()}`, message: `RGB set: r=${r} g=${g} b=${b}`, level: 'info' });
            return { success: true };
        } catch (err) {
            addAlert({ id: `rgb-err-${Date.now()}`, message: `Failed to set RGB: ${(err as Error).message}`, level: 'warn' });
            return { success: false, message: (err as Error).message };
        }
    };

    // Form submit handler - no persistent LED state is stored; form is reset after submit
    const handleRgbFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const rOn = fd.get('red') === 'on';
        const gOn = fd.get('green') === 'on';
        const bOn = fd.get('blue') === 'on';

        const r = rOn ? 255 : 0;
        const g = gOn ? 255 : 0;
        const b = bOn ? 255 : 0;

        await sendRgbState(r, g, b);

        // clear the form (no persistent LED state)
        (e.currentTarget as HTMLFormElement).reset();
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

                    <form onSubmit={handleRgbFormSubmit} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm">Red</div>
                                <div className="text-xs text-gray-400">Toggle red channel</div>
                            </div>
                            <label className="flex items-center space-x-2">
                                <input name="red" type="checkbox" className="form-checkbox h-5 w-5 text-red-500" />
                                <span className="text-xs text-gray-300">Enable</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm">Green</div>
                                <div className="text-xs text-gray-400">Toggle green channel</div>
                            </div>
                            <label className="flex items-center space-x-2">
                                <input name="green" type="checkbox" className="form-checkbox h-5 w-5 text-green-500" />
                                <span className="text-xs text-gray-300">Enable</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm">Blue</div>
                                <div className="text-xs text-gray-400">Toggle blue channel</div>
                            </div>
                            <label className="flex items-center space-x-2">
                                <input name="blue" type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                                <span className="text-xs text-gray-300">Enable</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-2">
                            <button type="submit" className="px-3 py-1 rounded bg-indigo-600 text-white hover:opacity-90">
                                Set
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1 rounded bg-gray-700 text-gray-200 hover:opacity-90"
                                onClick={(ev) => {
                                    (ev.currentTarget.closest('form') as HTMLFormElement)?.reset();
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        <div className="mt-2 text-xs text-gray-400">
                            Sends GET to <code className="bg-gray-800 px-1 rounded">http://192.168.137.246/?r=&lt;r&gt;&amp;g=&lt;g&gt;&amp;b=&lt;b&gt;</code> with values 0/255.
                        </div>
                    </form>
                </div>
            </section>

            <AlertModal alerts={alerts} onClose={closeAlert} />
        </div>
    );
};

export default ControlPanel;
