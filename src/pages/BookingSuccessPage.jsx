import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [operatorContact, setOperatorContact] = useState('');
  const bookingId = data?.bookingId;

  useEffect(() => {
    if (!data) return;
    const supplierId = data.supplierId;
    const operatorId = data.operatorId;

    fetch('https://booking-backend-tjmn.onrender.com/operators')
      .then(res => res.json())
      .then(list => {
        const found = list.find(o => {
          if (data.bookingType === 'car') {
            return String(o.id) === String(supplierId);
          } else {
            return String(o.id) === String(operatorId);
          }
        });
        if (found) setOperatorContact(found.phone || found.email || '');
      });
  }, [data]);

  return (
    <div className="success-wrapper">
      <h1 className="success-title">{t('bookingSuccess.title')}</h1>
  
      <div className="success-info">
        <p><strong>{t('bookingSuccess.bookingId')}:</strong> {bookingId}</p>
  
        {data?.bookingType === 'car' ? (
          <>
            <p><strong>{t('bookingSuccess.carId')}:</strong> {data.carId}</p>
            <p><strong>{t('bookingSuccess.dates')}:</strong> {data.dateFrom} – {data.dateTo}</p>
            <p><strong>{t('bookingSuccess.operatorContact')}:</strong> {operatorContact}</p>
          </>
        ) : (
          <>
            <p><strong>{t('bookingSuccess.excursion')}:</strong> {data.excursionTitle}</p>
            <p><strong>{t('bookingSuccess.date')}:</strong> {data.date}</p>
            <p><strong>{t('bookingSuccess.peopleCount')}:</strong> {data.peopleCount}</p>
            <p><strong>{t('bookingSuccess.operatorContact')}:</strong> {operatorContact}</p>
          </>
        )}
      </div>
  
      <button className="home-button-success" onClick={() => navigate('/')}>
        {t('bookingSuccess.home')}
      </button>
    </div>
  );  
};

export default BookingSuccessPage;
