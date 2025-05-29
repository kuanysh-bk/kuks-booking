import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LoginPage.css'; // подключаем стили

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isSuperuser = localStorage.getItem('isSuperuser');
  
    if (token) {
      navigate(isSuperuser === 'true' ? '/admin/super/dashboard' : '/admin/dashboard');
    }
  }, []);  

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
  
    try {
      const res = await fetch('https://booking-backend-tjmn.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('isSuperuser', data.is_superuser);
        navigate(data.is_superuser ? '/admin/super/dashboard' : '/admin/dashboard');
      } else {
        setError(t('login.invalid_credentials'));
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{t('login.title')}</h2>

        <input
          type="email"
          className="login-input"
          placeholder={t('login.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder={t('login.password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button className={`login-button ${isLoading ? 'loading' : ''}`} onClick={handleLogin} disabled={isLoading}>
        {isLoading ? t('login.loading', 'Logging in...') : t('login.submit')}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
