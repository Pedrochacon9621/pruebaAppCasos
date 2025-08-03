import { useEffect, useState } from "react"
import {useForm} from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { actualizarCaso, borrarCaso, casosConsultaId, clientesConsulta, crearCaso, usuariosConsulta, rolUser } from "../api/api"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function FormCasos() {
    //Contexto Globar para manejar el rol de Usuario:
    const {usuariog, setUsuariog} = useContext(UserContext)
    const navigate = useNavigate()
    const params = useParams()
    const {register, handleSubmit, setValue, reset, formState:{errors}} = useForm()

    const [usuarios, setUsuarios] = useState([])
    const [clientes, setClientes] = useState([])

    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        //cagar usuarios para asignar al caso
        async function cargarUser() {
            const resUser = await usuariosConsulta();        
            setUsuarios(resUser.data)
        }
        //cargar clientes para asignar al caso:
        async function cargarClient() {
            const resClient = await clientesConsulta();
            setClientes(resClient.data)            
        }
        // cargar la informacion en los campos del formulario cuando en url hay parametro (actualizar):
        async function cargarCasosId() {
            if (params.id_caso) {
                const res = await casosConsultaId(params.id_caso)
                setValue("nombre_caso", res.data.nombre_caso)
                setValue("descripcion_caso", res.data.descripcion_caso)
                setValue("id_user", res.data.id_user.id_user)
                setValue("id_client", res.data.id_client.id_client)    
                setValue("listo", res.data.listo)
            }else{
                //limiar los campos del formulario:
                reset({
                    nombre_caso: "",
                    descripcion_caso: "",
                    id_user: "",
                    id_client: "",
                });
            }
        }
        //Ejecucion de las funciones:
        llenarUsuariog()
        cargarUser()
        cargarClient()
        cargarCasosId()
    },[params])

    const onSubmit = handleSubmit(async caso =>{
        try {
            // Mostrar confirmación al usuario
            const confirmacion = window.confirm("¿Está seguro de guardar la información?");
            if (!confirmacion) {
                // Si el usuario cancela, no se ejecuta la acción
                console.log("Acción cancelada por el usuario.");
                return;
            }
            // Ejecutar acción según si hay un id_caso, si hay se actualizara, y si no hay se creara:
            if (params.id_caso) {
                await actualizarCaso(params.id_caso, caso);
                console.log("Caso actualizado exitosamente.");
            } else {
                await crearCaso(caso);
                console.log("Caso creado exitosamente.");
            }
            // Navegar a la lista de casos
            navigate("/casos");
        } catch (error) {
            // Mostrar el error capturado en la consola y en un alert
            console.error("Error al realizar la acción:", error);
            alert(`Ocurrió un error: ${error.message || error}`);
        }
    })
    //Funcion del boton de Eliminar caso:
     async function eliminarCaso() {
                const confirmacion = window.confirm("¿Seguro de eliminar?")
                if (!confirmacion) {
                    return
                }
                try {
                    await borrarCaso(params.id_caso);
                    navigate("/casos")
                } catch (error) {
                    console.error("Error al eliminar el caso:", error);
                    alert("Ocurrió un error al intentar eliminar el caso.");
                }
            }

    return(
        <div className="d-flex justify-content-center align-items-center">
            <div className="bg-dark text-light p-5  rounded mt-5" style={{width:"30rem"}}>
                <form onSubmit={onSubmit}>
                    <div class="mb-3">
                        <label for="nombre_caso" class="form-label">Titulo</label>
                        <input type="text" class="form-control shadow " id="nombre_caso" maxLength="40" {...register("nombre_caso",{required:"--campo obligatorio--"})} readOnly={usuariog.rol !== "admin"}></input>
                        {errors.nombre_caso && <p className="text-danger">{errors.nombre_caso.message}</p>}
                        
                    </div>
                    <div class="mb-3">
                        <label for="descripcion_caso" class="form-label">Descripcion del Caso</label>
                        <textarea class="form-control shadow " id="descripcion_caso" maxlength="200" rows="5" style={{resize:"none"}} {...register("descripcion_caso",{required:false})} readOnly={usuariog.rol !== "admin"}></textarea> 
                    </div>
                    <div class="mb-3">
                        <label for="id_user" class="form-label">Usuario a cargo</label>
                        <select class="form-select" id="id_user" {...register("id_user",{required:"--campo obligatorio--"})} disabled={usuariog.rol !== "admin"}>
                            <option value="">--Seleccionar--</option>
                            {usuarios.map(usuario=>(
                                <option key={usuario.id_user} value={usuario.id_user}>{usuario.nombre1} {usuario.apellido1}</option>
                            ))}  
                        </select>
                        {errors.id_user && <p className="text-danger">{errors.id_user.message}</p>}
                    </div>
                    <div class="mb-3">
                        <label for="id_client" class="form-label">Cliente</label>
                        <select class="form-select" id="id_client" {...register("id_client",{required:"--campo obligatorio--"})} disabled={usuariog.rol !== "admin"}>
                            <option value="">--Seleccionar--</option>
                            {clientes.map(cliente=>(
                                <option key={cliente.id_client} value={cliente.id_client}>{cliente.nombre1_client} {cliente.apellido1_client}</option>
                            ))}
                        </select>
                        {errors.id_client && <p className="text-danger">{errors.id_client.message}</p>}
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="listo" {...register("listo", {required:false})}></input>
                        <label class="form-check-label" for="listo">Listo</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                    {/* Renderizar el botón "Eliminar" solo si params.id_caso existe y si el usuario es admin */}
                    {params.id_caso && usuariog.rol === "admin" && (
                        <button type="button" className="btn btn-danger ms-5" onClick={() => eliminarCaso()}>Eliminar</button>
                    )}
                </form>
            </div>
        </div>
    )
}