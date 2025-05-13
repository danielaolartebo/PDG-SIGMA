import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

globalThis.isNumber = globalThis.isNumber || function (value) {
  return typeof value === 'number' && !isNaN(value);
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

