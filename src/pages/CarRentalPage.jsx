import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CarRentalPage.css';
import BackButton from '../components/BackButton';

const CarRentalPage = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки машин:', err);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (car) => {
    alert(`${t('Забронирована машина')}: ${car.brand} ${car.model}`);
  };

  const filteredCars = cars
    .filter(car => (filterType ? car.car_type === filterType : true))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_day - b.price_per_day;
      if (sortBy === 'price_desc') return b.price_per_day - a.price_per_day;
      return 0;
    });

  return (
    <div className="car-rental-wrapper">
      <h1>{t('Аренда автомобилей')}</h1>

      {/* Фильтры и сортировка */}
      <div className="filters">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">{t('Все типы')}</option>
          <option value="sedan">{t('Седан')}</option>
          <option value="suv">{t('Внедорожник')}</option>
          <option value="minivan">{t('Минивэн')}</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">{t('Без сортировки')}</option>
          <option value="price_asc">{t('По возрастанию цены')}</option>
          <option value="price_desc">{t('По убыванию цены')}</option>
        </select>
      </div>

      {/* Анимация загрузки */}
      {loading ? (
        <div className="loading-spinner">{t('Загрузка...')}</div>
      ) : (
        <div className="car-list">
          {filteredCars.map(car => (
            <div className="car-card" key={car.id}>
              <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-image" />
              <div className="car-info">
                <h3>{car.brand} {car.model}</h3>
                <p>{t('Цвет')}: {car.color}</p>
                <p>{t('Сидений')}: {car.seats}</p>
                <p>{t('Тип')}: {car.car_type}</p>
                <p>{t('Трансмиссия')}: {car.transmission}</p>
                <p>{t('Кондиционер')}: {car.has_air_conditioning ? t('Да') : t('Нет')}</p>
                <p>{t('Цена за день')}: {car.price_per_day} AED</p>
                <button className="book-button" onClick={() => handleBookClick(car)}>
                  {t('Забронировать')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <BackButton />
    </div>
  );
};

export default CarRentalPage;