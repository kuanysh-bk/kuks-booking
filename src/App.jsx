// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import './App.css';
import ExcursionOperatorPage from './pages/ExcursionOperatorPage';
import ExcursionListPage from './pages/ExcursionListPage';
import ExcursionDetailsPage from './pages/ExcursionDetailsPage';
import ExcursionDatePage from './pages/ExcursionDatePage';
import ExcursionBookingPage from './pages/ExcursionBookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import IdleWatcher from './components/IdleWatcher';
import CarRentalPage from './pages/CarRentalPage';
import CarDatePage from './pages/CarDatePage';
import CarBookingPage from './pages/CarBookingPage';
import LoginPage from './admin/LoginPage';
import Dashboard from './admin/Dashboard';
import SuperDashboard from './admin/super/SuperDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ExcursionsPage from './admin/ExcursionsPage';
import CarsPage from './admin/CarsPage';
import AddContentPage from './admin/AddContentPage';
import BookingsPage from './admin/BookingsPage';
import SupplierDashboard from './admin/SupplierDashboard';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
        <Route path="/" element={<IdleWatcher><Home /></IdleWatcher>} />
          <Route path="/excursions" element={<IdleWatcher><ExcursionOperatorPage /></IdleWatcher>} />
          <Route path="/cars" element={<IdleWatcher><CarRentalPage /></IdleWatcher>} />
          <Route path="/cars/:carId/calendar" element={<IdleWatcher><CarDatePage /></IdleWatcher>} />
          <Route path="/cars/:carId/booking" element={<IdleWatcher><CarBookingPage /></IdleWatcher>} />
          <Route path="/excursions/:operatorId" element={<IdleWatcher><ExcursionListPage /></IdleWatcher>} />
          <Route path="/excursions/:operatorId/:excursionId" element={<IdleWatcher><ExcursionDetailsPage /></IdleWatcher>} />
          <Route path="/excursions/:operatorId/:excursionId/date" element={<IdleWatcher><ExcursionDatePage /></IdleWatcher>} />
          <Route path="/excursions/:operatorId/:excursionId/booking" element={<IdleWatcher><ExcursionBookingPage /></IdleWatcher>} />
          <Route path="/success" element={<IdleWatcher><BookingSuccessPage /></IdleWatcher>} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/admin/super/dashboard" element={<ProtectedRoute><SuperDashboard /></ProtectedRoute>} />
          <Route path="/admin/supplier/:supplierId" element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/admin/excursions" element={<ProtectedRoute><ExcursionsPage /></ProtectedRoute>} />
          <Route path="/admin/cars" element={<ProtectedRoute><CarsPage /></ProtectedRoute>} />
          <Route path="/admin/add" element={<ProtectedRoute><AddContentPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
