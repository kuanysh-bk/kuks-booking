import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-content">
        <h1 className="home-title">Добро пожаловать</h1>
        <p className="home-subtitle">Выберите нужный вам сервис:</p>

        <div className="home-buttons">
          <Link to="/excursions" className="home-button">Забронировать экскурсию</Link>
          <Link to="/transfer" className="home-button">Забронировать трансфер</Link>
          <Link to="/check" className="home-button">Проверить бронирование</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
