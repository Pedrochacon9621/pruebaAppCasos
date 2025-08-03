import { useEffect, useState } from "react"
import {useForm} from "react-hook-form"
import { actualizarCliente, categoriasConsulta, clientesID, crearCliente, rolUser } from "../api/api"
import { useParams, useNavigate } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function FormClient() {
    const {usuariog, setUsuariog} = useContext(UserContext)// Para verificar rol del user
    const {register, handleSubmit, setValue, reset, formState:{errors}} = useForm()
    const params = useParams()
    const navigate = useNavigate()
    const[categorias, setCategorias] = useState([])
    
    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        // cargar las categorias para el select de categoria:
        async function cargarCategorias() {
            const res = await categoriasConsulta()
            setCategorias(res.data)    
        }
        //Funcion para llenar el form si hay parametro en url (Actualizar):
        async function cargarClientesId() {
            if (params.id_client) {
                const res = await clientesID(params.id_client)
                //llenar los campos del form
                setValue("cedula_client", res.data.cedula_client)
                setValue("nombre1_client", res.data.nombre1_client)
                setValue("nombre2_client", res.data.nombre2_client)
                setValue("apellido1_client", res.data.apellido1_client)
                setValue("apellido2_client", res.data.apellido2_client)
                setValue("id_cat", res.data.id_cat)   
            }else{
                //limpiar los campos del form
                reset({
                    cedula_client: "",
                    nombre1_client: "",
                    nombre2_client: "",
                    apellido1_client: "",
                    apellido2_client: "",
                    id_cat: "",
                })
            }
        }
        //ejecutar funciones:
        llenarUsuariog()
        cargarCategorias()
        cargarClientesId()    
    },[params])
    //CONDICION PARA SOLO RENDERIZAR A USERS ADMIN
    if (usuariog.rol !== "admin") {
        return null; // No renderizar el componente si el rol no es admin
    }
    const onSubmit = handleSubmit(async cliente=>{
        try {   
            const confirmacion =  window.confirm("¿Esta seguro de guardar la informacion?")
            if (!confirmacion) {
                // Si el usuario cancela, no se ejecuta la acción
                console.log("Acción cancelada por el usuario.");
                return;
            }
            //si hay parametro en url significa que vamos a actualizar, si no a crear:
            if (params.id_client) {
                await actualizarCliente(id_client, cliente)
            }else{
                await crearCliente(cliente)
            }
            navigate("/clientes")
        } catch (error) {
             // Mostrar el error capturado en la consola y en un alert
             console.error("Error al realizar la acción:", error);
             alert(`Ocurrió un error: ${error.message || error}`);
        }
        
    })

    return(
        <div className="d-flex justify-content-center align-items-center">
            <div className="bg-dark text-light p-5  rounded mt-5" style={{width:"30rem"}}>
                <form onSubmit={onSubmit}>
                    <div class="mb-3">
                        <label for="cedula_client" class="form-label">Cedula</label>
                        <input type="text" class="form-control shadow " id="cedula_client" maxLength="40" {...register("cedula_client",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/\D/g, "")}}></input>
                        {errors.cedula_client && <p className="text-danger">{errors.cedula_client.message}</p>}
                    </div>
                    <div class="mb-3">
                        <label for="nombre1_client" class="form-label">Primer nombre</label>
                        <input type="text" class="form-control shadow " id="nombre1_client" maxLength="40" {...register("nombre1_client",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.nombre1_client && <p className="text-danger">{errors.nombre1_client.message}</p>}
                    </div>
                    <div class="mb-3">
                        <label for="nombre2_client" class="form-label">Segundo nombre</label>
                        <input type="text" class="form-control shadow " id="nombre2_client" maxLength="40" {...register("nombre2_client",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.nombre2_client && <p className="text-danger">{errors.nombre2_client.message}</p>}
                    </div>
                    <div class="mb-3">
                        <label for="apellido1_client" class="form-label">Primer apellido</label>
                        <input type="text" class="form-control shadow " id="apellido1_client" maxLength="40" {...register("apellido1_client",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.apellido1_client && <p className="text-danger">{errors.apellido1_client.message}</p>}
                    </div>
                    <div class="mb-3">
                        <label for="apellido2_client" class="form-label">Segundo apellido</label>
                        <input type="text" class="form-control shadow " id="apellido2_client" maxLength="40" {...register("apellido2_client",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.apellido2_client && <p className="text-danger">{errors.apellido2_client.message}</p>}
                    </div>
                    <div class="mb-3">
                        <label for="id_cat" class="form-label">Categoria del Cliente</label>
                        <select class="form-select" id="id_cat" {...register("id_cat",{required:"--campo obligatorio--"})}>
                            <option value="">--Seleccionar--</option>
                            {categorias.map(categoria=>(
                                <option key={categoria.id_cat} value={categoria.id_cat}>{categoria.nombre_cat}</option>
                            ))}  
                        </select>
                        {errors.id_cat && <p className="text-danger">{errors.id_cat.message}</p>}
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
            </div>
        </div>
    )
}