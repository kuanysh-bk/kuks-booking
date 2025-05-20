import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionDetailsPage.css';
import BackButton from '../components/BackButton';

const ExcursionDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { operatorId, excursionId } = useParams();
  const [excursion, setExcursion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/excursions?operator_id=${operatorId}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(exc => String(exc.id) === excursionId);
        setExcursion(found);
      })
      .catch(err => console.error('Ошибка загрузки экскурсии:', err));
  }, [operatorId, excursionId]);

  if (!excursion) {
    return <p className="loading">{t('excursion.loading')}</p>;
  }

  const images = excursion.image_urls?.split(',').map(url => url.trim()) || [];

  // dynamic translation: use language-specific fields if available
  const description = excursion[`description_${i18n.language}`] || excursion.description;
  const locationValue = excursion[`location_${i18n.language}`] || excursion.location;

  return (
    <div className="excursion-details-wrapper">
      <h1 className="excursion-details-title">{excursion.title}</h1>

      <div className="image-carousel">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={t('excursion.photoAlt', { index: idx + 1 })}
            className="carousel-img"
          />
        ))}
      </div>

      <div className="excursion-info-block">
        <p>
          <strong>{t('excursion.description')}:</strong> {description}
        </p>
        <p>
          <strong>{t('excursion.location')}:</strong> {locationValue}
        </p>
        <p>
          <strong>{t('excursion.duration')}:</strong> {excursion.duration} {t('excursion.duration_min')}
        </p>
        <p>
          <strong>{t('excursion.price')}:</strong> {excursion.price} AED
        </p>
      </div>

      <button
        className="book-button"
        onClick={() => navigate(`/excursions/${operatorId}/${excursionId}/date`)}
      >
        {t('excursion.book')}
      </button>

      <BackButton/>
    </div>
  );
};

export default ExcursionDetailsPage;
