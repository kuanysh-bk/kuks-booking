import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionListPage.css';
import BackButton from '../components/BackButton';

const ExcursionListPage = () => {
  const { operatorId } = useParams();
  const [operatorName, setOperatorName] = useState('');
  const [excursions, setExcursions] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { t } = useTranslation();

  // Получаем имя оператора
  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/operators')
      .then(res => res.json())
      .then(data => {
        const operator = data.find(op => String(op.id) === operatorId);
        setOperatorName(operator ? operator.name : '');
      })
      .catch(err => console.error('Ошибка загрузки операторов:', err));
  }, [operatorId]);

  const parseDurationHours = (text) => {
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const sortExcursions = (list, option) => {
    const sorted = [...list];
    if (option === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (option === 'duration') {
      sorted.sort((a, b) => parseDurationHours(a.duration) - parseDurationHours(b.duration));
    }
    return sorted;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://booking-backend-tjmn.onrender.com/excursions?operator_id=${operatorId}`)
      .then(res => res.json())
      .then(data => {
        setExcursions(sortExcursions(data, sortOption));
        setHasError(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки экскурсий:', err);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  }, [operatorId, sortOption]);

  return (
    <div className="excursion-wrapper">
      {!isLoading && !hasError && excursions.length > 0 && (
      <h1 className="excursion-title">
        {operatorName
          ? t('excursion.operatorHeader', { name: operatorName })
          : t('excursion.operatorHeaderId', { id: operatorId })
        }
      </h1>)}

      <div className="sort-controls">
        <label htmlFor="sort">{t('excursion.sortBy')}:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="">{t('sort.none')}</option>
          <option value="price-asc">{t('sort.priceAsc')}</option>
          <option value="price-desc">{t('sort.priceDesc')}</option>
          <option value="duration">{t('sort.duration')}</option>
        </select>
      </div>

      {isLoading && <p className="excursion-status">{t('excursion.loading')}</p>}

      {!isLoading && hasError && (
        <p className="excursion-status error">{t('excursion.loadError')}</p>
      )}

      {!isLoading && !hasError && excursions.length === 0 && (
        <p className="excursion-status">{t('excursion.noExcursions')}</p>
      )}

      {!isLoading && !hasError && excursions.length > 0 && (
        <div className="excursion-list">
          {excursions.map(exc => (
            <Link
              to={`/excursions/${operatorId}/${exc.id}`}
              key={exc.id}
              className="excursion-card-link"
            >
              <div className="excursion-card">
                <img
                  src={exc.image_urls?.split(',')[0]}
                  alt={exc.title}
                  className="excursion-thumb"
                />
                <div className="excursion-info">
                  <h3>{exc.title}</h3>
                  <p>{t('excursion.price')}: {exc.price} AED</p>
                  <p>{t('excursion.duration')}: {exc.duration} {t('excursion.duration_min')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <BackButton/>
    </div>
  );
};

export default ExcursionListPage;
