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
  const [newUser, setNewUser] = useState({ email: '', supplier_id: '', password: '' });
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [editSuccess, setEditSuccess] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '', phone: '', email: '', supplier_type: '', address: ''
  });
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [supplierSuccess, setSupplierSuccess] = useState(false);

  useEffect(() => {
    const isSuperuser = localStorage.getItem("isSuperuser");
    if (isSuperuser !== "true") navigate("/admin/dashboard");
  }, []);

  const handleAddUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email.trim()) return alert(t('super_dashboard.email_required'));
    if (!emailRegex.test(newUser.email)) return alert(t('super_dashboard.invalid_email'));
    if (!newUser.supplier_id) return alert(t('super_dashboard.choose_supplier_required'));
    if (newUser.password && newUser.password.length < 5) {
      alert(t('super_dashboard.password_too_short'));
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
      setNewUser({ email: '', supplier_id: '', password: '' });
      setShowAddForm(false);
      loadUsers();
    }
  };

  const handleEditUser = async () => {
    if (!editUser.email || !editUser.supplier_id) return;
    if (!editUser.email.trim()) {
      alert(t('super_dashboard.email_required'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
      alert(t('super_dashboard.invalid_email'));
      return;
    }
    if (editUser.password && editUser.password.length < 5) {
      alert(t('super_dashboard.password_too_short'));
      return;
    }
    if (!editUser.supplier_id) {
      alert(t('super_dashboard.choose_supplier_required'));
      return;
    }
    const res = await fetch(`https://booking-backend-tjmn.onrender.com/api/super/users/${editUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(editUser)
    });
    if (res.ok) {
      setEditUser(null);
      setEditSuccess(true); // показать уведомление
      loadUsers();
    
      setTimeout(() => setEditSuccess(false), 3000); // скрыть через 3 секунды
    }

  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
  
    const res = await fetch(`https://booking-backend-tjmn.onrender.com/api/super/users/${userToDelete.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  
    if (res.ok) {
      setUserToDelete(null);
      setDeleteSuccess(true);
      loadUsers();
      setTimeout(() => setDeleteSuccess(false), 3000);
    }
  };

  const handleSaveSupplier = async () => {
    const { name, phone, email, supplier_type, address } = supplierForm;
    if (!name || !phone || !email || !supplier_type || !address) {
      alert(t('super_dashboard.fill_required'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert(t('super_dashboard.invalid_email'));
      return;
    }

    const method = editSupplier ? 'PUT' : 'POST';
    const url = editSupplier
      ? `https://booking-backend-tjmn.onrender.com/api/super/suppliers/${editSupplier.id}`
      : 'https://booking-backend-tjmn.onrender.com/api/super/suppliers';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(supplierForm)
    });

    if (res.ok) {
      setShowSupplierForm(false);
      setEditSupplier(null);
      setSupplierForm({ name: '', phone: '', email: '', supplier_type: '', address: '' });
      setSupplierSuccess(true);
      loadUsers(); // обновим список
      setTimeout(() => setSupplierSuccess(false), 3000);
    }
  };

  const confirmDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    const res = await fetch(`https://booking-backend-tjmn.onrender.com/api/super/suppliers/${supplierToDelete.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (res.ok) {
      setSupplierToDelete(null);
      setSupplierSuccess(true);
      loadUsers();
      setTimeout(() => setSupplierSuccess(false), 3000);
    }
  };

  const loadUsers = async () => {
    const res = await fetch('https://booking-backend-tjmn.onrender.com/api/super/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.status === 401) {
      localStorage.clear();
      navigate("/admin/login");
    } else {
      const usersData = await res.json();
      setUsers(usersData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      loadUsers();
      
      const res = await fetch('https://booking-backend-tjmn.onrender.com/api/super/suppliers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.status === 401) {
        localStorage.clear();
        navigate("/admin/login");
      } else {
        const data = await res.json();
        setSuppliers(data);
      }
    };
    fetchData();
  }, [activeTab]);

  const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || id;

  return (
    <div className="super-dashboard">
      <h1 className="dashboard-title">{t('super_dashboard.title')}</h1>
      {editSuccess && (
        <div className="success-message">
          {t('super_dashboard.user_updated', 'Пользователь успешно обновлён')}
        </div>
      )}
      {deleteSuccess && (
        <div className="success-message">
          {t('super_dashboard.user_deleted', 'Пользователь успешно удалён')}
        </div>
      )}

      <div className="tabs">
        <button className={activeTab === 'users' ? 'tab active' : 'tab'} onClick={() => setActiveTab('users')}>{t('super_dashboard.users')}</button>
        <button className={activeTab === 'suppliers' ? 'tab active' : 'tab'} onClick={() => setActiveTab('suppliers')}>{t('super_dashboard.suppliers')}</button>
      </div>

      {activeTab === 'users' && (
        <div className="table-wrapper">
          {showAddForm && (
            <div className="add-user-form">
              <input type="email" placeholder={t('super_dashboard.email')} value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <input type="password" placeholder={t('super_dashboard.password')} value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              <select value={newUser.supplier_id} onChange={e => setNewUser({ ...newUser, supplier_id: e.target.value })}>
                <option value="">{t('super_dashboard.choose_supplier')}</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button className="add-btn" onClick={handleAddUser}>{t('super_dashboard.submit')}</button>
            </div>
          )}

          <div className="table-actions">
            <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>{t('super_dashboard.add_user')}</button>
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
                    <button className="edit-btn" onClick={() => setEditUser(user)}>{t('common.edit')}</button>
                    <button className="delete-btn" onClick={() => setUserToDelete(user)}>{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editUser && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{t('super_dashboard.edit_user')}</h2>
                <input type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
                <input type="password" placeholder={t('super_dashboard.new_password')} onChange={e => setEditUser({ ...editUser, password: e.target.value })} />
                <select value={editUser.supplier_id} onChange={e => setEditUser({ ...editUser, supplier_id: e.target.value })}>
                  <option value="">{t('super_dashboard.choose_supplier')}</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <div className="modal-actions">
                  <button onClick={handleEditUser}>{t('common.save')}</button>
                  <button onClick={() => setEditUser(null)}>{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          )}
          {userToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{t('super_dashboard.confirm_delete')}</h2>
                <p>{t('super_dashboard.confirm_delete_user', { email: userToDelete.email })}</p>
                <div className="modal-actions">
                  <button onClick={confirmDeleteUser}>{t('common.confirm')}</button>
                  <button onClick={() => setUserToDelete(null)}>{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="table-wrapper">
          {supplierSuccess && (
            <div className="success-message">{t('super_dashboard.supplier_success')}</div>
          )}
          <div className="table-actions">
            <button className="add-btn" onClick={() => {
                setEditSupplier(null);
                setSupplierForm({ name: '', phone: '', email: '', supplier_type: '', address: '' });
                setShowSupplierForm(true);
              }}>{t('super_dashboard.add_supplier')}</button>
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
                    <button className="edit-btn" onClick={() => {
                        setEditSupplier(supplier);
                        setSupplierForm(supplier);
                        setShowSupplierForm(true);
                      }}>{t('common.edit')}</button>
                    <button className="delete-btn" onClick={() => setSupplierToDelete(supplier)}>{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showSupplierForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{editSupplier ? t('super_dashboard.edit_supplier') : t('super_dashboard.add_supplier')}</h2>
                <input type="text" placeholder={t('super_dashboard.name')} value={supplierForm.name} onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })} />
                <input type="text" placeholder={t('super_dashboard.phone')} value={supplierForm.phone} onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })} />
                <input type="email" placeholder={t('super_dashboard.email')} value={supplierForm.email} onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })} />
                <select value={supplierForm.supplier_type} onChange={e => setSupplierForm({ ...supplierForm, supplier_type: e.target.value })}>
                  <option value="">{t('super_dashboard.choose_type')}</option>
                  <option value="cars">{t('super_dashboard.cars')}</option>
                  <option value="excursion">{t('super_dashboard.excursion')}</option>
                </select>
                <input type="text" placeholder={t('super_dashboard.address')} value={supplierForm.address} onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })} />
                <div className="modal-actions">
                  <button onClick={handleSaveSupplier}>{t('common.save')}</button>
                  <button onClick={() => setShowSupplierForm(false)}>{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          )}

          {supplierToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{t('super_dashboard.confirm_delete')}</h2>
                <p>{t('super_dashboard.confirm_delete_supplier', { name: supplierToDelete.name })}</p>
                <div className="modal-actions">
                  <button onClick={confirmDeleteSupplier}>{t('common.confirm')}</button>
                  <button onClick={() => setSupplierToDelete(null)}>{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperDashboard;