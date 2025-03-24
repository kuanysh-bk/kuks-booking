// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import CarRental from './pages/CarRental';
import './App.css';
import ExcursionOperatorPage from './pages/ExcursionOperatorPage';
import ExcursionListPage from './pages/ExcursionListPage';
import ExcursionDetailsPage from './pages/ExcursionDetailsPage';
import ExcursionDatePage from './pages/ExcursionDatePage';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/car_rental" element={<CarRental />} />
          <Route path="/excursions" element={<ExcursionOperatorPage />} />
          <Route path="/excursions/:operatorId" element={<ExcursionListPage />} />
          <Route path="/excursions/:operatorId/:excursionId" element={<ExcursionDetailsPage />} />
          <Route path="/excursions/:operatorId/:excursionId/date" element={<ExcursionDatePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
