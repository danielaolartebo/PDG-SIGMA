import React, { useState, useEffect } from "react";
import "./Alert.css"; // Archivo de estilos separado

const Alert = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // Llama a la función onClose después de 3 segundos
      }, 3000);
      return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }
  }, [show, onClose]);

  return (
    <div className={`alert ${show ? "alert-show" : ""}`}>
      Has iniciado sesión como estudiante
    </div>
  );
};

export default Alert;
