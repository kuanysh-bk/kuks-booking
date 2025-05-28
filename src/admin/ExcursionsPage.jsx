import React, { useEffect, useState } from 'react';

const ExcursionsPage = () => {
  const [excursions, setExcursions] = useState([]);

  useEffect(() => {
    fetch('/api/admin/excursions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setExcursions);
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Удалить экскурсию?')) {
      await fetch(`/api/admin/excursions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setExcursions(excursions.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Мои экскурсии</h2>
      {excursions.map(exc => (
        <div key={exc.id} className="border p-4 mb-2 rounded shadow">
          <h3 className="text-lg font-semibold">{exc.title}</h3>
          <p>{exc.description}</p>
          <button className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Редактировать</button>
          <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleDelete(exc.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default ExcursionsPage;
