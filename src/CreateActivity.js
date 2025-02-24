import './CreateActivity.css';
import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';

function CreateActivity() {
  // Estados para los campos obligatorios y opcionales
  const [nombre, setNombre] = useState('');
  const [curso, setCurso] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState('');
  const [asignarA, setAsignarA] = useState('');
  const [asistentes, setAsistentes] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [cursos, setCursos] = useState([]);
  const [categorias, setCategorias] = useState(['Categoría A', 'Categoría B']);
  const [monitoresProfesores, setMonitoresProfesores] = useState([]);
  const [asistentesList, setAsistentesList] = useState(['Asistente 1', 'Asistente 2']);

  useEffect(() => {
    fetch('http://localhost:5433/monitoring/getA')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    setCursos(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));

  }, []);

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

  //Cuando cambie el curso/monitoria, debe actualizarse los monitores de dicha monitoria
  const getMonitors = async (cursoId) => {
    
    const response = await fetch(`http://localhost:5433/monitoring-monitor/${cursoId}/monitors`, {
      method: "GET",
    })
    .then(res => {
      if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
        if (data && data.length > 0) {
          setMonitoresProfesores(data); 
        } else {
            console.warn("Data format is incorrect or 'monitores' is empty.");
        }
    })
    .catch(error => console.error('Error al obtener los monitores', error));
    
    // const user = localStorage.getItem('userId');
    // const role = localStorage.getItem('role');
  };

  const handleRemoveCategory = () => {
    setNewCategory('');
    setShowNewCategoryField(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de campos obligatorios
    if (!nombre || !curso || !categoria || !fecha || !asignarA) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    // Se crea el objeto actividad
    const newActivity = {
      nombre,
      curso,
      categoria,
      fecha,
      asignarA,
      asistentes,
      descripcion,
    };
    console.log('Actividad creada:', newActivity);
    // Aquí puedes enviar los datos al backend o procesarlos según requieras

    // Reiniciamos el formulario (opcional)
    setNombre('');
    setCurso('');
    setCategoria('');
    setFecha('');
    setAsignarA('');
    setAsistentes('');
    setDescripcion('');
    alert('¡Actividad creada exitosamente!');
  };

  return (
    <div className="create-activity-container">
      <VerticalNavbar />
      <div className="create-activity-content">
        <div className="form-header">
          Crear Actividad
        </div>
        <form onSubmit={handleSubmit}>
          {/* Fila 1: Nombre y Curso */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre<span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                className="input-text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="curso">
                Curso<span className="required">*</span>
              </label>
              <select
                id="curso"
                className="activity-select"
                value={curso}
                onChange={(e) => {
                  setAsignarA("");
                  setMonitoresProfesores([]);
                  
                  const selectedCourse = cursos.find(c => c.id === parseInt(e.target.value, 10));

                  if (selectedCourse) {
                    setCurso(selectedCourse.id);
                    getMonitors(selectedCourse.id);
                  }
                }}
                required
              >
                <option value="">Seleccione un curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course.name}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* Fila 2: Categoría y Fecha */}
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
              <label htmlFor="fecha">
                Fecha<span className="required">*</span>
              </label>
              <input
                type="date"
                id="fecha"
                className="input-date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Fila 3: Asignar a y Asistentes */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="asignarA">
                Asignar a<span className="required">*</span>
              </label>
              <select
                id="asignarA"
                className="activity-select"
                value={asignarA}
                onChange={(e) => setAsignarA(e.target.value)}
                required
              >
                <option value="">Seleccione</option>
                {monitoresProfesores.map((mp) => (
                  <option key={mp.code} value={mp.code}>
                    {mp.code+" - "+mp.name+" "+mp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="asistentes">Asistentes</label>
              <select
                id="asistentes"
                className="activity-select"
                value={asistentes}
                onChange={(e) => setAsistentes(e.target.value)}
              >
                <option value="">Seleccione</option>
                {asistentesList.map((asistente, index) => (
                  <option key={index} value={asistente}>
                    {asistente}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 4: Descripción */}
          <div className="form-group">
            <label className="label-description" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              className="activity-textarea"
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>

          {/* Botón Confirmar */}
          <button type="submit" className="confirm-button">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateActivity;
