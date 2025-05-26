import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CarRentalPage.css';
import BackButton from '../components/BackButton';

const CarRentalPage = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filter, setFilter] = useState({
    type: '',
    brand: '',
    model: '',
    seatsFrom: '',
    seatsTo: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    engineFrom: '',
    engineTo: '',
    mileageFrom: '',
    mileageTo: ''
  });

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        const brandSet = new Set();
        const modelSet = new Set();
        let minSeats = Infinity, maxSeats = 0;

        data.forEach(car => {
          brandSet.add(car.brand);
          modelSet.add(car.model);
          if (car.seats < minSeats) minSeats = car.seats;
          if (car.seats > maxSeats) maxSeats = car.seats;
        });

        setBrands(Array.from(brandSet));
        setModels(Array.from(modelSet));

        setFilter(f => ({
          ...f,
          seatsFrom: minSeats,
          seatsTo: maxSeats
        }));

        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки машин:', err);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const toggleFilters = () => setShowFilters(prev => !prev);

  const filteredCars = cars.filter(car => {
    const {
      type, brand, model,
      seatsFrom, seatsTo,
      priceFrom, priceTo,
      yearFrom, yearTo,
      engineFrom, engineTo,
      mileageFrom, mileageTo
    } = filter;

    return (
      (!type || car.car_type === type) &&
      (!brand || car.brand === brand) &&
      (!model || car.model === model) &&
      (!seatsFrom || car.seats >= parseInt(seatsFrom)) &&
      (!seatsTo || car.seats <= parseInt(seatsTo)) &&
      (!priceFrom || car.price_per_day >= parseFloat(priceFrom)) &&
      (!priceTo || car.price_per_day <= parseFloat(priceTo)) &&
      (!yearFrom || car.year >= parseInt(yearFrom)) &&
      (!yearTo || car.year <= parseInt(yearTo)) &&
      (!engineFrom || car.engine_capacity >= parseFloat(engineFrom)) &&
      (!engineTo || car.engine_capacity <= parseFloat(engineTo)) &&
      (!mileageFrom || car.mileage >= parseInt(mileageFrom)) &&
      (!mileageTo || car.mileage <= parseInt(mileageTo))
    );
  });

  return (
    <div className="car-rental-wrapper">
      <h1>{t('cars.title')}</h1>

      <button className="toggle-filters" onClick={toggleFilters}>
        {showFilters ? t('cars.hideFilters') : t('cars.showFilters')}
      </button>

      {showFilters && (
        <div className="advanced-filters">
          <select name="type" value={filter.type} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allTypes')}</option>
            <option value="sedan">{t('cars.filters.sedan')}</option>
            <option value="suv">{t('cars.filters.suv')}</option>
            <option value="minivan">{t('cars.filters.minivan')}</option>
          </select>

          <select name="brand" value={filter.brand} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allBrands')}</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select name="model" value={filter.model} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allModels')}</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <div className="range-group">
            <label>{t('cars.seats')}</label>
            <input type="number" name="seatsFrom" value={filter.seatsFrom} onChange={handleFilterChange} />
            <input type="number" name="seatsTo" value={filter.seatsTo} onChange={handleFilterChange} />
          </div>

          <div className="range-group">
            <label>{t('cars.pricePerDay')}</label>
            <input type="number" name="priceFrom" value={filter.priceFrom} onChange={handleFilterChange} />
            <input type="number" name="priceTo" value={filter.priceTo} onChange={handleFilterChange} />
          </div>

          <div className="range-group">
            <label>{t('cars.year')}</label>
            <input type="number" name="yearFrom" value={filter.yearFrom} onChange={handleFilterChange} />
            <input type="number" name="yearTo" value={filter.yearTo} onChange={handleFilterChange} />
          </div>

          <div className="range-group">
            <label>{t('cars.engineCapacity')}</label>
            <input type="number" step="0.1" name="engineFrom" value={filter.engineFrom} onChange={handleFilterChange} />
            <input type="number" step="0.1" name="engineTo" value={filter.engineTo} onChange={handleFilterChange} />
          </div>

          <div className="range-group">
            <label>{t('cars.mileage')}</label>
            <input type="number" name="mileageFrom" value={filter.mileageFrom} onChange={handleFilterChange} />
            <input type="number" name="mileageTo" value={filter.mileageTo} onChange={handleFilterChange} />
          </div>
        </div>
      )}

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
                <button className="book-button" onClick={() => alert(`${t('cars.booked')}: ${car.brand} ${car.model}`)}>
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