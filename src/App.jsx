import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <header>
        <div className="language-selector">
          <a href="?lang=ar">العربية</a>
          <a href="?lang=kk">Қазақ</a>
          <a href="?lang=fr">Français</a>
          <a href="?lang=de">Deutsch</a>
          <a href="?lang=es">Español</a>
          <a href="?lang=en">English</a>
          <a href="?lang=ru">Русский</a>
        </div>
      </header>
      <main>
        <button 
          className="button" 
          onClick={() => window.location.href = 'excursion.html'}
        >
          Выбрать экскурсию
        </button>
        <button 
          className="button" 
          onClick={() => window.location.href = 'car_rental.html'}
        >
          Аренда автомобиля
        </button>
      </main>
    </div>
  );
}

export default App;
