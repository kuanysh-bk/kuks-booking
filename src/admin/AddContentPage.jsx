import React, { useState } from 'react';

const AddContentPage = () => {
  const [type, setType] = useState('excursion');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const endpoint = type === 'excursion' ? 'excursions' : 'cars';
    const res = await fetch(`/api/admin/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, description })
    });
    if (res.ok) alert('Успешно добавлено!');
    else alert('Ошибка при добавлении');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Добавить контент</h2>
      <select className="w-full p-2 border mb-2" value={type} onChange={e => setType(e.target.value)}>
        <option value="excursion">Экскурсия</option>
        <option value="car">Машина</option>
      </select>
      <input className="w-full p-2 border mb-2" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="w-full p-2 border mb-2" placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} />
      <button className="w-full bg-green-600 text-white p-2 rounded" onClick={handleSubmit}>Сохранить</button>
    </div>
  );
};

export default AddContentPage;
