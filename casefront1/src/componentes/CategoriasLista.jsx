import { useEffect, useState } from "react"
import { borrarCategoria, categoriasConsulta, rolUser } from "../api/api"
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function CategoriasLista() {
    const {usuariog, setUsuariog} = useContext(UserContext)
    const navigate = useNavigate()
    const params = useParams()
    const [categorias, setCategorias] = useState([])
    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }        
        async function cargarCategorias() {
            // SI HAY PARAMS SIGNIFICA QUE SE ESTA BUSCANDO EN LA BARRA DE BUSQUEDA
            if (params.busqueda) {
                //LOGICA PARA LA BUSQUEDA FILTRADA:
                const busqueda = decodeURIComponent(params.busqueda)
                const res = await categoriasConsulta()
                const resData = res.data
                // Filtrar coincidencias
                const resultados = resData.filter(cat => {
                // Ajusta la condición de coincidencia según tus datos                
                return cat.nombre_cat.toLowerCase().includes(busqueda.toLowerCase())
                });
                setCategorias(resultados);                        
            } else {
                const res = await categoriasConsulta()
                setCategorias(res.data)
            } 
        }
        llenarUsuariog()
        cargarCategorias()
    },[params])

    async function eliminarCategoria(id_cat) {
        const confirmacion = window.confirm("¿Seguro de eliminar?")
        if (!confirmacion) {
            return
        }
        try {
            await borrarCategoria(id_cat);
            //ejecuta consulta para actualizar el listado despues de eliminar
            const res = await categoriasConsulta();
            setCategorias(res.data);
        } catch (error) {
            console.error("Error al eliminar categoria:", error);
            alert("Ocurrió un error al intentar eliminar categoria.");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-start" style={{width:"25%", margin:"0 auto"}}>
                <Link to="/form4" className="btn btn-primary mb-2" >Crear Nuevo</Link>
            </div>
            <div className="container p-2 bg-light rounded" style={{width:"25%", margin:"0 auto"}}>
                <table className="table table-striped" >
                    <thead>
                        <tr>
                            <th scope="col" >ID</th>
                            <th scope="col" >Nombre de Categoria</th> 
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
                        {categorias.map(categoria =>(
                            <tr key={categoria.id_cat}>
                                <td>{categoria.id_cat}</td>
                                <td>{categoria.nombre_cat}</td>
                                {usuariog.rol == "admin" && (
                                    <>
                                         <td style={{cursor:"pointer"}} onClick={()=>{navigate(`/form4/${categoria.id_cat}`)}}><img src="/lapiz.png"/></td>
                                         <td style={{cursor:"pointer"}} onClick={()=>{eliminarCategoria(categoria.id_cat)}} ><img src="/basura.png"/></td>
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