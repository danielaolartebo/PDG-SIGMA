import React from "react";
import "./CustomComponents.css"; // Importamos los estilos

// Icono de campana personalizado
const Bell = ({ size = 24, color = "black" }) => (
  <svg
    className="bell-icon"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22c1.1 0 2-.9 2-2H10a2 2 0 0 0 2 2z" />
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9z" />
  </svg>
);

// Card contenedor
const Card = ({ children }) => <div className="custom-card">{children}</div>;

// CardContent interno
const CardContent = ({ children }) => <div className="card-content">{children}</div>;

export { Bell, Card, CardContent };
