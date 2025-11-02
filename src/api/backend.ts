export type EnvironmentData = {
    humidity: number | null;
    temperature: number | null;
    oxygen: number | null;
    water_detected: boolean | null;
    [key: string]: number | boolean | null | undefined;
};

const BASE_URL = 'http://localhost:5001';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
}

export async function getEnvironment(): Promise<EnvironmentData> {
    // GET /get-environment (Flask server as provided)
    return fetchJson<EnvironmentData>(`${BASE_URL}/get-environment`);
}

/**
 * Actuator helpers.
 * Your provided backend does not include POST endpoints for actuators.
 * These functions will attempt to call the backend; if the call fails they
 * return a simulated response so the UI can still work during the hackathon.
 */
type ControlResult = { success: boolean; simulated?: boolean; message?: string };

async function tryPost(path: string, body: object): Promise<ControlResult> {
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            // Non-2xx - treat as failure but return server message if any
            const txt = await res.text();
            return { success: false, message: `Server ${res.status}: ${txt}` };
        }
        const json = await res.json().catch(() => ({}));
        return { success: true, ...(json || {}) };
    } catch (err) {
        // Network error / endpoint not present -> simulate success
        return { success: true, simulated: true, message: 'Simulated (backend missing)' };
    }
}

export async function setLed(state: { on: boolean }): Promise<ControlResult> {
    return tryPost('/set-led', state);
}

export async function setFan(state: { on: boolean; speed?: number }): Promise<ControlResult> {
    return tryPost('/set-fan', state);
}