import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../src/img/logo2.png";
import "./VerticalNavbar.css";

function VerticalNavbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
    console.log(role);
  }, []);

  const handleClose = () => {
    localStorage.setItem("role", "");
    localStorage.setItem("userId", "");
  };

  return (
    <div className="vertical-navbar">
      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Menú */}
      <div className="menu-items">
        {/* Todos los usuarios tienen acceso a estas opciones: student, monitor, professor y jfedpto */}
        <NavLink to="/Task" className={({ isActive }) => (isActive ? "active" : "")}>Actividades</NavLink>
        <NavLink to="/ApplyMonitor" className={({ isActive }) => (isActive ? "active" : "")}>Postulaciones</NavLink>

        {/* Acceso para Monitor, Profesor y Jefe de Departamento */}
        {(role === "monitor" || role === "professor" || role === "jfedpto") && (
          <>
            <NavLink to="/Profile" className={({ isActive }) => (isActive ? "active" : "")}>Mi perfil</NavLink>
            <NavLink to="/Reports" className={({ isActive }) => (isActive ? "active" : "")}>Reportes</NavLink>
          </>
        )}

        {/* Acceso solo para Profesor */}
        {role === "professor" && (
          <>
            <NavLink to="/CreateMonitoria" className={({ isActive }) => (isActive ? "active" : "")}>Crear monitoria</NavLink>
            <NavLink to="/Applicants" className={({ isActive }) => (isActive ? "active" : "")}>Mis postulantes</NavLink>
          </>
        )}

        {/* Botón de cerrar sesión */}
        <div className="logout-container">
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")} 
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











