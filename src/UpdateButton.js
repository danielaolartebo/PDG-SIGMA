import React, { useState } from "react";
import "./UpdateButton.css"; // Importa los estilos
import {PopUp} from "./PopUp";
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

const UpdateButton = ({ role, userId }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [updateType, setUpdateType] = useState("sameSemester");
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [change, setChange] = useState(false)

  const handleUpdateTypeChange = (type) => {
    if (type === "newSemester") {
      const confirmation = window.confirm(
        "Al continuar, todas las monitorías perderán sus monitores asignados. " +
        "Además, si un curso no se encuentra en la nueva lista asociada al profesor, su monitoría será eliminada. " +
        "¿Deseas proceder?"
      );

      if (!confirmation) return; // Si el usuario cancela, no cambia la selección
    }

    setUpdateType(type);
  };

  const handleClose = () =>{
    setIsOpen(!isOpen)
    setChange(!change)
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita la recarga de la página

    const requestData = {
      updateType,
      professorId: role === "professor" ? userId : null,
      departmentHeadId: role === "jfedpto" ? userId : null,
      removeMonitors: updateType === "newSemester", // Eliminar monitores solo si es "newSemester"
    };

    console.log("Datos enviados:", requestData);

    fetch(`${BACKEND_URL}/api/sync/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
            'Authorization':localStorage.getItem('token')
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.text())
      .then((data) => {
        setMessage(`Estado : ${data}`)
        setIsOpen(!isOpen)
        // alert(`Actualización : ${data}`);
        setShowOptions(false); 
      })
      .catch((error) => {
        console.error("Error en la actualización:", error);
        // alert("Hubo un error en la actualización.");
        setMessage("Error en la actualización: "+ error)
        setIsOpen(!isOpen)
      });
  };

  return (
    <div className="update-button-container">
      <PopUp
          show={isOpen}
          onClose={() => handleClose()}
      >
          {message}
      </PopUp>
      <div className="content"></div>

      <button className="update-button" onClick={() => setShowOptions(!showOptions)}>
        Actualizar
      </button>

      {showOptions && (
        <form className="update-options" onSubmit={handleSubmit}>
          <div className="radio-container">
            <label>
              <input
                type="radio"
                value="sameSemester"
                checked={updateType === "sameSemester"}
                onChange={() => handleUpdateTypeChange("sameSemester")}
              />
              Actualizar en el mismo semestre
            </label>

            {role === "jfedpto" && (
              <label>
                <input
                  type="radio"
                  value="newSemester"
                  checked={updateType === "newSemester"}
                  onChange={() => handleUpdateTypeChange("newSemester")}
                />
                Reiniciar para nuevo semestre
              </label>
            )}
          </div>

          <button type="submit" className="submit-button">
            Confirmar actualización
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateButton;