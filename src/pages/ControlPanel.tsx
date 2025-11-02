import React, { useEffect, useState, useRef } from 'react';
import SensorCard from '../components/SensorCard';
import AlertModal from '../components/AlertModal';
import * as api from '../api/backend';

type Profile = { id: string; name: string; oxygenWarn?: number; oxygenDanger?: number };

const defaultProfiles: Profile[] = [
    { id: 'commander', name: 'Commander', oxygenWarn: 19.5, oxygenDanger: 18.5 },
    { id: 'engineer', name: 'Engineer', oxygenWarn: 19.0, oxygenDanger: 18.0 },
];

const ControlPanel: React.FC = () => {
    const [env, setEnv] = useState<Record<string, any>>({
        humidity: null,
        temperature: null,
        oxygen: null,
        water_detected: null,
    });
    const [history, setHistory] = useState<Record<string, number[]>>({});
    const [alerts, setAlerts] = useState<{ id: string; message: string; level?: 'info' | 'warn' | 'danger' }[]>([]);
    const [profiles] = useState<Profile[]>(defaultProfiles);
    const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0].id);
    const [ledOn, setLedOn] = useState(false);
    const [fanOn, setFanOn] = useState(false);
    const pollingRef = useRef<number | null>(null);

    const activeProfile = profiles.find((p) => p.id === activeProfileId)!;

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
            const newAlerts: typeof alerts = [];
            const oxygen = typeof data.oxygen === 'number' ? data.oxygen : NaN;
            if (!isNaN(oxygen)) {
                if (activeProfile && activeProfile.oxygenDanger !== undefined && oxygen <= activeProfile.oxygenDanger) {
                    newAlerts.push({ id: `oxy-danger-${Date.now()}`, message: `Oxygen critically low: ${oxygen}%`, level: 'danger' });
                } else if (activeProfile && activeProfile.oxygenWarn !== undefined && oxygen <= activeProfile.oxygenWarn) {
                    newAlerts.push({ id: `oxy-warn-${Date.now()}`, message: `Oxygen low: ${oxygen}%`, level: 'warn' });
                }
            }

            if (data.water_detected === true) {
                newAlerts.push({ id: `water-${Date.now()}`, message: `Water detected in the system!`, level: 'warn' });
            }

            if (newAlerts.length > 0) {
                setAlerts((prev) => [...prev, ...newAlerts]);
            }
        };

        const doFetch = async () => {
            try {
                const data = await api.getEnvironment();
                if (!mounted) return;
                setEnv(data as Record<string, any>);
                pushHistory(data as Record<string, any>);
                checkAlerts(data as Record<string, any>);
            } catch (err) {
                setAlerts((prev) => {
                    if (prev.some((a) => a.id === 'backend-error')) return prev;
                    return [...prev, { id: 'backend-error', message: `Cannot reach backend: ${(err as Error).message}`, level: 'warn' }];
                });
            }
        };

        doFetch();
        pollingRef.current = window.setInterval(doFetch, 2000);

        return () => {
            mounted = false;
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [activeProfileId]);

    const handleToggleLed = async () => {
        const target = !ledOn;
        setLedOn(target); // optimistic update
        const res = await api.setLed({ on: target });
        if (res.simulated) {
            setAlerts((a) => [...a, { id: `led-sim-${Date.now()}`, message: `LED ${target ? 'ON' : 'OFF'} (simulated)`, level: 'info' }]);
        } else if (!res.success) {
            setLedOn((s) => !s); // revert
            setAlerts((a) => [...a, { id: `led-err-${Date.now()}`, message: `LED command failed: ${res.message ?? 'unknown'}`, level: 'warn' }]);
        } else {
            setAlerts((a) => [...a, { id: `led-${Date.now()}`, message: `LED ${target ? 'ON' : 'OFF'}`, level: 'info' }]);
        }
    };

    const handleToggleFan = async () => {
        const target = !fanOn;
        setFanOn(target);
        const res = await api.setFan({ on: target });
        if (res.simulated) {
            setAlerts((a) => [...a, { id: `fan-sim-${Date.now()}`, message: `Fan ${target ? 'activated' : 'stopped'} (simulated)`, level: 'info' }]);
        } else if (!res.success) {
            setFanOn((s) => !s);
            setAlerts((a) => [...a, { id: `fan-err-${Date.now()}`, message: `Fan command failed: ${res.message ?? 'unknown'}`, level: 'warn' }]);
        } else {
            setAlerts((a) => [...a, { id: `fan-${Date.now()}`, message: `Fan ${target ? 'activated' : 'stopped'}`, level: 'info' }]);
        }
    };

    const closeAlert = (id: string) => setAlerts((a) => a.filter((x) => x.id !== id));

    const sensorOrder = ['temperature', 'humidity', 'oxygen', 'water_detected'];

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
                        label={key === 'water_detected' ? 'Water Detected' : key.charAt(0).toUpperCase() + key.slice(1)}
                        value={env[key]}
                        unit={key === 'oxygen' ? '%' : key === 'temperature' ? '°C' : key === 'humidity' ? '%' : undefined}
                        history={history[key]}
                        warningThreshold={key === 'oxygen' ? activeProfile?.oxygenWarn : undefined}
                        dangerThreshold={key === 'oxygen' ? activeProfile?.oxygenDanger : undefined}
                        onAction={null}
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