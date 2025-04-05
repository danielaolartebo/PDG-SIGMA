import './Reports.css';
import React from 'react';
import VerticalNavbar from './VerticalNavbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

function Reports() {
  console.log("Reports se está renderizando");

  // Datos de ejemplo
  const monitorPerformanceData = [
    { name: 'Monitor A', Completadas: 12, Tardías: 3, Pendientes: 2 },
    { name: 'Monitor B', Completadas: 9, Tardías: 4, Pendientes: 5 },
    { name: 'Monitor C', Completadas: 15, Tardías: 1, Pendientes: 0 },
  ];

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

  const profesoresData = [
    { profesor: 'Claudia', Completadas: 20, Tardías: 2, Pendientes: 1 },
    { profesor: 'Carlos', Completadas: 17, Tardías: 5, Pendientes: 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="reports-container">
      <VerticalNavbar />
      <div className="reports-content">
        {/* Gráfico de barras apiladas: Rendimiento de Monitores */}
        <div className="chart-card">
          <h3>Rendimiento de Monitores por Materia</h3>
          <BarChart width={500} height={300} data={monitorPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Completadas" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Tardías" stackId="a" fill="#ffc658" />
            <Bar dataKey="Pendientes" stackId="a" fill="#ff4d4f" />
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

        {/* Gráfico porcentaje de tareas completadas, tardias y pendientes */}
        <div className="chart-card">
            <h3>Porcentaje de tareas completadas, tardías y pendientes</h3>
            <div className="reports-summary">
                <div className="summary-card completadas">
                    <h4>Completadas</h4>
                    <p>68%</p>
                </div>
                <div className="summary-card atrasadas">
                    <h4>Atrasadas</h4>
                    <p>20%</p>
                </div>
                <div className="summary-card pendientes">
                    <h4>Pendientes</h4>
                    <p>12%</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
