import React, { createContext, useState } from 'react';
// Crear el contexto
export const UserContext = createContext();

// Crear un proveedor
export const UserProvider = ({ children }) => {
    const [usuariog, setUsuariog] = useState([]); // Estado global para el usuario
   // const [busquedas, setBusquedas] = useState(null); // Estado global para el rol

    return (
        <UserContext.Provider value={{ usuariog, setUsuariog}}>
            {children} {/* Renderiza todos los componentes hijos */}
        </UserContext.Provider>
    );
};