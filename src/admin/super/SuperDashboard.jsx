
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SuperDashboard.css';

const SuperDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetch('https://booking-backend-tjmn.onrender.com/api/super/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(setUsers);
    }
  }, [activeTab]);

  return (
    <div className="super-dashboard">
      <h1 className="dashboard-title">{t('super_dashboard.title')}</h1>
      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          {t('super_dashboard.users')}
        </button>
        <button
          className={activeTab === 'suppliers' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('suppliers')}
        >
          {t('super_dashboard.suppliers')}
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('super_dashboard.email')}</th>
                <th>{t('super_dashboard.is_superuser')}</th>
                <th>{t('super_dashboard.supplier_id')}</th>
                <th>{t('super_dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.is_superuser ? '✔' : ''}</td>
                  <td>{user.supplier_id}</td>
                  <td>
                    <button className="edit-btn">{t('common.edit')}</button>
                    <button className="delete-btn">{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="placeholder">{t('super_dashboard.suppliers_tab')}</div>
      )}
    </div>
  );
};

export default SuperDashboard;