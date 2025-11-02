import React from 'react';

type Alert = { id: string; message: string; level?: 'info' | 'warn' | 'danger' };

type Props = {
    alerts: Alert[];
    onClose: (id: string) => void;
};

const levelColor = (level?: Alert['level']) =>
    level === 'danger' ? 'bg-red-600' : level === 'warn' ? 'bg-yellow-500' : 'bg-blue-600';

const AlertModal: React.FC<Props> = ({ alerts, onClose }) => {
    if (alerts.length === 0) return null;
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {alerts.map((a) => (
                <div key={a.id} className={`flex items-start space-x-3 p-3 rounded shadow ${levelColor(a.level)} text-white max-w-sm`}>
                    <div className="flex-1">
                        <div className="font-semibold">{a.level?.toUpperCase() ?? 'INFO'}</div>
                        <div className="text-sm mt-1">{a.message}</div>
                    </div>
                    <button onClick={() => onClose(a.id)} className="text-white opacity-80 hover:opacity-100 ml-2">
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AlertModal;