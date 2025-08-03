import { useEffect, useState } from "react"
import { casosConsulta, rolUser } from "../api/api"
import { useNavigate, Link, useParams } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"

export function CasosLista() {
   
    
    const params = useParams()
    const {usuariog, setUsuariog} = useContext(UserContext)
    const navigate = useNavigate()

    const[casos, setCasos] = useState([])
    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        //cargar los casos de BD
        async function cargarCasos() {
            //si existen parametros en la url, significa que se ejecuto una busqueda con la barra de busqueda
            //por lo tanto se procede a filtrar caso:
            if (params.busqueda) {
                //LOGICA PARA LA BUSQUEDA FILTRADA:
                const busqueda = decodeURIComponent(params.busqueda)
                const res = await casosConsulta()
                const resData = res.data
                // Filtrar coincidencias
                const resultados = resData.filter(caso => {
                    // Ajusta la condición de coincidencia según tus datos
                    return caso.nombre_caso.toLowerCase().includes(busqueda.toLowerCase()) || 
                    caso.id_user.nombre1.toLowerCase().includes(busqueda.toLowerCase()) ||
                    caso.id_user.apellido1.toLowerCase().includes(busqueda.toLowerCase())||
                    caso.id_client.nombre1_client.toLowerCase().includes(busqueda.toLowerCase()) ||
                    caso.id_client.apellido1_client.toLowerCase().includes(busqueda.toLowerCase())
                });
                setCasos(resultados);
            }else{
            //SI NO SE CARGAN TODOS LOS CASOS, comportamiento DEFAULT    
                const res = await casosConsulta()
                setCasos(res.data)
            }  
        }
        cargarCasos()
        llenarUsuariog()
    },[params])
    //para mostrar en la tarjeta de los casos que el campo listo sea "si" o "no":
    function casoListo(listo) {
        let text =""
        if (listo == false) {
            text = "No"
        }else{
            text= "Si"
        }
        return text
    }
  
    return(    
        <div className="d-flex flex-column gap-4">
            {/*Si el rol del usuario no es ADMIN no muestra el boton de NUEVO CASO*/}
            {usuariog.rol == "admin" && (
                    <div className="container">
                        <Link to="/form5" className="btn btn-primary" style={{borderRadius:"50%", paddingTop:"10px", width:"50px", height:"50px"}}><h5>+</h5></Link>
                    </div>
                )
            }
            {/* params.busqueda && (<></>)*/}
            {casos.map(caso=>(
                <div className="container border border-dark border-2 rounded p-0" key={caso.id_caso} style={{backgroundColor:"#e0e0e0", cursor:"pointer"}} onClick={()=>{
                    navigate(`/form5/${caso.id_caso}`)
                }}>
                    <h3 className="container bg-dark text-light p-1" style={{ whiteSpace: "pre" }}> {caso.nombre_caso}</h3>
                    <div className="container"> 
                        <p><strong>Descripcion:</strong> {caso.descripcion_caso}</p>
                        <p style={{ whiteSpace: "pre" }}><strong>Usuario a cargo:</strong> {caso.id_user.nombre1} {caso.id_user.apellido1}          <strong>Cliente:</strong> {caso.id_client.nombre1_client} {caso.id_client.apellido1_client} ({caso.id_client.id_cat.nombre_cat})          Listo: {casoListo(caso.listo)}</p>
                    </div>
                </div>
            ))}
        </div>   
    )
}