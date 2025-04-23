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
  const [monitorPerformanceData, setMonitorPerformanceData] = useState([]);
  const [professorData, setProfessorData] = useState([]);
  const [courseSelectedM, setCourseSelectedM] = useState("");
  const [courseSelectedP, setCourseSelectedP] = useState("");
  const [filteredMonitorPerformanceData, setFilteredMonitorPerformanceData] = useState([]);
  const [filteredProfessorData, setFilteredProfessorData] = useState([]);

  //Porcentaje afectividad por materia de monitores
  const[completedPercent, setCompletedPercent] = useState("")
  const[pendingPercent, setPendingPercent] = useState("")
  const[latePercent, setLatePercent] = useState("")

  useEffect(() => {
    const user = localStorage.getItem('userId');

    const fetchActivities = async () => {
      try {
        const monitorResponse = await fetch(`http://localhost:5433/monitoring/getMonitorsReport/${user}`);
        const monitorJson = await monitorResponse.json();
        setMonitorPerformanceData(monitorJson);

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
  }, []);

  useEffect(() => {
    
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

    
  }, [filteredMonitorPerformanceData]);

  // Datos de ejemplo
  const categoryUsageData = [
    { name: 'POO', value: 20 },
    { name: 'Arreglos', value: 30 },
    { name: 'Redes', value: 10 },
    { name: 'Estructuras', value: 25 },
  ];

  const asistenciaData = [
    { mes: 'Enero', asistencia: 40 },
    { mes: 'Febrero', asistencia: 52 },
    { mes: 'Marzo', asistencia: 33 },
    { mes: 'Abril', asistencia: 60 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="main">
      {/* Title begins */}
      <div className="reports-top-bar">
        <h2 className="reports-title">Reportes</h2>
        <button className="download-button">Descargar</button>
      </div>
      {/* Title ends */}

      <div className="reports-container">
        <VerticalNavbar />

        <div className="reports-content">

          {/* Gráfico de barras apiladas: Rendimiento de Monitores */}
          <div className="chart-card">
            <h3>Rendimiento de Monitores por Materia</h3>
            <BarChart width={500} height={300} data={filteredMonitorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
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
              <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
              <Bar dataKey="late" stackId="a" fill="#ffc658" />
              <Bar dataKey="pending" stackId="a" fill="#ff4d4f" />
            </BarChart>
          </div>

          {/* Gráfico de pastel: Categorías más usadas */}
          <div className="chart-card">
            <h3>Reporte de Mayor Cantidad de Categoría</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={categoryUsageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                onClick={(data) => setSelectedCategory(data)}
                label={({ name }) => name}
              >
                {categoryUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Gráfico de línea: Asistencia a monitorías */}
          <div className="chart-card">
            <h3>Reporte de Asistencia a Monitorías</h3>
            <LineChart width={500} height={300} data={asistenciaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="asistencia" stroke="#8884d8" />
            </LineChart>
          </div>

          {/* Gráfico porcentaje de tareas completadas, tardías y pendientes */}
          <div className="chart-card">
            <h3>Porcentaje de tareas completadas, tardías y pendientes</h3>
            <div className="reports-summary">
              <div className="summary-card completadas">
                <h4>Completadas</h4>
                <p>{completedPercent}</p>
              </div>
              <div className="summary-card atrasadas">
                <h4>Atrasadas</h4>
                <p>{latePercent}</p>
              </div>
              <div className="summary-card pendientes">
                <h4>Pendientes</h4>
                <p>{pendingPercent}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;

