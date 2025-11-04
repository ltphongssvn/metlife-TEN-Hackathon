// /metlife-TEN-Hackathon/frontend/src/components/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ user }) => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [dailyActivity, setDailyActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7);

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const [statsRes, activityRes] = await Promise.all([
                api.get(`/analytics/stats?days=${timeRange}`),
                api.get(`/analytics/activity?days=${timeRange}`)
            ]);

            setStats(statsRes.data);

            // Format activity data for charts
            const formattedActivity = activityRes.data.map(day => ({
                date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sessions: parseInt(day.session_count),
                messages: parseInt(day.message_count),
                minutes: parseInt(day.total_minutes)
            })).reverse();

            setDailyActivity(formattedActivity);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="analytics-loading">Loading analytics...</div>;
    }

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h2>Your Study Analytics</h2>
                <div className="time-range-selector">
                    <button
                        className={timeRange === 7 ? 'active' : ''}
                        onClick={() => setTimeRange(7)}
                    >
                        7 Days
                    </button>
                    <button
                        className={timeRange === 30 ? 'active' : ''}
                        onClick={() => setTimeRange(30)}
                    >
                        30 Days
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats?.total_sessions || 0}</div>
                    <div className="stat-label">{t("totalSessions")}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.total_messages || 0}</div>
                    <div className="stat-label">{t("messagesSent")}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {stats?.total_minutes ? Math.round(stats.total_minutes) : 0}
                    </div>
                    <div className="stat-label">{t("minutesStudied")}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {stats?.avg_duration ? Math.round(stats.avg_duration) : 0}
                    </div>
                    <div className="stat-label">{t("avgSession")}</div>
                </div>
            </div>

            {dailyActivity.length > 0 && (
                <>
                    <div className="chart-section">
                        <h3>Study Sessions Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sessions"
                                    stroke="#1976d2"
                                    strokeWidth={2}
                                    name="Sessions"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-section">
                        <h3>Daily Activity Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="messages" fill="#4caf50" name="Messages" />
                                <Bar dataKey="minutes" fill="#ff9800" name="Minutes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {dailyActivity.length === 0 && (
                <div className="no-data">
                    <p>No study activity recorded yet. Start a conversation to see your analytics!</p>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;