import React from "react";
import "./PopUp.css";

const PopUp = ({show, onClose, children }) => {
  if (!show) return null
  
  return (
    <div className="overlay">
      <div className="popup">
        <div className="content">{children}</div>
        <button className="button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PopUp;
