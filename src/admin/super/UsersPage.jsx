import React, { useEffect, useState } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    fetch('/api/super/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(setUsers);
  }, []);

  const addUser = async () => {
    await fetch('/api/super/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, supplier_id: supplierId })
    });
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Пользователи</h2>
      <div className="mb-4">
        <input className="border p-2 mr-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="ID компании" value={supplierId} onChange={e => setSupplierId(e.target.value)} />
        <button className="bg-green-600 text-white p-2 rounded" onClick={addUser}>Добавить</button>
      </div>
      <ul>
        {users.map(u => (
          <li key={u.id} className="border p-2 mb-2 rounded">ID: {u.id} — {u.email} (Компания: {u.supplier_id})</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
