import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import './ExcursionBookingPage.css';
import { useTranslation } from 'react-i18next';

const ExcursionBookingPage = () => {
  const { excursionId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const selectedDate = location.state?.selectedDate;

  const [excursion, setExcursion] = useState(null);
  const [languages, setLanguages] = useState([]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    contactMethod: 'WhatsApp',
    email: '',
    documentNumber: '',
    language: '',
    adults: 1,
    children: 0,
    infants: 0
  });

  useEffect(() => {
    // Загрузка данных экскурсии
    fetch(`/mock/excursion_${excursionId}.json`)
      .then(res => res.json())
      .then(setExcursion);

    // Загрузка языков из БД (пока mock)
    fetch('/mock/languages.json')
      .then(res => res.json())
      .then(setLanguages);
  }, [excursionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!excursion) return 0;
    const { adult, child, infant } = excursion.prices;
    return (
      form.adults * adult +
      form.children * child +
      form.infants * infant
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      excursionId,
      date: selectedDate
    };
  
    console.log('Отправка бронирования:', payload);
    alert('Бронирование отправлено!');
  };

  if (!excursion) return <div>Загрузка...</div>;


  return (
    <div className="booking-wrapper">
      <h1 className="booking-title">{excursion.title}</h1>
      
      <form className="booking-form" onSubmit={handleSubmit}>
      <p style={{ background: 'lightgreen', padding: '1rem' }}>
        Проверка формы: поле "Имя" должно быть ниже
        </p>
        <label>Имя<input type="text" name="firstName" required onChange={handleChange} /></label>
        <label>Фамилия<input type="text" name="lastName" required onChange={handleChange} /></label>
        <label>Телефон<input type="tel" name="phone" required onChange={handleChange} /></label>

        <label>Метод связи
          <select name="contactMethod" onChange={handleChange}>
            <option>WhatsApp</option>
            <option>Telegram</option>
            <option>Email</option>
          </select>
        </label>

        {form.contactMethod === 'Email' && (
          <label>Email<input type="email" name="email" onChange={handleChange} /></label>
        )}

        <label>Номер документа<input type="text" name="documentNumber" onChange={handleChange} /></label>

        <label>Язык экскурсии
          <select name="language" required onChange={handleChange}>
            <option value="">Выберите язык</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </label>

        <label>Взрослых<input type="number" name="adults" min="0" value={form.adults} onChange={handleChange} /></label>
        <label>Детей<input type="number" name="children" min="0" value={form.children} onChange={handleChange} /></label>
        <label>Младенцев<input type="number" name="infants" min="0" value={form.infants} onChange={handleChange} /></label>

        <div className="booking-total">
          Итого: <strong>{calculateTotal()} AED</strong>
        </div>

        {selectedDate && (
        <div className="selected-date">
            📅 Дата экскурсии: <strong>{selectedDate}</strong>
        </div>
        )}

        <button type="submit" className="submit-button">Подтвердить бронирование</button>
      </form>

      <BackButton />
    </div>
  );
};

export default ExcursionBookingPage;