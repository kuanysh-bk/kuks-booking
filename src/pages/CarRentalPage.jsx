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
    alert(`${t('cars.booked')}: ${car.brand} ${car.model}`);
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
      <h1>{t('cars.title')}</h1>

      {/* Фильтры */}
      <div className="filters">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">{t('cars.filters.allTypes')}</option>
          <option value="sedan">{t('cars.filters.sedan')}</option>
          <option value="suv">{t('cars.filters.suv')}</option>
          <option value="minivan">{t('cars.filters.minivan')}</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">{t('cars.car_sort.noSort')}</option>
          <option value="price_asc">{t('cars.car_sort.priceAsc')}</option>
          <option value="price_desc">{t('cars.car_sort.priceDesc')}</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner">{t('common.loading')}</div>
      ) : (
        <div className="car-list">
          {filteredCars.map(car => (
            <div className="car-card" key={car.id}>
              {car.image_url ? (
                <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-image" />
              ) : (
                <div className="no-image">{t('cars.noPhoto')}</div>
              )}
              <div className="car-info">
                <h2>{car.brand} {car.model}</h2>
                <p>{t(`cars.color`)}: {t(`cars.colors.${car.color}`)}</p>
                <p>{t('cars.seats')}: {car.seats}</p>
                <p>{t(`cars.type`)}: {t(`cars.types.${car.car_type}`)}</p>
                <p>{t(`cars.transmission`)}: {t(`cars.transmissionTypes.${car.transmission}`)}</p>
                <p>{t('cars.ac')}: {car.has_air_conditioning ? t('common.yes') : t('common.no')}</p>
                <p>{t('cars.pricePerDay')}: {car.price_per_day} AED</p>
                <button className="book-button" onClick={() => handleBookClick(car)}>
                  {t('cars.book')}
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