import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './IdleWatcher.css';

const IdleWatcher = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  const [idle, setIdle] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdle(true), 60 * 1000);
  }, []);

  // Сброс при переходе на главную
  useEffect(() => {
    if (isMainPage) {
      setIdle(false);
      setCountdown(15);
    }
  }, [isMainPage]);

  // Настройка слушателей активности
  useEffect(() => {
    if (isMainPage) return;

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearTimeout(timerRef.current);
    };
  }, [isMainPage, resetTimer]);

  // Таймер обратного отсчета
  useEffect(() => {
    if (!idle) return;

    setCountdown(15);
    const interval = setInterval(() => {
      setCountdown(prev => {
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
          <p>{t('idle.message', { count: countdown })}</p>
          <button onClick={stayHere}>{t('idle.stay')}</button>
        </div>
        {children}
      </div>
    );
  }

  return children;
};

export default IdleWatcher;