import { useEffect, useState } from "react"
import { borrarUsuario, todosUsuarios, rolUser } from "../api/api"
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function UserLista() {
    const {usuariog, setUsuariog} = useContext(UserContext)// para el rol del user
    const navigate = useNavigate()
    const params = useParams()
    const [usuarios, setUsuarios] = useState([]) //guardar la info del user
    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        //consultar usuarios
        async function cargarUsers() {
            if (params.busqueda) {
                //LOGICA PARA LA BUSQUEDA FILTRADA:
                const busqueda = decodeURIComponent(params.busqueda)
                const res = await todosUsuarios()
                const resData = res.data
                // Filtrar coincidencias
                const resultados = resData.filter(usuario => {
                // Ajusta la condición de coincidencia según tus datos                
                return usuario.nombre1.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.nombre2.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.apellido1.toLowerCase().includes(busqueda.toLowerCase())||
                usuario.apellido2.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.rol.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.user.toLowerCase().includes(busqueda.toLowerCase()) ||
                String(usuario.cedula).includes(busqueda);
                });
                setUsuarios(resultados);
            } else {
                const res = await todosUsuarios()
                setUsuarios(res.data)
            }
        }
        //ejecucion de las funciones:
        llenarUsuariog()
        cargarUsers()
    },[params])
    //Funcion del boton eliminar:
    async function eliminarUsuario(id_user) {
            const confirmacion = window.confirm("¿Seguro de eliminar?")
            if (!confirmacion) {
                return
            }
            try {
                await borrarUsuario(id_user);
                //ejecuta consulta para actualizar el listado despues de eliminar
                const res = await todosUsuarios();
                setUsuarios(res.data);
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
                alert("Ocurrió un error al intentar eliminar el usuario.");
            }
        }

    return (
        <div>
            {/* Mostrar solo si es ADMIN */}
            {usuariog.rol == "admin" && (
                <div className="d-flex justify-content-start" style={{width:"70%", margin:"0 auto"}}>
                    <Link to="/form2" className="btn btn-primary mb-2">Crear Nuevo</Link>
                </div>
            )}
            <div className="container p-2 bg-light rounded" style={{width:"70%", margin:"0 auto"}}>
                <table className="table table-striped" >
                    <thead>
                        <tr>
                            <th scope="col" >Usuario</th>
                            <th scope="col">Cedula</th>
                            <th scope="col">Primer Nombre</th>
                            <th scope="col">Segundo Nombre</th>
                            <th scope="col">Primer Apellido</th>
                            <th scope="col">Segundo Apellido</th>
                            <th scope="col">Rol</th>
                            {/*Mostrar solo si es ADMIN, Espacios para que encaje con los botones de eliminar y actualizar*/}
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
                        {usuarios.map(usuario =>(
                            <tr key={usuario.id_user}>
                                <td>{usuario.user}</td>
                                <td>{usuario.cedula}</td>
                                <td>{usuario.nombre1}</td>
                                <td>{usuario.nombre2}</td>
                                <td>{usuario.apellido1}</td>
                                <td>{usuario.apellido2}</td>
                                <td>{usuario.rol}</td>
                                {/*Mostrar solo si es ADMIN, botones eliminar y actulizar*/}
                                {usuariog.rol == "admin" && (
                                        <>
                                            <td style={{cursor:"pointer"}} onClick={()=>{navigate(`/form2/${usuario.id_user}`)}}><img src="/lapiz.png"/></td>
                                            <td style={{cursor:"pointer"}} onClick={()=>{eliminarUsuario(usuario.id_user)}}><img src="/basura.png"/></td>
                                        </>
                                    )   
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}