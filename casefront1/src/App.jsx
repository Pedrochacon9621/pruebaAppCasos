import{Navegacion} from './componentes/Navegacion'
import { Form1 } from "./componentes/Form1";
import { Form2 } from './componentes/Form2';
import { FormClient } from './componentes/FormClient';  
import { FormCat } from './componentes/FormCat';
import { FormCasos } from './componentes/FormCasos';
import { CasosLista } from './componentes/CasosLista';
import { UserLista } from './componentes/UserLista';
import { CategoriasLista } from './componentes/CategoriasLista';
import { ClientesLista } from './componentes/ClientesLista';
import { UserProvider } from './componentes/context/UserContext';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'

function App() {
  return (
    <div className="bg-secondary pb-4" style={{ minHeight: "100vh" }}>
       <UserProvider>
        <BrowserRouter>
          {/* Renderizar la navegación solo si la ruta no es "/form1" */}
          {location.pathname !== "/form1" && location.pathname !== "/" && <Navegacion />}
          <Routes>
            <Route path='/' element={<Navigate to={"/form1"}/>}/>
            <Route path='/form1' element={<Form1/>}/>
            <Route path='/form2' element={<Form2/>}/>
            <Route path='/form2/:id_user' element={<Form2/>}/>
            <Route path='/form3' element={<FormClient/>}/>
            <Route path='/form3/:id_client' element={<FormClient/>}/>
            <Route path='/form4' element={<FormCat/>}/>
            <Route path='/form4/:id_cat' element={<FormCat/>}/>
            <Route path='/form5' element={<FormCasos/>}/>
            <Route path='/form5/:id_caso' element={<FormCasos/>}/>
            <Route path='/casos' element={<CasosLista/>}/>
            <Route path='/casos/:busqueda' element={<CasosLista/>}/>
            <Route path='/usuarios' element={<UserLista/>}/>
            <Route path='/usuarios/:busqueda' element={<UserLista/>}/>
            <Route path='/categorias' element={<CategoriasLista/>}/>
            <Route path='/categorias/:busqueda' element={<CategoriasLista/>}/>
            <Route path='/clientes' element={<ClientesLista/>}/> 
            <Route path='/clientes/:busqueda' element={<ClientesLista/>}/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  )
}
export default App
