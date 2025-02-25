import './App.css';
import { useState, useEffect } from 'react';
import React from 'react';
import './TableContent.css'

function TableContent() {
    const [column, setColumn] = useState([]);
    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;

    const columnNames = {
        id: "Identificador",
        period: "Periodo",
        name: "Curso",
        startPostulation: "Inicio de Convocatoria",
        endPostulation: "Fin de Convocatoria",
        requirement: "Requisitos"
    };

    useEffect(() => {
        fetch('http://localhost:3000/Data.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.monitoria && data.monitoria.length > 0) {
                    setColumn(Object.keys(data.monitoria[0]));
                    setRecords(data.monitoria); 
                } else {
                    console.error("Data format is incorrect or 'monitoria' is empty.");
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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
        const startDate = new Date(startPostulation.split('/').reverse().join('-'));
        const endDate = new Date(endPostulation.split('/').reverse().join('-'));
    
        if (currentDate >= startDate && currentDate <= endDate) {
            return { className: "status-active", text: "Activo" };
        } else {
            return { className: "status-inactive", text: "Vencido" };
        }
    };

    return (
        <div className="main-container">
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
                        {currentRecords.map((record, i) => {
                            const status = checkStatus(record.startPostulation, record.endPostulation);
                            return (
                                <tr key={i}>
                                    <td className="table-data">{record.id}</td>
                                    <td className="table-data">{record.period}</td>
                                    <td className="table-data">{record.name}</td>
                                    <td className="table-data">{record.startPostulation}</td>
                                    <td className="table-data">{record.endPostulation}</td>
                                    <td className="table-data">
                                        <div className="requirement-container">
                                            <button className="view-button">Ver</button>
                                            <span className="requirement-text">
                                                {record.requirement.split('\n').map((line, index) => (
                                                    <span key={index}>{line}<br /></span>
                                                ))}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="table-data">
                                        <div className={status.className}>
                                            {status.text}
                                        </div>
                                    </td>
                                    <td className="table-data">
                                        <div className="apply-button">Aplicar</div>
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


