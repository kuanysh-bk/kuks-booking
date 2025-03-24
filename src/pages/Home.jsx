import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="home-wrapper">
      <div className="language-switcher">
        <button
          onClick={() => changeLanguage('ru')}
          className={`lang-link ${i18n.language === 'ru' ? 'active' : ''}`}
        >
          🇷🇺 RU
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`lang-link ${i18n.language === 'en' ? 'active' : ''}`}
        >
          🇬🇧 EN
        </button>
      </div>

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
