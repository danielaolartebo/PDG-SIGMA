import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../src/img/logo2.png";
import "./VerticalNavbar.css";

function VerticalNavbar() {
  const [role, setRole] = useState("professor"); 
  const [user, setUser] = useState(null);
  const [initials, setInitials] = useState("");
  const [showProfileOption, setShowProfileOption] = useState(true);

  useEffect(() => {
    // Datos quemados
    const fakeUser = {
      id: "12345",
      firstname: "Sofia",
      lastname: "Martinez",
    };

    setUser(fakeUser);

    const fullName = `${fakeUser.firstname} ${fakeUser.lastname}`;
    const nameParts = fullName.trim().split(" ");
    const userInitials = nameParts.map(name => name[0]).join("").toUpperCase();
    setInitials(userInitials);
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
        {/* Mostrar avatar primero */}
        {(role === "monitor" || role === "professor" || role === "jfedpto") && (
          <NavLink
            to="/Profile"
            onClick={() => setShowProfileOption(false)}
            className="user-avatar"
            title={user ? `${user.firstname} ${user.lastname}` : ""}
          >
            {initials}
          </NavLink>
        )}
  
        {/* Todos los usuarios tienen acceso a esta opción */}
        <NavLink to="/ApplyMonitor" className={({ isActive }) => (isActive ? "active" : "")}>Postulaciones</NavLink>
  
        {/* Acceso para Monitor, Profesor y Jefe de Departamento */}
        {(role === "monitor" || role === "professor" || role === "jfedpto") && (
          <>
            <NavLink to="/Task" className={({ isActive }) => (isActive ? "active" : "")}>Actividades</NavLink>
          </>
        )}
  
        {/* Acceso solo para Profesor */}
        {role === "professor" && (
          <>
            <NavLink to="/CreateMonitoria" className={({ isActive }) => (isActive ? "active" : "")}>Crear monitoria</NavLink>
            <NavLink to="/Applicants" className={({ isActive }) => (isActive ? "active" : "")}>Mis postulantes</NavLink>
            <NavLink to="/Reports" className={({ isActive }) => (isActive ? "active" : "")}>Reportes</NavLink>
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












