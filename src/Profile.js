import "./Profile.css";
import React, { useState } from "react";
import VerticalNavbar from "./VerticalNavbar";
import profilePic from "./img/profile-pic.png";

function Profile() {
  console.log("Profile se está renderizando");

  const user = {
    foto: profilePic,
    nombre: "Claudia Cecilia Castiblanco Perez",
    facultad: "Ingeniería, diseño y ciencias aplicadas",
    programa: "Ingeniería de Sistemas",
    rol: "Profesor",
  };

  const cursosAsignados = [
    {
      id: 1,
      semestre: "2025-1",
      nombre: "Ingeniería de Software IV",
      monitor: "Sebastian Paz Palacios",
    },
    {
      id: 2,
      semestre: "2025-1",
      nombre: "Sistemas Intensivos en Datos",
      monitor: "Daniela Olarte Borja",
    },
    {
      id: 3,
      semestre: "2024-2",
      nombre: "Bases de Datos Avanzadas",
      monitor: "Juan Perez",
    },
    {
      id: 4,
      semestre: "2024-1",
      nombre: "Bases de Datos I",
      monitor: "Sebastian Montoya",
    },
  ];

  const [semestreSeleccionado, setSemestreSeleccionado] = useState("Seleccionar semestre");

  const semestresDisponibles = [
    "Seleccionar semestre",
    ...new Set(cursosAsignados.map((curso) => curso.semestre)),
  ];

  const cursosFiltrados =
    semestreSeleccionado === "Seleccionar semestre"
      ? cursosAsignados
      : cursosAsignados.filter((curso) => curso.semestre === semestreSeleccionado);

  return (
    <div className="profile-container">
      <VerticalNavbar />

      {/* Contenedor de perfil */}
      <div className="profile-content">
        <div className="profile-card">
          <img src={user.foto} alt="Foto de perfil" className="profile-pic" />
          <h2>{user.nombre}</h2>
          <p><strong>Facultad:</strong> {user.facultad}</p>
          <p><strong>Programa:</strong> {user.programa}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
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
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.semestre}</td>
                  <td>{curso.nombre}</td>
                  <td>{curso.monitor}</td>
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
