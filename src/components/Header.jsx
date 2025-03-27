import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="language-selector">
        <button
          onClick={() => changeLanguage('ru')}
          className={i18n.language === 'ru' ? 'active' : ''}
        >
          Русский
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={i18n.language === 'en' ? 'active' : ''}
        >
          English
        </button>
      </div>
    </header>
  );
};

export default Header;