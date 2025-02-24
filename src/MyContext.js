import React, { createContext, useState } from 'react';

// Crear el contexto
export const MyContext = createContext();

// Crear un proveedor para envolver los componentes
export const MyProvider = ({ children }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");

  return (
    <MyContext.Provider value={{ selectedValue, setSelectedValue, selectedCondition, setSelectedCondition, selectedRequest, setSelectedRequest }}>
      {children}
    </MyContext.Provider>
  );
};
