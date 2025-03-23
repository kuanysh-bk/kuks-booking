import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Excursion from './pages/Excursion';
import CarRental from './pages/CarRental';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excursion" element={<Excursion />} />
          <Route path="/car_rental" element={<CarRental />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
