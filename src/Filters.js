import React, { useState, useEffect } from 'react';

function Dropdown() {
    const [faculties, setFaculties] = useState([]); // State for Faculty options
    const [programs, setPrograms] = useState([]); // State for Program options
    const [subject, setSubject] = useState([]); // State for Subject options
    const [state, setState] = useState([]); // State for State options

    const [selectedFaculty, setSelectedFaculty] = useState(""); // Selected Faculty
    const [selectedProgram, setSelectedProgram] = useState(""); // Selected Program
    const [selectedSubject, setSelectedSubject] = useState(""); // Selected Subject
    const [selectedState, setSelectedState] = useState(""); // Selected State

    // Fetch Faculty options
    useEffect(() => {
        fetch('http://localhost:3000/Faculty.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.faculty) {
                    setFaculties(data.faculty);
                } else {
                    console.error("Faculty data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching faculty data:', error));
    }, []);

    // Fetch Program options
    useEffect(() => {
        fetch('http://localhost:3000/Program.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.program) {
                    setPrograms(data.program);
                } else {
                    console.error("Program data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, []);

    // Fetch Subject options
    useEffect(() => {
        fetch('http://localhost:3000/Subject.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.subject) {
                    setSubject(data.subject);
                } else {
                    console.error("Program data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, []);

    // Fetch State options
    useEffect(() => {
        fetch('http://localhost:3000/State.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.state) {
                    setState(data.state);
                } else {
                    console.error("Program data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, []);


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

    // Handle change for State dropdown
     const handleStateChange = (event) => {
        setSelectedState(event.target.value);
    };


    return (
        <div className="filter">
            <div className="filter-container">
                {/* Faculty Dropdown */}
                <select className="faculty"
                    id="faculty-dropdown" 
                    value={selectedFaculty} 
                    onChange={handleFacultyChange}
                >
                    <option value=""> Facultad </option>
                    {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>
                            {faculty.name}
                        </option>
                    ))}
                </select>

                {/* Program Dropdown */}
                <select className="program"
                    id="program-dropdown" 
                    value={selectedProgram} 
                    onChange={handleProgramChange}
                >
                    <option value=""> Programa </option>
                    {programs.map(program => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>

                {/* Curso Dropdown */}
                <select className="program"
                    id="program-dropdown" 
                    value={selectedSubject} 
                    onChange={handleSubjectChange}
                >
                    <option value=""> Curso </option>
                    {subject.map(subject => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                {/* State Dropdown */}
                <select className="state"
                    id="state-dropdown" 
                    value={selectedState} 
                    onChange={handleStateChange}
                >
                    <option value=""> Estado </option>
                    {state.map(state => (
                        <option key={state.id} value={state.id}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Dropdown;