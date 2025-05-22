import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  // Redirect if no state
  useEffect(() => {
    if (!data || !data.bookingId) {
      navigate('/');
    }
  }, [data, navigate]);

  // Local state for operator contact info
  const [operatorContact, setOperatorContact] = useState('');

  useEffect(() => {
    if (data && data.operatorId) {
      fetch('https://booking-backend-tjmn.onrender.com/operators')
        .then(res => res.json())
        .then(list => {
          const op = list.find(o => String(o.id) === String(data.operatorId));
          if (op) setOperatorContact(op.phone || op.email || '');
        })
        .catch(err => console.error('Ошибка загрузки оператора:', err));
    }
  }, [data]);

  if (!data) return null;

  const {
    bookingId,
    excursionTitle,
    date,
    peopleCount,
    operatorId
  } = data;

  return (
    <div className="success-wrapper">
      <h1 className="success-title">{t('bookingSuccess.title')}</h1>
      <div className="success-info">
        <p><strong>{t('bookingSuccess.bookingId')}:</strong> {bookingId}</p>
        <p><strong>{t('bookingSuccess.excursion')}:</strong> {excursionTitle}</p>
        <p><strong>{t('bookingSuccess.date')}:</strong> {date}</p>
        <p><strong>{t('bookingSuccess.peopleCount')}:</strong> {peopleCount}</p>
        <p><strong>{t('bookingSuccess.operatorContact')}:</strong> {operatorContact}</p>
      </div>
      <button
        className="home-button-success"
        onClick={() => navigate('/')}
      >
        {t('bookingSuccess.home')}
      </button>
    </div>
  );
};

export default BookingSuccessPage;