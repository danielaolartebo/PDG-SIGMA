import './Reports.css';
import React, { useEffect, useState, useMemo } from 'react';
import VerticalNavbar from './VerticalNavbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, LabelList
} from 'recharts';
import {PopUp} from "./PopUp";
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

function Reports() {

  const [monitorPerformanceDataOriginal, setMonitorPerformanceDataOriginal] = useState([]);
  const [professorData, setProfessorData] = useState([]);
  const [professorDataOriginal, setProfessorDataOriginal] = useState([]);

  // console.log("Reports se está renderizando");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [asistenciaDataOriginal, setAsistenciaDataOriginal] = useState([]);

  // const [categoryUsageDataOriginal, setCategoryUsageDataOriginal] = useState([]);
  const [categoryReportData, setCategoryReportData] = useState([]);
  const [courseSelectedM, setCourseSelectedM] = useState("");
  const [courseSelectedP, setCourseSelectedP] = useState("");
  const [filteredMonitorPerformanceData, setFilteredMonitorPerformanceData] = useState([]);
  const [filteredProfessorData, setFilteredProfessorData] = useState([]);
  const [role, setRole] = useState('')

  //Pop up
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [change, setChange] = useState(false)

  const [semester, setSemester] = useState('');
  const [program, setProgram] = useState('');
  const [course, setCourse] = useState('');
  const [professor, setProfessor] = useState('');
  const [monitor, setMonitor] = useState('');

  //Porcentaje efectividad por materia de monitores
  const[completedPercent, setCompletedPercent] = useState("")
  const[pendingPercent, setPendingPercent] = useState("")
  const[latePercent, setLatePercent] = useState("")
  const[porcentages, setPorcentages] = useState([{ completed: "0%", late: "0%", pending: "0%" }]);

  //Porcentaje efectividad por materia de profesores
  const[completedPercentProfessor, setCompletedPercentProfessor] = useState("")
  const[pendingPercentProfessor, setPendingPercentProfessor] = useState("")
  const[latePercentProfessor, setLatePercentProfessor] = useState("")
  const[porcentagesProfessor, setPorcentagesProfessor] = useState([{ completed: "0%", late: "0%", pending: "0%" }]);

  useEffect(() => {
    console.log("obtener---")
    setMessage("Para obtener la información de los reportes, debes al menos seleccionar información para los primeros 3 filtros.")
    setIsOpen(!isOpen)
    setChange(!change)
    const user = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    setRole(role);
    const fetchActivities = async () => {
      try {
        const monitorResponse = await fetch(`${BACKEND_URL}/monitoring/getMonitorsReport/${user}/${role}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
        });
        const monitorJson = await monitorResponse.json();
        setMonitorPerformanceDataOriginal(monitorJson);
        
        let professorList = [];
        for (const [index, report] of monitorJson.entries()) {
            let value = report.idProfessor;
            console.log('Times');
            if(!professorList.find(e => e.idProfessor === value)){
                const professorResponse = await fetch(`${BACKEND_URL}/monitoring/getProfessorReport/${value}`,{
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' ,
                      'Authorization':localStorage.getItem('token')
                  },
                  });
              const professorJson = await professorResponse.json();
              
              console.log('Value '+professorJson)
              professorList = professorList.concat(professorJson);
              
            }
        }

        setProfessorDataOriginal(professorList)
        
      } catch (error) {
        console.error("Error fetching monitor data:", error);
      }
    };

    fetchActivities();

    const fetchAttendance = async () => {
      try {
        const attendanceResponse = await fetch(`${BACKEND_URL}/monitoring/getAttendanceReport/${role}/${user}`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization':localStorage.getItem('token')
            },
            });
        const attendanceJson = await attendanceResponse.json();
        setAsistenciaDataOriginal(attendanceJson);

      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    fetchAttendance();

    const fetchCategories = async () => {

      // const url = `${BACKEND_URL}/monitoring/getCategoriesReport/${user}`;
      const url = `${BACKEND_URL}/monitoring/getCategoriesReport/${role}/${user}`;

      try {
        const categoriesResponse = await fetch(url,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization':localStorage.getItem('token')
            },
            });
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

  const getValues = (data) =>{
    
    const list = [];
    monitorPerformanceDataOriginal.forEach((a) =>{

        if(data === "semester"){
            if(!list.includes(a.semester)){
                list.push(a.semester);
            }
        }else if(data === "courses" && program !== ''){
            if(!list.includes(a.course) && a.program === program){
                list.push(a.course);
            }
        }else if(data === "professors" && course !== ''){

            if(!list.includes(a.professor) && a.course === course){
                list.push(a.professor);

            }
        }else if(data === "programs"){
            if(!list.includes(a.program)){
                list.push(a.program);
            }
        }else {
            if(!list.includes(a.name) && a.course === course){
                list.push(a.name);
            }
        }
       
    });
    return list;
  }

  // const monitorPerformanceDataOriginal = [
  //   { name: 'Monitor A', Completadas: 12, Tardias: 3, Pendientes: 2, semestre: '2024-1', programa: 'Ingenieria de Sistemas', curso: 'POO', profesor: 'Claudia' },
  // ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  //  Función que aplica los filtros actuales
  const applyFilters = (data) => {
    if (!Array.isArray(data)) {
      console.warn("applyFilters recibió datos que no son un array:", data);
      return [];
    }

    return data.filter(d =>
      (!semester || d.semester === semester) &&
      (!program || d.program === program) &&
      (!course || d.course === course) &&
      (!professor || d.professor === professor) &&
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
    if(course !== '' && program !=='' && semester !== ''){
      let displayValue;
      let attendance;
      if (course) {
        const courseEntry = d.asistencia_por_curso?.find(item => item.curso === course);
        displayValue = courseEntry ? courseEntry.cantidad : 0;
        attendance = courseEntry? courseEntry.estudiantes : [];
      } else {
        displayValue = d.total_mes;
      }

      return {
        mes: d.mes,
        semestre: d.semestre, 
        asistencia: displayValue,
        asistentes:attendance
      };
    }
    return undefined;
  });

  const lineName = course ? `Asistentes - ${course}` : "Total Asistentes";

  const pieChartData = useMemo(() => {
    if (!categoryReportData) {
      return [];
    }
    if(course === '' || program ==='' || semester === '') {
      return [];
    }

    if (course) {
      const courseDetail = categoryReportData.detalle_por_curso?.find(
        (detail) => detail.curso === course
      );
    
      if (courseDetail && Array.isArray(courseDetail.categorias)) {
        return courseDetail.categorias.map(cat => ({
          categoria: cat.categoria,
          cantidad_total: cat.cantidad 
        }))
        .slice(0, 5);
      } else {
        return [];
      }
    } else {
      const totals = categoryReportData?.totales_por_categoria;
      if (Array.isArray(totals)) {
        console.log("Calculando pieChartData: Devolviendo totales:", totals);
        return totals.slice(0, 5);
      } else {
        console.warn("totales_por_categoria no es un arreglo válido:", totals);
        return [];
      }
    }
    
  }, [categoryReportData, course]); 

    const categoryChartTitle = course ? `Uso de Categorías - ${course}` : "Top 5 de actividades por categoría";

   const exportToCSV = (data, filename, filters) => {
    if (!data || data.length === 0) return;

    const csvRows = [];

    // Tabla principal
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = headers.map(header => `"${row[header] ?? ''}"`);
      csvRows.push(values.join(','));
    });

    // Separación visual
    csvRows.push('', '', 'Filtros aplicados:');

    // Filtros con etiquetas
    csvRows.push('Filtro,Valor');
    csvRows.push(`Semestre,${filters.semester}`);
    csvRows.push(`Programa,${filters.program}`);
    csvRows.push(`Curso,${filters.course}`);

    if (filters.professor && filters.professor.trim() !== '') {
      csvRows.push(`Profesor,${filters.professor}`);
    }

    if (filters.monitor && filters.monitor.trim() !== '') {
      csvRows.push(`Monitor,${filters.monitor}`);
    }

    // Crear blob y descargar
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  //const categoryUsageData = applyFilters(categoryUsageDataOriginal);
  const asistenciaData = chartReadyAttendanceData;

  
  const semestersToShow = getValues("semester");
  const coursesToShow = getValues("courses");
  const professorsToShow = getValues("professors");
  const programsToShow = getValues("programs");
  const monitorsToShow = getValues("monitors");


  const [monitorPerformanceData, setMonitorPerformanceData] = useState([]);
  console.log("BEFORE",monitorPerformanceData);

  //Porcentaje actividades monitores


  useEffect(() => {
    if (monitorPerformanceData.length > 0) {
  
      // Calcula los porcentajes globales para monitores
      let totalCompleted = 0;
      let totalLate = 0;
      let totalPending = 0;
  
      monitorPerformanceData.forEach(item => {
        totalCompleted += item.completed || 0;
        totalLate += item.late || 0;
        totalPending += item.pending || 0;
      });
  
      const total = totalCompleted + totalLate + totalPending;
  
      if (total > 0) {
        setCompletedPercent(`${Math.round((totalCompleted / total) * 100)}%`);
        setPendingPercent(`${Math.round((totalPending / total) * 100)}%`);
        setLatePercent(`${Math.round((totalLate / total) * 100)}%`);
        setPorcentages([{
          completed: `${Math.round((totalCompleted / total) * 100)}%`,
          pending: `${Math.round((totalPending / total) * 100)}%`,
          late: `${Math.round((totalLate / total) * 100)}%`
        }]);
      }
    }
  }, [monitorPerformanceData]);
  
  //Filter monitors information
  useEffect(() => {
    setMonitor('');
    setProfessor('');
    const data = monitorPerformanceDataOriginal; 
    const report = data.filter(d =>
      (!semester || d.semester === semester) &&
      (!program || d.program === program) &&
      (!course || d.course === course)
    );

    if(course !== '' && program !=='' && semester !== ''){
      setMonitorPerformanceData(report);
    }
    
    
  }, [course]); 

  useEffect(() => {
    const data = monitorPerformanceDataOriginal; 
    const report = data.filter(d =>
      (!semester || d.semester === semester) &&
      (!program || d.program === program) &&
      (!course || d.course === course) &&
      (!professor || d.professor === professor) &&
      (!monitor || d.name === monitor)
    );

    if(course !== '' && program !=='' && semester !== ''){
      setMonitorPerformanceData(report);
    }
    
    
  }, [monitor]); 

  //Filter professor report 
  useEffect(() => {
    const data = professorDataOriginal;
    const report = data.filter(d => (d.name === professor) && (d.course === course));
    setProfessorData(report);
    
  }, [professor]); 


  //Porcentaje actividades profesores

useEffect(() => {
  if (professorData.length > 0) {
    let completed = 0;
    let late = 0;
    let pending = 0;
    
    professorData.forEach(item => {
      completed += item.completed || 0;
      late += item.late || 0;
      pending += item.pending || 0;
    });

    const total = completed + late + pending;

    if (total > 0) {
      const completedPercent = Math.round((completed / total) * 100);
      const latePercent = Math.round((late / total) * 100);
      const pendingPercent = Math.round((pending / total) * 100);

      setPorcentagesProfessor([{
        completed: `${completedPercent}%`,
        late: `${latePercent}%`,
        pending: `${pendingPercent}%`
      }]);

      setCompletedPercentProfessor(`${completedPercent}%`);
      setPendingPercentProfessor(`${pendingPercent}%`);
      setLatePercentProfessor(`${latePercent}%`);
    }
  }
}, [professorData]);


  const handleClose = () =>{
      setIsOpen(!isOpen)
      setChange(!change)
  }


  return (
    <div className="main">
      <PopUp
        show={isOpen}
        onClose={() => handleClose()}
      >{message}
      </PopUp>
      <div className="reports-top-bar">
        <h2 className="reports-title">Reportes</h2>
        <div className="filters-container">
          <div className="filter-group">
            <select onChange={(e) => setSemester(e.target.value)}>
                  <option value="">Semestre*</option>
                  {semestersToShow.map((semester, index) => (
                      <option key={index} value={semester}>
                      {semester}
                      </option>
                  ))}
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setProgram(e.target.value)}>
              <option value="">Programa*</option>
                {programsToShow.map((program, index) => (
                    <option key={index} value={program}>
                    {program}
                    </option>
                ))}
            </select>
          </div>
          <div className="filter-group">
            <select onChange={(e) => setCourse(e.target.value)}>
            <option value="">Curso*</option>
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
          
    {/* Gráfico de barras - MONITOR */}
    <div className="chart-card">
      <h3>Rendimiento de monitores</h3>
      <BarChart width={500} height={300} data={monitorPerformanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* Mostrar solo el nombre del monitor */}
        <XAxis 
          dataKey="nameAndCourse" 
          tickFormatter={(value) => value.split(' ')[0]} 
        />
        
        <YAxis />
        
        {/* Tooltip */}
        <Tooltip 
          formatter={(value, name, props) => {
            const map = {
              completed: 'Completado',
              pending: 'Pendiente',
              late: 'Tarde',
            };

            const payload = props.payload;

            if (payload && typeof value === 'number') {
              const completed = payload.completed || 0;
              const pending = payload.pending || 0;
              const late = payload.late || 0;
              const total = completed + pending + late;

              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

              return [`${value} actividades - ${percentage}%`, map[name] || name];
            }

            return [`${value}`, map[name] || name];
          }}
          labelFormatter={(label) => `${label}`}
        />

        {/* Legend */}
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
        
        {/* Barra de Completado */}
        <Bar dataKey="completed" stackId="a" fill="rgb(0, 196, 159)" />

        {/* Barra de Pendiente */}
        <Bar dataKey="pending" stackId="a" fill="rgb(255, 82, 82)"/>

        {/* Barra de Tarde */}
        <Bar dataKey="late" stackId="a" fill="rgb(255, 187, 40)" />
           
      </BarChart>

          <div className="chart-download-container">
            <button className="chart-download-button" onClick={() => exportToCSV(monitorPerformanceData, 'Rendimiento_Monitores', {
                  semester,
                  program,
                  course,
                  professor,
                  monitor
                })
              }>Descargar</button>
          </div>
        </div>


         {/* Porcentaje de tareas - MONITOR*/}
         <div className="chart-card">
            <h3>Tareas completadas, tardías y pendientes de monitores</h3>
            <div className="reports-summary">
              <div className="summary-card completadas">
                <h4>Completadas</h4>
                <p>{completedPercent}</p>
              </div>
              <div className="summary-card tardias">
                <h4>Completadas tardías</h4>
                <p>{latePercent}</p>
              </div>
              <div className="summary-card pendientes">
                <h4>Pendientes</h4>
                <p>{pendingPercent}</p>
              </div>
            </div>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(porcentages, 'Resumen_Tareas_Monitor', {
                  semester,
                  program,
                  course,
                  professor,
                  monitor
                })
              }>Descargar</button>
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
              <Tooltip 
                formatter={(value, name, props) => {
                  const total = pieChartData.reduce((acc, curr) => acc + curr.cantidad_total, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} actividades (${percent}%)`, 'Cantidad'];
                }} 
              />
            </PieChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(pieChartData, 'Categorias_Por_Curso', {
                  semester,
                  program,
                  course,
                  professor,
                  monitor
                })
              }>Descargar</button>
            </div>
          </div>

          {/* Asistencias */}
          <div className="chart-card">
            <h3> {`Asistencia a monitorías ${course ? `(${course})` : '(mensual)'}`}</h3>
            <LineChart width={500} height={300} data={asistenciaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value, name, props) => [`${value} asistentes`, lineName]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="asistencia"
                stroke="#8884d8"
                name={lineName}
                activeDot={{ r: 8 }}
              />
            </LineChart>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(asistenciaData, `Asistencia_${lineName.replace(' ', '_')}`, {
                  semester,
                  program,
                  course,
                  professor,
                  monitor
                })
              }>Descargar</button>
              {/* datos filtrados originales*/}
              {/* <button className="chart-download-button" onClick={() => exportToCSV(filteredAttendanceData, 'Asistencia_Detallada_Filtrada')}>Descargar Detalle Filtrado</button> */}
            </div>
          </div>

        {/* Gráfico de barras - PROFESOR */}
        <div className="chart-card">
          <h3>Rendimiento de profesores</h3>
            <BarChart width={500} height={300} data={professorData}>
              <CartesianGrid strokeDasharray="3 3" />
              
              {/* Mostrar solo el nombre (jeje sin el apellido) en el eje X */}
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => value.split(' ')[0]} 
              />
              
              <YAxis />

              <Tooltip 
                formatter={(value, name, props) => {
                  const map = {
                    completed: 'Completado',
                    pending: 'Pendiente',
                    late: 'Tarde',
                  };

                  const payload = props.payload;

                  if (payload && typeof value === 'number') {
                    const completed = payload.completed || 0;
                    const pending = payload.pending || 0;
                    const late = payload.late || 0;
                    const total = completed + pending + late;

                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

                    return [`${value} actividades - ${percentage}%`, map[name] || name];
                  }

                  return [`${value}`, map[name] || name];
                }}

                labelFormatter={(label) => {
                  const parts = label.split(' ');
                  if (parts.length >= 3) {
                    const nombreCompleto = `${parts[0]} ${parts[1]}`;
                    const nombreCurso = parts.slice(2).join(' ');
                    return `${nombreCompleto} ${nombreCurso}`;
                  }
                  return label; // fallback
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
              <Bar dataKey="pending" stackId="a" fill="rgb(255, 82, 82)" />
              <Bar dataKey="late" stackId="a" fill="rgb(255, 187, 40)" />
            </BarChart>

          <div className="chart-download-container">
            <button className="chart-download-button" onClick={() => exportToCSV(professorData, 'Rendimiento_Profesores', {
                  semester,
                  program,
                  course,
                  professor,
                  monitor
                })
              }>Descargar</button>
          </div>
        </div>


         {/* Porcentaje de tareas - PROFESOR */}
         <div className="chart-card">
            <h3>Tareas completadas, tardías y pendientes de profesores</h3>
            <div className="reports-summary">
              <div className="summary-card completadas">
                <h4>Completadas</h4>
                <p>{completedPercentProfessor}</p>
              </div>
              <div className="summary-card tardias">
                <h4>Completadas tardías</h4>
                <p>{latePercentProfessor}</p>
              </div>
              <div className="summary-card pendientes">
                <h4>Pendientes</h4>
                <p>{pendingPercentProfessor}</p>
              </div>
            </div>
            <div className="chart-download-container">
              <button className="chart-download-button" onClick={() => exportToCSV(porcentagesProfessor, 'Resumen_Tareas_Profesor', {
                  semester,
                  program,
                  course,
                  professor,
                  monitor
                })
              }>Descargar</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;