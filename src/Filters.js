import React, { useState, useEffect } from 'react';
import { MyContext } from './MyContext';
import { useContext } from 'react';

function Dropdown() {
    const [faculties, setFaculties] = useState([]); // State for Faculty options
    const [programs, setPrograms] = useState([]); // State for Program options
    const [subject, setSubject] = useState([]); // State for Subject options
    const [state, setState] = useState([]); // State for State options

    const [selectedFaculty, setSelectedFaculty] = useState(""); // Selected Faculty
    const [selectedProgram, setSelectedProgram] = useState(""); // Selected Program
    const [selectedSubject, setSelectedSubject] = useState(""); // Selected Subject
    const [selectedState, setSelectedState] = useState(""); // Selected State
    const { selectedValue, setSelectedValue, selectedCondition, setSelectedCondition, selectedRequest, setSelectedRequest } = useContext(MyContext)

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
    }, []);

    // Fetch Program options
    useEffect(() => {
        const prog = {
            name:selectedFaculty
        }
        fetch('http://localhost:5433/program/getProgramsSchool',{
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
                    setPrograms(data);
                    setSubject([])
                } else {
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
                    console.error("Program data format is incorrect.");
                }
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, [selectedProgram]);

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
        setSelectedValue(event.target.value);
        setSelectedCondition(selectedState);
        setSelectedRequest('faculty')
    };

    // Handle change for Program dropdown
    const handleProgramChange = (event) => {
        setSelectedProgram(event.target.value);
        setSelectedValue(event.target.value);
        setSelectedCondition(selectedState);
        setSelectedRequest('program')
    };

     // Handle change for Subject dropdown
     const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
        setSelectedValue(event.target.value);
        setSelectedCondition(selectedState);
        setSelectedRequest('course')
    };

    // Handle change for State dropdown
     const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setSelectedCondition(event.target.value);
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
                        <option key={faculty.name} value={faculty.name}>
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
                        <option key={program.name} value={program.name}>
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
                        <option key={subject.name} value={subject.name}>
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
                        <option key={state.name} value={state.name}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Dropdown;