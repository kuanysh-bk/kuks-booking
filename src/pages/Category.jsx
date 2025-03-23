// src/pages/Category.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Category.css'; // Создайте файл стилей, если нужно

const Category = () => {
  const { t } = useTranslation();

  return (
    <div className="category-page">
      <h1>{t('selectTourOperator')}</h1>
      <p>{t('selectTourOperatorInfo')}</p>

      {/* Здесь можно вывести список или сетку тур операторов */}
      <div className="operator-list">
        <div className="operator-item">Туроператор 1</div>
        <div className="operator-item">Туроператор 2</div>
        <div className="operator-item">Туроператор 3</div>
        {/* Добавьте другие элементы по необходимости */}
      </div>
    </div>
  );
};

export default Category;
