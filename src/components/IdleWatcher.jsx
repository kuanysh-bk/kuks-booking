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

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdle(true), 60 * 1000); // 1 минута
  }, []);

  // Сбросить при переходе на главную
  useEffect(() => {
    if (location.pathname === '/') {
      setIdle(false);
      setCountdown(15);
    }
  }, [location.pathname]);

  // Отслеживаем активность пользователя
  useEffect(() => {
    if (isMainPage) return; // исключаем главную страницу

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
  }, [isMainPage, resetTimer]);

  // Обратный отсчет при неактивности
  useEffect(() => {
    if (!idle) return;

    setCountdown(15); // Сбросить таймер при активации idle

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

  const stayHere = () => {
    setIdle(false);
    setCountdown(15);
    resetTimer();
  };

  if (idle) {
    return (
      <div className="idle-overlay">
        <div className="idle-popup">
          <p>Вы здесь? Возвращаемся на главную через {countdown} сек...</p>
          <button onClick={stayHere}>Остаться</button>
        </div>
        {children}
      </div>
    );
  }

  return children;
};

export default IdleWatcher;
