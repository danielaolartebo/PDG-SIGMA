import './Applicants.css';
import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';
import {PopUp} from "./PopUp";
import { BACKEND_URL } from './config/ApiBackend';
import LoadingSpinner from './LoadingSpinner';

function Applicants() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [electionStatuses, setElectionStatuses] = useState({});
    const recordsPerPage = 8;
    const [selectedCourse, setSelectedCourse] = useState("Todos"); 

    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [change, setChange] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const handleClose = () =>{
        setIsOpen(!isOpen)
        setChange(!change)
        setIsLoading(!isLoading)
    }

    const handleFinishClick = async () => {

        // const electedApplicants = records.filter((applicant, index) => {
        //     const applicantIndex = indexOfFirstRecord + index;
        //     return electionStatuses[applicantIndex] === true;
        //   });
        
        //   setRecords(electedApplicants);
        
        setIsLoading(true)
        try {
            
            const nonElectedApplicants = currentRecords.filter(
                (_, index) => !electionStatuses[indexOfFirstRecord + index]
            );
            
            for (const applicant of nonElectedApplicants) {
                // Esta lógica va a cambiar, porque está eliminando a los monitores(aplicantes)
                // y no la relación entre monitor-monitoría. 
                // Si solo aplica a una monitoria no hay problema, pero si son 2 o mas
                // borra todas. 
                // De igual forma, la lógica del back cambia al enviar el correo, 
                // No itera sobre la lista de monitores, sino que lo va a hacer sobre 
                // las relaciones monitor-monitoring

                // await fetch(`${BACKEND_URL}/monitor/${applicant.code}`, {
                //     method: 'DELETE',
                //     headers: { 'Content-Type': 'application/json' ,
                //         'Authorization':localStorage.getItem('token')
                //     },
                // });
            }
            
            //setElectionStatuses(new Array(electedApplicants.length).fill(true))
            //setElectionStatuses(new Array(electionStatuses.length).fill(true))
    
            // Update applicants
            setRecords((prevRecords) =>
                prevRecords.filter((_, index) => electionStatuses[indexOfFirstRecord + index])
            );
    
        } catch (error) {
            console.error('Error during end of selection:', error);
            // alert('Hubo un error al finalizar la selección.');
            setMessage("Hubo un error al finalizar la selección")
            setIsOpen(!isOpen)
        }

        const electedCodes = currentRecords
        .filter((applicant, index) => electionStatuses[indexOfFirstRecord + index])
        .map(applicant => applicant.code); 

        console.log(electedCodes)
        try {
            const response = await fetch(`${BACKEND_URL}/email-finish-selection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' ,
                    'Authorization':localStorage.getItem('token')
                },
                body: JSON.stringify(electedCodes),
            });

            const result = await response.text();
            // alert(result);
            setMessage("Proceso finalizado - Monitores seleccionados")
            setIsOpen(!isOpen)
            
        } catch (error) {
            console.error("Error finishing selection:", error);
            // alert("No se pudo finalizar la selección.");
            setMessage("No se pudo finalizar la selección:" + error)
            setIsOpen(!isOpen)
        }
    };
    

    useEffect(() => {
        // Load data from Applicants.json
        fetch(`${BACKEND_URL}/monitor/getA`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization':localStorage.getItem('token')
            },
        })
            .then(response => response.json())
            .then(data => {
                // Sort records by 'pacumulado' (promedio acumulado) descending
                const sortedRecords = data.sort((a, b) => b.gradeAverage - a.gradeAverage);
                setRecords(sortedRecords);
                setFilteredRecords(sortedRecords);
            })
            .catch(error => console.error("Error loading data:", error));
    }, []);

    // Get course list by apl
    const courses = ["Todos", ...new Set(records.map(a => a.course))];

    //Manage Course Selected
    const handleCourseChange = (e) => {
        const selected = e.target.value;
        setSelectedCourse(selected);

        // Filter list
        if (selected === "Todos") {
            setFilteredRecords(records);
        } else {
            setFilteredRecords(records.filter(a => a.course === selected));
        }
    };

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(records.length / recordsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleElection = (index) => {
        setElectionStatuses(prevStatuses => ({
            ...prevStatuses,
            [index]: !prevStatuses[index]
        }));
    };

    

    return (
        <div>
            {/* Rueda de carga */}
            {isLoading && <LoadingSpinner />}
            {/* Ventana emergente */}
            <PopUp
                show={isOpen}
                onClose={() => handleClose()}
            >
                {message}
            </PopUp>
            {/* Load file button starts */}
            
            <button className="applicants-top-right-button" onClick={handleFinishClick}>Terminar selección</button>
            
            {/* Load file button ends */}
            

            <VerticalNavbar />

            <div className="applicants-content">
                {/* Title begins */}
                <div className="applicants-title-container">
                    <h2 className="applicants-title">Mis postulantes</h2>
                </div>
                {/* Title ends */}

                {/* Subject and status begins */}
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
                        <div className="applicants-status">
                            <span>Estado:</span>
                            <span className="applicants-status-selected">Postulante seleccionado</span>
                        </div>
                    </div>
                </div>
                {/* Subject and status ends */}

                {/* Table starts */}
                <div className="applicants-main-container">
                    <div className='applicants-table-main-container'>
                        <table className="applicants-table" id="table">
                            <thead>
                                <tr>
                                    <th className="applicants-table-head">Nombre</th>
                                    <th className="applicants-table-head">Apellido</th>
                                    <th className="applicants-table-head">Código</th>
                                    <th className="applicants-table-head">Promedio acumulado</th>
                                    <th className="applicants-table-head">Promedio materia</th>
                                    <th className="applicants-table-head">Curso</th>
                                    <th className="applicants-table-head">Postulación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((applicant, index) => {
                                    const applicantIndex = indexOfFirstRecord + index;
                                    const isElected = electionStatuses[applicantIndex] || false;

                                    return (
                                        <tr key={index}>
                                            <td className="applicants-table-data">{applicant.name}</td>
                                            <td className="applicants-table-data">{applicant.lastName}</td>
                                            <td className="applicants-table-data">{applicant.code}</td>
                                            <td className="applicants-table-data">{applicant.gradeAverage}</td>
                                            <td className="applicants-table-data">{applicant.gradeCourse}</td>
                                            <td className="applicants-table-data">{applicant.course}</td>
                                            <td className="applicants-table-data">
                                                <div className="applicants-requirement-container">
                                                    <button 
                                                        className={`applicants-status-button ${isElected ? '' : ''}`} 
                                                        onClick={() => toggleElection(applicantIndex)}
                                                        style={{
                                                            backgroundColor: isElected ? '#70d67b' : 'lightgrey',
                                                            color: 'black',
                                                            width: '100px',
                                                            borderRadius: '0.5em',
                                                            borderWidth: '1px'
                                                        }}
                                                    >
                                                        {isElected ? 'Electo' : 'No electo'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="applicants-div-pagination">
                        <div className="applicants-pagination-info">
                            Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, records.length)} de {records.length} resultados
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
                                <button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Table ends */}
            </div>
        </div>
    );
}

export default Applicants;


