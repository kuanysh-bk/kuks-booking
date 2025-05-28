import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import './ExcursionDatePage.css';
import BackButton from '../components/BackButton';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import en from 'date-fns/locale/en-US';

const CarDatePage = () => {
  const { t, i18n } = useTranslation();
  const { carId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    registerLocale('ru', ru);
    registerLocale('en', en);
  }, []);

  console.log('carId из useParams:', carId);

  useEffect(() => {
    if (!carId) return;
    fetch(`https://booking-backend-tjmn.onrender.com/car-reservations?car_id=${carId}`)
      .then(res => res.json())
      .then(data => {
        console.log('>>> Ответ от /car-reservations:', data);
        const dates = [];
        data.forEach(item => {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));  // создаём копию, иначе ошибка
        }
        });
        setUnavailableDates(dates);
      })
      .catch(err => console.error('Ошибка загрузки дат:', err));
  }, [carId]);

  const handleContinue = () => {
    if (!startDate || !endDate) return;

    const toISO = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`;

    navigate(`/cars/${carId}/booking`, {
      state: {
        dateFrom: toISO(startDate),
        dateTo: toISO(endDate),
      },
    });
  };

  console.log('Недоступные даты:', unavailableDates);

  return (
    <div className="date-page-wrapper">
      <h2 className="date-page-title">{t('booking.selectDate')}</h2>
      <div className="datepicker-container">
        <DatePicker
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          excludeDates={unavailableDates}
          selectsRange
          inline
          calendarClassName="custom-calendar"
          dateFormat="yyyy-MM-dd"
          locale={i18n.language === 'ru' ? 'ru' : 'en'}
        />
      </div>
      <button
        onClick={handleContinue}
        className="continue-button"
        disabled={!startDate || !endDate}
      >
        {t('booking.continue')}
      </button>
      <BackButton />
    </div>
  );
};

export default CarDatePage;