import React from 'react';
import { Link } from 'react-router-dom';

const SuperDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Суперюзер Панель</h1>
      <div className="space-y-4">
        <Link to="/admin/super/users" className="block bg-blue-600 text-white p-3 rounded">Пользователи</Link>
        <Link to="/admin/super/suppliers" className="block bg-blue-600 text-white p-3 rounded">Компании</Link>
        <Link to="/admin/super/excursions" className="block bg-purple-600 text-white p-3 rounded">Все экскурсии</Link>
        <Link to="/admin/super/cars" className="block bg-purple-600 text-white p-3 rounded">Все машины</Link>
        <Link to="/admin/super/bookings" className="block bg-gray-600 text-white p-3 rounded">Все брони</Link>
      </div>
    </div>
  );
};

export default SuperDashboard;
