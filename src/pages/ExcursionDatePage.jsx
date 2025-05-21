import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import './ExcursionDatePage.css';
import BackButton from '../components/BackButton';

const ExcursionDatePage = () => {
  const { t } = useTranslation();
  const { operatorId, excursionId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/excursion-reservations?excursion_id=${excursionId}`)
      .then(res => res.json())
      .then(data => {
        const dates = data.map(item => {
          const [y, m, d] = item.date.split('-');
          return new Date(+y, +m - 1, +d); // локальная дата
        });
        setUnavailableDates(dates);
      })
      .catch(err => console.error('Ошибка загрузки дат:', err));
  }, [excursionId]);

  const handleContinue = () => {
    if (!selectedDate) return;

    // Формируем строго локальную дату в формате YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    console.log('Выбрана дата:', dateString);

    navigate(`/excursions/${operatorId}/${excursionId}/booking`, {
      state: { date: dateString }
    });
  };

  return (
    <div className="date-page-wrapper">
      <h2 className="date-page-title">{t('booking.selectDate')}</h2>
      <div className="datepicker-container">
        <DatePicker
          selected={selectedDate}
          onChange={date => {
            // Убираем смещение времени — создаём дату без времени
            const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            setSelectedDate(local);
          }}
          minDate={new Date()}
          excludeDates={unavailableDates}
          placeholderText={t('booking.placeholder')}
          dateFormat="yyyy-MM-dd"
          inline
          calendarClassName="custom-calendar"
        />
      </div>
      <button
        onClick={handleContinue}
        className="continue-button"
        disabled={!selectedDate}
      >
        {t('booking.continue')}
      </button>
      <BackButton />
    </div>
  );
};

export default ExcursionDatePage;