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
    let id = localStorage.getItem('userId')
    let roleS = localStorage.getItem('role')
    while(id === null && role === null){
      id = localStorage.getItem('userId');
      role = localStorage.getItem('role');
      setRole(role);
    }
    let nameToUse = "";
        if(roleS === 'professor'){
          fetch(`http://localhost:5433/professor/profile/${id}`)
          .then(res => {
              if (!res.ok) {
                const responseData = res.json();
                throw new Error(`HTTP error! Status: ${responseData}`);
                  
              }
              return res.json();
          })
          .then(data => {
              if (data) {
                getInitials(data.name);
                  setUser(data)
              } else {
                  console.error("No data.");
              }
          })
          .catch(error => console.error('Error fetching faculty data:', error));
        }
        else if(roleS === 'monitor'){
          fetch(`http://localhost:5433/monitor/profile/${id}`)
          .then(res => {
              if (!res.ok) {
                const responseData = res.json();
                console.log(responseData)
                throw new Error(`HTTP error! Status: ${responseData}`);
                  
              }
              return res.json();
          })
          .then(data => {
              if (data) {
                getInitials(data.name);
                setUser(data)
              } else {
                  console.error("No data.");
              }
          })
          .catch(error => console.error('Error fetching faculty data:', error));
        }
        else{
          fetch(`http://localhost:5433/department-head/profile/${id}`)
          .then(res => {
              if (!res.ok) {
                const responseData = res.json();
                throw new Error(`HTTP error! Status: ${responseData}`);
                  
              }
              return res.json();
          })
          .then(data => {
              if (data) {
                getInitials(data.name);
                setUser(data)
              } else {
                  console.error("No data.");
              }
          })
          .catch(error => console.error('Error fetching faculty data:', error));
        }
  }, []);

  function getInitials(name) {
    const nameParts = name.trim().split(" ");
          
          if (nameParts.length > 2) {
            const firstInitial = nameParts[0]?.charAt(0)?.toUpperCase() || '';
            const secondInitial = nameParts[2]?.charAt(0)?.toUpperCase() || '';
            setInitials(firstInitial + secondInitial);
          } else {
            const firstInitial = nameParts[0]?.charAt(0)?.toUpperCase() || '';
            const secondInitial = nameParts[1]?.charAt(0)?.toUpperCase() || '';
            setInitials(firstInitial + secondInitial);
          }
  }

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
        {/* Avatar del usuario */}
        {(role === "monitor" || role === "professor" || role === "jfedpto") && (
          <NavLink
            to="/Profile"
            className="user-avatar"
            title={user ? `${user.firstname} ${user.lastname}` : ""}
          >
            {initials}
          </NavLink>
        )}
        {/* Acceso general */}
        <NavLink
          to="/ApplyMonitor"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Postulaciones
        </NavLink>

        {/* Acceso para Monitor, Profesor y Jefe de Departamento */}
        {(role === "monitor" || role === "professor" || role === "jfedpto") && (
          <>
            <NavLink
              to="/Task"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Actividades
            </NavLink>
          </>
        )}

        {/* Acceso exclusivo para Profesores */}
        {role === "professor" && (
          <>
            <NavLink
              to="/CreateMonitoria"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Crear monitoria
            </NavLink>
            <NavLink
              to="/Applicants"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Mis postulantes
            </NavLink>
            <NavLink
              to="/Reports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Reportes
            </NavLink>
          </>
        )}
  
        {/* Botón de cerrar sesión */}
        <div className="logout-container">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "logout-button active" : "logout-button"
            }
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