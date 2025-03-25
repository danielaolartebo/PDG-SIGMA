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
        else if(role === 'monitor'){
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
                    throw new Error(`HTTP error! Status: ${res.json()}`);
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

  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
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
              <p><strong>Rol:</strong> {user.rol}</p>
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
                {role === "professor" && <th>Monitor Asignado</th>}
                {role === "monitor" && <th>Profesor Asignado</th>}
                {role === "jfedpto" && (
                  <>
                    <th>Profesor Asignado</th>
                    <th>Monitor Asignado</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.map((curso) => (
                <tr key={curso.id? curso.id:"N/A"}>
                  <td>{curso.semester? curso.semester:"N/A"}</td>
                  <td>{curso.courseName? curso.courseName:"N/A"}</td>
                  {role === "professor" && <td>{curso.monitor? curso.monitor: "No hay monitores"}</td>}
                  {/* En este caso monitor va tener el nombre del profesor */}
                  {role === "monitor" && <td>{curso.monitor? curso.monitor:"N/A"}</td>}
                  {role === "jfedpto" && (
                    <>
                      <td>{curso.professorName? curso.professorName:"N/A"}</td>
                      <td>{curso.monitor? curso.monitor: "No hay monitores"}</td>
                    </>
                  )}
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
