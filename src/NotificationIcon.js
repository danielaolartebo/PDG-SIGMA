import React, { useState, useEffect } from "react";
import { Bell } from "./CustomComponents";
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const user = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      if (!user || !role) {
        console.error("Usuario o rol no encontrado en localStorage");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/activity/findAll/${user}/${role}`,{
          method: 'GET',
          headers: { 'Content-Type': 'application/json' ,
              'Authorization':localStorage.getItem('token')
          },
          });
        if (!response.ok) throw new Error("Error al obtener actividades");

        const activities = await response.json();
        const today = new Date();
        const daysThreshold = 1; // 1 día para la fecha límite

        const upcomingAlerts = activities
        .filter(activity => activity.finish && activity.state === "PENDIENTE")
          .map(activity => {
            const finishDate = new Date(activity.finish);
            const diffInDays = Math.ceil((finishDate - today) / (1000 * 60 * 60 * 24));

            return diffInDays > 0 && diffInDays <= daysThreshold
              ? { id: activity.id, message: `La actividad "${activity.name}" vence en ${diffInDays} día`, date: finishDate.toLocaleDateString() }
              : null;
          })
          .filter(Boolean);

        setAlerts(upcomingAlerts);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 60000); // Cada 60 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notification-container">
      <div className="bell-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
        <Bell size={36} color="blue" className="bell-icon" />
        {alerts.length > 0 && <span className="notification-badge">{alerts.length}</span>}
      </div>

      {showNotifications && (
        <div className="custom-card">
          <h3 className="card-title">Notificaciones</h3>
          {alerts.length > 0 ? (
            <ul className="notification-list">
              {alerts.map(alert => (
                <li key={alert.id} className="notification-item">
                  <div className="notification-box">
                    <p>{alert.message}</p>
                    <span className="notification-date">{alert.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay notificaciones pendientes</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
