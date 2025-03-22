import React from 'react';
import './Header.css'; // Если понадобится отдельный файл стилей

const Header = () => {
  return (
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
  );
};

export default Header;
