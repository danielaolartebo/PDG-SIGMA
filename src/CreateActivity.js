import './CreateActivity.css';
import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';
import {PopUp} from "./PopUp";
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

function CreateActivity() {
  // Estados
  const [nombre, setNombre] = useState('');
  const [curso, setCurso] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fechaFinalizacion, setFechaFinalizacion] = useState('');
  const [asignarA, setAsignarA] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [semestre, setSemestre] = useState('2025-1');
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState(['Académico', 'Extracurricular']);
  const [monitoresProfesores, setMonitoresProfesores] = useState([]);
  const [requiresAttendance, setRequiresAttendance] = useState(true);

  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [asistentesList, setAsistentesList] = useState([]);
  // const [asistentesSeleccionados, setAsistentesSeleccionados] = useState([]); 
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('userId');
  const [rolResponsable, setRolResponsable] = useState("");

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [change, setChange] = useState(false)
  
  useEffect(() => {
    fetch(`${BACKEND_URL}/monitoring/getAllActiveByUserId/${user}/${role}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' ,
            'Authorization':localStorage.getItem('token')
        },
      })
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => console.error('Error al obtener los cursos:', error));
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

  const getMonitors = async (cursoId) => {
    fetch(`${BACKEND_URL}/monitoring-monitor/${cursoId}/monitors`,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' ,
          'Authorization':localStorage.getItem('token')
      }
      })
      .then(res => res.json())
      .then(data => setMonitoresProfesores(data))
      .catch(error => console.error('Error al obtener los monitores:', error));
  };

  const fetchCategorias = async (cursoId) => {
    
    const val = cursos.find(monitoring => monitoring.id.toString() === cursoId);
   
    const cursoIdDef = val.course.id;
    try {
      const response = await fetch(`${BACKEND_URL}/category/course/${cursoIdDef}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' ,
            'Authorization':localStorage.getItem('token')
        }
    });
      if (!response.ok) {
        throw new Error("Error al obtener las categorías");
      }
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const getStudentsByCourse  = async (cursoId) => {
    fetch(`${BACKEND_URL}/student/course/${cursoId}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' ,
            'Authorization':localStorage.getItem('token')
        }
    })
          .then((res) => res.json())
          .then((data) => {
            console.log("Datos recibidos:", data);
            setEstudiantesList(data);
          })
          .catch((error) => console.error("Error al cargar estudiantes:", error));
  };

  // const getAssistantsByCourse = async (actId) => {
  //   fetch(`${BACKEND_URL}/attendance/activity/${actId}`)
  //     .then(res => res.json())
  //     .then(data => setAsistentesList(data))
  //     .catch(error => console.error("Error al cargar asistentes:", error));
  // };

  const handleClose = () =>{
        setIsOpen(!isOpen)
        setChange(!change)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !curso || !categoria || !fechaFinalizacion || !asignarA) {
        // alert('Por favor, complete todos los campos obligatorios.');
        setMessage("Por favor, complete todos los campos obligatorios")
        setIsOpen(!isOpen)
        return;
    }
    
    const nuevaActividad = {
        name: nombre,
        creation: new Date().toISOString(),
        finish: new Date(fechaFinalizacion + "T00:00:00"),
        roleCreator: localStorage.getItem('role').charAt(0).toUpperCase(),
        roleResponsable: rolResponsable,
        category: categoria?.name ?? categoria,
        description: descripcion,
        monitoringId: curso,
        monitorId: asignarA,
        professorId: localStorage.getItem("userId"),
        state: "PENDIENTE",
        semester: semestre,
        edited: new Date().toISOString()
    };

    console.log(nuevaActividad)

    try {
      const response = await fetch(`${BACKEND_URL}/activity/create`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
                'Authorization':localStorage.getItem('token')
          },
          body: JSON.stringify(nuevaActividad)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear la actividad: ${response.status} ${errorText}`);
      } else{
        setMessage("¡Actividad creada exitosamente!")
        setIsOpen(!isOpen)
      }

      const data = await response.json();
      console.log('Actividad creada:', data);
      const actividadId = data.id;

      if (requiresAttendance && asistentesList.length > 0) {
          console.log(`Registrando asistencia para ${asistentesList.length} estudiantes...`);
          await Promise.all(asistentesList.map(async (studentId) => { 
              const attendancePayload = {
                  activity: { id: actividadId },
                  student: { code: studentId } 
              };
              console.log("Enviando payload de asistencia:", attendancePayload); // Log para depurar

              const attendanceResponse = await fetch(`${BACKEND_URL}/attendance/create`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json',
                        'Authorization':localStorage.getItem('token') },
                  body: JSON.stringify(attendancePayload)
              });

              if (!attendanceResponse.ok) {
                  const errorText = await attendanceResponse.text();
                  console.error(`Error al guardar asistencia para el estudiante ${studentId}: ${attendanceResponse.status} ${errorText}`);
                  setMessage(errorText)
                  console.error("Error: " + errorText)
                  setIsOpen(!isOpen)
              } else {
                  console.log(`Asistencia guardada para ${studentId}`);
                  setMessage("¡Actividad y Registro de asistencia exitoso!")
                  setIsOpen(!isOpen)
              }
          }));
          console.log("Proceso de registro de asistencia completado.");
          
      }

        // 
        setNombre('');
        setCurso('');
        setCategoria('');
        setFechaFinalizacion('');
        setAsignarA('');
        setDescripcion('');
        setSemestre('2025-1');
        setAsistentesList([]); 

    } catch (error) {
        console.error(error);
        // alert(error);
        setMessage("Error: "+ error)
        setIsOpen(!isOpen)
    }
};


  // Estados para gestionar la creación de una nueva categoría
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !curso) {
      // alert("Debe ingresar una categoría y seleccionar un curso");
      setMessage("Debe ingresar una categoría y seleccionar un curso")
      setIsOpen(!isOpen)
      return;
    }
  
    try {
      const val = cursos.find(monitoring => monitoring.id.toString() === curso);
      
      const cursoIdDef = val.course.id;
      const response = await fetch(`${BACKEND_URL}/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json" ,
          "Authorization":localStorage.getItem('token')
        },
        body: JSON.stringify({ 
          name: newCategory.trim(), 
          course: { id: Number(cursoIdDef) } 
        }),
      });
  
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Error al crear la categoría");
      // }

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error(`Error del servidor (${response.status}): ${errorText}`);
        throw new Error(`Server error ${response.status}: ${errorText}`);
    }
  
      const createdCategory = await response.json();
  
      console.log("Categoría creada:", createdCategory); 

      const categoryName = createdCategory.name || "Sin nombre";
  
      setCategorias((prev) => [...prev, createdCategory]); 
  
      // alert(`Categoría creada: ${categoryName}`);
      setMessage(`Categoría creada: ${categoryName}`)
      setIsOpen(!isOpen)
  
      setNewCategory("");
      setShowNewCategoryField(false);
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      // alert("No se pudo crear la categoría");
      setMessage("No se pudo crear la categoría:" + error.message)
      setIsOpen(!isOpen)
    }
  };

  useEffect(() => {
    if (!asignarA) return;
  
    const asignado = monitoresProfesores.find((monitor) => monitor.userId === asignarA);
    
    if (asignado) {
      setRolResponsable(asignado.rol);
    } else {
      setRolResponsable(null);
    }
  }, [asignarA]);
  
  const monitoresProfesoresFiltrados =
    role === 'professor'
      ? monitoresProfesores
      : monitoresProfesores.filter((monitor) => monitor.rol === "P" || monitor.userId === user);
  
  

  const handleRemoveCategory = () => {
    setNewCategory('');
    setShowNewCategoryField(false);
  };
  


  return (
    <div className="create-activity-container">
      <VerticalNavbar />
      {/* Ventana emergente */}
          <PopUp
              show={isOpen}
              onClose={() => handleClose()}
          >
              {message}
          </PopUp>
      <div className="create-activity-content">
        <div className="form-header">Crear Actividad</div>
        <form onSubmit={handleSubmit}>
          {/* Nombre y Curso */}
          <div className="form-row">
            <div className="form-group">
              <label>Nombre*</label>
              <input type="text" className="input-text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Curso*</label>
              <select value={curso} className="activity-select" onChange={(e) => { setCurso(e.target.value); getMonitors(e.target.value); getStudentsByCourse(e.target.value); fetchCategorias(e.target.value)}} required > {/*getAsistant*/}
                <option value="">Seleccione un curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.course.name}</option>)}
              </select>
            </div>
          </div>

          {/* Categoría y Fechas */}
          <div className="form-row">
            <div className="form-group categoria-group">
              <label htmlFor="categoria">
                Categoría<span className="required">*</span>
              </label>
              <div className="categoria-dropdown">
                <select
                  id="categoria"
                  className="activity-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="add-category-btn"
                  onClick={() => setShowNewCategoryField(true)}
                >
                  +
                </button>
              </div>
              {showNewCategoryField && (
                <div className="new-category-field">
                  <input
                    type="text"
                    placeholder="Nueva categoría"
                    className="input-text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <div className="new-category-actions">
                    <button type="button" onClick={handleAddCategory}>
                      Añadir
                    </button>
                    <button type="button" onClick={handleRemoveCategory}>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fechaFinalizacion">
                Fecha de Finalización<span className="required">*</span>
              </label>
              <input
                type="date"
                id="fechaFinalizacion"
                className="input-date"
                value={fechaFinalizacion}
                onChange={(e) => setFechaFinalizacion(e.target.value)}
                required
              />
            </div>
          </div>


          {/* Asignar */}
          <div className="form-row">
            <div className="form-group">
              <label>Asignar a*</label>
              <select value={asignarA} className="asign-to-select" onChange={(e) => setAsignarA(e.target.value)} required>
                <option value="">Seleccione al responsable</option>
                {monitoresProfesoresFiltrados.map(mp => <option key={mp.userId} value={mp.userId}>{mp.name}</option>)}
              </select>
            </div>
            
          </div>

          <div className="form-group form-group-checkbox"> 
            <label htmlFor="requiresAttendanceCheckbox" className="checkbox-label">
              <input
                type="checkbox"
                id="requiresAttendanceCheckbox"
                checked={requiresAttendance}
                onChange={(e) => setRequiresAttendance(e.target.checked)}
              />
              ¿Esta actividad requiere registrar asistencia?
            </label>
          </div>

                    {/* Asistentes */}
                    <label>Asistentes</label>
          <input
            type="text"
            placeholder="Buscar asistente..."
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!requiresAttendance} 
          />

          {/* Contenedor de checkboxes */}
          <div className={`checkbox-container2 ${!requiresAttendance ? 'disabled-section' : ''}`}>
            
            {estudiantesList
              .map(asistente => {
                const studentData = allStudents.find(s => s.code === asistente.studentId);
                return {
                  studentId: asistente.studentId, 
                  name: studentData ? studentData.name : "Nombre no encontrado",
                  code: studentData ? studentData.code : "Código no encontrado",
                };
              })
              .filter(asistente =>
                 (asistente.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  asistente.code?.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((asistente, index) => (
                <label key={asistente.studentId || index} className="checkbox-label"> 
                  <input
                    type="checkbox"
                    value={asistente.studentId}
                    checked={asistentesList.includes(asistente.studentId)}
                    onChange={(e) => {
                      if (!requiresAttendance) return; 
                      if (e.target.checked) {
                        setAsistentesList([...asistentesList, asistente.studentId]);
                      } else {
                        setAsistentesList(asistentesList.filter(a => a !== asistente.studentId));
                      }
                    }}
                    disabled={!requiresAttendance} 
                  />
                  {asistente.name + " - " + asistente.code}
                </label>
              ))}
              {!requiresAttendance && <p className="disabled-message">El registro de asistencia está desactivado.</p>}
          </div>


          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea rows="4" className="activity-textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
          </div>
        
          <button type="submit" className="confirm-button">Confirmar</button>
        </form>
      </div>
    </div>
  );
}

export default CreateActivity;
