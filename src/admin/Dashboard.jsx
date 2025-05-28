import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Панель управления</h1>
      <div className="space-y-4">
        <Link to="/admin/excursions" className="block bg-blue-500 text-white p-3 rounded">Мои экскурсии</Link>
        <Link to="/admin/cars" className="block bg-blue-500 text-white p-3 rounded">Мои машины</Link>
        <Link to="/admin/add" className="block bg-green-500 text-white p-3 rounded">Добавить контент</Link>
        <Link to="/admin/bookings" className="block bg-gray-500 text-white p-3 rounded">Мои брони</Link>
      </div>
    </div>
  );
};

export default Dashboard;
