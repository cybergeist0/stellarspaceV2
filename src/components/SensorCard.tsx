import React from 'react';

type Props = {
    label: string;
    value: number | string | boolean | null | undefined;
    unit?: string;
    history?: number[];
    warningThreshold?: number;
    dangerThreshold?: number;
    onAction?: React.ReactNode | null;
    isWebcam?: boolean;
    iframeSrc?: string;
    iframeTitle?: string;
};

const Sparkline: React.FC<{ data?: number[] }> = ({ data = [] }) => {
    const width = 120;
    const height = 36;
    if (data.length === 0) return <svg width={width} height={height} />;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = max === min ? 1 : max - min;
    const points = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((v - min) / span) * height;
            return `${x},${y}`;
        })
        .join(' ');
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
            <polyline fill="none" stroke="#60a5fa" strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const SensorCard: React.FC<Props> = ({ label, value, unit, history, warningThreshold, dangerThreshold, onAction = null, isWebcam = false, iframeSrc, iframeTitle = 'webcam' }) => {
    const numeric = typeof value === 'number' ? value : NaN;
    let borderClass = 'border-gray-700';
    if (!isNaN(numeric) && dangerThreshold !== undefined && numeric <= dangerThreshold) {
        borderClass = 'border-red-500';
    } else if (!isNaN(numeric) && warningThreshold !== undefined && numeric <= warningThreshold) {
        borderClass = 'border-yellow-500';
    }

    const showWebcam = isWebcam || !!iframeSrc;

    const display =
        showWebcam
            ? ''
            : value === null || value === undefined
                ? '—'
                : typeof value === 'boolean'
                    ? value
                        ? 'Yes'
                        : 'No'
                    : value;

    return (
        <div className={`p-4 rounded-lg bg-gray-900 border ${borderClass} shadow-sm w-full max-w-xs`}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="text-2xl font-semibold">
                        {display}
                        {unit && typeof display !== 'boolean' && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
                    </div>
                </div>
                <div>{onAction}</div>
            </div>

            <div className="mt-3">
                {showWebcam ? (
                    <div className="w-full rounded bg-black overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        {iframeSrc ? (
                            <iframe
                                src={iframeSrc}
                                className="w-full h-full border-0"
                                scrolling="no"
                                width="320"
                                height="176"
                                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm p-4">
                                No iframe source provided
                            </div>
                        )}
                    </div>
                ) : (
                    <Sparkline data={history} />
                )}
            </div>
        </div>
    );
};

export default SensorCard;