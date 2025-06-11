import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-wrapper">

      <div className="home-content">
        <h1 className="home-title">{t('home.title')}</h1>
        <p className="home-subtitle">{t('home.subtitle')}</p>

        <div className="home-buttons">
          <Link to="/excursions" className="home-button">
            {t('home.bookExcursion')}
          </Link>
          <Link to="/cars" className="home-button">
            {t('home.rentCar')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
