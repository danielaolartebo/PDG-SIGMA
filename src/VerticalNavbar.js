import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../src/img/logo2.png";
import "./VerticalNavbar.css";

function VerticalNavbar() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    let endpoint = "";

    if (storedRole === "professor") {
      endpoint = `http://localhost:5433/professor/profile/${id}`;
    } else if (storedRole === "monitor") {
      endpoint = `http://localhost:5433/monitor/profile/${id}`;
    } else {
      endpoint = `http://localhost:5433/department-head/profile/${id}`;
    }

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          const fullName = `${data.firstname} ${data.lastname}`;
          const nameParts = fullName.trim().split(" ");
          const userInitials = nameParts.map((name) => name[0]).join("").toUpperCase();
          setInitials(userInitials);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
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
