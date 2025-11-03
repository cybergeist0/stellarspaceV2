import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { HealthSummary } from '../types/health';
import AlertModal from '../components/AlertModal';
import '../styles/Health.css';

const Health: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [preferredSleep, setPreferredSleep] = useState<number>(8);
    const [dailyWaterGoal, setDailyWaterGoal] = useState<number>(2000);
    const [healthData, setHealthData] = useState<HealthSummary | null>(null);
    const [sleepHours, setSleepHours] = useState('');
    const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
    const [waterAmount, setWaterAmount] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchHealthData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHealthData = async () => {
        try {
            const response = await axios.get('http://localhost:5555/api/health-summary', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setHealthData(response.data);
            checkHealthAlerts(response.data);
        } catch (error) {
            console.error('Error fetching health data:', error);
        }
    };

    const checkHealthAlerts = (data: HealthSummary) => {
        const alerts: string[] = [];

        if (data.latest_sleep && data.latest_sleep.sleep_hours < data.preferences.preferred_sleep_hours) {
            alerts.push(`You slept ${data.latest_sleep.sleep_hours} hours, below your goal of ${data.preferences.preferred_sleep_hours} hours`);
        }

        if (data.today_water_intake < data.preferences.daily_water_goal_ml) {
            const remaining = data.preferences.daily_water_goal_ml - data.today_water_intake;
            alerts.push(`You still need to drink ${remaining}ml of water to reach your daily goal`);
        }

        if (alerts.length > 0) {
            setAlertMessage(alerts.join('\n'));
            setShowAlert(true);
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5555/api/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);
            fetchHealthData();
        } catch (error) {
            console.error('Login error:', error);
            setAlertMessage('Invalid credentials');
            setShowAlert(true);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5555/api/register', {
                username,
                password,
                preferred_sleep_hours: preferredSleep,
                daily_water_goal_ml: dailyWaterGoal,
            });
            // After registering, auto-login
            const resp = await axios.post('http://localhost:5555/api/login', { username, password });
            localStorage.setItem('token', resp.data.token);
            setIsLoggedIn(true);
            setIsRegistering(false);
            fetchHealthData();
        } catch (error: any) {
            console.error('Register error:', error);
            setAlertMessage(error?.response?.data?.error || 'Registration failed');
            setShowAlert(true);
        }
    };

    const handleSleepLog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5555/api/sleep',
                {
                    sleep_hours: Number(sleepHours),
                    sleep_quality: sleepQuality,
                    date: new Date().toISOString().split('T')[0],
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSleepHours('');
            fetchHealthData();
        } catch (error) {
            console.error('Error logging sleep:', error);
        }
    };

    const handleWaterLog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5555/api/water',
                { water_amount_ml: Number(waterAmount), date: new Date().toISOString().split('T')[0] },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setWaterAmount('');
            fetchHealthData();
        } catch (error) {
            console.error('Error logging water:', error);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="health-container relative z-20">
                <h2>{isRegistering ? 'Create an account' : 'Login to Track Your Health'}</h2>

                {isRegistering ? (
                    <form onSubmit={handleRegister} className="login-form">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type="number" placeholder="Preferred sleep hours" value={preferredSleep} onChange={(e) => setPreferredSleep(Number(e.target.value))} />
                        <input type="number" placeholder="Daily water goal (ml)" value={dailyWaterGoal} onChange={(e) => setDailyWaterGoal(Number(e.target.value))} />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button type="submit">Sign up</button>
                            <button type="button" onClick={() => setIsRegistering(false)}>Back to Login</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="login-form">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button type="submit">Login</button>
                            <button type="button" onClick={() => setIsRegistering(true)}>Sign up</button>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setHealthData(null);
    };

    return (
        <div className="health-container relative z-20">
            <div className="flex justify-between items-center mb-4">
                <h2>Health Tracking</h2>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {healthData && (
                <div className="health-summary">
                    <h3>Your Health Summary</h3>
                    <p>Preferred Sleep: {healthData.preferences.preferred_sleep_hours} hours</p>
                    <p>Daily Water Goal: {healthData.preferences.daily_water_goal_ml}ml</p>
                    <p>Today's Water Intake: {healthData.today_water_intake}ml</p>

                    {healthData.latest_sleep && (
                        <div>
                            <h4>Last Sleep Log</h4>
                            <p>Hours: {healthData.latest_sleep.sleep_hours}</p>
                            <p>Quality: {healthData.latest_sleep.sleep_quality}</p>
                            <p>Date: {healthData.latest_sleep.date}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="log-forms">
                <form onSubmit={handleSleepLog} className="sleep-form">
                    <h3>Log Sleep</h3>
                    <input type="number" placeholder="Hours of sleep" value={sleepHours} step="0.5" onChange={(e) => setSleepHours(e.target.value)} />
                    <select value={sleepQuality} onChange={(e) => setSleepQuality(e.target.value as 'poor' | 'fair' | 'good' | 'excellent')}>
                        <option value="poor">Poor</option>
                        <option value="fair">Fair</option>
                        <option value="good">Good</option>
                        <option value="excellent">Excellent</option>
                    </select>
                    <button type="submit">Log Sleep</button>
                </form>

                <form onSubmit={handleWaterLog} className="water-form">
                    <h3>Log Water Intake</h3>
                    <input type="number" placeholder="Water amount (ml)" value={waterAmount} onChange={(e) => setWaterAmount(e.target.value)} />
                    <button type="submit">Log Water</button>
                </form>
            </div>

            {showAlert && (
                <AlertModal alerts={[{ id: 'health-alert', message: alertMessage, level: 'warn', visible: true }]} onClose={(id: string) => {
                    if (id === 'health-alert') {
                        setShowAlert(false);
                        setAlertMessage('');
                    }
                }} />
            )}
        </div>
    );
};

export default Health;
