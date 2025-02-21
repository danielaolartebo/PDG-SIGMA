import React from "react";
import { NavLink } from "react-router-dom";

function VerticalNavbar() {

  const handleClose= () =>{
    localStorage.setItem('role','')
  }
  return (
    <div className="vertical-navbar">
      <div className="menu-items">
        <NavLink to="/Login" className="logout-button" activeClassName="active">
          Cerrar sesión
        </NavLink>
        <NavLink to="/Task" activeClassName="active">Actividades</NavLink>
        <NavLink to="/Profile" activeClassName="active">Mi perfil</NavLink>
        <NavLink to="/CreateMonitoria" activeClassName="active">Crear monitoria</NavLink>
        <NavLink to="/" activeClassName="active">Postulaciones</NavLink>
        <NavLink to="/Applicants" activeClassName="active">Mis postulantes</NavLink>
        <NavLink to="/Reports" activeClassName="active">Reportes</NavLink>
      </div>
    </div>
  );
}

export default VerticalNavbar;



