import './App.css';
import React from 'react';
import Navbar from './Navbar'; 
import TableContent from './TableContent';
import Dropdown from './Filters';
import Login from './Login'; 
import Task from './Task'; 
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CreateMonitoria from './CreateMonitoria';
import Applicants from './Applicants';
import CreateActivity from './CreateActivity';

function App() {
  // Hook para obtener la ruta actual
  const location = useLocation();

  return (
    <div className="App">
     {/* Mostrar Navbar solo en la ruta principal */}
     {location.pathname === '/' && <Navbar />}
      
      <Routes>
        {/* Ruta predeterminada */}
        <Route path="/" element={
          <>
            {/* Title begins */}
            <div className="title-container-app" id="title-container-app">
              <div className="title-app" id="title-app">
                  Postulación a Monitor
              </div>
            </div>
            {/* Title ends */}

            {/* Filter starts */}
            <Dropdown />
            {/* Filter ends */}

            {/* TableContent begins */}
            <TableContent />
            {/* TableContent ends */}
          </>
        } />

        {/* Ruta para Login */}
        <Route path="/Login" element={<Login />} />

        {/* Route for Task */}
        <Route path="/Task" element={<Task />} />

        {/* Route for Create Monitoria */}
        <Route path="/CreateMonitoria" element={<CreateMonitoria />} />
        
        {/* Route for Applicants */}
        <Route path="/Applicants" element={<Applicants />} />

         {/* Route for Create Activity */}
         <Route path="/CreateActivity" element={<CreateActivity />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}


