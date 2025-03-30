import React, { useEffect, useState } from 'react';
import './CarRentalPage.css';
import BackButton from '../components/BackButton';

const CarRentalPage = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/cars')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error('Ошибка загрузки машин:', err));
  }, []);

  const handleBookClick = (car) => {
    alert(`Забронирована машина: ${car.brand} ${car.model}`);
    // Здесь можно реализовать переход на страницу оформления аренды
  };

  return (
    <div className="car-rental-wrapper">
      <h1>Аренда автомобилей</h1>
      <div className="car-list">
        {cars.map(car => (
          <div className="car-card" key={car.id}>
            <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-image" />
            <div className="car-info">
              <h3>{car.brand} {car.model}</h3>
              <p>Цвет: {car.color}</p>
              <p>Сидений: {car.seats}</p>
              <p>Тип: {car.car_type}</p>
              <p>Трансмиссия: {car.transmission}</p>
              <p>Кондиционер: {car.has_air_conditioning ? 'Да' : 'Нет'}</p>
              <p>Цена за день: {car.price_per_day} AED</p>
              <button className="book-button" onClick={() => handleBookClick(car)}>Забронировать</button>
            </div>
          </div>
        ))}
      </div>
      <BackButton />
    </div>
  );
};

export default CarRentalPage;