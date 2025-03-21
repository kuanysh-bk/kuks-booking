import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const translations = {
  ru: {
    heading: "Выберите раздел",
    excursions: "Экскурсии",
    excursionsDesc: "Забронируйте увлекательные экскурсии по Эмиратам",
    cars: "Аренда автомобиля",
    carsDesc: "Арендуйте авто для комфортных поездок",
  },
  en: {
    heading: "Choose a section",
    excursions: "Excursions",
    excursionsDesc: "Book exciting excursions in the Emirates",
    cars: "Car Rental",
    carsDesc: "Rent a car for comfortable travel",
  },
};

const Home = () => {
  const [lang, setLang] = useState("ru");
  const t = translations[lang];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">{t.heading}</h1>
        <div>
          <button
            onClick={() => setLang("ru")}
            className={`lang-btn ${lang === "ru" ? "active" : ""}`}
          >
            RU
          </button>
          <button
            onClick={() => setLang("en")}
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="home-options">
        <Link to="/excursions" className="home-card">
          <h2>{t.excursions}</h2>
          <p>{t.excursionsDesc}</p>
        </Link>
        <Link to="/cars" className="home-card">
          <h2>{t.cars}</h2>
          <p>{t.carsDesc}</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
