import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../src/img/logo2.png";
import './VerticalNavbar.css';

function VerticalNavbar() {

  const handleClose= () =>{
    localStorage.setItem('role','');
    localStorage.setItem('userId','');
  };

  return (
    <div className="vertical-navbar">
      {/* Logo starts */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      {/* Logo ends */}

      <div className="menu-items">
        <NavLink to="/Task" className={({ isActive }) => isActive ? "active" : ""}>Actividades</NavLink>
        <NavLink to="/Profile" className={({ isActive }) => isActive ? "active" : ""}>Mi perfil</NavLink>
        <NavLink to="/CreateMonitoria" className={({ isActive }) => isActive ? "active" : ""}>Crear monitoria</NavLink>
        <NavLink to="/ApplyMonitor" className={({ isActive }) => isActive ? "active" : ""}>Postulaciones</NavLink>
        <NavLink to="/Applicants" className={({ isActive }) => isActive ? "active" : ""}>Mis postulantes</NavLink>
        <NavLink to="/Reports" className={({ isActive }) => isActive ? "active" : ""}>Reportes</NavLink>

        <div className="logout-container">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "logout-button active" : "logout-button"} 
            onClick={handleClose}
          >
            Cerrar sesión
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default VerticalNavbar;







