import './CreateActivity.css';
import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';

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

  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [asistentesList, setAsistentesList] = useState([]);
  const [asistentesSeleccionados, setAsistentesSeleccionados] = useState([]); 
  
  useEffect(() => {
    fetch('http://localhost:5433/monitoring/getA')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => console.error('Error al obtener los cursos:', error));
    fetch('http://localhost:5433/student/getA')
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(error => console.error('Error al obtener los all students:', error));
  }, []);

  const getMonitors = async (cursoId) => {
    fetch(`http://localhost:5433/monitoring-monitor/${cursoId}/monitors`)
      .then(res => res.json())
      .then(data => setMonitoresProfesores(data))
      .catch(error => console.error('Error al obtener los monitores:', error));
  };

  const getStudentsByCourse  = async (cursoId) => {
    fetch(`http://localhost:5433/student/course/${cursoId}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Datos recibidos:", data);
            setEstudiantesList(data);
          })
          .catch((error) => console.error("Error al cargar estudiantes:", error));
  };

  // const getAssistantsByCourse = async (actId) => {
  //   fetch(`http://localhost:5433/attendance/activity/${actId}`)
  //     .then(res => res.json())
  //     .then(data => setAsistentesList(data))
  //     .catch(error => console.error("Error al cargar asistentes:", error));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !curso || !categoria || !fechaFinalizacion || !asignarA) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    const nuevaActividad = {
        name: nombre,
        creation: new Date().toISOString(),
        finish: new Date(fechaFinalizacion+"T00:00:00"),
        roleCreator: localStorage.getItem('role').charAt(0).toUpperCase(),
        roleResponsable: 'M',
        category: categoria,
        description: descripcion,
        monitoringId: curso,
        monitorId: asignarA,
        professorId: localStorage.getItem("userId"),
        state: "PENDIENTE",
        semester: semestre,
        edited: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:5433/activity/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaActividad)
        });

        if (!response.ok) {
            throw new Error(`Error al crear la actividad: ${response.statusText}`);
        }

          const data = await response.json();
          console.log('Actividad creada:', data);
          alert('¡Actividad creada exitosamente!');
          
          setNombre('');
          setCurso('');
          setCategoria('');
          setFechaFinalizacion('');
          setAsignarA('');
          setDescripcion('');
          setSemestre('2025-1');

      } 
        catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al crear la actividad.');
        }
  };

  // Estados para gestionar la creación de una nueva categoría
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategorias(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
      setShowNewCategoryField(false);
    }
  };

  const handleRemoveCategory = () => {
    setNewCategory('');
    setShowNewCategoryField(false);
  };
  


  return (
    <div className="create-activity-container">
      <VerticalNavbar />
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
              <select value={curso} className="activity-select" onChange={(e) => { setCurso(e.target.value); getMonitors(e.target.value); getStudentsByCourse(e.target.value);}} required > {/*getAsistant*/}
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
                  {categorias.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
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
                {monitoresProfesores.map(mp => <option key={mp.code} value={mp.code}>{mp.name} {mp.lastName} {mp.code}</option>)}
              </select>
            </div>
            
          </div>

          {/* Asistentes */}
          <label>Asistentes</label>
          {/* Campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar asistente..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Contenedor de checkboxes */}
          <div className="checkbox-container">
            {estudiantesList
              .map(asistente => {
                const studentData = allStudents.find(s => s.code === asistente.studentId);
                return {
                  ...asistente, 
                  name: studentData ? studentData.name : "Nombre no encontrado",
                  code: studentData ? studentData.code : "code no encontrado",
                };
              })
              .filter(asistente =>
                (asistente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  asistente.code.toLowerCase().includes(searchTerm.toLowerCase()))// Filtra por búsqueda
              )
              .sort((a, b) => a.name.localeCompare(b.name)) // Orden alfabético
              .map((asistente, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={asistente.studentId}
                    checked={asistentesList.includes(asistente.studentId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAsistentesList([...asistentesList, asistente.studentId]); // Agregar asistente
                      } else {
                        setAsistentesList(asistentesList.filter(a => a !== asistente.studentId)); // Eliminar asistente
                      }
                    }}
                  />
                  {asistente.name+" - "+asistente.code}
                </label>
              ))}
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
