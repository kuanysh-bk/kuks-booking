import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>{t('welcome')}</h1>
      <button className="button" onClick={() => navigate('/excursion')}>
        {t('excursion')}
      </button>
      <button className="button" onClick={() => navigate('/car_rental')}>
        {t('carRental')}
      </button>
    </div>
  );
};

export default Home;
