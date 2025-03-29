import React, { useState } from "react";
import "./UpdateButton.css"; // Importa los estilos

const UpdateButton = ({ role, userId }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [updateType, setUpdateType] = useState("sameSemester");
  const [removeMonitors, setRemoveMonitors] = useState(false);

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
    setRemoveMonitors(type === "newSemester"); // Se marca y deshabilita automáticamente en "newSemester"
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita la recarga de la página

    const requestData = {
      updateType,
      professorId: role === "professor" ? userId : null,
      departmentHeadId: role === "jfedpto" ? userId : null,
      removeMonitors: updateType === "newSemester" || removeMonitors // Siempre eliminar monitores en "newSemester"
    };
    
    console.log("Datos enviados:", requestData);

    fetch("http://localhost:5433/api/sync/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(`Actualización completada: ${data}`);
        setShowOptions(false); // Ocultar el menú después de actualizar
      })
      .catch((error) => {
        console.error("Error en la actualización:", error);
        alert("Hubo un error en la actualización.");
      });
  };

  return (
    <div className="update-button-container">
      <button className="update-button" onClick={() => setShowOptions(!showOptions)}>
        Actualizar
      </button>

      {showOptions && (
        <form className="update-options" onSubmit={handleSubmit}>
          {/* Checkbox para eliminar monitores */}
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={updateType === "newSemester" || removeMonitors}
              disabled={updateType === "newSemester"}
              onChange={() => setRemoveMonitors(!removeMonitors)}
            />
            <label>¿Eliminar monitores?</label>
          </div>

          {/* Radio buttons para tipo de actualización */}
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

            <label>
              <input
                type="radio"
                value="newSemester"
                checked={updateType === "newSemester"}
                onChange={() => handleUpdateTypeChange("newSemester")}
              />
              Reiniciar para nuevo semestre
            </label>
          </div>

          {/* Botón de enviar */}
          <button type="submit" className="submit-button">
            Confirmar actualización
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateButton;
