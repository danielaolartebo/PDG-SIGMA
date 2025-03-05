import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from './MyContext';

function Dropdown() {
    const [faculties, setFaculties] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [states, setStates] = useState([]);

    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedState, setSelectedState] = useState("");

    // Obtener el contexto y verificar que esté definido
    const context = useContext(MyContext);
    const setSelectedValue = context?.setSelectedValue;
    const setSelectedCondition = context?.setSelectedCondition;
    const setSelectedRequest = context?.setSelectedRequest;

    // Fetch Faculty options
    useEffect(() => {
        fetch('http://localhost:5433/school/getSchools')
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
            .then(data => setFaculties(data || []))
            .catch(error => console.error('Error fetching faculty data:', error));
    }, []);

    // Fetch Program options based on selected faculty
    useEffect(() => {
        if (!selectedFaculty) {
            setPrograms([]);
            return;
        }
        fetch('http://localhost:5433/program/getProgramsSchool', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedFaculty }),
        })
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
            .then(data => {
                setPrograms(data || []);
                setSubjects([]); // Reset subjects when faculty changes
            })
            .catch(error => console.error('Error fetching program data:', error));
    }, [selectedFaculty]);

    // Fetch Subject options based on selected program
    useEffect(() => {
        if (!selectedProgram) {
            setSubjects([]);
            return;
        }
        fetch('http://localhost:5433/course/getCoursesProgram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedProgram }),
        })
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
            .then(data => setSubjects(data || []))
            .catch(error => console.error('Error fetching course data:', error));
    }, [selectedProgram]);

    // Fetch State options
    useEffect(() => {
        fetch('http://localhost:3000/State.json')
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
            .then(data => setStates(data.state || []))
            .catch(error => console.error('Error fetching state data:', error));
    }, []);

    // Manejo de cambios con verificación de contexto
    const handleFacultyChange = (event) => {
        const value = event.target.value;
        setSelectedFaculty(value);
        if (setSelectedValue) setSelectedValue(value);
        if (setSelectedCondition) setSelectedCondition(selectedState);
        if (setSelectedRequest) setSelectedRequest('faculty');
    };

    const handleProgramChange = (event) => {
        const value = event.target.value;
        setSelectedProgram(value);
        if (setSelectedValue) setSelectedValue(value);
        if (setSelectedCondition) setSelectedCondition(selectedState);
        if (setSelectedRequest) setSelectedRequest('program');
    };

    const handleSubjectChange = (event) => {
        const value = event.target.value;
        setSelectedSubject(value);
        if (setSelectedValue) setSelectedValue(value);
        if (setSelectedCondition) setSelectedCondition(selectedState);
        if (setSelectedRequest) setSelectedRequest('course');
    };

    const handleStateChange = (event) => {
        const value = event.target.value;
        setSelectedState(value);
        if (setSelectedCondition) setSelectedCondition(value);
    };

    return (
        <div className="filter">
            <div className="filter-container">
                {/* Faculty Dropdown */}
                <select className="faculty" id="faculty-dropdown" value={selectedFaculty} onChange={handleFacultyChange}>
                    <option value="">Facultad</option>
                    {faculties.map(faculty => (
                        <option key={faculty.id || faculty.name} value={faculty.name}>
                            {faculty.name}
                        </option>
                    ))}
                </select>

                {/* Program Dropdown */}
                <select className="program" id="program-dropdown" value={selectedProgram} onChange={handleProgramChange}>
                    <option value="">Programa</option>
                    {programs.map(program => (
                        <option key={program.id || program.name} value={program.name}>
                            {program.name}
                        </option>
                    ))}
                </select>

                {/* Course Dropdown */}
                <select className="course" id="course-dropdown" value={selectedSubject} onChange={handleSubjectChange}>
                    <option value="">Curso</option>
                    {subjects.map(subject => (
                        <option key={subject.id || subject.name} value={subject.name}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                {/* State Dropdown */}
                <select className="state" id="state-dropdown" value={selectedState} onChange={handleStateChange}>
                    <option value="">Estado</option>
                    {states.map(state => (
                        <option key={state.id || state.name} value={state.name}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Dropdown;
