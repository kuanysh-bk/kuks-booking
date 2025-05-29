import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/admin/login', {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">{t('login.title')}</h2>

        <input
          type="email"
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          placeholder={t('login.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          placeholder={t('login.password')}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
        >
          {t('login.submit')}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;