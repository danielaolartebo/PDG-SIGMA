import './Task.css';
import VerticalNavbar from './VerticalNavbar';
import './Login.css';
import AlertIcon from './NotificationIcon';
import {PopUp, PopupDelete} from "./PopUp";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

function Task() {
  // Estado para almacenar las actividades
  const [activities, setActivities] = useState([]);

  // Estado para controlar qué fila está expandida
  const [expandedRow, setExpandedRow] = useState(null);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Número de filas por página

  const [allStudents, setAllStudents] = useState([]);
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [asistentesSeleccionados, setAsistentesSeleccionados] = useState(new Set()); 
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState(new Set()); // Estado con asistencias en la DB
  const rolActual = localStorage.getItem('role');
  const userActual = localStorage.getItem('userId') 

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [change, setChange] = useState(false)

  // Función para alternar filas expandibles
  const toggleRow = (id, monitoringId, courseId) => {
    setExpandedRow(expandedRow === id ? null : id);
    handleExpand(id, monitoringId,courseId);
  };

  const handleClose = () =>{
    setIsOpen(!isOpen)
    setChange(!change)
  }

  const handleCloseDelete = () =>{
    setIsOpen(!isOpenDelete)
    setChange(!change)
  }

  // Función para manejar el cambio de página
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const user = localStorage.getItem('userId')
      const role = localStorage.getItem('role')
      try{
      
        const data = await fetch(`${BACKEND_URL}/activity/findAll/${user}/${role}`,{
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
              'Authorization':localStorage.getItem('token')
          },
          }); 
        const jsonData = await data.json();
        setActivities(jsonData);
        console.log(jsonData);
      }catch (error){
        console.error('Error fetching data:', error);
        }
    };
    fetchActivities();
    fetch(`${BACKEND_URL}/student/getA`,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' ,
          'Authorization':localStorage.getItem('token')
      },
      })
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(error => console.error('Error al obtener los all students:', error));
    
  }, [change]);

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

  const handleAsignadoAChange = (id, value, valueId, responsable) => {
      setEditedActivities((prev) => ({
        ...prev,
        [id]: { 
          ...prev[id], 
          responsableName: value, 
          monitorId: valueId, 
          roleResponsable:responsable,
          roleCreator:rolActual.charAt(0).toUpperCase()
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

const storedRole = localStorage.getItem("userRole"); // Obtiene el rol
const userRole = storedRole ? storedRole.trim() : ""; // Evita valores nulos o indefinidos

//localStorage.setItem("userRole", "student");
console.log("Rol recuperado del localStorage:", userRole);

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
  const [programFilter, setProgramFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monitorsByMonitoring, setMonitorsByMonitoring] = React.useState({});
  const [expandedActivities, setExpandedActivities] = React.useState({});

  // Generar opciones únicas para cada filtro
  const semesters = [...new Set(activities.map(activity => activity.semester))];
  const programs = [...new Set(activities.map(activity => activity.program))];
  const courses = [...new Set(activities.map(activity => activity.course))];
  const requestedDueDate = [...new Set(activities.map(activity => activity.finish))];///
  const categories = [...new Set(activities.map(activity => activity.category))];
  const assignedTos = [...new Set(activities.map(activity => activity.responsableName))];
  const statuses = [...new Set(activities.map(activity => activity.state))];

  // Filtrar actividades según los filtros seleccionados
  const filteredActivities = activities.filter(activity => (
    (semesterFilter === '' || activity.semester === semesterFilter) &&
    (programFilter === '' || activity.program === programFilter) &&
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
    fetch(`${BACKEND_URL}/monitoring-monitor/${monitoringId}/monitors`,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' ,
          'Authorization':localStorage.getItem('token')
      },
      })
      .then(response => response.json())
      .then(data => {
        let filtered = data
        if(rolActual === "monitor"){
          filtered = data.filter((monitor) => monitor.rol === "P" || monitor.userId === userActual)
          
        }
        console.log(filtered)
        setMonitorsByMonitoring(prev => ({ ...prev, [monitoringId]: filtered }));
      })
      .catch(error => console.error(`Error fetching monitors for monitoring ${monitoringId}:`, error));
  }
};

const getStudentsByCourse  = async (cursoId) => {
  fetch(`${BACKEND_URL}/student/course/${cursoId}`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
        'Authorization':localStorage.getItem('token')
    },
    })
        .then((res) => res.json())
        .then((data) => {
          console.log("Datos recibidos:", data);
          setEstudiantesList(data);
        })
        .catch((error) => console.error("Error al cargar estudiantes:", error));
};



const handleExpand = (activityId, monitoringId,courseId) => {
  setExpandedActivities(prev => ({ ...prev, [activityId]: !prev[activityId] }));

  if (!monitorsByMonitoring[monitoringId]) {
    fetchMonitors(monitoringId);
  }
  getStudentsByCourse(courseId)

  // Cargar asistencia existente
  fetch(`${BACKEND_URL}/attendance/activity/${activityId}`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,
        'Authorization':localStorage.getItem('token')
    },
    })
      .then((res) => res.json())
      .then((data) => {
        const asistenciasSet = new Set(data.map((a) => a.student.code));
        setAsistenciasRegistradas(asistenciasSet);
        setAsistentesSeleccionados(new Set(asistenciasSet)); // Inicializar con los datos de la DB
      })
      .catch((err) => console.error("Error cargando asistencias:", err));

  
};

const toggleAsistencia = (studentId) => {
  setAsistentesSeleccionados((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(studentId)) {
      newSet.delete(studentId);
    } else {
      newSet.add(studentId);
    }
    return newSet;
  });
};

 const handleSave = async (activityId, updatedActivityData) => {
  console.log(`Guardando cambios para la actividad con ID: ${activityId}`, updatedActivityData);

  try {
    const response = await fetch(`${BACKEND_URL}/activity/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
            'Authorization':localStorage.getItem('token')
      },
      body: JSON.stringify({...updatedActivityData, id: activityId})
    });

    if (!response.ok) {
      throw new Error(`Error al guardar los cambios: ${await response.text()}`);
    }

    // alert("Actividad actualizada correctamente");
    setMessage("Actividad actualizada correctamente")
    setIsOpen(!isOpen)

    const user = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const data = await fetch(`${BACKEND_URL}/activity/findAll/${user}/${role}`,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' ,
          'Authorization':localStorage.getItem('token')
      },
      });
    const jsonData = await data.json();
    setActivities(jsonData);  

  } catch (error) {
    console.error("Error guardando la actividad:", error);
    setMessage("Error guardando cambios: "+ error)
    setIsOpen(!isOpen)
    // alert("Error al guardar los cambios");
  }

  
  // const saveAttendance = () => {
  //   console.log("Guardando asistencia para los siguientes estudiantes:", asistentesSeleccionados);
  
  //   Promise.all(
  //     asistentesSeleccionados.map((studentId) => {
  //       const requestBody = {
  //         activity: { id: activityId },
  //         student: { code: studentId }
  //       };
  
  //       return fetch(`${BACKEND_URL}/attendance/create`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(requestBody),
  //       });
  //     })
  //   )
  //     .then(() => console.log("Asistencia guardada exitosamente"))
  //     .catch((error) => console.error("Error al guardar asistencia:", error));
  // };
  // saveAttendance();
  const saveAttendance = async () => {
    const nuevosAsistentes = [...asistentesSeleccionados].filter(
      (id) => !asistenciasRegistradas.has(id)
    );
    const asistentesEliminados = [...asistenciasRegistradas].filter(
      (id) => !asistentesSeleccionados.has(id)
    );

    // Enviar solo nuevos asistentes
    await Promise.all(
      nuevosAsistentes.map((studentId) =>
        fetch(`${BACKEND_URL}/attendance/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
              'Authorization':localStorage.getItem('token') },
          body: JSON.stringify({ activity: { id: activityId }, student: { code: studentId } }),
        })
      )
    );

    // Eliminar solo los que se desmarcaron
    await Promise.all(
      asistentesEliminados.map((studentId) =>
        fetch(`${BACKEND_URL}/attendance/delete/${activityId}/${studentId}`,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' ,
              'Authorization':localStorage.getItem('token')
          },
          })
      )
    );

    // Actualizar el estado con los nuevos valores confirmados en la DB
    setAsistenciasRegistradas(new Set(asistentesSeleccionados));
  };
  saveAttendance();
  

};
  
  const handleCancel = (activityId) => {
    console.log(`Cancelando edición para la actividad con ID: ${activityId}`);
    // Lógica para restaurar los valores originales (si aplica)
  };
  
  const handleDelete = async (activityId) => {
    // if (!window.confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
    //   return;
    // }

    console.log(`Eliminando actividad con ID: ${activityId}`);
  
    try {
      const response = await fetch(`${BACKEND_URL}/activity/${activityId}`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' ,
            'Authorization':localStorage.getItem('token')
        },
        });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la actividad: ${await response.text()}`);
      }
  
      // alert("Actividad eliminada correctamente");
      setMessage("Actividad eliminada correctamente")
      setIsOpen(!isOpen)
      
      const user = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      const data = await fetch(`${BACKEND_URL}/activity/findAll/${user}/${role}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' ,
            'Authorization':localStorage.getItem('token')
        },
        });
      const jsonData = await data.json();
      setActivities(jsonData);  


    } catch (error) {
      console.error("Error eliminando la actividad:", error);
      // alert("No se pudo eliminar la actividad");
      setMessage("Error al eliminar la actividad: "+ error)
      setIsOpen(!isOpen)
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
    const response = await fetch(`${BACKEND_URL}/activity/updateState`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json' ,
          'Authorization':localStorage.getItem('token')
      },
      body: JSON.stringify(id),
    });
  }

  const navigate = useNavigate(); 

    const handleCreateActivity = () => {
        navigate('/CreateActivity'); 
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="task-container">
      <VerticalNavbar />
      {/* Ventana emergente */}
      <PopUp
          show={isOpen}
          onClose={() => handleClose()}
      >
          {message}
      </PopUp>
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

          {rolActual === "jfedpto" && (
            <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
              <option value="">Programa</option>
              {programs.map((program, index) => (
                <option key={index} value={program}>{program}</option>
              ))}
            </select>
          )}


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
                } else if (activity.state === "COMPLETADO") {
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
                    onClick={activity.state === "PENDIENTE" && !(rolActual === "jfedpto") ? () => toggleStatus(activity.id) : null}
                  >
                    {activity.state === "COMPLETADOT" ? "COMPLETADO": activity.state}
                  </span>
                    </td>
                    <td>
                      <span
                        className="table-actions"
                        onClick={() => toggleRow(activity.id, activity.monitoring.id, activity.monitoring.course.id)}
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
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" || 
                              (activity.monitor?.idMonitor === userActual && activity.roleResponsable === "M" && 
                                activity.roleCreator === "P") || 
                              (activity.professor?.id === userActual && activity.roleResponsable === "P" && 
                              activity.roleCreator === "M") || rolActual === "jfedpto"}/>
                          </label>

                          <label>
                            Curso:
                            <select value={editedActivities[activity.id]?.course || activity.course} 
                            onChange={(e) => handleCursoChange(activity.id, e.target.value)}
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" || 
                              (activity.monitor?.idMonitor === userActual && activity.roleResponsable === "M" && 
                                activity.roleCreator === "P") || 
                              (activity.professor?.id === userActual && activity.roleResponsable === "P" && 
                              activity.roleCreator === "M") || rolActual === "jfedpto"}>
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
                              disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" || 
                                (activity.monitor?.idMonitor === userActual && activity.roleResponsable === "M" && 
                                  activity.roleCreator === "P") || 
                                (activity.professor?.id === userActual && activity.roleResponsable === "P" && 
                                activity.roleCreator === "M") || rolActual === "jfedpto"}
                            />
                          </label>


                          <label>
                            Categoría:
                            <select value={editedActivities[activity.id]?.category || activity.category} 
                            onChange={(e) => handleCategoryChange(activity.id, e.target.value)}
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" || 
                              (activity.monitor?.idMonitor === userActual && activity.roleResponsable === "M" && 
                                activity.roleCreator === "P") || 
                              (activity.professor?.id === userActual && activity.roleResponsable === "P" && 
                              activity.roleCreator === "M") || rolActual === "jfedpto"}>
                            {categories.map((categoria, index) => <option key={index} value={categoria}>{categoria}</option>)}
                            </select>
                          </label>

                          <label>
                            Asignado a:
                            <select 
                              value={editedActivities[activity.id]?.responsableName || activity.responsableName} 
                              onChange={(e) => {
                                const selectedMonitor = monitorsByMonitoring[activity.monitoring.id]?.find(monitor =>
                                  monitor.name === e.target.value
                                );
                                  handleAsignadoAChange(activity.id, e.target.value, selectedMonitor?.userId,selectedMonitor?.rol);
                                
                              }}
                              disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" || 
                                (activity.monitor?.idMonitor === userActual && activity.roleResponsable === "M" && 
                                  activity.roleCreator === "P") || 
                                (activity.professor?.id === userActual && activity.roleResponsable === "P" && 
                                activity.roleCreator === "M") || rolActual === "jfedpto"}
                            >
                              {/* Responsable actual */}
                              <option value={activity.responsableName}>
                                {activity.responsableName} (Actual)
                              </option>

                              {/* Otros monitores de la misma monitoring */}
                              {monitorsByMonitoring[activity.monitoring.id]?.map((monitor) => (
                                <option key={monitor.userId} value={monitor.name}>
                                  {monitor.name}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            Fecha última edición:
                            <input type="text" value={new Date(activity.edited).toLocaleDateString("es-ES")} readOnly />
                          </label>


                          <label>
                            <span>Asistentes:</span>
                            <input
                              type="text"
                              placeholder="Buscar asistente..."
                              className="search-input"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <div className="asistentes-table-container">
                              <table className="asistentes-table">
                                <thead>
                                  <tr>
                                    <th>Seleccionar</th>
                                    <th>Nombre</th>
                                    <th>Código</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {estudiantesList
                                    .map((asistente) => {
                                      const studentData = allStudents.find((s) => s.code === asistente.studentId);
                                      return {
                                        ...asistente,
                                        name: studentData ? studentData.name : "?",
                                        code: studentData ? studentData.code : "?",
                                      };
                                    })
                                    .filter(
                                      (asistente) =>
                                        asistente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        asistente.code.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((asistente, index) => (
                                      <tr key={index}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            value={asistente.studentId}
                                            checked={asistentesSeleccionados.has(asistente.studentId)}
                                            onChange={() => toggleAsistencia(asistente.studentId)}
                                            disabled={
                                              activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" ||
                                              rolActual === "jfedpto"
                                            }
                                          />
                                        </td>
                                        <td>{asistente.name}</td>
                                        <td>{asistente.code}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>

                          </label>

                        

                          <label>
                            Descripción:
                            <textarea rows="4" value={editedActivities[activity.id]?.description || activity.description} 
                            onChange={(e) => handleDescripcionChange(activity.id, e.target.value)} 
                            disabled={activity.state === "COMPLETADO" || activity.state === "COMPLETADOT" || 
                            (activity.monitor?.idMonitor === userActual && activity.roleResponsable === "M" && 
                              activity.roleCreator === "P") || 
                            (activity.professor?.id === userActual && activity.roleResponsable === "P" && 
                            activity.roleCreator === "M") || rolActual === "jfedpto"}/>
                          </label>

                          {/* Botones */}
                          <div className="button-container">
                            <button className="save-button-act" onClick={() => handleSave(activity.id, {
                                                                                        ...editedActivities[activity.id]})}>Guardar</button>
                            <button className="cancel-button-act" onClick={() => handleCancel(activity.id)}>Cancelar</button>
                            <button className="delete-button-act" onClick={() => setIsOpenDelete(true)}>Eliminar</button>
                          </div>

                          <PopupDelete
                            show={isOpenDelete}
                            onClose={() => handleCloseDelete()}
                            onApply={() => handleDelete(activity.id)}
                          />
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




