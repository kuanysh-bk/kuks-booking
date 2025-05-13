import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExcursionOperatorPage.css';
import BackButton from '../components/BackButton';

const ExcursionOperatorPage = () => {
  const [operators, setOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/operators') 
      .then(res => {if (!res.ok) throw new Error('Ошибка сети');
                    return res.json();})
      .then(data => {
        setOperators(data);
        setHasError(false);
      })
      .catch(err =>  {
        console.error('Ошибка загрузки операторов:', err);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleOperatorClick = (id) => {
    navigate(`/excursions/${id}`);
  };

  return (
    <div className="operator-wrapper">
      <h1 className="operator-title">Выберите туроператора</h1>
      {isLoading && <p className="operator-status">Загрузка...</p>}

      {!isLoading && hasError && (
        <p className="operator-status error">Не удалось загрузить туроператоров. Попробуйте позже.</p>
      )}

      {!isLoading && !hasError && operators.length === 0 && (
        <p className="operator-status">Нет доступных туроператоров</p>
      )}

      {!isLoading && !hasError && operators.length > 0 && (
        <div className="operator-list">
          {operators.map((op) => (
            <div key={op.id} className="operator-card" onClick={() => handleOperatorClick(op.id)}>
              {op.logo_url && <img src={op.logo_url} alt={op.name} className="operator-logo" />}
              <h3>{op.name}</h3>
            </div>
          ))}
        </div>
      )}

      <BackButton />
    </div>
  );
};

export default ExcursionOperatorPage;
