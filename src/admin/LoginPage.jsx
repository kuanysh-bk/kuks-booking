import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
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
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Авторизация</h2>
      <input className="w-full mb-2 p-2 border" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-2 p-2 border" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={handleLogin}>Войти</button>
    </div>
  );
};

export default LoginPage;