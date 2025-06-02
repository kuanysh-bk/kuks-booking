
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SuperDashboard.css';

const SuperDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', supplier_id: '' });
  const navigate = useNavigate();

    useEffect(() => {
    const isSuperuser = localStorage.getItem("isSuperuser");
    if (isSuperuser !== "true") {
        navigate("/admin/dashboard");
    }
    }, []);

  const handleAddUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!newUser.email.trim()) {
      alert(t('super_dashboard.email_required'));
      return;
    }
  
    if (!emailRegex.test(newUser.email)) {
      alert(t('super_dashboard.invalid_email'));
      return;
    }

    if (!newUser.supplier_id) {
      alert(t('super_dashboard.choose_supplier_required'));
      return;
    }
  
    const res = await fetch('https://booking-backend-tjmn.onrender.com/api/super/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newUser)
    });
  
    if (res.ok) {
      setNewUser({ email: '', supplier_id: '' });
      setShowAddForm(false);
      const updated = await fetch('https://booking-backend-tjmn.onrender.com/api/super/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json());
      setUsers(updated);
    }
  };  

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'users') {
        const res = await fetch('https://booking-backend-tjmn.onrender.com/api/super/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.status === 401) {
          localStorage.clear();
          navigate("/admin/login");
          return;
        }
        const usersData = await res.json();
        setUsers(usersData);
      } else if (activeTab === 'suppliers') {
        const res = await fetch('https://booking-backend-tjmn.onrender.com/api/super/suppliers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.status === 401) {
          localStorage.clear();
          navigate("/admin/login");
          return;
        }
        const suppliersData = await res.json();
        setSuppliers(suppliersData);
      }
    };
    fetchData();
  }, [activeTab]);

  const getSupplierName = (id) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : id;
  };

  return (
    <div className="super-dashboard">
      <h1 className="dashboard-title">{t('super_dashboard.title')}</h1>
      <div className="tabs">
        <button className={activeTab === 'users' ? 'tab active' : 'tab'} onClick={() => setActiveTab('users')}>
          {t('super_dashboard.users')}
        </button>
        <button className={activeTab === 'suppliers' ? 'tab active' : 'tab'} onClick={() => setActiveTab('suppliers')}>
          {t('super_dashboard.suppliers')}
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="table-wrapper">
          {showAddForm && (
            <div className="add-user-form">
                <input
                type="email"
                placeholder={t('super_dashboard.email')}
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                />
                <select
                value={newUser.supplier_id}
                onChange={e => setNewUser({ ...newUser, supplier_id: e.target.value })}
                >
                <option value="">{t('super_dashboard.choose_supplier')}</option>
                {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                </select>
                <button className="add-btn" onClick={handleAddUser}>
                {t('super_dashboard.submit')}
                </button>
            </div>
            )}

            <div className="table-actions">
            <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                {t('super_dashboard.add_user')}
            </button>
            </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('super_dashboard.email')}</th>
                <th>{t('super_dashboard.supplier')}</th>
                <th>{t('super_dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => !user.is_superuser).map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{getSupplierName(user.supplier_id)}</td>
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
        <div className="table-wrapper">
          <div className="table-actions">
            <button className="add-btn">{t('super_dashboard.add_supplier')}</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('super_dashboard.name')}</th>
                <th>{t('super_dashboard.phone')}</th>
                <th>{t('super_dashboard.email')}</th>
                <th>{t('super_dashboard.type')}</th>
                <th>{t('super_dashboard.address')}</th>
                <th>{t('super_dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.supplier_type}</td>
                  <td>{supplier.address}</td>
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
    </div>
  );
};

export default SuperDashboard;