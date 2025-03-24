import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExcursionDetailsPage.css';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const ExcursionDetailsPage = () => {
  const { excursionId, operatorId } = useParams();
  const [data, setData] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/mock/excursion_${excursionId}.json`)
      .then(res => res.json())
      .then(setData);
  }, [excursionId]);

  if (!data) return <div>Загрузка...</div>;

  return (
    <div className="excursion-details-wrapper">
      <h1 className="excursion-title">{data.title}</h1>

      <div className="excursion-images">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={4000}
        className="excursion-carousel"
        >
        {data.images.map((src, index) => (
            <div key={index}>
            <img src={src} alt={`slide-${index}`} />
            </div>
        ))}
        </Carousel>
      </div>

      <p className="excursion-description">{data.description}</p>
      <p><strong>📍 {t('details.location')}:</strong> {data.location}</p>
      <p><strong>⏱ {t('details.duration')}:</strong> {data.duration}</p>

      <div className="excursion-prices">
        <p><strong>{t('details.adult')}:</strong> {data.prices.adult} AED</p>
        <p><strong>{t('details.child')}:</strong> {data.prices.child} AED</p>
        <p><strong>{t('details.infant')}:</strong> {data.prices.infant} AED</p>
      </div>

      <button
        className="excursion-book-btn"
        onClick={() => navigate(`/excursions/${operatorId}/${excursionId}/booking`)}
      >
        {t('common.book')}
      </button>

      <BackButton />
    </div>
  );
};

export default ExcursionDetailsPage;
