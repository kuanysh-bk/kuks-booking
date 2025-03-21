import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import App from './App';
import CarRental from './CarRental';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/excursions" element={<App />} />
        <Route path="/cars" element={<CarRental />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
