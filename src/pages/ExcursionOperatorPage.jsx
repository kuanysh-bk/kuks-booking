import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExcursionOperatorPage.css';
import BackButton from '../components/BackButton';

const ExcursionOperatorPage = () => {
  const [operators, setOperators] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/operators') 
      .then(res => res.json())
      .then(data => setOperators(data))
      .catch(err => console.error('Ошибка загрузки операторов:', err));
  }, []);

  const handleOperatorClick = (id) => {
    navigate(`/excursions/operator/${id}`);
  };

  return (
    <div className="operator-wrapper">
      <h1 className="operator-title">Выберите туроператора</h1>
      <div className="operator-list">
        {operators.map((op) => (
          <div key={op.id} className="operator-card" onClick={() => handleOperatorClick(op.id)}>
            {op.logo_url && <img src={op.logo_url} alt={op.name} className="operator-logo" />}
            <h3>{op.name}</h3>
          </div>
        ))}
      </div>
      <BackButton />
    </div>
  );
};

export default ExcursionOperatorPage;
