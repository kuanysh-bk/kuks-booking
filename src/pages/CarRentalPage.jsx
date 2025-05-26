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
    type: '', brand: '', model: '', color: '',
    transmission: '', airConditioning: '', fuel_type: '', drive_type: '',
    seatsFrom: '', seatsTo: '', priceFrom: '', priceTo: '',
    yearFrom: '', yearTo: '', engineFrom: '', engineTo: '', mileageFrom: '', mileageTo: ''
  });

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [allModels, setAllModels] = useState([]);

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        const brandSet = new Set();
        const modelMap = new Map();
        let minSeats = Infinity, maxSeats = 0;

        data.forEach(car => {
          brandSet.add(car.brand);
          if (!modelMap.has(car.brand)) modelMap.set(car.brand, new Set());
          modelMap.get(car.brand).add(car.model);
          if (car.seats < minSeats) minSeats = car.seats;
          if (car.seats > maxSeats) maxSeats = car.seats;
        });

        setBrands(Array.from(brandSet));
        setAllModels(modelMap);
        setModels([]);

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

  useEffect(() => {
    if (filter.brand && allModels.has(filter.brand)) {
      setModels(Array.from(allModels.get(filter.brand)));
    } else {
      setModels([]);
    }
  }, [filter.brand, allModels]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const toggleFilters = () => setShowFilters(prev => !prev);

  const filteredCars = cars.filter(car => {
    const {
      type, brand, model, color, transmission, airConditioning, fuel_type, drive_type,
      seatsFrom, seatsTo, priceFrom, priceTo,
      yearFrom, yearTo, engineFrom, engineTo, mileageFrom, mileageTo
    } = filter;

    return (
      (!type || car.car_type === type) &&
      (!brand || car.brand === brand) &&
      (!model || car.model === model) &&
      (!color || car.color === color) &&
      (!transmission || car.transmission === transmission) &&
      (!airConditioning || (airConditioning === 'yes' ? car.has_air_conditioning : !car.has_air_conditioning)) &&
      (!fuel_type || car.fuel_type === fuel_type) &&
      (!drive_type || car.drive_type === drive_type) &&
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
      <button className="reset-filters" onClick={() => {
        setFilter({
          type: '', brand: '', model: '', color: '',
          transmission: '', airConditioning: '', fuel_type: '', drive_type: '',
          seatsFrom: '', seatsTo: '', priceFrom: '', priceTo: '',
          yearFrom: '', yearTo: '', engineFrom: '', engineTo: '', mileageFrom: '', mileageTo: ''
        });
      }}>
        {t('cars.resetFilters')}
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

          {filter.brand && (
            <select name="model" value={filter.model} onChange={handleFilterChange}>
              <option value="">{t('cars.filters.allModels')}</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}

          <select name="color" value={filter.color} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allColors')}</option>
            <option value="white">{t('cars.colors.white')}</option>
            <option value="black">{t('cars.colors.black')}</option>
            <option value="silver">{t('cars.colors.silver')}</option>
            <option value="gray">{t('cars.colors.gray')}</option>
            <option value="blue">{t('cars.colors.blue')}</option>
            <option value="red">{t('cars.colors.red')}</option>
          </select>

          <select name="transmission" value={filter.transmission} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allTransmissions')}</option>
            <option value="automatic">{t('cars.transmissionTypes.automatic')}</option>
            <option value="manual">{t('cars.transmissionTypes.manual')}</option>
          </select>

          <select name="airConditioning" value={filter.airConditioning} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.anyAC')}</option>
            <option value="yes">{t('common.yes')}</option>
            <option value="no">{t('common.no')}</option>
          </select>

          <select name="fuel_type" value={filter.fuel_type} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allFuels')}</option>
            <option value="petrol">{t('cars.fuel.petrol')}</option>
            <option value="diesel">{t('cars.fuel.diesel')}</option>
            <option value="gas">{t('cars.fuel.gas')}</option>
            <option value="electric">{t('cars.fuel.electric')}</option>
          </select>

          <select name="drive_type" value={filter.drive_type} onChange={handleFilterChange}>
            <option value="">{t('cars.filters.allDrives')}</option>
            <option value="fwd">{t('cars.drive.fwd')}</option>
            <option value="rwd">{t('cars.drive.rwd')}</option>
            <option value="awd">{t('cars.drive.awd')}</option>
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