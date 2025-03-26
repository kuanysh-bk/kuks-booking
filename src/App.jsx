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


function App() {
  return (
    <IdleWatcher>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excursions" element={<ExcursionOperatorPage />} />
          <Route path="/excursions/:operatorId" element={<ExcursionListPage />} />
          <Route path="/excursions/:operatorId/:excursionId" element={<ExcursionDetailsPage />} />
          <Route path="/excursions/:operatorId/:excursionId/date" element={<ExcursionDatePage />} />
          <Route path="/excursions/:operatorId/:excursionId/booking" element={<ExcursionBookingPage />} />
          <Route path="/success" element={<BookingSuccessPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </IdleWatcher>
  );
}

export default App;
