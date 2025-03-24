import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExcursionOperatorPage.css';
import BackButton from '../components/BackButton';

const ExcursionOperatorPage = () => {
  const [operators, setOperators] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Временно — локальный mock
    fetch('/mock/operators.json')
      .then(res => res.json())
      .then(setOperators);
  }, []);

  const handleSelect = (operatorId) => {
    navigate(`/excursions/${operatorId}`);
  };

  return (
    <div className="operator-wrapper">
      <h1 className="operator-title">Выберите туроператора</h1>
      <div className="operator-list">
        {operators.map((op) => (
          <button key={op.id} className="operator-card" onClick={() => handleSelect(op.id)}>
            {op.name}
          </button>
        ))}
      </div>
      <BackButton />
    </div>
  );
};

export default ExcursionOperatorPage;
