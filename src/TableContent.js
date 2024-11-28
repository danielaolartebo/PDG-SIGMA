import './App.css';
import { useState, useEffect } from 'react';
import React from 'react';
import Popup from './PopUp';
import { useMemo } from 'react';
import PopupCheck from './PopUpCheck';
import Alert from './Alert';

function TableContent() {
    const [column, setColumn] = useState([]);
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setOpen] = useState(false)
    const [isOpenCheck, setOpenCheck] = useState(false)
    const [message, setMessage] = useState("")
    const [idMonitoring, setIdMonitoring] = useState("")
    const [state, setState] = useState("")
    const [alertVisible, setAlertVisible] = useState(false);
    const recordsPerPage = 6;

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
        if(localStorage.getItem('role') === 'student'){
            setAlertVisible(!alertVisible)
        }
        fetch('http://localhost:5433/monitoring/getA')
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
    }, []);

    const handlePopUpCheck = (id,status) =>{
        if(localStorage.getItem('role') !=='student'){
            setMessage('Tiene que iniciar sesión como estudiante')
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
                const response = await fetch('http://localhost:5433/candidature/create', {
                    method: 'POST',
                    headers: {
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

    const closeAlert = () => {
        setAlertVisible(!alertVisible);
    };

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
             <Popup
                show={isOpen}
                onClose={() => handleClose()}
            >
                {message}
            </Popup>
            <PopupCheck
                show={isOpenCheck}
                onClose={() => handleCloseCheck()}
                onApply={() => handleApplyClick()}
            />
             <Alert
                show={alertVisible}
                onClose={closeAlert}
             />
            <div className='table-main-container'>
                <table className="table" id="table">
                    <thead>
                        <tr>
                            {column.map((c, i) => (
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


