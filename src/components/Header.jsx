import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const {t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const goHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isSuperuser');
    navigate('/admin/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        {!isAdmin && location.pathname !== '/' && location.pathname !== '/success' && (
          <button className="home-button-header" onClick={goHome}>
            {t('common.home', 'Home')}
          </button>
        )}
      </div>
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
        {isAdmin && !isLoginPage && (
          <button className="logout-button" onClick={handleLogout}>
            {t('common.logout', 'Logout')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;