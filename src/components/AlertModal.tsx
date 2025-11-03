import React from 'react';

type Alert = { id: string; message: string; level?: 'info' | 'warn' | 'danger'; visible?: boolean };

type Props = {
    alerts: Alert[];
    onClose: (id: string) => void;
};

const levelColor = (level?: Alert['level']) =>
    level === 'danger' ? 'bg-red-600' : level === 'warn' ? 'bg-yellow-500' : 'bg-blue-600';

// keep in sync with ControlPanel FADE_MS
const FADE_MS = 500;

const AlertModal: React.FC<Props> = ({ alerts, onClose }) => {
    if (alerts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {alerts.map((a) => {
                const visible = a.visible !== false; // default true
                const style: React.CSSProperties = {
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity ${FADE_MS}ms ease-out, transform ${FADE_MS}ms ease-out`,
                    pointerEvents: visible ? 'auto' : 'none',
                };

                return (
                    <div
                        key={a.id}
                        style={style}
                        className={`flex items-start space-x-3 p-3 rounded shadow ${levelColor(a.level)} text-white max-w-sm`}
                    >
                        <div className="flex-1">
                            <div className="font-semibold">{a.level?.toUpperCase() ?? 'INFO'}</div>
                            <div className="text-sm mt-1">{a.message}</div>
                        </div>
                        <button
                            onClick={() => {
                                onClose(a.id);
                            }}
                            className="text-white opacity-80 hover:opacity-100 ml-2"
                        >
                            &times;
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertModal;