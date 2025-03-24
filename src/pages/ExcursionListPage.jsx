import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionListPage.css';
import BackButton from '../components/BackButton';

const [sortOption, setSortOption] = useState(''); // default — без сортировки

const handleSort = (e) => {
  setSortOption(e.target.value);
};

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
  
const ExcursionListPage = () => {
  const { operatorId } = useParams();
  const [excursions, setExcursions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`/mock/excursions_${operatorId}.json`)
      .then(res => res.json())
      .then((data) => {
        const sorted = sortExcursions(data, sortOption);
        setExcursions(sorted);
      });
  }, [operatorId, sortOption]);

  return (
    <div className="excursion-wrapper">
      <h1 className="excursion-title">Экскурсии туроператора #{operatorId}</h1>
      <div className="excursion-list">
      <div className="sort-controls">
        <label htmlFor="sort">Сортировать по: </label>
        <select id="sort" value={sortOption} onChange={handleSort}>
            <option value="">Без сортировки</option>
            <option value="price-asc">Цене: от дешевых</option>
            <option value="price-desc">Цене: от дорогих</option>
            <option value="duration">Длительности</option>
        </select>
        </div>

        {excursions.map((exc) => (
          <Link
            to={`/excursions/${operatorId}/${exc.id}`}
            key={exc.id}
            className="excursion-card-link"
          >
            <div className="excursion-card">
            <img src={exc.image} alt={exc.title} className="excursion-thumb" />
            <div className="excursion-info">
                <h3>{exc.title}</h3>
                <p>Цена: {exc.price} AED</p>
            </div>
            </div>
          </Link>
        ))}
      </div>

      <BackButton />
    </div>
  );
};

export default ExcursionListPage;
