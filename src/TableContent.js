import './App.css';
import { useState, useEffect } from 'react';
import React from 'react';
import {PopUp} from './PopUp';
import { useMemo } from 'react';
import PopupCheck from './PopUpCheck';
import { MyContext } from './MyContext';
import { useContext } from 'react';
import { BACKEND_URL, getApiUrl } from './config/ApiBackend';

function TableContent() {
    const [column, setColumn] = useState([]);
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setOpen] = useState(false)
    const [isOpenCheck, setOpenCheck] = useState(false)
    const [message, setMessage] = useState("")
    const [idMonitoring, setIdMonitoring] = useState("")
    const [state, setState] = useState("")
    const recordsPerPage = 6;
    
    const context = useContext(MyContext);
    const selectedFaculty = context?.selectedFaculty;
    const selectedProgram = context?.selectedProgram;
    const selectedState = context?.selectedState;
    const selectedSubject = context?.selectedSubject;


    const columnNames = {
        id: "ID - CRN",
        school: "Facultad",
        program: "Programa",
        course: "Curso",
        start: "Inicio de Convocatoria",
        finish: "Fin de Convocatoria",
        averageGrade: "Promedio General",
        courseGrade: "Promedio de la Materia",
        semester: "Semestre",
        requirement: "Requisitos"
    };

    useEffect(() => {
        fetch(`${BACKEND_URL}/monitoring/getA`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    // setColumn(Object.keys(data[0]));
                    const allKeys = Object.keys(data[0]);
                    const desiredKeys = allKeys.filter(key =>
                        key !== "monitoringMonitors" 
                    );
                    
                    setColumn(desiredKeys);
                    setRecords(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    /*useEffect(() => {
        let prog ={

        }

        const safeSelectedValue = selectedValue?.trim() || "";
        const safeSelectedCondition = selectedCondition?.trim() || "";

        if ((!safeSelectedValue && safeSelectedCondition === "") || (safeSelectedValue === "" && safeSelectedCondition === "")) {
            console.log("selectedValue está vacío, no se realizará ninguna solicitud.");
            return; // Evita ejecutar el efecto si selectedValue es inválido
        }
        else if(!selectedValue  || selectedValue.trim() === ""){
            prog={
                programName:" ",
                courseName:selectedCondition
            }

        }else{
            prog={
                programName:selectedValue,
                courseName:selectedCondition
            }
        }
        
        if(selectedRequest === 'faculty' || selectedRequest === ''){
            
            fetch(`${BACKEND_URL}/monitoring/findByFaculty`,{
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
                if (data && data.length > 0) {
                    setColumn(Object.keys(data[0]));
                    setRecords(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        }
        else if(selectedRequest === 'program'){
            fetch(`${BACKEND_URL}/monitoring/findByProgram`,{
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
                if (data && data.length > 0) {
                    setColumn(Object.keys(data[0]));
                    setRecords(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        }else{
            fetch(`${BACKEND_URL}/monitoring/findByCourse`,{
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
                if (data && data.length > 0) {
                    setColumn(Object.keys(data[0]));
                    setRecords(data); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
        }
        
    }, [selectedValue, selectedCondition]);*/

    const checkStatus = (startPostulation, endPostulation) => {
        const currentDate = new Date();
        const [year, month, day] = startPostulation?.split('T')[0].split("-").map(Number);
        const [year2, month2, day2] = endPostulation?.split('T')[0].split("-").map(Number);
        const startDate = new Date(year, month - 1, day);
        const endDate = new Date(year2, month2 - 1, day2);
    
        if (currentDate >= startDate && currentDate <= endDate) {
            return { className: "status-active", text: "Activo" };
        } else if(currentDate > startDate && currentDate> endDate){
            return { className: "status-inactive", text: "Vencido" };
        }else{
            return { className: "status-inactive", text: "Inactivo" };
        }
    };

    //New filter
    const recordsFiltered = useMemo(() => {
    console.log("Values Selected: "+selectedFaculty+", "+selectedProgram+", "+selectedSubject+", "+selectedState)
    const values = records.filter(monitoring => (
        (selectedFaculty === '' || selectedFaculty === monitoring.school.name) && 
        (selectedProgram === '' || selectedProgram === monitoring.program.name) &&
        (selectedSubject === '' || selectedSubject === monitoring.course.name)
    ));

    if (values.length === 0) return records;

    const filtered = values.filter(monitoring =>
        checkStatus(monitoring.start, monitoring.finish).text === selectedState
    );
    return filtered.length > 0 ? filtered : values;
}, [records, selectedFaculty, selectedProgram, selectedSubject, selectedState]);


    const handlePopUpCheck = (id,status) =>{
        const role = localStorage.getItem('role');
  
        if (role !== 'student' && role !== 'monitor') {
            setMessage('Tiene que iniciar sesión como estudiante/monitor')
            setOpen(!isOpen)
        }else{
            setIdMonitoring(id)
            setState(status)
            setOpenCheck(!isOpenCheck)
        }
        
    }

    const handleApplyClick = async () => {
        setOpenCheck(!isOpenCheck);
        console.log(localStorage.getItem('userId'))
        const data = {
            monitoringId:idMonitoring,
            userId:localStorage.getItem('userId')
        }
        try{
            if(state === "Activo"){
                const response = await fetch(`${BACKEND_URL}/monitor/create`, {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                  });
                  const mess = await response.text()
                if(response.ok){
                    setMessage(mess)
                    setOpen(!isOpen)
                }
                else{
                    setMessage(mess)
                    setOpen(!isOpen)
                }  
            }
            else if(state === "Vencido"){
                setMessage('El tiempo ha expirado')
                setOpen(!isOpen)
            }
            else{
                setMessage('La fecha está inactiva')
                setOpen(!isOpen)
            }
            setOpen(!isOpen)
        }
        catch(error){
            console.error('Error in fetching', error)
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = recordsFiltered.slice(indexOfFirstRecord, indexOfLastRecord);

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

    const handleClose = () =>{
        setOpen(!isOpen);
    }

    const handleCloseCheck = () =>{
        setOpenCheck(!isOpenCheck);
    }

    return (
        <div className="main-container">
             <PopUp
                show={isOpen}
                onClose={() => handleClose()}
            >
                {message}
            </PopUp>
            <PopupCheck
                show={isOpenCheck}
                onClose={() => handleCloseCheck()}
                onApply={() => handleApplyClick()}
            />
            
            <div className='table-main-container'>
                <table className="table" id="table">
                    <thead>
                        <tr>
                        {column
                            .filter(c => c !== "professor")
                            .map((c, i) => (
                                <th className="table-head" key={i}>
                                {columnNames[c] || c}
                                </th>
                            ))}
                            <th className="table-head"> Estado </th>
                            <th className="table-head"> ¿Interesad@? </th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedRecords.map((record, i) => {
                            const status = checkStatus(record.start, record.finish);
                            return (
                                <tr key={i}>
                                    <td className="table-data">{record.id}</td>
                                    <td className="table-data">{record.school.name}</td>
                                    <td className="table-data">{record.program.name}</td>
                                    <td className="table-data">{record.course.name}</td>
                                    <td className="table-data">{record.startFormatted}</td>
                                    <td className="table-data">{record.endFormatted}</td>
                                    <td className="table-data">{record.averageGrade}</td>
                                    <td className="table-data">{record.courseGrade}</td>
                                    <td className="table-data">{record.semester}</td>
                        
                                    <td className="table-data">
                                        <div className={status.className}>
                                            {status.text}
                                        </div>
                                    </td>
                                    <td className="table-data">
                                        <div className="apply-button" onClick={() => handlePopUpCheck(record.id, status.text)}>Aplicar</div>
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
    );
}

export default TableContent;




