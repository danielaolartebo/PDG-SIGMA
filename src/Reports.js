import './Reports.css';
import React, { useEffect, useState } from 'react';
import VerticalNavbar from './VerticalNavbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

function Reports() {
  /*console.log("Reports se está renderizando");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [monitorPerformanceDataOriginal, setMonitorPerformanceDataOriginal] = useState([]);
  const [professorData, setProfessorData] = useState([]);
  const [courseSelectedM, setCourseSelectedM] = useState("");
  const [courseSelectedP, setCourseSelectedP] = useState("");
  const [filteredMonitorPerformanceData, setFilteredMonitorPerformanceData] = useState([]);
  const [filteredProfessorData, setFilteredProfessorData] = useState([]);

  //Porcentaje afectividad por materia de monitores
  const[completedPercent, setCompletedPercent] = useState("")
  const[pendingPercent, setPendingPercent] = useState("")
  const[latePercent, setLatePercent] = useState("")*/

  /*useEffect(() => {
    const user = localStorage.getItem('userId');

    const fetchActivities = async () => {
      try {
        const monitorResponse = await fetch(`http://localhost:5433/monitoring/getMonitorsReport/${user}`);
        const monitorJson = await monitorResponse.json();
        setMonitorPerformanceDataOriginal(monitorJson);

        if (monitorJson.length > 0) {
          const firstCourse = monitorJson[0].course;
          setCourseSelectedM(firstCourse);
          const filtered = monitorJson.filter(a => a.course === firstCourse);
          setFilteredMonitorPerformanceData(filtered);
        }
      } catch (error) {
        console.error('Error fetching monitor data:', error);
      }

      try {
        const professorResponse = await fetch(`http://localhost:5433/monitoring/getProfessorReport/${user}`);
        const professorJson = await professorResponse.json();
        setProfessorData(professorJson);

        if (professorJson.length > 0) {
          const firstCourseP = professorJson[0].course;
          setCourseSelectedP(firstCourseP);
          const filtered = professorJson.filter(a => a.course === firstCourseP);
          setFilteredProfessorData(filtered);
        }
      } catch (error) {
        console.error('Error fetching professor data:', error);
      }
    };

    fetchActivities();
  }, []);*/

  /*useEffect(() => {
    
    let completed = 0;
    let pending = 0;
    let late = 0;
    let total = 0;
    const values = filteredMonitorPerformanceData;

    values.forEach(a=>{
      completed = completed + a.completed;
      pending = pending + a.pending;
      late = late + a.late;
    })

    total = completed+pending+late;
    setCompletedPercent(((completed/total)*100).toString()+"%");
    setPendingPercent(((pending/total)*100).toString()+"%");
    setLatePercent(((late/total)*100).toString()+"%");

    
  }, [filteredMonitorPerformanceData]);*/

  const [semester, setSemester] = useState('');
  const [program, setProgram] = useState('');
  const [course, setCourse] = useState('');
  const [professor, setProfessor] = useState('');
  const [monitor, setMonitor] = useState('');

  // Datos de ejemplo con atributos para filtros
  const monitorPerformanceDataOriginal = [
    { name: 'Monitor A', Completadas: 12, Tardias: 3, Pendientes: 2, semestre: '2024-1', programa: 'Ingenieria de Sistemas', curso: 'POO', profesor: 'Claudia' },
    { name: 'Monitor B', Completadas: 9, Tardias: 4, Pendientes: 5, semestre: '2024-2', programa: 'Ingenieria Industrial', curso: 'Estructuras de Datos', profesor: 'Carlos' },
    { name: 'Monitor C', Completadas: 15, Tardias: 1, Pendientes: 0, semestre: '2024-1', programa: 'Ingenieria de Sistemas', curso: 'POO', profesor: 'Claudia' },
    { name: 'Monitor D', Completadas: 10, Tardias: 2, Pendientes: 1, semestre: '2025-1', programa: 'Ingenieria Industrial', curso: 'Redes', profesor: 'Carlos' },
    { name: 'Monitor E', Completadas: 7, Tardias: 3, Pendientes: 4, semestre: '2024-2', programa: 'Ingenieria de Sistemas', curso: 'Arreglos', profesor: 'Claudia' },
    { name: 'Monitor F', Completadas: 13, Tardias: 0, Pendientes: 2, semestre: '2025-1', programa: 'Ingenieria de Sistemas', curso: 'Estructuras de Datos', profesor: 'Carlos' },
    { name: 'Monitor G', Completadas: 8, Tardias: 1, Pendientes: 3, semestre: '2025-2', programa: 'Ingenieria Biomédica', curso: 'Bioinformática', profesor: 'Mariana' },
    { name: 'Monitor H', Completadas: 11, Tardias: 0, Pendientes: 2, semestre: '2024-1', programa: 'Ingenieria Electrónica', curso: 'Circuitos Digitales', profesor: 'José' },
    { name: 'Monitor I', Completadas: 6, Tardias: 5, Pendientes: 5, semestre: '2025-2', programa: 'Ingenieria Biomédica', curso: 'Señales Biomédicas', profesor: 'Mariana' },
    { name: 'Monitor J', Completadas: 14, Tardias: 2, Pendientes: 1, semestre: '2024-2', programa: 'Ingenieria Electrónica', curso: 'Microcontroladores', profesor: 'José' },
  ];
  

  const categoryUsageDataOriginal = [
    { name: 'POO', value: 20, semestre: '2024-1' },
    { name: 'Arreglos', value: 30, semestre: '2024-1' },
    { name: 'Redes', value: 10, semestre: '2024-2' },
    { name: 'Estructuras', value: 25, semestre: '2024-2' },
  ];

  const asistenciaDataOriginal = [
    { mes: 'Enero', asistencia: 40, semestre: '2024-1' },
    { mes: 'Febrero', asistencia: 52, semestre: '2024-1' },
    { mes: 'Marzo', asistencia: 33, semestre: '2024-2' },
    { mes: 'Abril', asistencia: 60, semestre: '2024-2' },
  ];

 /* const resumenTareasData = [
    { estado: 'Completadas', porcentaje: '68%' },
    { estado: 'Tardias', porcentaje: '20%' },
    { estado: 'Pendientes', porcentaje: '12%' },
  ];*/

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  //  Función que aplica los filtros actuales
  const applyFilters = (data) => {
    return data.filter(d =>
      (!semester || d.semestre === semester) &&
      (!program || d.programa === program) &&
      (!course || d.curso === course) &&
      (!professor || d.profesor === professor) &&
      (!monitor || d.name === monitor)
    );
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = headers.map(header => `"${row[header]}"`);
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monitorPerformanceData = applyFilters(monitorPerformanceDataOriginal);
  const categoryUsageData = applyFilters(categoryUsageDataOriginal);
  const asistenciaData = applyFilters(asistenciaDataOriginal);

  return (
    <div className="main">
      <div className="reports-top-bar">
        <h2 className="reports-title">Reportes</h2>
        <div className="filters-container">
          <div className="filter-group">
            <select onChange={(e) => setSemester(e.target.value)}>
              <option value="">Semestre</option>
              <option value="2024-1">2024-1</option>
              <option value="2024-2">2024-2</option>
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setProgram(e.target.value)}>
              <option value="">Programa</option>
              <option value="Ingenieria de Sistemas">Ingenieria de Sistemas</option>
              <option value="Ingenieria Industrial">Ingenieria Industrial</option>
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setCourse(e.target.value)}>
              <option value="">Curso</option>
              <option value="POO">POO</option>
              <option value="Estructuras de Datos">Estructuras de Datos</option>
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setProfessor(e.target.value)}>
              <option value="">Profesor</option>
              <option value="Claudia">Claudia</option>
              <option value="Carlos">Carlos</option>
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setMonitor(e.target.value)}>
              <option value="">Monitor</option>
              <option value="Monitor A">Monitor A</option>
              <option value="Monitor B">Monitor B</option>
              <option value="Monitor C">Monitor C</option>
            </select>
          </div>
        </div>
      </div>
      <div className="reports-container">
        <VerticalNavbar />
        <div className="reports-content">
          {/* Gráfico de barras */}
          <div className="chart-card">
            <h3>Rendimiento de monitores</h3>
            <BarChart width={500} height={300} data={monitorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completadas" stackId="a" fill="rgb(0, 196, 159)" />
              <Bar dataKey="Tardias" stackId="a" fill="rgb(255, 187, 40)" />
              <Bar dataKey="Pendientes" stackId="a" fill="rgb(255, 82, 82)" />
            </BarChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(monitorPerformanceData, 'Rendimiento_Monitores')}>Descargar</button>
            </div>
          </div>

          {/* Gráfico de pastel */}
          <div className="chart-card">
            <h3>Categoría con mayor demanda </h3>
            <PieChart width={400} height={300}>
              <Pie
                data={categoryUsageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name }) => name}
              >
                {categoryUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(categoryUsageData, 'Categoria_Mayor_Demanda')}>Descargar</button>
            </div>
          </div>

          {/* Gráfico de línea */}
          <div className="chart-card">
            <h3>Asistencia a monitorías</h3>
            <LineChart width={500} height={300} data={asistenciaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="asistencia" stroke="#8884d8" />
            </LineChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(asistenciaData, 'Asistencia_Monitorias')}>Descargar</button>
            </div>
          </div>

          {/* Porcentaje de tareas */}
          <div className="chart-card">
            <h3>Tareas completadas, tardías y pendientes</h3>
            <div className="reports-summary">
              {resumenTareasData.map((item, idx) => (
                <div key={idx} className={`summary-card ${item.estado.toLowerCase()}`}>
                  <h4>{item.estado}</h4>
                  <p>{item.porcentaje}</p>
                </div>
              ))}
            </div>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(resumenTareasData, 'Resumen_Tareas')}>Descargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;