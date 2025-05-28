import './Applicants.css';
import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';
import {PopUp} from "./PopUp";
import { BACKEND_URL } from './config/ApiBackend';
import LoadingSpinner from './LoadingSpinner';

// Función para generar la clave única para cada postulación
const getApplicantKey = (applicant) => `${applicant.code}-${applicant.monitoringId}`;

function Applicants() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // electionStatuses ahora mapeará una clave compuesta (ej: "A00379506-101") a un booleano
    const [electionStatuses, setElectionStatuses] = useState({});
    const recordsPerPage = 8;
    const [selectedCourse, setSelectedCourse] = useState("Todos");

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    // const [change, setChange] = useState(false); // Descomenta si la usas para re-fetch

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () =>{
        setIsOpen(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(`${BACKEND_URL}/monitor/getA`,{ // Asumimos que este endpoint devuelve las postulaciones
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization':localStorage.getItem('token')
            },
        })
        .then(response => response.json())
        .then(data => {
            // Asegúrate que 'data' es un array de objetos postulación, y cada uno tiene:
            // code, monitoringId, selectionStatus, name, lastName, etc.
            console.log("Datos recibidos del backend:", data); // DEBUG: Verifica los datos y selectionStatus

            const sortedRecords = data.sort((a, b) => {
                // Ordenar primero por promedio y luego quizás por código o nombre para consistencia
                if (b.gradeAverage !== a.gradeAverage) {
                    return b.gradeAverage - a.gradeAverage;
                }
                return a.code.localeCompare(b.code); // Ejemplo de segundo criterio
            });

            setRecords(sortedRecords);

            if (selectedCourse === "Todos") {
                setFilteredRecords(sortedRecords);
            } else {
                setFilteredRecords(sortedRecords.filter(a => a.course === selectedCourse));
            }

            // Inicializa electionStatuses basado en el estado persistido usando la clave compuesta
            const initialElectionStatuses = {};
            sortedRecords.forEach(applicant => {
                const key = getApplicantKey(applicant);
                let isInitiallySelected = false; // Default to false

                if (applicant.selectionStatus) { // O applicant.estadoSeleccion 
                    const statusFromDB = applicant.selectionStatus.toLowerCase(); // O applicant.estadoSeleccion.toLowerCase()
                    if (statusFromDB === "seleccionado") {
                        isInitiallySelected = true;
                    }
                }

                initialElectionStatuses[key] = isInitiallySelected;
                console.log(`Applicant ${key}: DB status='${applicant.selectionStatus}', UI initial elected=${isInitiallySelected}`);
            });

            setElectionStatuses(initialElectionStatuses);
            console.log("Initial electionStatuses state:", initialElectionStatuses); // DEBUG
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Error loading data:", error);
            setMessage("Error cargando postulantes: " + error.message);
            setIsOpen(true);
            setIsLoading(false);
        });
    // }, [change, selectedCourse]); // Ajusta dependencias si es necesario
    }, []); // Carga inicial

    const handleFinishClick = async () => {
        setIsLoading(true);
        let currentMessage = "";
        const errors = [];
        const selectionResultsForBackend = [];
        const applicantsToKeepInUI = [];

        // Usar 'records' para procesar todas las postulaciones, no solo las filtradas/paginadas
        const applicantsToProcess = [...records];

        for (const applicant of applicantsToProcess) {
            const applicantKey = getApplicantKey(applicant);
            const originalDbStatus = applicant.selectionStatus ? applicant.selectionStatus.toLowerCase() : null;
            const uiIsSelected = electionStatuses[applicantKey] || false;

            let finalStatusForApplicant = "";

            if (originalDbStatus === "seleccionado") {
                finalStatusForApplicant = "seleccionado";
                applicantsToKeepInUI.push({ ...applicant, selectionStatus: "seleccionado" });
            } else { // No era "seleccionado" originalmente (era "no seleccionado", null, o nuevo)
                if (uiIsSelected) { // Marcado como "Electo" en la UI
                    finalStatusForApplicant = "seleccionado";
                    applicantsToKeepInUI.push({ ...applicant, selectionStatus: "seleccionado" });
                } else { // Marcado como "No electo" en la UI
                    finalStatusForApplicant = "no seleccionado";
                    // Proceder a borrar la relación si es "no seleccionado"
                    console.log(`Postulación no electa (se borrará relación): ${applicantKey}`);
                    try {
                        const deleteResponse = await fetch(`${BACKEND_URL}/monitoring-monitor/${applicant.monitoringId}/${applicant.code}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': localStorage.getItem('token') }
                        });
                        if (!deleteResponse.ok) {
                            const errorText = await deleteResponse.text();
                            throw new Error(`Error ${deleteResponse.status} borrando ${applicantKey}: ${errorText}`);
                        }
                        // Si el borrado es exitoso, NO se añade a applicantsToKeepInUI
                    } catch (error) {
                        console.error('Error borrando relación de no electo:', error);
                        errors.push(`Error borrando ${applicantKey}: ${error.message}`);
                        applicantsToKeepInUI.push({ ...applicant, selectionStatus: originalDbStatus || "no seleccionado" });
                    }
                }
            }

            // Asegurarse de enviar al backend el estado final para esta postulación específica
            if (finalStatusForApplicant) {
                selectionResultsForBackend.push({
                    idMonitoring: applicant.monitoringId,
                    code: applicant.code,
                    estadoSeleccion: finalStatusForApplicant
                });
            } else if (originalDbStatus !== "seleccionado" && !finalStatusForApplicant) {
                // Caso de "no seleccionado" que se borró y no está en applicantsToKeepInUI,
                // pero aún debe informarse al backend para el email.
                 selectionResultsForBackend.push({
                    idMonitoring: applicant.monitoringId,
                    code: applicant.code,
                    estadoSeleccion: "no seleccionado"
                });
            }
        }

        if (selectionResultsForBackend.length > 0) {
            console.log("Enviando al backend para emails/actualización de estado:", selectionResultsForBackend);
            try {
                const response = await fetch(`${BACKEND_URL}/email-finish-selection`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
                    body: JSON.stringify(selectionResultsForBackend)
                });
                const resultText = await response.text();
                if (response.ok) {
                    currentMessage = resultText || "Proceso de selección finalizado y notificaciones enviadas.";
                } else {
                    errors.push(`Error del backend al finalizar selección: ${resultText}`);
                }
            } catch (error) {
                console.error("Error llamando a /email-finish-selection:", error);
                errors.push(`Error de red al finalizar selección: ${error.message}`);
            }
        } else if (applicantsToProcess.length > 0) {
            currentMessage = "No hubo cambios de estado para procesar.";
        } else {
            currentMessage = "No hay postulaciones para procesar.";
        }

        setRecords(applicantsToKeepInUI);
        if (selectedCourse === "Todos") {
            setFilteredRecords(applicantsToKeepInUI);
        } else {
            setFilteredRecords(applicantsToKeepInUI.filter(a => a.course === selectedCourse));
        }

        const newElectionStatuses = {};
        applicantsToKeepInUI.forEach(app => {
            newElectionStatuses[getApplicantKey(app)] = app.selectionStatus === "seleccionado";
        });
        setElectionStatuses(newElectionStatuses);
        setCurrentPage(1);

        if (errors.length > 0) {
            setMessage((currentMessage ? currentMessage + "\n\n" : "") + "Errores:\n" + errors.join("\n"));
        } else {
            setMessage(currentMessage || "Proceso completado.");
        }
        setIsOpen(true);
        setIsLoading(false);
        // Considera recargar datos después de finalizar para asegurar consistencia:
        // setChange(prev => !prev); // si usas `change` en el useEffect
    };

    const courses = ["Todos", ...new Set(records.map(a => a.course))];

    const handleCourseChange = (e) => {
        const selected = e.target.value;
        setSelectedCourse(selected);
        setCurrentPage(1);
        if (selected === "Todos") {
            setFilteredRecords(records);
        } else {
            setFilteredRecords(records.filter(a => a.course === selected));
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => { // CORREGIDO
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleElection = (applicantKey) => {
        const [code, monitoringIdStr] = applicantKey.split('-');
        const applicant = records.find(r => r.code === code && r.monitoringId === monitoringIdStr);

        if (!applicant) {
            console.error("Postulación no encontrada para toggle:", applicantKey);
            console.log("Records actuales para búsqueda:", records); 
            return;
        }

        if (applicant.selectionStatus && applicant.selectionStatus.toLowerCase() === "seleccionado") {
            console.log(`La postulación ${applicantKey} ya está 'seleccionado' permanentemente.`);
            return;
        }

        setElectionStatuses(prevStatuses => ({
            ...prevStatuses,
            [applicantKey]: !prevStatuses[applicantKey]
        }));
    };

    return (
        <div>
            {isLoading && <LoadingSpinner />}
            <PopUp show={isOpen} onClose={handleClose}>
                <div style={{whiteSpace: 'pre-wrap'}}>{message}</div>
            </PopUp>
            <button className="applicants-top-right-button" onClick={handleFinishClick}>Terminar selección</button>
            <VerticalNavbar />
            <div className="applicants-content">
                {/* ... (título y filtro de curso sin cambios) ... */}
                 <div className="applicants-title-container">
                    <h2 className="applicants-title">Mis postulantes</h2>
                </div>

                <div className="applicants-subject-status-container">
                    <div className="applicants-subject-status">
                        <div className="applicants-subject">
                            <span>Curso:</span>
                            <select
                                className="applicants-dropdown"
                                value={selectedCourse}
                                onChange={handleCourseChange}
                            >
                                {courses.map(course => (
                                    <option key={course} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {isLoading && <LoadingSpinner />}
                {!isLoading && records.length === 0 && ( 
                    <p>No hay postulaciones para mostrar.</p>
                )}

                {!isLoading && records.length > 0 && (
                    <div className="applicants-main-container">
                        <div className='applicants-table-main-container'>
                            <table className="applicants-table" id="table">
                                <thead>
                                    <tr>
                                        <th className="applicants-table-head">Nombre</th>
                                        <th className="applicants-table-head">Apellido</th>
                                        <th className="applicants-table-head">Código</th>
                                        <th className="applicants-table-head">P. Acumulado</th>
                                        <th className="applicants-table-head">P. Materia</th>
                                        <th className="applicants-table-head">Curso</th>
                                        <th className="applicants-table-head">Postulación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((applicant) => {
                                        const applicantKey = getApplicantKey(applicant);
                                        // El estado de la UI viene de electionStatuses[applicantKey]
                                        const uiIsSelected = electionStatuses[applicantKey] || false;
                                        // El estado original de la BD que determina si el botón se bloquea
                                        const isPermanentlySelected = applicant.selectionStatus && applicant.selectionStatus.toLowerCase() === "seleccionado";
                                        
                                        let buttonText = "No electo";
                                        if (isPermanentlySelected) {
                                            buttonText = "Seleccionado";
                                        } else if (uiIsSelected) {
                                            buttonText = "Electo";
                                        }

                                        return (
                                            // Usar la clave compuesta para la 'key' de la fila
                                            <tr key={applicantKey}>
                                                <td className="applicants-table-data">{applicant.name}</td>
                                                <td className="applicants-table-data">{applicant.lastName}</td>
                                                <td className="applicants-table-data">{applicant.code}</td>
                                                <td className="applicants-table-data">{applicant.gradeAverage}</td>
                                                <td className="applicants-table-data">{applicant.gradeCourse}</td>
                                                <td className="applicants-table-data">{applicant.course}</td>
                                                <td className="applicants-table-data">
                                                    <div className="applicants-requirement-container">
                                                        <button
                                                            className={`applicants-status-button`}
                                                            onClick={() => toggleElection(applicantKey)} // Pasar clave compuesta
                                                            disabled={isPermanentlySelected}
                                                            style={{
                                                                backgroundColor: (isPermanentlySelected || uiIsSelected) ? '#70d67b' : 'lightgrey',
                                                                color: 'black',
                                                                width: '120px',
                                                                borderRadius: '0.5em',
                                                                borderWidth: '1px',
                                                                cursor: isPermanentlySelected ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            {buttonText}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* ... (paginación sin cambios) ... */}
                        <div className="applicants-div-pagination">
                            <div className="applicants-pagination-info">
                                Mostrando {filteredRecords.length > 0 ? indexOfFirstRecord + 1 : 0} - {Math.min(indexOfLastRecord, filteredRecords.length)} de {filteredRecords.length} resultados
                            </div>

                            <div className="applicants-main-pagination">
                                <div className="applicants-pagination">
                                    <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={currentPage === index + 1 ? 'applicants-active' : ''}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button onClick={nextPage} disabled={currentPage === totalPages || totalPages === 0}>Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>  
                
        </div>
    );
}

export default Applicants;