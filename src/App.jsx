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


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <IdleWatcher>
            <Route path="/" element={<Home />} />
            <Route path="/excursions" element={<ExcursionOperatorPage />} />
            <Route path="/cars" element={<CarRentalPage />} />
            <Route path="/cars/:carId/calendar" element={<CarDatePage />} />
            <Route path="/cars/:carId/booking" element={<CarBookingPage />} />
            <Route path="/excursions/:operatorId" element={<ExcursionListPage />} />
            <Route path="/excursions/:operatorId/:excursionId" element={<ExcursionDetailsPage />} />
            <Route path="/excursions/:operatorId/:excursionId/date" element={<ExcursionDatePage />} />
            <Route path="/excursions/:operatorId/:excursionId/booking" element={<ExcursionBookingPage />} />
            <Route path="/success" element={<BookingSuccessPage />} />
          </IdleWatcher>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/super/dashboard" element={<ProtectedRoute><SuperDashboard /></ProtectedRoute>} />
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
