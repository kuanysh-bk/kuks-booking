import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './ExcursionBookingPage.css';
import BackButton from '../components/BackButton';

const ExcursionBookingPage = () => {
  const { t, i18n } = useTranslation();
  const { operatorId, excursionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [excursion, setExcursion] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', contact_method: 'WhatsApp',
    email: '', document_number: '', language: i18n.language,
    adults: 1, children: 0, infants: 0, pickup_location: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedDate = location.state?.date || '';

  // Keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [layoutName, setLayoutName] = useState('default');

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/excursions?operator_id=${operatorId}`)
      .then(res => res.json())
      .then(data => setExcursion(data.find(e => String(e.id) === excursionId)))
      .catch(err => console.error('Ошибка загрузки экскурсии:', err));
  }, [operatorId, excursionId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['adults', 'children', 'infants'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleFocus = e => {
    setCurrentInput(e.target.name);
    setShowKeyboard(true);
  };

  const handleKeyPress = button => {
    if (button === '{shift}' || button === '{lock}') {
      const newLayout = layoutName === 'default' ? 'shift' : 'default';
      setLayoutName(newLayout);
      return;
    }
    if (!currentInput) return;
    setFormData(prev => {
      let val = String(prev[currentInput] || '');
      if (button === '{bksp}') val = val.slice(0, -1);
      else if (button === '{space}') val += ' ';
      else if (button === '{tab}') val += '';
      else if (button === '{enter}') val += '';
      else val += button;
      return {
        ...prev,
        [currentInput]: ['adults', 'children', 'infants'].includes(currentInput)
          ? Number(val)
          : val
      };
    });
  };

  const hideKeyboard = () => {
    setShowKeyboard(false);
    setCurrentInput('');
    setLayoutName('default');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    if (!excursion) return;
    const totalPrice =
      excursion.adult_price * formData.adults +
      excursion.child_price * formData.children +
      excursion.infant_price * formData.infants;
    const totalPeople = formData.adults + formData.children + formData.infants;
    const payload = {
      ...formData,
      excursion_title: excursion.title,
      date: selectedDate,
      total_price: totalPrice,
      supplier_id: excursion.supplier_id,
      booking_type: 'excursion',
      car_id: null
    };
    try {
      const res = await fetch('https://booking-backend-tjmn.onrender.com/api/pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('payment error');
      const result = await res.json();
      navigate('/success', {
        state: {
          bookingId: result.booking_id,
          excursionTitle: excursion.title,
          date: selectedDate,
          peopleCount: totalPeople,
          operatorId
        }
      });
    } catch (err) {
      console.error(err);
      setStatus(t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!excursion) return <p className="booking-loading">{t('booking.loading')}</p>;

  return (
    <div className="booking-page">
      <h1 className="booking-title">{t('booking.title', { title: excursion.title })}</h1>
      <form className="booking-form" onSubmit={handleSubmit}>
        {['firstName','lastName','phone','email','documentNumber','pickupLocation'].map(field => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{t(`booking.${field}`)}</label>
            <input
              id={field} name={field}
              type="text"
              placeholder={t(`booking.${field}`)}
              value={formData[field]}
              onChange={handleChange}
              onFocus={handleFocus}
              required={['firstName','lastName','phone'].includes(field)}
            />
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="contact_method">{t('booking.contactMethod')}</label>
          <select id="contact_method" name="contact_method" value={formData.contact_method} onChange={handleChange} onFocus={handleFocus}>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Telegram">Telegram</option>
            <option value="Email">Email</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="language">{t('booking.guideLanguage')}</label>
          <select id="language" name="language" value={formData.language} onChange={handleChange} onFocus={handleFocus}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
        {['adults','children','infants'].map(field => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{t(`booking.${field}`)}</label>
            <input
              id={field} name={field} type="tel" inputMode="numeric" pattern="[0-9]*"
              value={formData[field]}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
        ))}
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
        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? t('booking.processing') : t('booking.pay')}
        </button>
      </form>
      {showKeyboard && (
        <div className="keyboard-wrapper">
          <button className="keyboard-hide-btn" onClick={hideKeyboard}>×</button>
          <Keyboard
            layoutName={layoutName}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}

      <BackButton />
    </div>
  );
};

export default ExcursionBookingPage;