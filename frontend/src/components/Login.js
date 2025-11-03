// /metlife-TEN-Hackathon/frontend/src/components/Login.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            console.log('Submitting to:', endpoint, 'with data:', { ...formData, password: '***' });
            const response = await api.post(endpoint, formData);
            
            console.log('Response received:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('Token stored, calling onLoginSuccess with user:', response.data.user);
                // Pass user data to parent component
                onLoginSuccess(response.data.user);
            } else {
                console.error('No token in response:', response.data);
                setError('Login failed - no token received');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <LanguageSwitcher />
            </div>
            <div className="login-box">
                <h2>{isLogin ? t('login') : t('register')}</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="firstName"
                                placeholder={t('firstName')}
                                value={formData.firstName}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder={t('lastName')}
                                value={formData.lastName}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder={t('email')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder={t('password')}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? t('loading') : (isLogin ? t('login') : t('register'))}
                    </button>
                </form>

                <p className="toggle-form">
                    {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? t('register') : t('login')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
