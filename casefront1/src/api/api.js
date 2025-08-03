import Cookies from 'js-cookie';
import axios from 'axios'

const token = Cookies.get("jwt"); // Obtener el token de las cookies
const apiUrl = axios.create({
    baseURL:"http://localhost:8000/api",
    headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en todas las solicitudes para que el backend valide rol del usuario en todo momento
    },
})
//----RUTAS GET---------------------------------------------------------------------------------------------------------------------------------------------
export const todosUsuarios = ()=>{
    return apiUrl.get('/usuarios/')
}

export const usuariosID = (id_user)=>{
    return apiUrl.get(`/usuarios/${id_user}/`)
}

//clientes con relacion incluida para mostrar en tabla front
export const todosClientes = ()=>{
    return apiUrl.get('/clientesTabla/')
}

export const clientesID = (id_client)=>{
    return apiUrl.get(`/clientes/${id_client}/`)
}

//Usuarios consulta limitada para mostrar en el select del form de casos:
export const usuariosConsulta = ()=>{
    return apiUrl.get('/usuariosC/')
}

//Clientes con atributos recortados:
export const clientesConsulta = ()=>{
   return apiUrl.get('/clientesP/')
}

// Casos consulta para mostrar en la lista de casos, tiene relaciones con otras tablas que se muestra info de ellas en la ficha del caso
export const casosConsulta = ()=>{
    return apiUrl.get('/casosRelacion/')   
}
//Casos para rellenar el form cuando se va a actualizar
export const casosConsultaId = (id_caso)=>{
    return apiUrl.get(`/casosRelacion/${id_caso}/`)
}

export const categoriasConsulta = ()=>{
    return apiUrl.get('/categorias/')
}

export const categoriasConsultaID = (id_cat)=>{
    return apiUrl.get(`/categorias/${id_cat}/`)   
}
//----RUTAS GET---------------------------------------------------------------------------------------------------------------------------------------------

//RUTAS POST-----------------------------------------------------------------------------------------------------------------------------------------------

export const crearUsuario = (usuario)=>{
    return apiUrl.post('/usuarios/', usuario)
}

export const crearCliente = (cliente)=>{
    return apiUrl.post('/clientes/', cliente)
}


export const crearCategoria = (categoria)=>{
    return apiUrl.post('/categorias/', categoria)
    
}

export const crearCaso = (caso)=>{
    return apiUrl.post('/casos/', caso)
    
}
 //RUTAS PUT----------------------------------------------------------------------------------------------------------------------------------

 export const actualizarUsuario = (id_user ,usuario)=>{
    return apiUrl.put(`/usuarios/${id_user}/`, usuario)
}
export const actualizarCliente = (id_client ,cliente)=>{
    return apiUrl.put(`/clientes/${id_client}/`, cliente)
}

export const actualizarCaso = (id_caso ,caso)=>{
    return apiUrl.put(`/casos/${id_caso}/`, caso)
}

export const actualizarCategoria = (id_cat, categoria) => {
    
    return apiUrl.put(`/categorias/${id_cat}/`,categoria);
};

//--RUTAS DELETE ----------------------------------------------------------------------------------------------------------------------------------

export const borrarUsuario = (id_user)=>{
    return apiUrl.delete(`/usuarios/${id_user}/`)
}
export const borrarCliente = (id_client)=>{
    return apiUrl.delete(`/clientes/${id_client}/`)
}

export const borrarCaso = (id_caso)=>{
    return apiUrl.delete(`/casos/${id_caso}/`)
}

export const borrarCategoria = (id_cat)=>{
    return apiUrl.delete(`/categorias/${id_cat}/`)
}

//--------------------------------------------------------------
//-----LOGIN y LOGOUT-----------------------------------------------------------------------------------------------------------------------------------------
export const login = async(usuario) => {
    const { user, clave } = usuario;
    const response = await apiUrl.post('/login/',{user:user, clave:clave})
    
    // Guardar el token en una cookie en el frontend
    Cookies.set('jwt', response.data.token, {
        expires: 1, // Expira en 1 día
        path: '/',  // Disponible en todo el dominio
    });
    console.log('Token guardado en cookies:', response.data.token);
    return response
}

export const logout = () => {
    // Eliminar la cookie 'jwt'
    Cookies.remove('jwt', {
        path: '/', // todo el dominio, debe ser igual a cuando se crea
    });
    console.log('Token eliminado de cookies');
    // Redirigir al usuario a la pantalla de login
    window.location.href = "/form1"; 
}
//-----LOGIN y LOGOUT-----------------------------------------------------------------------------------------------------------------------------------------

//Funcion para recibir datos de usuario a traves de la cookie token para los roles--------------------
export const rolUser = async () => {
    //si existe token, enviar al backend para verificar rol del usuario y si token sigue activo
    if (token) {
        try {
            const response = await apiUrl.get('/user-info/');
            return response
        } catch (error) {
            console.error('Error obteniendo la información del usuario:', error.response.data);
        }
    }
}
//Funcion para recibir datos de usuario a traves de la cookie token para los roles--------------------

