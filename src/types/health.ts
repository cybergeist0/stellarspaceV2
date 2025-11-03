export interface User {
    id: number;
    username: string;
    preferred_sleep_hours: number;
    daily_water_goal_ml: number;
}

export interface SleepLog {
    sleep_hours: number;
    sleep_quality: 'poor' | 'fair' | 'good' | 'excellent';
    date: string;
}

export interface WaterLog {
    water_amount_ml: number;
    date: string;
}

export interface HealthSummary {
    preferences: {
        preferred_sleep_hours: number;
        daily_water_goal_ml: number;
    };
    latest_sleep: SleepLog | null;
    today_water_intake: number;
}