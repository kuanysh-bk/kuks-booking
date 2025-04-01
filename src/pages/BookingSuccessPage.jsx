import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [timer, setTimer] = useState(null);
  const [idleTimer, setIdleTimer] = useState(null);

  const bookingId = data?.bookingId;
  const title = data?.excursionTitle;
  const date = data?.date;
  const totalPeople = data?.people;
  const operatorContact = data?.contact;

  useEffect(() => {
    const startIdleTimer = () => {
      const timeout = setTimeout(() => {
        setShowIdlePrompt(true);
        startCountdown();
      }, 120000);
      setIdleTimer(timeout);
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      setShowIdlePrompt(false);
      setCountdown(15);
      clearInterval(timer);
      startIdleTimer();
    };

    const handleUserActivity = () => {
      resetIdleTimer();
    };

    const startCountdown = () => {
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(countdownTimer);
    };

    startIdleTimer();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      clearTimeout(idleTimer);
      clearInterval(timer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [navigate]);

  const handleStay = () => {
    setShowIdlePrompt(false);
    setCountdown(15);
    clearInterval(timer);
  };

  if (!data) {
    navigate('/');
    return null;
  }

  return (
    <div className="success-wrapper">
      <h1>Бронирование успешно!</h1>
      <div className="success-info">
        <p><strong>Номер брони:</strong> {bookingId}</p>
        <p><strong>Экскурсия:</strong> {title}</p>
        <p><strong>Дата:</strong> {date}</p>
        <p><strong>Количество человек:</strong> {totalPeople}</p>
        <p><strong>Контакт туроператора:</strong> {operatorContact}</p>
      </div>

      <button className="home-button" onClick={() => navigate('/')}>На главную</button>

      {showIdlePrompt && (
        <div className="idle-banner">
          <p>Вы всё ещё здесь? Возврат на главную через {countdown} сек.</p>
          <button onClick={handleStay}>Остаться</button>
        </div>
      )}
    </div>
  );
};

export default BookingSuccessPage;