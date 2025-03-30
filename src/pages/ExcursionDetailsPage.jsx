import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExcursionDetailsPage.css';
import BackButton from '../components/BackButton';

const ExcursionDetailsPage = () => {
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

  if (!excursion) return <p>Загрузка...</p>;

  const images = excursion.image_urls?.split(',') || [];

  return (
    <div className="excursion-details-wrapper">
      <h1>{excursion.title}</h1>

      <div className="image-carousel">
        {images.map((url, idx) => (
          <img key={idx} src={url.trim()} alt={`Фото ${idx + 1}`} className="carousel-img" />
        ))}
      </div>

      <div className="excursion-info-block">
        <p><strong>Описание:</strong> {excursion.description}</p>
        <p><strong>Локация:</strong> {excursion.location}</p>
        <p><strong>Длительность:</strong> {excursion.duration}</p>
        <p><strong>Цена:</strong> {excursion.price} AED</p>
      </div>

      <button className="book-button" onClick={() => navigate(`/excursions/${operatorId}/${excursionId}/date`)}>
        Забронировать
      </button>

      <BackButton />
    </div>
  );
};

export default ExcursionDetailsPage;
