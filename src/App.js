import './App.css';
import React from 'react';
import Navbar from './Navbar'; 
import TableContent from './TableContent';
import Dropdown from './Filters';
import Login from './Login'; 
import Task from './Task'; 
import ApplyMonitor from './ApplyMonitor';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CreateMonitoria from './CreateMonitoria';
import Applicants from './Applicants';
import { MyProvider } from './MyContext';
import CreateActivity from './CreateActivity';
import Profile from './Profile';
import Reports from './Reports';
import { useEffect } from "react";

function App() {
  // Hook para obtener la ruta actual
  const location = useLocation();
  
  useEffect(() => {
      return () => {
          localStorage.clear(); // Se borra el localStorage al desmontar el frontend
      };
    }, []);
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
            <MyProvider>
              {/* Filter starts */}
              <Dropdown />
              {/* Filter ends */}

              {/* TableContent begins */}
              <TableContent />
              {/* TableContent ends */}
            </MyProvider>
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

         {/* Route for ApplyMonitor */}
         <Route path="/ApplyMonitor" element={<ApplyMonitor />} />

         {/* Route for Profile */}
         <Route path="/Profile" element={<Profile />} />

         {/* Route for Reports */}
         <Route path="/Reports" element={<Reports />} />
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


