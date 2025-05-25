import "./PopUp.css";

const PopUp = ({show, onClose, children }) => {
  if (!show) return null
  
  return (
    <div className="overlay">
      <div className="popup">
        <div className="content">{children}</div>
        <button className="button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const PopupDelete = ({ show, onClose, onApply }) => {

  if(!show) return null

  return (
    <div className="overlay">
      <div className="popup">
        <div className="content">
          <p>¿Estás seguro de la acción a realizar?</p>
          Eliminar
        </div>
        <button
          className={`button button-apply }`}
          onClick={onApply}
        >
          Sí, Elimar
        </button>
        <button className="button button-close" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export { PopUp, PopupDelete };
