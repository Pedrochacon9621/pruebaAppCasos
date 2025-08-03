import { useEffect } from "react"
import {useForm} from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom"
import { actualizarUsuario, crearUsuario, usuariosID, rolUser } from "../api/api"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function Form2() {
    //Contexto Global para manejar el ROL del usuario en LA APP:
    const {usuariog, setUsuariog} = useContext(UserContext)
    
    const {register, handleSubmit, setValue, reset, formState:{errors}} = useForm()
    const navigate = useNavigate()
    const params = useParams()
    useEffect(()=>{
        //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
        async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        //llenar los campos del form cuando la url posee parametro (actualizar):
        async function cargarUserId() {
            if (params.id_user) {
                const res = await usuariosID(params.id_user)
                console.log(res);
                setValue("user", res.data.user)
                setValue("clave", res.data.clave)
                setValue("cedula", res.data.cedula)
                setValue("nombre1", res.data.nombre1)
                setValue("nombre2", res.data.nombre2)
                setValue("apellido1", res.data.apellido1)
                setValue("apellido2", res.data.apellido2)
                setValue("rol", res.data.rol)
            }else{
                //cuando no posee parametro la url, se limpian en caso de ser necesario:
                reset({
                    user: "",
                    clave: "",
                    cedula: "",
                    nombre1: "",
                    nombre2: "",
                    apellido1: "",
                    apellido2: "",
                    rol: "user",
                })
            }
        }
        //ejecucion de las funciones:
        llenarUsuariog()
        cargarUserId()
    },[params])
    //CONDICION PARA SOLO RENDERIZAR A USERS ADMIN:
    if (usuariog.rol !== "admin") {
        return null; // No renderizar el componente si el rol no es admin
    }
    const onSubmit = handleSubmit( async usuario =>{
       try {
            const confirmacion =  window.confirm("¿Esta seguro de guardar la informacion?")
            if (!confirmacion) {
                // Si el usuario cancela, no se ejecuta la acción
                return;
            }
            //Si existe parametro en url, se ejecuta actualizar, si no existe parametro se ejecuta Guardar
            if (params.id_user) {
                await actualizarUsuario(params.id_user, usuario)
            }else{
                await crearUsuario(usuario)
            }
            //navega a la lista de Usuarios
            navigate("/usuarios")
       } catch (error) {
             // Mostrar el error capturado en la consola y en un alert
             console.error("Error al realizar la acción:", error);
             alert(`Ocurrió un error: ${error.message || error}`);
       } 
    })

    return(
        <div className="d-flex justify-content-center align-items-center">
            <div className="bg-dark text-light p-5  rounded" style={{width:"30rem"}}>
                <form onSubmit={onSubmit}>
                    <div class="mb-3">
                        <label for="user" class="form-label">Nombre de Usuario</label>
                        <input type="text" class="form-control shadow " id="user" maxLength="40" {...register("user",{required:"--campo obligatorio--"})}></input>
                        {errors.user && <p className="text-danger">{errors.user.message}</p> }
                    </div>

                    <div class="mb-3">
                        <label for="clave" class="form-label">Contraseña</label>
                        <input type="password" class="form-control shadow-lg" id="clave" maxLength="12" {...register("clave", {required:"--campo obligatorio--"})}></input>
                        {errors.clave && <p className="text-danger">{errors.clave.message}</p> }
                    </div>

                    <div class="mb-3">
                        <label for="cedula" class="form-label">Cedula</label>
                        <input type="text" class="form-control shadow " id="cedula" maxLength="40" {...register("cedula",{required:"--campo obligatorio--"})}  onChange={(e) => {e.target.value = e.target.value.replace(/\D/g, "")}}></input>
                        {errors.cedula && <p className="text-danger">{errors.cedula.message}</p> }
                    </div>

                    <div class="mb-3">
                        <label for="nombre1" class="form-label">Primer nombre</label>
                        <input type="text" class="form-control shadow " id="nombre1" maxLength="40" {...register("nombre1",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.nombre1 && <p className="text-danger">{errors.nombre1.message}</p> }
                    </div>

                    <div class="mb-3">
                        <label for="nombre2" class="form-label">Segundo nombre</label>
                        <input type="text" class="form-control shadow " id="nombre2" maxLength="40" {...register("nombre2",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.nombre2 && <p className="text-danger">{errors.nombre2.message}</p> }
                    </div>

                    <div class="mb-3">
                        <label for="apellido1" class="form-label">Primer apellido</label>
                        <input type="text" class="form-control shadow " id="apellido1" maxLength="40" {...register("apellido1",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.apellido1 && <p className="text-danger">{errors.apellido1.message}</p> }
                    </div>
                    
                    <div class="mb-3">
                        <label for="apellido2" class="form-label">Segundo apellido</label>
                        <input type="text" class="form-control shadow " id="apellido2" maxLength="40" {...register("apellido2",{required:"--campo obligatorio--"})} onChange={(e) => {e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")}}></input>
                        {errors.apellido2 && <p className="text-danger">{errors.apellido2.message}</p> }
                    </div>
                    <div class="mb-3">
                        <label for="rol" class="form-label">Rol del usuario</label>
                        <select class="form-select" id="rol" {...register("rol",{required:"--campo obligatorio--"})}>
                            <option value="user" selected>Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                        {errors.rol && <p className="text-danger">{errors.rol.message}</p> }
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
            </div>
            
        </div>
    )
}