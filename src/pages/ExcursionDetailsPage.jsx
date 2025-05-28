import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionDetailsPage.css';
import BackButton from '../components/BackButton';

const ExcursionDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { operatorId, excursionId } = useParams();
  const [excursion, setExcursion] = useState(null);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const images = excursion?.image_urls?.split(',').map(url => url.trim()) || [];

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const goTo = (index) => {
    clearInterval(intervalRef.current);
    setCurrentIndex(index);
  };

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

  // dynamic translation: use language-specific fields if available
  const description = excursion[`description_${i18n.language}`] || excursion.description;
  const locationValue = excursion[`location_${i18n.language}`] || excursion.location;

  return (
    <div className="excursion-details-wrapper">
      <h1 className="excursion-details-title">{excursion.title}</h1>

      {images.length > 0 && (
        <div className="carousel-wrapper">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="carousel-img"
          />
          <button className="carousel-btn left" onClick={() => goTo((currentIndex - 1 + images.length) % images.length)}>&lt;</button>
          <button className="carousel-btn right" onClick={() => goTo((currentIndex + 1) % images.length)}>&gt;</button>
        </div>
      )}

      <div className="excursion-info-block">
        <p><strong>{t('excursion.description')}:</strong> {description}</p>
        <p><strong>{t('excursion.location')}:</strong> {locationValue}</p>
        <p><strong>{t('excursion.duration')}:</strong> {excursion.duration} {t('excursion.duration_min')}</p>
        <p><strong>{t('excursion.price')}:</strong> {excursion.price} AED</p>
      </div>

      <button className="book-button" onClick={() => navigate(`/excursions/${operatorId}/${excursionId}/date`)}>
        {t('excursion.book')}
      </button>

      <BackButton />
    </div>
  );
};

export default ExcursionDetailsPage;
