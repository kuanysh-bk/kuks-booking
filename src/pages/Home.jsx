import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// Если дополнительные стили для Home не нужны, можно удалить этот импорт
// import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="home-page">
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
