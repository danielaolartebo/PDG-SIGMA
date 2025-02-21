import './Task.css';
import VerticalNavbar from './VerticalNavbar';
import './Login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Task() {
  // Estado para almacenar las actividades
  const [activities, setActivities] = useState([]);

  // Estado para controlar qué fila está expandida
  const [expandedRow, setExpandedRow] = useState(null);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Número de filas por página

  // Función para alternar filas expandibles
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Función para manejar el cambio de página
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await fetch('http://localhost:3000/Activities.json'); 
      const jsonData = await data.json();
      setActivities(jsonData);
    };

    fetchActivities();
  }, []);

  const [editedActivities, setEditedActivities] = useState({});
  
  const handleNameChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], nombre: value } }));
  };

  const handleCategoryChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], categoria: value } }));
  };

  const handleCursoChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], curso: value } }));
  };

  const handleAsignadoAChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], asignadoA: value } }));
  };

  const handleDescripcionChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], detalles: value } }));
  };

  const handleFechaUltimaEdicionChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], fechaUltimaEdicion: value } }));
  };

  const handleFechaSolicitadaEntrega = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], fechaSolicitadaEntrega: value } }));
  };

  const [records, setRecords] = useState([]);
  const recordsPerPage = 2;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  
  const nextPage = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  const prevPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

   // Estados para los filtros
   const [semesterFilter, setSemesterFilter] = useState('');
   const [courseFilter, setCourseFilter] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('');
   const [assignedToFilter, setAssignedToFilter] = useState('');
   const [statusFilter, setStatusFilter] = useState('');

  // Generar opciones únicas para cada filtro
  const semesters = [...new Set(activities.map(activity => activity.semestre))];
  const courses = [...new Set(activities.map(activity => activity.curso))];
  const requestedDueDate = [...new Set(activities.map(activity => activity.fechaSolicitadaEntrega))];
  const categories = [...new Set(activities.map(activity => activity.categoria))];
  const assignedTos = [...new Set(activities.map(activity => activity.asignadoA))];
  const statuses = [...new Set(activities.map(activity => activity.estado))];

  // Filtrar actividades según los filtros seleccionados
  const filteredActivities = activities.filter(activity => (
    (semesterFilter === '' || activity.semestre === semesterFilter) &&
    (courseFilter === '' || activity.curso === courseFilter) &&
    (categoryFilter === '' || activity.categoria === categoryFilter) &&
    (assignedToFilter === '' || activity.asignadoA === assignedToFilter) &&
    (statusFilter === '' || activity.estado === statusFilter)
 ));
 
 const indexOfLastRow = Math.min(currentPage * rowsPerPage, filteredActivities.length);
 const indexOfFirstRow = Math.max(0, indexOfLastRow - rowsPerPage);
 const currentRows = filteredActivities.slice(indexOfFirstRow, indexOfLastRow); 
 const totalPages = Math.max(1, Math.ceil(filteredActivities.length / rowsPerPage));
 const handleSave = (activityId) => {
    console.log(`Guardando cambios para la actividad con ID: ${activityId}`);
    // Lógica para guardar los cambios
  };
  
  const handleCancel = (activityId) => {
    console.log(`Cancelando edición para la actividad con ID: ${activityId}`);
    // Lógica para restaurar los valores originales (si aplica)
  };
  
  const handleDelete = (activityId) => {
    console.log(`Eliminando actividad con ID: ${activityId}`);
    // Lógica para eliminar la actividad
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleStatus = (id) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) => {
        if (activity.id === id && activity.estado === "Pendiente") {
          return {
            ...activity,
            estado: "Completado",
            fechaRealEntrega: formatDate(new Date()),
          };
        }
        return activity;
      })
    );
  };

  const navigate = useNavigate(); 

    const handleCreateActivity = () => {
        navigate('/CreateActivity'); 
    };


  return (
    <div className="task-container">
      <VerticalNavbar />
      <div className="content">

        {/* Title starts*/}
        <div className="title-container" id="title-container">
          <div className="title" id="title">
            Historial de Actividades
          </div>
        </div>
        {/* Title ends*/}

        {/* Button create activity starts */}
        <div className="button-create-activity-container" id="button-create-activity-container">
          <button className="create-activity-btn" id="create-activity-btn" onClick={handleCreateActivity}>
            Crear actividad
          </button>
        </div>
        {/* Button create activity ends */}

        {/* Filter starts */}
        <div className="filter-container-activities">
          <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
            <option value="">Semestre</option>
            {semesters.map((semestre, index) => (
              <option key={index} value={semestre}>{semestre}</option>
            ))}
          </select>

          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">Curso</option>
            {courses.map((curso, index) => (
              <option key={index} value={curso}>{curso}</option>
            ))}
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Categoría</option>
            {categories.map((categoria, index) => (
              <option key={index} value={categoria}>{categoria}</option>
            ))}
          </select>

          <select value={assignedToFilter} onChange={(e) => setAssignedToFilter(e.target.value)}>
            <option value="">Asignado a</option>
            {assignedTos.map((asignadoA, index) => (
              <option key={index} value={asignadoA}>{asignadoA}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Estado</option>
            {statuses.map((estado, index) => (
              <option key={index} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        {/* Filter ends */}

        {/* Tabla de actividades starts */}
        <div className="table-container">
          <table className="table">
            <thead className="table-head-act">
              <tr>
                <th>Nombre</th>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Fecha creación</th>
                <th>Fecha solicitada entrega</th>
                <th>Fecha real entrega</th>
                <th>Creado por</th>
                <th>Asignado a</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((activity) => {

              // Formato fecha "DD/MM/YYYY"
                const parseDate = (dateString) => {
                  const [day, month, year] = dateString.split("/").map(Number);
                  return new Date(year, month - 1, day); 
                };

                const fechaSolicitadaEntrega = parseDate(activity.fechaSolicitadaEntrega);
                const fechaActual = new Date();

                let estadoClase = "";

                if (activity.estado === "Pendiente") {
                  // Si está pendiente, se determina si está tarde o no
                  if (fechaActual > fechaSolicitadaEntrega) {
                    estadoClase = "pending-late"; // Color rojo
                  } else {
                    estadoClase = "pending"; // Color gris
                  }
                } else if (activity.estado === "Completado") {
                  // Para completado, se compara la fecha real de entrega con la solicitada
                  const fechaRealEntregaParsed = parseDate(activity.fechaRealEntrega);

                  // Se calcula la fecha solicitada + 2 días (Chance para que el monitor entregue la actividad)
                  const dosDiasDespues = new Date(fechaSolicitadaEntrega.getTime() + 2 * 24 * 60 * 60 * 1000);
                  
                  // Si la fecha real de entrega es mayor a la fecha solicitada + 2 días, se considera tardío
                  if (fechaRealEntregaParsed > dosDiasDespues) {
                    estadoClase = "completed-late";
                  } else {
                    estadoClase = "completed";
                  }
                }
                return (
                  <React.Fragment key={activity.id}>
                  <tr>
                    <td>{activity.nombre}</td>
                    <td>{activity.curso}</td>
                    <td>{activity.categoria}</td>
                    <td>{activity.fechaCreacion}</td>
                    <td>{activity.fechaSolicitadaEntrega}</td>
                    <td>{activity.fechaRealEntrega}</td>
                    <td>{activity.creadoPor}</td>
                    <td>{activity.asignadoA}</td>
                    <td>
                    <span
                    className={`table-actions ${estadoClase}`}
                    onClick={activity.estado === "Pendiente" ? () => toggleStatus(activity.id) : null}
                  >
                    {activity.estado}
                  </span>
                    </td>
                    <td>
                      <span
                        className="table-actions"
                        onClick={() => toggleRow(activity.id)}
                      >
                        {expandedRow === activity.id ? "-" : "+"}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === activity.id && (
                    <tr>
                      <td colSpan="9" className="table-details">
                      <div className="edit-form">
                          {/* Primera fila */}
                          <label>
                            Nombre:
                            <input type="text" value={editedActivities[activity.id]?.nombre || activity.nombre} onChange={(e) => handleNameChange(activity.id, e.target.value)} />
                          </label>

                          <label>
                            Curso:
                            <select value={editedActivities[activity.id]?.curso || activity.curso} onChange={(e) => handleCursoChange(activity.id, e.target.value)}>
                              {courses.map((curso, index) => <option key={index} value={curso}>{curso}</option>)}
                            </select>
                          </label>

                          <label>
                            Fecha solicitada entrega:
                            <input 
                              type="date"
                              value={editedActivities[activity.id]?.fechaSolicitadaEntrega || activity.fechaSolicitadaEntrega}
                              onChange={(e) => handleFechaSolicitadaEntrega(activity.id, e.target.value)}
                            />
                          </label>

                          <label>
                            Categoría:
                            <select value={editedActivities[activity.id]?.categoria || activity.categoria} onChange={(e) => handleCategoryChange(activity.id, e.target.value)}>
                              {categories.map((categoria, index) => <option key={index} value={categoria}>{categoria}</option>)}
                            </select>
                          </label>

                          <label>
                            Asignado a:
                            <select value={editedActivities[activity.id]?.asignadoA || activity.asignadoA} onChange={(e) => handleAsignadoAChange(activity.id, e.target.value)}>
                              {assignedTos.map((asignadoA, index) => <option key={index} value={asignadoA}>{asignadoA}</option>)}
                            </select>
                          </label>

                          {/* Segunda fila */}
                          <label>
                            Asistentes:
                            <select></select>
                          </label>

                          <label>
                            Fecha última edición:
                            <input type="text" value={activity.fechaUltimaEdicion} readOnly />
                          </label>

                          <label>
                            Descripción:
                            <textarea rows="4" value={editedActivities[activity.id]?.detalles || activity.detalles} onChange={(e) => handleDescripcionChange(activity.id, e.target.value)} />
                          </label>

                          {/* Botones */}
                          <div className="button-container">
                            <button className="save-button-act" onClick={() => handleSave(activity.id)}>Guardar</button>
                            <button className="cancel-button-act" onClick={() => handleCancel(activity.id)}>Cancelar</button>
                            <button className="delete-button-act" onClick={() => handleDelete(activity.id)}>Eliminar</button>
                          </div>
                        </div>
                        
                    </td>
                  </tr>
                  )}
                </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="div-pagination">
            <div className="pagination-info">
              Mostrando {indexOfFirstRow + 1} - {indexOfLastRow} de {filteredActivities.length} resultados
            </div>

                <div className="main-pagination">
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => setCurrentPage(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
        {/* Tabla de actividades ends */}

      </div>
    </div>
  );
}

export default Task;


