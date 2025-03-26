import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './IdleWatcher.css';

const IdleWatcher = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  const [idle, setIdle] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const timerRef = useRef(null);

  // Отслеживаем активность пользователя
  useEffect(() => {
    if (isMainPage) return; // исключаем главную страницу

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      if (idle) {
        setIdle(false);
        setCountdown(15);
      }
      timerRef.current = setTimeout(() => setIdle(true), 60 * 1000); // 1 минута
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer(); // инициализация

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearTimeout(timerRef.current);
    };
  }, [idle, isMainPage]);

  // Обратный отсчет при неактивности
  useEffect(() => {
    if (!idle) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [idle, navigate]);

  if (idle) {
    return (
      <div className="idle-overlay">
        <div className="idle-popup">
          <p>Вы здесь? Возвращаемся на главную через {countdown} сек...</p>
          <button onClick={() => setIdle(false)}>Остаться</button>
        </div>
        {children}
      </div>
    );
  }

  return children;
};

export default IdleWatcher;
