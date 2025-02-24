import React, { useState, useEffect } from "react";
import "./Alert.css"; // Archivo de estilos separado

const AlertElect = ({ show, onClose }) => {
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
      La selección terminó. Los estudiantes serán notificados
    </div>
  );
};

export default AlertElect;
