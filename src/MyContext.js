import React, { createContext, useState } from 'react';

// Crear el contexto
export const MyContext = createContext();

// Crear un proveedor para envolver los componentes
export const MyProvider = ({ children }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(""); // Selected Faculty
  const [selectedProgram, setSelectedProgram] = useState(""); // Selected Program
  const [selectedSubject, setSelectedSubject] = useState(""); // Selected Subject
  const [selectedState, setSelectedState] = useState(""); // Selected State

  return (
    <MyContext.Provider value={{ selectedValue, setSelectedValue, selectedCondition, setSelectedCondition, selectedRequest, setSelectedRequest,selectedFaculty, setSelectedFaculty, selectedProgram, setSelectedProgram,selectedSubject, setSelectedSubject, selectedState, setSelectedState  }}>
      {children}
    </MyContext.Provider>
  );
};
