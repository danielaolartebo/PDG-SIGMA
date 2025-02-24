import './Login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.png';

function Login() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState('')

    const handleReturnClick = () => {
        navigate('/'); // Redirige a la página principal
    };

    const handleChangeUser = (event) => {
      setUserId(event.target.value);
    };
  
    const handleChangePassword = (event) => {
      setPassword(event.target.value);
    };

    const handleLoginClick = async(event) => {
      event.preventDefault(); 
      const data = {
        userId:userId,
        password:password
      }
      console.log('Data to send:', data);
      try {
        const response = await fetch('http://localhost:5433/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });
        console.log(response);
        if(response.ok){
          localStorage.setItem('userId',userId)
          
          const res =  await response.json()
          console.log(localStorage.getItem('userId'))

          if(res.role === 'professor'){
            localStorage.setItem('role',res.role)
            navigate('/Task');// Redirige a la pagina del profesor
          }
          else{
            localStorage.setItem('role',res.role)
            navigate('/')// Redirige a la pagina inicial con usuario iniciado sesion
          }
        }else{
          console.log("Can't find it")
        }

      }catch (error){
        console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Añadir clase al body cuando el componente Login se monta
        document.body.classList.add('login-background');
        
        // Remover la clase cuando el componente Login se desmonta
        return () => {
          document.body.classList.remove('login-background');
        };
      }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar-login" id="navbar-login">
        <button className="return-btn-login" id="return-btn-login" onClick={handleReturnClick}> ← </button>
      </nav>
      
      {/* Main Login Form */}
      <div className="login-container">
        <div className="main-login">
            <form>
                <img src={logo} alt="Logo" className="logo-login"/>
                <div className="inputs-container">
                    <input className="inputs-login" type="text" name="user" placeholder=" Usuario" value={userId} onChange={handleChangeUser} required />
                    <input className="inputs-login" type="password" name="pswd" placeholder=" Clave" value={password} onChange={handleChangePassword} required />
                </div>
                <div className="login-btn-container-login">
                    <button className="login-btn-login" id="login-btn-login" type="submit" onClick={handleLoginClick}>Iniciar sesión</button>
                </div>
            </form>
        </div>
       </div>
    </div>
  );
}

export default Login;
