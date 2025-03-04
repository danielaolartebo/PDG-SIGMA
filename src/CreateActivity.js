import './CreateActivity.css';
import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';

function CreateActivity() {
  // Estados
  const [nombre, setNombre] = useState('');
  const [curso, setCurso] = useState('');
  const [categoria, setCategoria] = useState('');
  // const [fechaCreacion, setFechaCreacion] = useState('');
  const [fechaFinalizacion, setFechaFinalizacion] = useState('');
  const [asignarA, setAsignarA] = useState('');
  // const [estado, setEstado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [semestre, setSemestre] = useState('2025-1');
  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState(['Académico', 'Extracurricular']);
  const [monitoresProfesores, setMonitoresProfesores] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5433/monitoring/getA')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(error => console.error('Error al obtener los cursos:', error));
  }, []);

  const getMonitors = async (cursoId) => {
    fetch(`http://localhost:5433/monitoring-monitor/${cursoId}/monitors`)
      .then(res => res.json())
      .then(data => setMonitoresProfesores(data))
      .catch(error => console.error('Error al obtener los monitores:', error));
  };

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
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Curso*</label>
              <select value={curso} onChange={(e) => { setCurso(e.target.value); getMonitors(e.target.value); }} required>
                <option value="">Seleccione un curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.course.name}</option>)}
              </select>
            </div>
          </div>

          {/* Categoría y Fechas */}
          <div className="form-row">
            <div className="form-group">
              <label>Categoría*</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha de Finalización*</label>
              <input type="date" value={fechaFinalizacion} onChange={(e) => setFechaFinalizacion(e.target.value)} required />
            </div>
          </div>

          {/* Asignar y Estado */}
          <div className="form-row">
            <div className="form-group">
              <label>Asignar a*</label>
              <select value={asignarA} onChange={(e) => setAsignarA(e.target.value)} required>
                <option value="">Seleccione</option>
                {monitoresProfesores.map(mp => <option key={mp.code} value={mp.code}>{mp.name} {mp.lastName} {mp.code}</option>)}
              </select>
            </div>
            
          </div>

          {/* Descripción */}
          
          <div className="form-group">
            <label>Descripción</label>
            <textarea rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
          </div>

          <button type="submit" className="confirm-button">Confirmar</button>
        </form>
      </div>
    </div>
  );
}

export default CreateActivity;
