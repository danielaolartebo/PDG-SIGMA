import './Task.css';
import VerticalNavbar from './VerticalNavbar';
import './Login.css';
import AlertIcon from './NotificationIcon';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';

function Task() {
  // Estado para almacenar las actividades
  const [activities, setActivities] = useState([]);

  // Estado para controlar qué fila está expandida
  const [expandedRow, setExpandedRow] = useState(null);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Número de filas por página

  // Función para alternar filas expandibles
  const toggleRow = (id, monitoringId) => {
    setExpandedRow(expandedRow === id ? null : id);
    handleExpand(id, monitoringId);
  };

  // Función para manejar el cambio de página
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const user = localStorage.getItem('userId')
      const role = localStorage.getItem('role')
      try{
      
        const data = await fetch(`http://localhost:5433/activity/findAll/${user}/${role}`); 
        const jsonData = await data.json();
        setActivities(jsonData);
      }catch (error){
        console.error('Error fetching data:', error);
        }
    };
    fetchActivities();
  }, []);

  const [editedActivities, setEditedActivities] = useState({});
  
  const handleNameChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], name: value } }));
  };

  const handleCategoryChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], category: value } }));
  };

  const handleCursoChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], course: value } }));
  };

  const handleAsignadoAChange = (id, value, valueId) => {
    setEditedActivities((prev) => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        responsableName: value, 
        monitorId: valueId 
      }
    }));
  };
  

  const handleDescripcionChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], description: value } }));
  };

  const handleFechaUltimaEdicionChange = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], edited: value } }));///
  };

  const handleFechaSolicitadaEntrega = (id, value) => {
    setEditedActivities((prev) => ({ ...prev, [id]: { ...prev[id], finish: value } }));
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
  const [monitorsByMonitoring, setMonitorsByMonitoring] = React.useState({});
  const [expandedActivities, setExpandedActivities] = React.useState({});

  // Generar opciones únicas para cada filtro
  const semesters = [...new Set(activities.map(activity => activity.semester))];
  const courses = [...new Set(activities.map(activity => activity.course))];
  const requestedDueDate = [...new Set(activities.map(activity => activity.finish))];///
  const categories = [...new Set(activities.map(activity => activity.category))];
  const assignedTos = [...new Set(activities.map(activity => activity.responsableName))];
  const statuses = [...new Set(activities.map(activity => activity.state))];

  // Filtrar actividades según los filtros seleccionados
  const filteredActivities = activities.filter(activity => (
    (semesterFilter === '' || activity.semester === semesterFilter) &&
    (courseFilter === '' || activity.course === courseFilter) &&
    (categoryFilter === '' || activity.category === categoryFilter) &&
    (assignedToFilter === '' || activity.responsableName === assignedToFilter) &&
    (statusFilter === '' || activity.state === statusFilter)
 ));
 
 const indexOfLastRow = Math.min(currentPage * rowsPerPage, filteredActivities.length);
 const indexOfFirstRow = Math.max(0, indexOfLastRow - rowsPerPage);
 const currentRows = filteredActivities.slice(indexOfFirstRow, indexOfLastRow); 
 const totalPages = Math.max(1, Math.ceil(filteredActivities.length / rowsPerPage));
 
 const fetchMonitors = (monitoringId) => {
  if (!monitorsByMonitoring[monitoringId]) {
    fetch(`http://localhost:5433/monitoring-monitor/${monitoringId}/monitors`)
      .then(response => response.json())
      .then(data => {
        setMonitorsByMonitoring(prev => ({ ...prev, [monitoringId]: data }));
      })
      .catch(error => console.error(`Error fetching monitors for monitoring ${monitoringId}:`, error));
  }
  
};

const handleExpand = (activityId, monitoringId) => {
  setExpandedActivities(prev => ({ ...prev, [activityId]: !prev[activityId] }));

  if (!monitorsByMonitoring[monitoringId]) {
    fetchMonitors(monitoringId);
  }
};


 const handleSave = async (activityId, updatedActivityData) => {
  console.log(`Guardando cambios para la actividad con ID: ${activityId}`, updatedActivityData);

  try {
    const response = await fetch(`http://localhost:5433/activity/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...updatedActivityData, id: activityId})
    });

    if (!response.ok) {
      throw new Error(`Error al guardar los cambios: ${await response.text()}`);
    }

    alert("Actividad actualizada correctamente");

    const user = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const data = await fetch(`http://localhost:5433/activity/findAll/${user}/${role}`);
    const jsonData = await data.json();
    setActivities(jsonData);  

  } catch (error) {
    console.error("Error guardando la actividad:", error);
    alert("Error al guardar los cambios");
  }
};
  
  const handleCancel = (activityId) => {
    console.log(`Cancelando edición para la actividad con ID: ${activityId}`);
    // Lógica para restaurar los valores originales (si aplica)
  };
  
  // const handleDelete = (activityId) => {
  //   console.log(`Eliminando actividad con ID: ${activityId}`);
  //   // Lógica para eliminar la actividad
  // };

  const handleDelete = async (activityId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
      return;
    }
  
    console.log(`Eliminando actividad con ID: ${activityId}`);
  
    try {
      const response = await fetch(`http://localhost:5433/activity/${activityId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la actividad: ${await response.text()}`);
      }
  
      alert("Actividad eliminada correctamente");
      
      const user = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      const data = await fetch(`http://localhost:5433/activity/findAll/${user}/${role}`);
      const jsonData = await data.json();
      setActivities(jsonData);  


    } catch (error) {
      console.error("Error eliminando la actividad:", error);
      alert("No se pudo eliminar la actividad");
    }
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
        if (activity.id === id && activity.state === "PENDIENTE") {
          sendState(id)
          return {
            ...activity,
            state: "COMPLETADO",
            delivey: new Date(),
          };
        }
        return activity;
      })
    );
  };

  const sendState = async (id) =>{
    const response = await fetch('http://localhost:5433/activity/updateState', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id),
    });
  }

  const navigate = useNavigate(); 

    const handleCreateActivity = () => {
        navigate('/CreateActivity'); 
    };


  return (
    <div className="task-container">
      <VerticalNavbar />
      <div className="content">

        {/* Title starts*/}
        <div className="header">
          <div className="title-container" id="title-container">
            <div className="title" id="title">
              Historial de Actividades
            </div>
            <NotificationIcon />
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
                <th>Actividad</th>
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
                const parseDate = (dateString) => new Date(dateString);

                const fechaSolicitadaEntrega = parseDate(activity.finish);
                const fechaActual = new Date();

                let estadoClase = "";

                if (activity.state === "PENDIENTE") {
                  // Si está pendiente, se determina si está tarde o no
                  if (fechaActual > fechaSolicitadaEntrega) {
                    estadoClase = "pending-late"; // Color rojo
                  } else {
                    estadoClase = "pending"; // Color gris
                  }
                } else if (activity.state === "COMPLETADO" || activity.state ==="COMPLETADOT") {
                  // Para completado, se compara la fecha real de entrega con la solicitada
                  const fechaRealEntregaParsed = parseDate(activity.delivey);

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
                    <td>{activity.name}</td>
                    <td>{activity.course}</td>
                    <td>{activity.category}</td>
                    <td>{activity.creation ? new Date(activity.creation).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric"}) : "N/A"}</td>
                    <td>{activity.finish ? new Date(activity.finish).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric"}) : "N/A"}</td>
                    <td>{activity.delivey ? new Date(activity.delivey).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric"}) : "N/A"}</td>
                    <td>{activity.creatorName}</td>
                    <td>{activity.responsableName}</td>
                    <td>
                    <span
                    className={`table-actions ${estadoClase}`}
                    onClick={activity.state === "PENDIENTE" ? () => toggleStatus(activity.id) : null}
                  >
                    {activity.state === "COMPLETADOT" ? "COMPLETADO": activity.state}
                  </span>
                    </td>
                    <td>
                      <span
                        className="table-actions"
                        onClick={() => toggleRow(activity.id, activity.monitoring.id)}
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
                            Actividad:
                            <input type="text" value={editedActivities[activity.id]?.name || activity.name} 
                            onChange={(e) => handleNameChange(activity.id, e.target.value)} 
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT"}/>
                          </label>

                          <label>
                            Curso:
                            <select value={editedActivities[activity.id]?.course || activity.course} 
                            onChange={(e) => handleCursoChange(activity.id, e.target.value)}
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT"}>
                            {courses.map((curso, index) => <option key={index} value={curso}>{curso}</option>)}
                            </select>
                          </label>

                          <label>
                            Fecha solicitada entrega:
                            <input 
                              type="date"
                              // value={activity.finish ? formatDate(new Date(activity.finish)) : ""}
                              value={activity.finish ? new Date(activity.finish).toISOString().split('T')[0] : ""}

                              onChange={(e) => handleFechaSolicitadaEntrega(activity.id, e.target.value)}
                              disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT"}
                            />
                          </label>


                          <label>
                            Categoría:
                            <select value={editedActivities[activity.id]?.category || activity.category} 
                            onChange={(e) => handleCategoryChange(activity.id, e.target.value)}
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT"}>
                            {categories.map((categoria, index) => <option key={index} value={categoria}>{categoria}</option>)}
                            </select>
                          </label>

                          <label>
                            Asignado a:
                            <select 
                              value={editedActivities[activity.id]?.responsableName || activity.responsableName} 
                              onChange={(e) => {
                                const selectedMonitor = monitorsByMonitoring[activity.monitoring.id]?.find(monitor =>
                                  `${monitor.name} ${monitor.lastName}` === e.target.value
                                );
                                handleAsignadoAChange(activity.id, e.target.value, selectedMonitor?.code);
                              }}
                              disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT"}
                            >
                              {/* Responsable actual */}
                              <option value={activity.responsableName}>
                                {activity.responsableName} (Actual)
                              </option>

                              {/* Otros monitores de la misma monitoring */}
                              {monitorsByMonitoring[activity.monitoring.id]?.map((monitor) => (
                                (monitor.name + " " + monitor.lastName) !== activity.responsableName && (
                                  <option key={monitor.code} value={`${monitor.name} ${monitor.lastName}`}>
                                    {monitor.name} {monitor.lastName} ({monitor.code})
                                  </option>
                                )
                              ))}
                            </select>
                          </label>

                          {/* <label>
                            Asignado a:
                            <select value={editedActivities[activity.id]?.responsableName || activity.responsableName} onChange={(e) => handleAsignadoAChange(activity.id, e.target.value)}>
                              {assignedTos.map((asignadoA, index) => <option key={index} value={asignadoA}>{asignadoA}</option>)}
                            </select>
                          </label> */}

                          {/* Segunda fila */}
                          <label>
                            Asistentes:
                            <select></select>
                          </label>

                          <label>
                            Fecha última edición:
                            <input type="text" value={new Date(activity.edited).toLocaleDateString("es-ES")} readOnly />
                          </label>

                          <label>
                            Descripción:
                            <textarea rows="4" value={editedActivities[activity.id]?.description || activity.description} 
                            onChange={(e) => handleDescripcionChange(activity.id, e.target.value)} 
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT"}/>
                          </label>

                          {/* Botones */}
                          <div className="button-container">
                            <button className="save-button-act" onClick={() => handleSave(activity.id, {
                                                                                        ...editedActivities[activity.id]})}>Guardar</button>
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


