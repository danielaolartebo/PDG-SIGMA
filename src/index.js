import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if (typeof window.isNumber === 'undefined') {
  window.isNumber = function (value) {
    return typeof value === 'number' && !isNaN(value);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
