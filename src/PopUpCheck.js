import React, { useState } from "react";
import "./PopUpCheck.css";

const PopupCheck = ({ show, onClose, onApply }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  if(!show) return null

  return (
    <div className="overlay">
      <div className="popup">
        <div className="content">
          <p>Por favor confirma las siguientes condiciones:</p>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            Acepto las condiciones
          </label>
        </div>
        <button
          className={`button button-apply ${isChecked ? "enabled" : ""}`}
          onClick={onApply}
          disabled={!isChecked}
        >
          Aplicar
        </button>
        <button className="button button-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PopupCheck;
