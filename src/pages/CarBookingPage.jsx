import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionBookingPage.css';
import BackButton from '../components/BackButton';

const CarBookingPage = () => {
  const { t } = useTranslation();
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { dateFrom, dateTo } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    contact_method: 'WhatsApp',
    email: '',
    document_number: ''
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Получаем цену за день машины
    fetch(`https://booking-backend-tjmn.onrender.com/cars/${carId}`)
      .then(res => res.json())
      .then(data => {
        const days = Math.max(
          1,
          (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24) + 1
        );
        setPrice(data.price_per_day * days);
      })
      .catch(err => console.error('Ошибка получения цены:', err));
  }, [carId, dateFrom, dateTo]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const payload = {
        ...formData,
        start_date: dateFrom,
        end_date: dateTo,
        car_id: parseInt(carId),
        booking_type: 'car',
        total_price: price
      };

      const res = await fetch('https://booking-backend-tjmn.onrender.com/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Payment failed');
      const result = await res.json();

      navigate('/success', {
        state: {
          bookingId: result.booking_id,
          dateFrom,
          dateTo,
          carId
        }
      });
    } catch (err) {
      console.error(err);
      setStatus(t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <h1 className="booking-title">{t('booking.titleCar')}</h1>
      <form className="booking-form" onSubmit={handleSubmit}>
        {['firstName','lastName','phone','email','document_number'].map(field => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{t(`booking.${field}`)}</label>
            <input
              id={field} name={field} type="text"
              placeholder={t(`booking.${field}`)}
              value={formData[field]}
              onChange={handleChange}
              required={['firstName','lastName','phone'].includes(field)}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="contact_method">{t('booking.contactMethod')}</label>
          <select name="contact_method" value={formData.contact_method} onChange={handleChange}>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Telegram">Telegram</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('booking.date')}</label>
          <p>{dateFrom} — {dateTo}</p>
        </div>

        <div className="form-group">
          <label>{t('booking.total')}</label>
          <p>{price} AED</p>
        </div>

        {status && <p className="error-text">{status}</p>}
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? t('booking.processing') : t('booking.pay')}
        </button>
      </form>
      <BackButton />
    </div>
  );
};

export default CarBookingPage;
