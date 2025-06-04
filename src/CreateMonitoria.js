import React, { useState, useEffect } from 'react';
import './CreateMonitoria.css'; 
// import './Task.css';
import { Link } from 'react-router-dom';
import VerticalNavbar from './VerticalNavbar';
import {PopUp} from "./PopUp";
import { useNavigate } from "react-router-dom";
import { useMemo } from 'react';
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

function CreateMonitoria() {

    const [column, setColumn] = useState([]);
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
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
    const [file, setFile] = useState(null); //File


    // Fetch Faculty options
    useEffect(() => {
        const idProfessor = localStorage.getItem('userId');
        console.log(idProfessor);
        fetch(`${BACKEND_URL}/school/getSchools`)
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

            fetch(`${BACKEND_URL}/monitoring/getAllByProfessor/${idProfessor}`)
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

            const message = (
                    <>
                        <p><strong>Si vas a cargar múltiples monitorias en "Cargar Datos",asegúrate de que el archivo Excel cumpla con el siguiente formato:</strong></p>
                        <ul>
                            <li>El archivo debe estar en formato <strong>.xlsx</strong>.</li>
                            <li>Cada fila representa una monitoría diferente.</li>
                            <li>No dejes columnas vacías si son obligatorias.</li>
                            <li>Revisa que las fechas estén en el formato correcto (por ejemplo, <em>dd/mm/aaaa</em>).</li>
                        </ul>
                        <p><strong>Debes incluir los siguientes campos obligatorios por fila:</strong></p>
                        <ul>
                            <li>Nombre de la monitoría</li>
                            <li>Fecha de inicio de postulación</li>
                            <li>Fecha de cierre de postulación</li>
                        </ul>
                        <p>
                            Puedes descargar un ejemplo del formato correcto haciendo clic aquí:&nbsp;
                            <a
                                href="https://github.com/danielaolartebo/PDG-SIGMA/tree/draft/doc/Formatos"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ejemplo Formato
                            </a>
                        </p>
                    </>
                );
                
        setMessage(message)
        setIsOpen(!isOpen)
    }, []);

    useEffect(() => {
        const idProfessor = localStorage.getItem('userId');
            fetch(`${BACKEND_URL}/monitoring/getAllByProfessor/${idProfessor}`)
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

        fetch(`${BACKEND_URL}/program/getProgramsSchool`,{
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
        fetch(`${BACKEND_URL}/course/getCoursesProgram`,{
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


    const handleUpload = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx, .xls";
    
        input.onchange = async (event) => {
          const file = event.target.files[0];
    
          if (!file) {
            // alert("No se seleccionó ningún archivo.");
            setMessage("No se seleccionó ningún archivo.")
            setIsOpen(!isOpen)
            
            return;
          }
    
          const formData = new FormData();
          formData.append("file", file);

          const idProfessor = localStorage.getItem('userId')
    
          try {
            const response = await fetch(`${BACKEND_URL}/monitoring/createAll/${idProfessor}`, {
              method: "POST",
                headers: {
                    'Authorization':localStorage.getItem('token')
                },
              body: formData,
              
            });
            
            const message = await response.text();
            // alert(message);
            setMessage(message)
            setIsOpen(!isOpen)

          } catch (error) {
            console.error("Error:", error);
            // alert("Error al conectar con el servidor");
            setMessage("Error al conectar con el servidor")
            setIsOpen(!isOpen)
            
          }
        };
    
        input.click(); // Simula el clic para abrir el explorador de archivos
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
            const response = await fetch(`${BACKEND_URL}/monitoring/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                    'Authorization':localStorage.getItem('token')
              },
              body: JSON.stringify(data),
            });
        
            // Leer el mensaje del backend
            const messageR = await response.text();
        
            if (response.ok) {
                setMessage("Estado: " + messageR)
                setIsOpen(!isOpen)
                
            } else {
                setMessage(messageR)
                console.error("Error: " + messageR)
                setIsOpen(!isOpen)
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            // alert("Ocurrió un error inesperado. Por favor, inténtalo nuevamente.");
            setMessage("Ocurrió un error inesperado. Por favor, inténtalo nuevamente.")
            setIsOpen(!isOpen)
          }
    };

    const handleDelete = async(id) => {
        try {
            //Delete logic in here
            const responseDelete = await fetch(`${BACKEND_URL}/monitoring/deleteMonitoring/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                    'Authorization':localStorage.getItem('token')
              }
            });
            const answer = await responseDelete.json();
            if (answer) {
                // Estado ok
                // setMessage("Estado: " + messageR)
                setMessage("Se ha eliminado la monitoría")
                
                
            } else {
                // console.error("Error: " + messageR)
                // setMessage(error: messageR)
                setMessage("La monitoria no pudo ser eliminada debido a que esta asociada a monitores o postulantes a monitoria. Asegurate de revisar el proceso postulación")
            }
            setIsOpen(!isOpen)
        } catch (error) {
            console.error("Error deleting data:", error);
            setMessage("Error en el servidor: No ha sido posible eliminar la monitoría")
            setIsOpen(!isOpen)
        }
    };

    const handleClose = () =>{
        setIsOpen(false)
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
            <button className="top-right-button" onClick={handleUpload}>Cargar datos</button>
            {/* Load file button ends */}

            {/* Ventana emergente */}
            <PopUp
                show={isOpen}
                onClose={() => handleClose()}
            >
                {message}
            </PopUp>

            <VerticalNavbar />
            <div className="cm-content">
                {/* Title begins */}
                <div className="cm-title-container">
                    <h2 className="cm-title">Crear monitoria</h2>
                </div>
                {/* Title ends */}

                <form className="cm-grid-container">

                    {/* Facultad */}
                    <label>Nombre de facultad</label>
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
                    <label>Nombre de programa</label>
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
                    <label>Curso académico</label>
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
                                                    {/* <button className="edit-button">Editar</button> */}
                                                    <button className="cancel-button" onClick={() =>handleDelete(record.id)}>Eliminar</button>
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