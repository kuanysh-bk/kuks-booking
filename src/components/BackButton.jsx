import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="back-button-wrapper">
      <button onClick={() => navigate(-1)} className="back-button">
        {t('common.back')}
      </button>
    </div>
  );
};

export default BackButton;
