import './Reports.css';
import React, { useEffect, useState, useMemo } from 'react';
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
  const [asistenciaDataOriginal, setAsistenciaDataOriginal] = useState([]);
  // const [categoryUsageDataOriginal, setCategoryUsageDataOriginal] = useState([]);
  const [categoryReportData, setCategoryReportData] = useState([]);
  const [professorData, setProfessorData] = useState([]);
  const [courseSelectedM, setCourseSelectedM] = useState("");
  const [courseSelectedP, setCourseSelectedP] = useState("");
  const [filteredMonitorPerformanceData, setFilteredMonitorPerformanceData] = useState([]);
  const [filteredProfessorData, setFilteredProfessorData] = useState([]);

  //Porcentaje efectividad por materia de monitores
  const[completedPercent, setCompletedPercent] = useState("")
  const[pendingPercent, setPendingPercent] = useState("")
  const[latePercent, setLatePercent] = useState("")

  useEffect(() => {
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

    const fetchAttendance = async () => {
      try {
        const attendanceResponse = await fetch(`http://localhost:5433/monitoring/getAttendanceReport/${user}`);
        const attendanceJson = await attendanceResponse.json();
        setAsistenciaDataOriginal(attendanceJson);

      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    fetchAttendance();

    const fetchCategories = async () => {

      const url = `http://localhost:5433/monitoring/getCategoriesReport/${user}`;

      try {
        const categoriesResponse = await fetch(url);
        if (!categoriesResponse.ok) {
             const errorData = await categoriesResponse.json().catch(() => ({}));
             throw new Error(errorData.error || `Error ${categoriesResponse.status}`);
        }
        const categoriesJson = await categoriesResponse.json();
        console.log("Respuesta API Categorías:", categoriesJson); 

        setCategoryReportData(categoriesJson);

      } catch (error) {
        console.error('Error fetching categories data:', error);
        setCategoryReportData(null); 
      }
    };
    fetchCategories();
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

  const [semester, setSemester] = useState('');
  const [program, setProgram] = useState('');
  const [course, setCourse] = useState('');
  const [professor, setProfessor] = useState('');
  const [monitor, setMonitor] = useState('');

  // Datos de ejemplo con atributos para filtros
  // const monitorPerformanceDataOriginal = [
  //   { name: 'Monitor A', Completadas: 12, Tardias: 3, Pendientes: 2, semestre: '2024-1', programa: 'Ingenieria de Sistemas', curso: 'POO', profesor: 'Claudia' },
  //   { name: 'Monitor B', Completadas: 9, Tardias: 4, Pendientes: 5, semestre: '2024-2', programa: 'Ingenieria Industrial', curso: 'Estructuras de Datos', profesor: 'Carlos' },
  //   { name: 'Monitor C', Completadas: 15, Tardias: 1, Pendientes: 0, semestre: '2024-1', programa: 'Ingenieria de Sistemas', curso: 'POO', profesor: 'Claudia' },
  //   { name: 'Monitor D', Completadas: 10, Tardias: 2, Pendientes: 1, semestre: '2025-1', programa: 'Ingenieria Industrial', curso: 'Redes', profesor: 'Carlos' },
  //   { name: 'Monitor E', Completadas: 7, Tardias: 3, Pendientes: 4, semestre: '2024-2', programa: 'Ingenieria de Sistemas', curso: 'Arreglos', profesor: 'Claudia' },
  //   { name: 'Monitor F', Completadas: 13, Tardias: 0, Pendientes: 2, semestre: '2025-1', programa: 'Ingenieria de Sistemas', curso: 'Estructuras de Datos', profesor: 'Carlos' },
  //   { name: 'Monitor G', Completadas: 8, Tardias: 1, Pendientes: 3, semestre: '2025-2', programa: 'Ingenieria Biomédica', curso: 'Bioinformática', profesor: 'Mariana' },
  //   { name: 'Monitor H', Completadas: 11, Tardias: 0, Pendientes: 2, semestre: '2024-1', programa: 'Ingenieria Electrónica', curso: 'Circuitos Digitales', profesor: 'José' },
  //   { name: 'Monitor I', Completadas: 6, Tardias: 5, Pendientes: 5, semestre: '2025-2', programa: 'Ingenieria Biomédica', curso: 'Señales Biomédicas', profesor: 'Mariana' },
  //   { name: 'Monitor J', Completadas: 14, Tardias: 2, Pendientes: 1, semestre: '2024-2', programa: 'Ingenieria Electrónica', curso: 'Microcontroladores', profesor: 'José' },
  // ];


  const resumenTareasData = [
    { estado: 'Completadas', porcentaje: '68%' },
    { estado: 'Tardias', porcentaje: '20%' },
    { estado: 'Pendientes', porcentaje: '12%' },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  //  Función que aplica los filtros actuales
  const applyFilters = (data) => {
    if (!Array.isArray(data)) {
      console.warn("applyFilters recibió datos que no son un array:", data);
      return [];
    }

    return data.filter(d =>
      d &&
      (!semester || d.semestre === semester) &&
      (!program || d.programa === program) &&
      (!course || d.curso === course) &&
      (!professor || d.profesor === professor) &&
      (!monitor || d.name === monitor)
    );
    
  };

  const applyAttendanceFilters = (data) => {
    if (!Array.isArray(data)) {
      console.warn("applyAttendanceFilters recibió datos que no son un array:", data);
      return [];
    }
    return data.filter(d => {
      if (!d) return false;

      const semesterMatch = !semester || d.semestre === semester;

      const courseMatch = !course ||
        (Array.isArray(d.asistencia_por_curso) && 
         d.asistencia_por_curso.some(item => item.curso === course));

      return semesterMatch && courseMatch;
    });
  };

  const filteredAttendanceData = applyAttendanceFilters(asistenciaDataOriginal);

  const chartReadyAttendanceData = filteredAttendanceData.map(d => {
    let displayValue;
    if (course) {
      const courseEntry = d.asistencia_por_curso?.find(item => item.curso === course);
      displayValue = courseEntry ? courseEntry.cantidad : 0;
    } else {
      displayValue = d.total_mes;
    }

    return {
      mes: d.mes,
      semestre: d.semestre, 
      valorMostrado: displayValue
    };
  });

  const lineName = course ? `Asistentes - ${course}` : "Total Asistentes";

  const pieChartData = useMemo(() => {
    if (!categoryReportData) {
      console.log("Calculando pieChartData: No hay categoryReportData");
      return [];
    }

    if (course) {
      console.log(`Calculando pieChartData: Filtro de curso '${course}' activo.`);
      const courseDetail = categoryReportData.detalle_por_curso?.find(
        (detail) => detail.curso === course
      );

      if (courseDetail && Array.isArray(courseDetail.categorias)) {
        console.log("Calculando pieChartData: Curso encontrado, mapeando categorías:", courseDetail.categorias);
        
        return courseDetail.categorias.map(cat => ({
          categoria: cat.categoria,
          cantidad_total: cat.cantidad 
        }));
      } else {
        console.log("Calculando pieChartData: Curso no encontrado o sin categorías.");
        return [];
      }
    } else {
      console.log("Calculando pieChartData: Sin filtro de curso, usando totales.");
      if (Array.isArray(categoryReportData.totales_por_categoria)) {
         console.log("Calculando pieChartData: Devolviendo totales:", categoryReportData.totales_por_categoria);
          return categoryReportData.totales_por_categoria; 
      } else {
          console.log("Calculando pieChartData: totales_por_categoria no es un array.");
          return []; 
      }
    }
  }, [categoryReportData, course]); 

  const categoryChartTitle = course ? `Uso de Categorías - ${course}` : "Uso de Categorías (Totales)";

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
  // const categoryUsageData = applyFilters(categoryTotalsData);
  // const asistenciaData = applyAttendanceFilters(asistenciaDataOriginal);
  const asistenciaData = chartReadyAttendanceData;

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
              <option value="2025-1">2025-1</option>
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
              <option value="Ingeniería de Software I">Ingeniería de Software I</option>
              <option value="Mundos Posibles 2">Mundos Posibles 2</option>
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

          {/* Gráfico de pastel*/}
          <div className="chart-card">
            <h3>{categoryChartTitle}</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="cantidad_total"
                nameKey="categoria"
                label={({ categoria }) => categoria}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}-${entry.categoria}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} actividades`} />
            </PieChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(pieChartData, 'Categorias_Por_Curso')}>Descargar</button>
            </div>
          </div>

          {/* Asistencias */}
          <div className="chart-card">
            <h3> {`Asistencia a monitorías ${course ? `(${course})` : '(Total Mensual)'}`}</h3>
            <LineChart width={500} height={300} data={asistenciaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value, name, props) => [`${value} asistentes`, lineName]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="valorMostrado"
                stroke="#8884d8"
                name={lineName}
                activeDot={{ r: 8 }}
              />
            </LineChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(asistenciaData, `Asistencia_${lineName.replace(' ', '_')}`)}>Descargar Vista Actual</button>
              {/* datos filtrados originales*/}
              {/* <button className="chart-download-button" onClick={() => exportToCSV(filteredAttendanceData, 'Asistencia_Detallada_Filtrada')}>Descargar Detalle Filtrado</button> */}
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