import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ExcursionBookingPage.css';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';

const ExcursionBookingPage = () => {
  const { operatorId, excursionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [excursion, setExcursion] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    contact_method: 'WhatsApp',
    email: '',
    document_number: '',
    language: 'en',
    adults: '1',
    children: '0',
    infants: '0',
    pickup_location: ''
  });

  const [status, setStatus] = useState(null);

  const selectedDate = location.state?.date || '';

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/excursions?operator_id=${operatorId}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(exc => String(exc.id) === excursionId);
        setExcursion(found);
      })
      .catch(err => console.error('Ошибка загрузки экскурсии:', err));
  }, [operatorId, excursionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const totalPrice = excursion.price * (
      parseInt(formData.adults) +
      parseInt(formData.children) +
      parseInt(formData.infants)
    );

    const payload = {
      ...formData,
      excursion_title: excursion.title,
      date: selectedDate,
      total_price: totalPrice
    };

    try {
      const response = await fetch('https://booking-backend-tjmn.onrender.com/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Ошибка оплаты');

      const result = await response.json();
      navigate('/success', {
        state: {
          bookingId: result.booking_id,
          excursionTitle: excursion.title,
          date: selectedDate,
          people: parseInt(formData.adults) + parseInt(formData.children) + parseInt(formData.infants),
          contact: excursion.contact,
        }
      });
    } catch (err) {
      console.error(err);
      setStatus('Ошибка при оплате. Попробуйте позже.');
    }
  };

  if (!excursion) return <p>Загрузка...</p>;

  return (
    <div className="booking-page">
      <h1>Бронирование: {excursion.title}</h1>
      <form onSubmit={handleSubmit} className="booking-form">
        <input type="text" name="firstName" placeholder="Имя" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Фамилия" value={formData.lastName} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />

        <select name="contact_method" value={formData.contact_method} onChange={handleChange} required>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Telegram">Telegram</option>
          <option value="Email">Email</option>
        </select>

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="document_number" placeholder="Номер документа" value={formData.document_number} onChange={handleChange} required />

        <input type="text" name="pickup_location" placeholder="Pick-up location" value={formData.pickup_location} onChange={handleChange} />

        <select name="language" value={formData.language} onChange={handleChange} required>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>

        <input type="number" name="adults" placeholder="Взрослые" value={formData.adults} onChange={handleChange} min="0" required />
        <input type="number" name="children" placeholder="Дети" value={formData.children} onChange={handleChange} min="0" />
        <input type="number" name="infants" placeholder="Младенцы" value={formData.infants} onChange={handleChange} min="0" />

        <p><strong>Дата:</strong> {selectedDate}</p>
        <p><strong>Итого:</strong> {excursion.price * (
          parseInt(formData.adults) +
          parseInt(formData.children) +
          parseInt(formData.infants)
        )} AED</p>

        {status && <p className="error-text">{status}</p>}

        <button type="submit">Оплатить</button>
      </form>

      <BackButton />
    </div>
  );
};

export default ExcursionBookingPage;