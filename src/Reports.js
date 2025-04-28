import './Reports.css';
import React, { useEffect, useState } from 'react';
import VerticalNavbar from './VerticalNavbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

function Reports() {
  console.log("Reports se está renderizando");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [monitorPerformanceDataOriginal, setMonitorPerformanceDataOriginal] = useState([]);
  const [professorData, setProfessorData] = useState('');
  const [courseSelectedM, setCourseSelectedM] = useState("");
  const [courseSelectedP, setCourseSelectedP] = useState("");
  const [filteredMonitorPerformanceData, setFilteredMonitorPerformanceData] = useState([]);
  const [filteredProfessorData, setFilteredProfessorData] = useState([]);
  const [role, setRole] = useState('')

const [semester, setSemester] = useState('');
  const [program, setProgram] = useState('');
  const [course, setCourse] = useState('');
  const [professor, setProfessor] = useState('');
  const [monitor, setMonitor] = useState('');

  //Porcentaje afectividad por materia de monitores
  const[completedPercent, setCompletedPercent] = useState("")
  const[pendingPercent, setPendingPercent] = useState("")
  const[latePercent, setLatePercent] = useState("")
  const[porcentages, setPorcentages] = useState([{ completed: "0%", late: "0%", pending: "0%" }]);

  useEffect(() => {
    const user = localStorage.getItem('userId');
    const role = localStorage.getItem('role')
    setRole(role);
    const fetchActivities = async () => {
      try {
        const monitorResponse = await fetch(`http://localhost:5433/monitoring/getMonitorsReport/${user}/${role}`);
        const monitorJson = await monitorResponse.json();
        setMonitorPerformanceDataOriginal(monitorJson);

        if (monitorJson.length > 0) {
          const firstCourse = monitorJson[0].course;
          const filtered = monitorJson.filter(a => a.course === firstCourse);
          setFilteredMonitorPerformanceData(filtered);
        }
      } catch (error) {
        console.error('Error fetching monitor data:', error);
      }
      if(role === 'professor'){
        try {
            const professorResponse = await fetch(`http://localhost:5433/monitoring/getProfessorReport/${user}`);
            const professorJson = await professorResponse.json();
            setProfessorData(professorJson);
    
            if (professorJson.length > 0) {
              const filtered = professorJson.filter(a => a.course === course);
              setFilteredProfessorData(filtered);
            }
          } catch (error) {
            console.error('Error fetching professor data:', error);
          }
      }
      
    };

    fetchActivities();
  }, []);

  

  // Datos de ejemplo con atributos para filtros
  /*const monitorPerformanceDataOriginal = [
    { name: 'Monitor A', completed: 12, late: 3, pending: 2, semester: '2024-1', program: 'Ingenieria de Sistemas', course: 'POO', professor: 'Claudia Castiblanco'}
  ];*/
  
  

  const getValues = (data) =>{
    
    const list = [];
    monitorPerformanceDataOriginal.forEach((a) =>{

        if(data === "semester"){
            if(!list.includes(a.semester)){
                list.push(a.semester);
            }
        }else if(data === "courses"){
            if(!list.includes(a.course)){
                list.push(a.course);
            }
        }else if(data === "professors"){

            if(!list.includes(a.professor)){
                list.push(a.professor);

            }
        }else if(data === "programs"){
            if(!list.includes(a.program)){
                list.push(a.program);
            }
        }else {
            if(!list.includes(a.name)){
                list.push(a.name);
            }
        }
       
    });
    return list;
  }

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
      (!semester || d.semester === semester) &&
      (!program || d.program === program) &&
      (!course || d.course === course) &&
      (!professor || d.professor === professor) &&
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
  
  const semestersToShow = getValues("semester");
  const coursesToShow = getValues("courses");
  const professorsToShow = getValues("professors");
  const programsToShow = getValues("programs");
  const monitorsToShow = getValues("monitors");

  useEffect(() => {
    if (monitorPerformanceData.length > 0) {
      let completed = 0;
      let late = 0;
      let pending = 0;
      
      monitorPerformanceData.forEach(item => {
        completed += item.completed || 0;
        late += item.late || 0;
        pending += item.pending || 0;
      });
  
      const total = completed + late + pending;
      
      if (total > 0) {

        setPorcentages([{
          completed: `${((completed / total) * 100)}%`,
          late: `${((late / total) * 100)}%`,
          pending: `${((pending / total) * 100)}%`
        }]);
        setCompletedPercent(((completed/total)*100).toString()+"%");
        setPendingPercent(((pending/total)*100).toString()+"%");
        setLatePercent(((late/total)*100).toString()+"%");
      }
    }
  }, [monitorPerformanceData]);

  return (
    <div className="main">
      <div className="reports-top-bar">
        <h2 className="reports-title">Reportes</h2>
        <div className="filters-container">
          <div className="filter-group">
          <select onChange={(e) => setSemester(e.target.value)}>
                <option value="">Semestre</option>
                {semestersToShow.map((semester, index) => (
                    <option key={index} value={semester}>
                    {semester}
                    </option>
                ))}
          </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setProgram(e.target.value)}>
              <option value="">Programa</option>
                {programsToShow.map((program, index) => (
                    <option key={index} value={program}>
                    {program}
                    </option>
                ))}
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setCourse(e.target.value)}>
            <option value="">Curso</option>
                {coursesToShow.map((course, index) => (
                    <option key={index} value={course}>
                    {course}
                    </option>
                ))}
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setProfessor(e.target.value)}>
            <option value="">Profesor</option>
                {professorsToShow.map((professor, index) => (
                    <option key={index} value={professor}>
                    {professor}
                    </option>
                ))}
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setMonitor(e.target.value)}>
              <option value="">Monitor</option>
              {monitorsToShow.map((monitor, index) => (
                    <option key={index} value={monitor}>
                    {monitor}
                    </option>
                ))}
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
              <XAxis dataKey="nameAndCourse" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const map = {
                    completed: 'Completado',
                    pending: 'Pendiente',
                    late: 'Tarde',
                  };
                  return [value, map[name] || name];
                }} 
              />
              <Legend 
                formatter={(value) => {
                  const map = {
                    completed: 'Completado',
                    pending: 'Pendiente',
                    late: 'Tarde',
                  };
                  return map[value] || value;
                }} 
              />

              <Bar dataKey="completed" stackId="a" fill="rgb(0, 196, 159)" />
              <Bar dataKey="late" stackId="a" fill="rgb(255, 187, 40)" />
              <Bar dataKey="pending" stackId="a" fill="rgb(255, 82, 82)" />
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
              <div className="summary-card completadas">
                <h4>Completadas</h4>
                <p>{completedPercent}</p>
              </div>
              <div className="summary-card tardias">
                <h4>Tardías</h4>
                <p>{latePercent}</p>
              </div>
              <div className="summary-card pendientes">
                <h4>Pendientes</h4>
                <p>{pendingPercent}</p>
              </div>
            </div>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(porcentages, 'Resumen_Tareas')}>Descargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;