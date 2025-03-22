import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Можно создать, если нужны специальные стили для Home

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <button 
        className="button" 
        onClick={() => navigate('/excursion')}
      >
        Выбрать экскурсию
      </button>
      <button 
        className="button" 
        onClick={() => navigate('/car_rental')}
      >
        Аренда автомобиля
      </button>
    </div>
  );
};

export default Home;
