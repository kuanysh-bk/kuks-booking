import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Выберите раздел</h1>
      <div className="home-options">
        <Link to="/excursions" className="home-card">
          <h2>Экскурсии</h2>
          <p>Забронируйте увлекательные экскурсии по Эмиратам</p>
        </Link>
        <Link to="/cars" className="home-card">
          <h2>Аренда автомобиля</h2>
          <p>Арендуйте авто для комфортных поездок</p>
        </Link>
      </div>
    </div>
  );
};


export default Home;
