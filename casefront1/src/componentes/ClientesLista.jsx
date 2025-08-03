import { useEffect, useState } from "react"
import { borrarCliente, todosClientes, rolUser } from "../api/api"
import { useNavigate, Link, useParams } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function ClientesLista() {
    const {usuariog, setUsuariog} = useContext(UserContext)
    const params = useParams()
    const navigate = useNavigate()
    const [clientes, setClientes] = useState([])
    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        async function cargarClientes() {
            if (params.busqueda) {
                //LOGICA PARA LA BUSQUEDA FILTRADA:
                const busqueda = decodeURIComponent(params.busqueda)
                const res = await todosClientes()
                const resData = res.data
                // Filtrar coincidencias
                const resultados = resData.filter(cliente => {
                // Ajusta la condición de coincidencia según tus datos
                
                return cliente.nombre1_client.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.nombre2_client.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.apellido1_client.toLowerCase().includes(busqueda.toLowerCase())||
                cliente.apellido2_client.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.id_cat.nombre_cat.toLowerCase().includes(busqueda.toLowerCase())||
                String(cliente.cedula_client).includes(busqueda);
                });
                setClientes(resultados);
            }else{
                //SI NO SE CARGAN TODOS LOS CASOS, comportamiento DEFAULT
                const res = await todosClientes()
                setClientes(res.data)
                console.log(res.data);
                
            } 
        }
        llenarUsuariog()
        cargarClientes()
    },[params])

    async function eliminarCliente(id_client) {
        const confirmacion = window.confirm("¿Seguro de eliminar?")
        if (!confirmacion) {
            return
        }
        
        try {
            await borrarCliente(id_client);
            console.log(`Cliente con ID ${id_client} eliminado exitosamente.`);
            // Llamar a la función cargarClientes para actualizar la lista
            const res = await todosClientes();
            setClientes(res.data);
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            alert("Ocurrió un error al intentar eliminar el cliente.");
        }
    }
    return(
        <div>
            {/*Mostrar solo si es ADMIN*/}
            {usuariog.rol == "admin" && (
                <div className="d-flex justify-content-start" style={{width:"70%", margin:"0 auto"}}>
                    <Link to="/form3" className="btn btn-primary mb-2" >Crear Nuevo</Link>
                </div>
            )}
            
            <div className="container p-2 bg-light rounded" style={{width:"70%", margin:"0 auto"}}>
                <table className="table table-striped" >
                    <thead>
                        <tr>
                            <th scope="col">Cedula</th>
                            <th scope="col">Primer Nombre</th>
                            <th scope="col">Segundo Nombre</th>
                            <th scope="col">Primer Apellido</th>
                            <th scope="col">Segundo Apellido</th>
                            <th scope="col">Categoria</th>
                            {/*Mostrar solo si es ADMIN*/}
                            {usuariog.rol == "admin" && (
                                    <>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                    </>    
                                )      
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente =>(
                            <tr key={cliente.id_client} >
                                <td>{cliente.cedula_client}</td>
                                <td>{cliente.nombre1_client}</td>
                                <td>{cliente.nombre2_client}</td>
                                <td>{cliente.apellido1_client}</td>
                                <td>{cliente.apellido2_client}</td>
                                <td>{cliente.id_cat.nombre_cat}</td>
                                {usuariog.rol == "admin" && (
                                    <>
                                        <td style={{cursor:"pointer"}} onClick={()=>{navigate(`/form3/${cliente.id_client}`)}}><img src="/lapiz.png"/></td> 
                                        <td style={{cursor:"pointer"}} onClick={()=>{eliminarCliente(cliente.id_client)}}><img src="/basura.png"/></td>
                                    </>
                                )}     
                            </tr>
                        ))}    
                    </tbody>
                </table>
            </div>
        </div>  
    )
}