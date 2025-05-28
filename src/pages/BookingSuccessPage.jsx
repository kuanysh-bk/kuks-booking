import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BookingSuccessPage.css';

const BookingSuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [supplier, setSupplier] = useState(null);

  const bookingId = data?.bookingId;
  const supplierId = data?.supplierId;

  useEffect(() => {
    if (supplierId) {
      fetch('https://booking-backend-tjmn.onrender.com/operators')
        .then(res => res.json())
        .then(list => {
          const found = list.find(op => String(op.id) === String(supplierId));
          if (found) setSupplier(found);
        });
    }
  }, [supplierId]);

  return (
    <div className="success-wrapper">
      <h1 className="success-title">{t('bookingSuccess.title')}</h1>

      <div className="success-info">
        <p><strong>{t('bookingSuccess.bookingId')}:</strong> {bookingId}</p>

        {data?.bookingType === 'car' ? (
          <>
            <p><strong>{t('bookingSuccess.dates')}:</strong> {data.dateFrom} – {data.dateTo}</p>
          </>
        ) : (
          <>
            <p><strong>{t('bookingSuccess.excursion')}:</strong> {data.excursionTitle}</p>
            <p><strong>{t('bookingSuccess.date')}:</strong> {data.date}</p>
            <p><strong>{t('bookingSuccess.peopleCount')}:</strong> {data.peopleCount}</p>
          </>
        )}

        {supplier && (
          <>
            <p><strong>{t('bookingSuccess.operatorName')}:</strong> {supplier.name || '-'}</p>
            <p><strong>{t('bookingSuccess.operatorPhone')}:</strong> {supplier.phone || '-'}</p>
            <p><strong>{t('bookingSuccess.operatorEmail')}:</strong> {supplier.email || '-'}</p>
            <p><strong>{t('bookingSuccess.operatorAddress')}:</strong> {supplier.address || '-'}</p>
          </>
        )}
      </div>

      <button className="home-button-success" onClick={() => navigate('/')}>{t('bookingSuccess.home')}</button>
    </div>
  );
};

export default BookingSuccessPage;
