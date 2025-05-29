import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const {t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleChangePassword = async () => {
    if (password !== repeatPassword) return alert(t('common.password_mismatch'));
    await fetch('https://booking-backend-tjmn.onrender.com/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ password })
    });
    setShowModal(false);
    setPassword('');
    setRepeatPassword('');
    alert(t('common.password_updated'));
  };

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
        {isAdmin && !isLoginPage && (
          <>
            <button className="change-password-button" onClick={() => setShowModal(true)}>
              {t('common.change_password')}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              {t('common.logout')}
            </button>
          </>
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
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{t('common.new_password')}</h3>
            <input
              type="password"
              placeholder={t('common.enter_new')}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t('common.repeat_new')}
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>{t('common.submit')}</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;