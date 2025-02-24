import './App.css';
import React from 'react';
import logo from './img/logo.png';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if(localStorage.getItem('role') !== "professor"){
      navigate('/Login');
    }
    else{
      navigate('/Task')
    }
  };

  return (
    <header>
      <nav className="navbar" id="navbar">
        <img src={logo} alt="Logo" className="logo"/>
        <button className="login-btn" id="login-btn" onClick={handleLoginClick}>
          Iniciar sesión
        </button>
      </nav>
    </header>
  );
}

export default Navbar;

