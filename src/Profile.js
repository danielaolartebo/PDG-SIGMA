import "./Profile.css";
import React from "react";
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
      nombre: "Ingeniería de Software IV",
      monitor: "Sebastian Paz Palacios",
      fechaInicio: "02/01/2025",
      fechaFin: "30/06/2025",
    },
    {
      id: 2,
      nombre: "Sistemas Intensivos en Datos",
      monitor: "Daniela Olarte Borja",
      fechaInicio: "02/01/2025",
      fechaFin: "30/06/2025",
    },
  ];

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
          <table className="courses-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Monitor Asignado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
              </tr>
            </thead>
            <tbody>
              {cursosAsignados.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.nombre}</td>
                  <td>{curso.monitor}</td>
                  <td>{curso.fechaInicio}</td>
                  <td>{curso.fechaFin}</td>
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
