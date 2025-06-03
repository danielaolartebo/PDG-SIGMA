import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../src/img/logo2.png";
import {PopUp} from "./PopUp";
import "./VerticalNavbar.css";
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

function VerticalNavbar() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [initials, setInitials] = useState("");
  const [showProfileOption, setShowProfileOption] = useState(true);
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [change, setChange] = useState(false)

  const handleClose = () =>{
      setIsOpen(!isOpen)
      setChange(!change)
  }

  useEffect(() => {
    let id = localStorage.getItem('userId')
    let roleS = localStorage.getItem('role')
    while(id === null || roleS === null){
      id = localStorage.getItem('userId');
      roleS = localStorage.getItem('role');
      
    }
    setRole(roleS);
    console.log(roleS);
    let nameToUse = "";
        if(roleS === 'professor'){
          console.log('Inside professor');
          fetch(`${BACKEND_URL}/professor/profile/${id}`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization': localStorage.getItem('token')
            },
            })
          .then(res => {
              if (!res.ok) {
                const responseData = res.json();
                throw new Error(`HTTP error! Status: ${responseData}`);
                  
              }
              return res.json();
          })
          .then(data => {
              if (data) {
                console.log('Inside professor2');
                getInitials(data.name);
                  setUser(data)
              } else {
                  console.error("No data.");
              }
          })
          .catch(error => console.error('Error fetching faculty data:', error));
        }
        else if(roleS === 'monitor'){
          fetch(`${BACKEND_URL}/monitor/profile/${id}`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                Authorization:localStorage.getItem('token')
            },
            })
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
        else if(roleS === 'jfedpto'){
          fetch(`${BACKEND_URL}/department-head/profile/${id}`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization':localStorage.getItem('token')
            },
            })
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

  const handleCloseLogout = () => {
    setMessage("Has cerrado sesión exitosamente.")
    setIsOpen(!isOpen)
    setChange(!change)
    localStorage.setItem("role", "");
    localStorage.setItem("userId", "");
  };

  return (
    <div className="vertical-navbar">
      <PopUp
          show={isOpen}
          onClose={() => handleClose()}
      >
          {message}
      </PopUp>
      {/* Logo */}
      <div className="logo-container">
        <NavLink to="/Task">
          <img src={logo} alt="Logo" className="logo" />
        </NavLink>
      </div>
  
      {/* Menú */}
      <div className="menu-items">
        {/* Avatar del usuario */}
        {(role === "monitor" || role === "professor" || role === "jfedpto") && (
          <NavLink
            to="/Profile"
            className="user-avatar"
            title={user ? `${user.name}` : ""}
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
          </>
        )}

        {(role === "professor" || role === "jfedpto") && (
          <>
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
            onClick={handleCloseLogout}
          >
            Cerrar sesión
          </NavLink>
        </div>
      </div>
    </div>
  );  
}

export default VerticalNavbar;
