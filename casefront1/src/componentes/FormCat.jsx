import {useForm} from "react-hook-form"
import { actualizarCategoria, categoriasConsultaID, crearCategoria, rolUser} from "../api/api"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { UserContext } from "./context/UserContext"
import { useContext } from "react"
export function FormCat() {
    const {setUsuariog} = useContext(UserContext)
    const {register, handleSubmit, setValue, formState:{errors}} = useForm()
    const navigate = useNavigate()
    const params = useParams()

    useEffect(()=>{
         //VERFICAR ROL DEL BACKEND: obtener rol con la cookie
         async function llenarUsuariog() {
            const resRol = await rolUser()
            setUsuariog(resRol.data)
        }
        //Funcion cargar la categoria a actualizar, si existe parametro en url:
        async function cargarCategorias() {   
            if (params.id_cat) {
                const res = await categoriasConsultaID(params.id_cat)
                setValue("nombre_cat", res.data.nombre_cat)
            }   
        }
        //ejecucion de las funciones:
        llenarUsuariog()
        cargarCategorias()
    },[])

    const onSubmit = handleSubmit(async categoria =>{
        try {
            const confirmacion =  window.confirm("¿Esta seguro de guardar la informacion?")
            if (!confirmacion) {
                // Si el usuario cancela, no se ejecuta la acción
                console.log("Acción cancelada por el usuario.");
                return;
            }
            //si hay parametro en la url significa que se va es a actuliazar:
            if (params.id_cat) {
                await actualizarCategoria(params.id_cat, categoria)
            }else{
                //si no hay parametro en url significa que vamos a crear:
                await crearCategoria(categoria)
            }
            navigate("/categorias")
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
                        <label for="nombre_cat" class="form-label">Descripción de Categoria</label>
                        <input type="text" class="form-control shadow " id="nombre_cat" maxLength="40" {...register("nombre_cat",{required:"--campo obligatorio--"})}></input>
                        {errors.nombre_cat && <p className="text-danger">{errors.nombre_cat.message}</p> }
                    </div>

                    <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
            </div>
            
        </div>
    )
}