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
    fetch(`https://…/excursion-reservations?excursion_id=${excursionId}`)
      .then(res => res.json())
      .then(data => {
        const dates = data.map(item => {
          const [y, m, d] = item.date.split('-');
          return new Date(y, m - 1, d);  // создаём в локальной зоне
        });
        setUnavailableDates(dates);
      })
      .catch(err => console.error('Ошибка загрузки дат:', err));
  }, [excursionId]);  

  const handleContinue = () => {
    if (!selectedDate) return;
    // Собираем дату в локальном формате yyyy-MM-dd
    const year  = selectedDate.getUTCFullYear();
    const month = String(selectedDate.getUTCMonth() + 1).padStart(2, '0');
    const day   = String(selectedDate.getUTCDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

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
          onChange={date => setSelectedDate(date)}
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
