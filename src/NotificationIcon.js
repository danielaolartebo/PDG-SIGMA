import React, { useState } from "react";
import { Bell } from "./CustomComponents";

const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const alerts = [
    { id: 1, message: "La actividad 1 debe ser entregada dentro de 2 días", date: "07/03/2025" },
    { id: 2, message: "Revisión pendiente en la actividad 3", date: "06/03/2025" },
  ];

  return (
    <div className="notification-container">
      {/* Icono de campana */}
      <div className="bell-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
        <Bell size={36} color="blue" className="bell-icon" />
      </div>

      {/* Tarjeta de notificaciones */}
      {showNotifications && (
        <div className="custom-card">
          <h3 className="card-title">Notificaciones</h3>
          <ul className="notification-list">
            {alerts.map((alert) => (
              <li key={alert.id} className="notification-item">
                <div className="notification-box">
                  <p>{alert.message}</p>
                  <span className="notification-date">{alert.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;



