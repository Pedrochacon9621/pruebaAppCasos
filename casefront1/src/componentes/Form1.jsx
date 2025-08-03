import {useForm} from "react-hook-form"
import { login, rolUser} from "../api/api"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
//Formulario de LOGIN
export function Form1() {
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()
    useEffect(()=>{
        //Funcion pasar a la pagina de casos si ya la sesion esta iniciada
        async function verificarLogin(params) {
            const login = await rolUser()
            if (login) {
                navigate('/casos')
                window.location.reload();
            }
        }
        verificarLogin()
    },[])
    //Funcion del boton iniciar sesion:
    const onSubmit = handleSubmit(async usuario=>{  
        try {
            const loger = await login(usuario) 
            if (loger) {
                navigate('/casos')
                //reload completo para solucionar error que no carga la barra de navegacion:
                window.location.reload();
            }
        } catch (error) {
            // Mostrar una alerta con un mensaje amigable y el error
            alert(`Usuario o contraseña incorrecta. Detalles: ${error.message}`);
            console.error('Error durante el inicio de sesión:', error); // Para depuración en consola
        }
        
    })
    return(
        <div className=" bg-dark text-light d-flex justify-content-center align-items-center" style={ {height:"100vh"}}>
            <div className="bg-secondary p-5 rounded" style={{width:"30rem"}}>
                <form onSubmit={onSubmit}>
                    <div class="mb-3">
                        <label for="user" class="form-label">Usuario</label>
                        <input type="text" class="form-control shadow " id="user" {...register("user", {required:true})}></input>
                    </div>
                    <div class="mb-3">
                        <label for="clave" class="form-label">Contraseña</label>
                        <input type="password" class="form-control shadow-lg" id="clave" {...register("clave",{required:true})}></input>
                    </div>
                    <button type="submit" class="btn btn-primary">Iniciar sesión</button>
                </form>
            </div>
        </div>
    )
}