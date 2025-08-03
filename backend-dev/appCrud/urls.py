from django.urls import path, include
from rest_framework import routers
#Importacion de las funciones que se encuentran en el archivo views:
from .views import UsuariosView,UsuariosCView, CategoriasView, ClientesView, CasosView, CasosCView, ClientesPView, ClientesTView,LoginJWT, UserInfoView

router = routers.DefaultRouter() #Crear varibale para definir las rutas del CRUD por DEFECTO que trae Rest Framework

#Utilizacion de variable router para las rutas por defecto de REST FRAMEWORK:
router.register(r'usuarios', UsuariosView, 'usuarios')#DEFAULT
router.register(r'usuariosC', UsuariosCView, 'usuariosC') #COnsulta para los Select en los formularios
router.register(r'categorias', CategoriasView, 'categorias')#DEFAULT
router.register(r'clientes', ClientesView, 'clientes')#DEFAULT
router.register(r'clientesP', ClientesPView, 'clientesP') #consulta para el select del formulario de los casos.
router.register(r'casos', CasosView, 'casos') #DEFAULT
router.register(r'casosRelacion', CasosCView, 'casosRelacion') #Consulta para tarjetas de caso y formulario caso actualizar
router.register(r'clientesTabla', ClientesTView, 'clientesTabla') #Consulta de clientes para la tabla del front

urlpatterns = [
    path('login/', LoginJWT.as_view(), name='login_jwt'),  # Endpoint para autenticación
    path('user-info/', UserInfoView.as_view(), name='user-info'), #Verificar token con la cookie para el rol dinamico
    path('', include(router.urls)), #Rutas por defecto De REST FRAMEWORK
]
