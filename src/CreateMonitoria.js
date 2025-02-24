import React, { useState, useEffect } from 'react';
import './CreateMonitoria.css'; 
import './Task.css';
import { Link } from 'react-router-dom';
import VerticalNavbar from './VerticalNavbar';
import Popup from "./PopUp";
import { useNavigate } from "react-router-dom";
import { useMemo } from 'react';

function CreateMonitoria() {

    const [column, setColumn] = useState([]);
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 2;
    const navigate = useNavigate();

    const [monitories, setMonitories] = useState([]); // State for Monitories list
    const [faculties, setFaculties] = useState([]); // State for Faculty options
    const [programs, setPrograms] = useState([]); // State for Program options
    const [subject, setSubject] = useState([]); // State for Subject options
    const [selectedFaculty, setSelectedFaculty] = useState(""); // Selected Faculty
    const [selectedProgram, setSelectedProgram] = useState(""); // Selected Program
    const [selectedSubject, setSelectedSubject] = useState(""); // Selected Subject
    const [selectedSemester, setSelectedSemester] = useState(""); // Selected Semester
    const [selectedStartDate, setSelectedStartDate] = useState(""); // Selected StartDate
    const [selectedFinishDate, setSelectedFinishDate] = useState(""); // Selected FinishDate
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [change, setChange] = useState(false)

    // Fetch Faculty options
    useEffect(() => {
        fetch('http://localhost:5433/school/getSchools')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setFaculties(data);
                } else {
                    console.error("Faculty data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching faculty data:', error));

            fetch('http://localhost:5433/monitoring/getA')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    setRecords(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        
    }, []);

    useEffect(() => {
            fetch('http://localhost:5433/monitoring/getA')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    setRecords(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        
    }, [change]);


    // Fetch Program options
    useEffect(() => {
        const school ={
            name:selectedFaculty
        }

        fetch('http://localhost:5433/program/getProgramsSchool',{
            method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(school),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setPrograms(data);
                    setSubject([])
                } else {
                    setPrograms([])
                    console.error("Program data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, [selectedFaculty]);

    // Fetch Subject options
    useEffect(() => {
        const prog = {
            name:selectedProgram
        }
        fetch('http://localhost:5433/course/getCoursesProgram',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(prog),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setSubject(data);
                } else {
                    setSubject([])
                    console.error("Program data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, [selectedProgram]);

    // Handle change for Faculty dropdown
    const handleFacultyChange = (event) => {
        setSelectedFaculty(event.target.value);
    };

    // Handle change for Program dropdown
    const handleProgramChange = (event) => {
        setSelectedProgram(event.target.value);
    };

    // Handle change for Subject dropdown
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    // Handle change for Semester dropdown
    const handleSemesterChange = (event) => {
        setSelectedSemester(event.target.value);
    };

    // Handle change for Start Date Calendar
    const handleStartDateChange = (event) => {
        setSelectedStartDate(event.target.value);
    };

    // Handle change for Finish Date Calendar
    const handleFinishDateChange = (event) => {
        setSelectedFinishDate(event.target.value);
    };

    


    const handleCreate = async() => {
       
        const data = {
            programName: selectedProgram,
            courseName: selectedSubject,
            schoolName: selectedFaculty,
            start: selectedStartDate,
            finish: selectedFinishDate,
            professorId: localStorage.getItem("userId"),
            semester: selectedSemester,
          };
        
          console.log("Data to send:", data);
        
          try {
            const response = await fetch("http://localhost:5433/monitoring/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
        
            // Leer el mensaje del backend
            const messageR = await response.text();
        
            if (response.ok) {
                setMessage(messageR)
                setIsOpen(!isOpen)
                
            } else {
                setMessage(messageR)
                console.error("Error: " + messageR)
                setIsOpen(!isOpen)
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            alert("Ocurrió un error inesperado. Por favor, inténtalo nuevamente.");
          }
    };

    const handleClose = () =>{
        setIsOpen(!isOpen)
        setChange(!change)
    }

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

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

    const processedRecords = useMemo(() => {
        return currentRecords.map(record => {
            const startDateR = record.start.split('T')[0];
            const endDateR = record.finish.split('T')[0];
            return {
                ...record,
                startFormatted: startDateR,
                endFormatted: endDateR,
            };
        });
    }, [currentRecords]);

    const checkDates = (startPostulation, endPostulation) => {
        
        const startDateR = startPostulation.split('T')[0];
        const endDateR = endPostulation.split('T')[0];
        
        return startDateR, endDateR
    };

    return (
        <div className="cm-task-container">
            {/* Load file button starts */}
            <button className="top-right-button">Cargar datos</button>
            {/* Load file button ends */}

            {/* Ventana emergente */}
            <Popup
                show={isOpen}
                onClose={() => handleClose()}
            >
                {message}
            </Popup>

            <VerticalNavbar />
            <div className="cm-content">
                {/* Title begins */}
                <div className="cm-title-container">
                    <h2 className="cm-title">Crear monitoria</h2>
                </div>
                {/* Title ends */}

                <form className="cm-grid-container">

                    {/* Facultad */}
                    <label>Facultad</label>
                    <select className="cm-faculty"
                            id="faculty-dropdown" 
                            value={selectedFaculty} 
                            onChange={handleFacultyChange}>
                        <option value=""> Seleccionar </option>
                        {faculties.map(faculty => (
                            <option key={faculty.name} value={faculty.name}>
                                {faculty.name}
                            </option>
                        ))}
                    </select>

                    {/* Programa */}
                    <label>Programa</label>
                    <select className="cm-program"
                            id="program-dropdown" 
                            value={selectedProgram} 
                            onChange={handleProgramChange}>
                        <option value=""> Seleccionar </option>
                        {programs.map(program => (
                            <option key={program.name} value={program.name}>
                                {program.name}
                            </option>
                        ))}
                    </select>

                    {/* Materia/Curso */}
                    <label>Curso</label>
                    <select className="cm-program"
                            id="subject-dropdown" 
                            value={selectedSubject} 
                            onChange={handleSubjectChange}>
                        <option value=""> Seleccionar </option>
                        {subject.map(subject => (
                            <option key={subject.name} value={subject.name}>
                                {subject.name}
                            </option>
                        ))}
                    </select>

                    {/* Periodo académico */}
                    <label>Periodo académico</label>
                    <select value={selectedSemester} onChange={handleSemesterChange}>
                    <option value=""> Seleccionar </option>
                        <option key='2024-1' value='2024-1'>
                            2024-1
                        </option>
                        <option key='2024-2' value='2024-2'>
                                2024-2
                        </option>
                    </select>


                    {/* Inicio de convocatoria en dos columnas */}
                    <label>Inicio de convocatoria</label>
                    <input type="date" className="cm-input-date" value={selectedStartDate} onChange={handleStartDateChange}/>

                    {/* Fin de convocatoria */}
                    <label>Fin de convocatoria</label>
                    <input type="date" className="cm-input-date" value={selectedFinishDate} onChange={handleFinishDateChange} />


                    {/* Requisitos */}
                    {/*
                    <label>Promedio acumulado:</label>
                    <input type="text" placeholder="4.5" className="cm-input-text-box"/>
                    <label>Promedio materia:</label>
                    <input type="text" placeholder="4.5" className="cm-input-text-box"/> */}

                    {/* Añadir nuevo requisito */}  
                   {/*  <label></label>
                    <Link to="#"></Link>

                    <label></label>
                    <Link to="#">¿Añadir nuevo requisito?</Link> */}
                    
                    {/* Botón de confirmación */}
                    <button 
                        type="button" 
                        className="cm-confirm-button" 
                        onClick={handleCreate}>
                        Confirmar
                    </button>
                </form>

            {/* Table starts */}

            <div className="main-container">
                <div className='table-main-container'>
                    <table className="table" id="table">
                        <thead>
                            <tr>
                                <th className="table-head"> Facultad </th>
                                <th className="table-head"> Programa </th>
                                <th className="table-head"> Materia/Curso </th>
                                <th className="table-head"> Periodo académico </th>
                                <th className="table-head"> Inicio de convocatoria</th>
                                <th className="table-head"> Fin de convocatoria</th>
                                <th className="table-head"> </th>
                            </tr>
                        </thead>
                        <tbody>
                                {processedRecords.map((record, i) => {
                                    
                                    return (
                                        <tr key={i}>
                                            <td className="table-data">{record.school.name}</td>
                                            <td className="table-data">{record.program.name}</td>
                                            <td className="table-data">{record.course.name}</td>
                                            <td className="table-data">{record.semester}</td>
                                            <td className="table-data">{record.startFormatted}</td>
                                            <td className="table-data">{record.endFormatted}</td>
                                            <td className="table-data">
                                                <div className="requirement-container">
                                                    <button className="edit-button">Editar</button>
                                                    <button className="cancel-button">Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                
                    </tbody>
                    </table>
                </div>

            <div className="div-pagination">
                <div className="pagination-info">
                    Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, records.length)} de {records.length} resultados
                </div>

                <div className="main-pagination">
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => setCurrentPage(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
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

export default CreateMonitoria;


