import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionListPage.css';
import BackButton from '../components/BackButton';

const ExcursionListPage = () => {
  const { operatorId } = useParams();
  const [excursions, setExcursions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`/mock/excursions_${operatorId}.json`)
      .then(res => res.json())
      .then(setExcursions);
  }, [operatorId]);

  return (
    <div className="excursion-wrapper">
      <h1 className="excursion-title">Экскурсии туроператора #{operatorId}</h1>

      <div className="excursion-list">
        {excursions.map((exc) => (
          <div key={exc.id} className="excursion-card">
            <h3>{exc.title}</h3>
            <p>Цена: {exc.price} AED</p>
            <button className="excursion-book-btn">{t('common.book')}</button>
          </div>
        ))}
      </div>

      <BackButton />
    </div>
  );
};

export default ExcursionListPage;
