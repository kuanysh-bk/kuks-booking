import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionBookingPage.css';
import BackButton from '../components/BackButton';

const ExcursionBookingPage = () => {
  const { t, i18n } = useTranslation();
  const { operatorId, excursionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [excursion, setExcursion] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    contact_method: 'WhatsApp',
    email: '',
    document_number: '',
    language: i18n.language,
    adults: 1,
    children: 0,
    infants: 0,
    pickup_location: ''
  });
  const [status, setStatus] = useState(null);
  const selectedDate = location.state?.date || '';

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/excursions?operator_id=${operatorId}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => String(e.id) === excursionId);
        setExcursion(found);
      })
      .catch(err => console.error('Ошибка загрузки экскурсии:', err));
  }, [operatorId, excursionId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['adults','children','infants'].includes(name)
        ? Math.max(0, parseInt(value, 10) || 0)
        : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    if (!excursion) return;

    const totalPrice =
      excursion.adult_price * formData.adults +
      excursion.child_price * formData.children +
      excursion.infant_price * formData.infants;

    const payload = {
      ...formData,
      excursion_title: excursion.title,
      date: selectedDate,
      total_price: totalPrice
    };

    try {
      const res = await fetch('https://booking-backend-tjmn.onrender.com/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('payment error');
      const result = await res.json();
      navigate('/success', {
        state: {
          bookingId: result.booking_id,
          excursionTitle: excursion.title,
          date: selectedDate,
          peopleCount: formData.adults + formData.children + formData.infants
        }
      });
    } catch (err) {
      console.error(err);
      setStatus(t('booking.error'));
    }
  };

  if (!excursion) return <p className="booking-loading">{t('booking.loading')}</p>;

  return (
    <div className="booking-page">
      <h1 className="booking-title">{t('booking.title', { title: excursion.title })}</h1>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">{t('booking.firstName')}</label>
          <input
            id="firstName" name="firstName"
            type="text"
            placeholder={t('booking.firstName')}
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">{t('booking.lastName')}</label>
          <input
            id="lastName" name="lastName"
            type="text"
            placeholder={t('booking.lastName')}
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">{t('booking.phone')}</label>
          <input
            id="phone" name="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={t('booking.phone')}
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact_method">{t('booking.contactMethod')}</label>
          <select
            id="contact_method" name="contact_method"
            value={formData.contact_method}
            onChange={handleChange}
            required
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Telegram">Telegram</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('booking.email')}</label>
          <input
            id="email" name="email"
            type="email"
            placeholder={t('booking.email')}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="document_number">{t('booking.documentNumber')}</label>
          <input
            id="document_number" name="document_number"
            type="text"
            placeholder={t('booking.documentNumber')}
            value={formData.document_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pickup_location">{t('booking.pickupLocation')}</label>
          <input
            id="pickup_location" name="pickup_location"
            type="text"
            placeholder={t('booking.pickupLocation')}
            value={formData.pickup_location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="language">{t('booking.guideLanguage')}</label>
          <select
            id="language" name="language"
            value={formData.language}
            onChange={handleChange}
            required
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="adults">{t('booking.adults')}</label>
          <input
            id="adults" name="adults"
            type="number"
            min="0"
            value={formData.adults}
            onChange={handleChange}
            inputMode="numeric"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="children">{t('booking.children')}</label>
          <input
            id="children" name="children"
            type="number"
            min="0"
            value={formData.children}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        <div className="form-group">
          <label htmlFor="infants">{t('booking.infants')}</label>
          <input
            id="infants" name="infants"
            type="number"
            min="0"
            value={formData.infants}
            onChange={handleChange}
            inputMode="numeric"
          />
        </div>

        <div className="form-group">
          <label>{t('booking.date')}</label>
          <p>{selectedDate}</p>
        </div>

        <div className="form-group">
          <label>{t('booking.total')}</label>
          <p>{
            excursion.adult_price * formData.adults +
            excursion.child_price * formData.children +
            excursion.infant_price * formData.infants
          } AED</p>
        </div>

        {status && <p className="error-text">{status}</p>}

        <button type="submit" className="pay-button">
          {t('booking.pay')}
        </button>
      </form>

      <BackButton/>
    </div>
  );
};

export default ExcursionBookingPage;
