import React, { useEffect, useState } from 'react';

const CarsPage = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('/api/admin/cars', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setCars);
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Удалить машину?')) {
      await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCars(cars.filter(car => car.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Мои машины</h2>
      {cars.map(car => (
        <div key={car.id} className="border p-4 mb-2 rounded shadow">
          <h3 className="text-lg font-semibold">{car.title}</h3>
          <p>{car.description}</p>
          <button className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Редактировать</button>
          <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleDelete(car.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default CarsPage;
