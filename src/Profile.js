import "./Profile.css";
import React, { useEffect, useState } from "react";
import VerticalNavbar from "./VerticalNavbar";
import profilePic from "./img/profile-pic.png";

function Profile() {
  console.log("Profile se está renderizando");

  const [user, setUser] = useState(null); 
  const [cursosAsignados, setCursosAsignados] = useState([]);

useEffect(() => {
        const id = localStorage.getItem('userId')
        const role = localStorage.getItem('role')
        if(role === 'professor'){
          fetch(`http://localhost:5433/professor/profile/${id}`)
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
                  setUser(data)
              } else {
                  console.error("No data.");
              }
          })
          .catch(error => console.error('Error fetching faculty data:', error));
        }
        else{
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
                  setUser(data)
              } else {
                  console.error("No data.");
              }
          })
          .catch(error => console.error('Error fetching faculty data:', error));
        }
        
        
           fetch(`http://localhost:5433/monitoring/profile/${id}/${role}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.json}`);
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setCursosAsignados(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

  const [semestreSeleccionado, setSemestreSeleccionado] = useState("Seleccionar semestre");

  const semestresDisponibles = [
    "Seleccionar semestre",
    ...new Set(cursosAsignados? cursosAsignados.map((curso) => curso.semester): []),
  ];

  const cursosFiltrados =
    semestreSeleccionado === "Seleccionar semestre"
      ? cursosAsignados
      : cursosAsignados.filter((curso) => curso.semester === semestreSeleccionado);

  return (
    <div className="profile-container">
      <VerticalNavbar />

      {/* Contenedor de perfil */}
      <div className="profile-content">
        <div className="profile-card">
          <img src={profilePic} alt="Foto de perfil" className="profile-pic" />
         {user ? (
            <>
              <h2>{user.name}</h2>
              <p><strong>Facultad:</strong> {user.school}</p>
              <p><strong>Programa:</strong> {user.program}</p>
              <p><strong>Rol:</strong> {user.role}</p>
            </>
          ) : (
            <p>Cargando perfil...</p>
          )}
        </div>

        {/* Contenedor de cursos asignados */}
        <div className="courses-container">
          <h3>Cursos Asignados</h3>
          
          {/* Filtro de semestre */}
          <div className="filter-container">
            <select className="select-semester-filter"
              id="semestre"
              value={semestreSeleccionado}
              onChange={(e) => setSemestreSeleccionado(e.target.value)}
            >
              {semestresDisponibles.map((semestre) => (
                <option key={semestre} value={semestre}>{semestre}</option>
              ))}
            </select>
          </div>

          <table className="courses-table">
            <thead>
              <tr>
                <th>Semestre</th>
                <th>Curso</th>
                <th>Monitor Asignado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.semester}</td>
                  <td>{curso.courseName}</td>
                  <td>{curso.monitor? curso.monitor: "No hay monitores"}</td>
                  <td>{curso.start ? new Date(curso.start).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric"}) : "N/A"}</td>
                  <td>{curso.finish ? new Date(curso.finish).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric"}) : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
