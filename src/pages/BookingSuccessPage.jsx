import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [idle, setIdle] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // Мок данных (позже заменим на реальные из БД)
  const bookingId = data?.bookingId || 101; // например max(id) + 1
  const title = data?.title || 'City Tour Dubai';
  const date = data?.date || '2025-04-01';
  const totalPeople = data?.totalPeople || 3;
  const operatorContact = data?.operatorContact || '+971-50-123-4567';

  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setIdle(true);
    }, 2 * 60 * 1000); // 2 минуты неактивности

    return () => clearTimeout(idleTimer);
  }, []);

  useEffect(() => {
    if (idle) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/');
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [idle, navigate]);

  const stayHere = () => {
    setIdle(false);
    setCountdown(15);
  };

  const goHome = () => navigate('/');

  return (
    <div className="success-page">
      <h1>🎉 Бронирование успешно!</h1>
      <div className="details">
        <p><strong>Номер брони:</strong> {bookingId}</p>
        <p><strong>Экскурсия:</strong> {title}</p>
        <p><strong>Дата:</strong> {date}</p>
        <p><strong>Количество участников:</strong> {totalPeople}</p>
        <p><strong>Контакты туроператора:</strong> {operatorContact}</p>
      </div>

      <button onClick={goHome} className="home-button">На главную</button>

      {idle && (
        <div className="idle-banner">
          <p>⏳ Вы здесь? Возвращаемся на главную через {countdown} сек...</p>
          <button onClick={stayHere}>Остаться</button>
        </div>
      )}
    </div>
  );
};

export default BookingSuccessPage;