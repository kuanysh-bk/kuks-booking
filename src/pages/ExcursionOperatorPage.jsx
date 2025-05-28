import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ExcursionOperatorPage.css';
import BackButton from '../components/BackButton';

const ExcursionOperatorPage = () => {
  const { t } = useTranslation();         // <-- подключили переводчик
  const [operators, setOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://booking-backend-tjmn.onrender.com/operators')
      .then(res => {
        if (!res.ok) throw new Error('network error');
        return res.json();
      })
      .then(data => {
        const excursionSuppliers = data.filter(supplier => supplier.supplier_type === 'excursion');
        setOperators(excursionSuppliers);
        setHasError(false);
      })
      .catch(err => {
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
      <h1 className="operator-title">
        {t('operator.selectOperator')}
      </h1>

      {isLoading && (
        <p className="operator-status">
          {t('operator.loading')}
        </p>
      )}

      {!isLoading && hasError && (
        <p className="operator-status error">
          {t('operator.loadError')}
        </p>
      )}

      {!isLoading && !hasError && operators.length === 0 && (
        <p className="operator-status">
          {t('operator.noOperators')}
        </p>
      )}

      {!isLoading && !hasError && operators.length > 0 && (
        <div className="operator-list">
          {operators.map(op => (
            <div
              key={op.id}
              className="operator-card"
              onClick={() => handleOperatorClick(op.id)}
            >
              {op.logo_url && (
                <img
                  src={op.logo_url}
                  alt={op.name}
                  className="operator-logo"
                />
              )}
              <h3 className="operator-name">{op.name}</h3>
            </div>
          ))}
        </div>
      )}

      <BackButton>
        {t('common.back')}
      </BackButton>
    </div>
  );
};

export default ExcursionOperatorPage;
