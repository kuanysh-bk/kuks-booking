import React, { useEffect, useState } from 'react';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('tour');

  useEffect(() => {
    fetch('/api/super/suppliers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(setSuppliers);
  }, []);

  const addSupplier = async () => {
    await fetch('/api/super/suppliers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, type })
    });
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Компании</h2>
      <div className="mb-4">
        <input className="border p-2 mr-2" placeholder="Название" value={name} onChange={e => setName(e.target.value)} />
        <select className="border p-2 mr-2" value={type} onChange={e => setType(e.target.value)}>
          <option value="tour">Туроператор</option>
          <option value="car">Аренда машин</option>
        </select>
        <button className="bg-green-600 text-white p-2 rounded" onClick={addSupplier}>Добавить</button>
      </div>
      <ul>
        {suppliers.map(s => (
          <li key={s.id} className="border p-2 mb-2 rounded">ID: {s.id} — {s.name} ({s.type})</li>
        ))}
      </ul>
    </div>
  );
};

export default SuppliersPage;
