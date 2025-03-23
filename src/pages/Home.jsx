// src/pages/Home.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import './Home.css'; // если нужны стили

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <button className="button" onClick={() => navigate('/category')}>
        {t('excursion', 'Выбрать экскурсию')}
      </button>
      <button className="button" onClick={() => navigate('/car_rental')}>
        {t('carRental', 'Аренда автомобиля')}
      </button>
    </div>
  );
};

export default Home;
