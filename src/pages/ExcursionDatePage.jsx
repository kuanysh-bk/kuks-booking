import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ExcursionDatePage.css';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';

const ExcursionDatePage = () => {
  const { operatorId, excursionId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    // Здесь будет реальный запрос к БД
    fetch(`/mock/excursion_availability_${excursionId}.json`)
      .then((res) => res.json())
      .then((data) => {
        const dates = data.unavailable.map(dateStr => new Date(dateStr));
        setUnavailableDates(dates);
      });
  }, [excursionId]);

  const handleContinue = () => {
    if (selectedDate) {
      // Можно передавать дату через state, query или глобальное хранилище
      navigate(`/excursions/${operatorId}/${excursionId}/booking`, {
        state: { selectedDate: selectedDate.toISOString().split('T')[0] } // формат: YYYY-MM-DD
      });
    }
  };

  return (
    <div className="date-picker-wrapper">
      <h1 className="date-picker-title">{t('booking.selectDate')}</h1>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        excludeDates={unavailableDates}
        minDate={new Date()}
        dateFormat="dd.MM.yyyy"
        placeholderText={t('booking.chooseDate')}
        inline
      />

      <button
        className="submit-button"
        onClick={handleContinue}
        disabled={!selectedDate}
      >
        {t('booking.continue')}
      </button>

      <BackButton />
    </div>
  );
};

export default ExcursionDatePage;