import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Импорт и инициализация i18n
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
