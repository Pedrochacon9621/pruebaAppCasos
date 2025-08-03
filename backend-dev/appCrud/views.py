import jwt
import datetime
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializer import UsuariosSerializer,UsuariosCSerializer, CategoriasSerializer, ClientesSerializer, ClientesCSerializer, CasosSerializer, CasosCSerializer,ClientesTSerializer
from .models import Usuarios, Categorias, Clientes, Casos
from .permissions import IsAuthenticatedWithToken
# Create your views here.

#JWT-----------------------------------------------------------------------------------
# Clave secreta para firmar los tokens (usa una variable de entorno en producción)
SECRET_KEY = 'tu_clave_secreta'

#LOGIN----------------------------------------------------------------------------------------
class LoginJWT(APIView):
     permission_classes = [AllowAny]  # Permitir acceso sin token para esta vista. Hace referencia al archivo permission donde se establece la logica de JWT    
     def post(self, request):
        # Obtener usuario y contraseña desde el body del request
        user = request.data.get('user')
        clave = request.data.get('clave')

        # Validar credenciales
        try:
            usuario = Usuarios.objects.get(user=user)
            if usuario.clave == clave:  # Validar contraseña
                # Generar el token JWT
                token = jwt.encode({
                    'id': usuario.id_user,
                    'user': usuario.user,
                    'rol': usuario.rol,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2),
                }, SECRET_KEY, algorithm='HS256')

         # Enviar el token como parte del cuerpo de la respuesta
                return Response({'message': 'Autenticación exitosa', 'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)       
#LOGIN----------------------------------------------------------------------------------------

#Funcion obtener datos del usuario a traves del TOken que envia el backend----------------------------
class UserInfoView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            usuario = Usuarios.objects.get(id_user=payload['id'])
            return Response({
                'user': usuario.user,
                'nombre1': usuario.nombre1,
                'apellido1': usuario.apellido1,
                'rol': usuario.rol,
            }, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expirado'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
#Funcion obtener datos del usuario a traves del TOken que envia el backend----------------------------

#Usuarios default rest framework----------------------
class UsuariosView(viewsets.ModelViewSet):
    serializer_class = UsuariosSerializer
    queryset = Usuarios.objects.all()
    permission_classes = [IsAuthenticatedWithToken]  # Asegurar que tengan token
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
    def create(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().destroy(request, *args, **kwargs)
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
#----------------------------------------------------------

#Categorias default rest framework----------------------
class CategoriasView(viewsets.ModelViewSet):
    serializer_class = CategoriasSerializer
    queryset = Categorias.objects.all()
    permission_classes = [IsAuthenticatedWithToken]  # Asegurar que tengan token
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
    def update(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().destroy(request, *args, **kwargs)
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
#-------------------------------------------------------    

#Clientes default rest framework----------------------
class ClientesView(viewsets.ModelViewSet):
    serializer_class = ClientesSerializer
    queryset = Clientes.objects.all()
    permission_classes = [IsAuthenticatedWithToken]  # Asegurar que tengan token
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
    def create(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().destroy(request, *args, **kwargs)
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
#-------------------------------------------------------

#ClientesP default rest framework----------------------
class ClientesPView(viewsets.ModelViewSet):
    serializer_class = ClientesCSerializer
    queryset = Clientes.objects.all()
#-------------------------------------------------------

#Clientes Tabla-front default rest framework----------------------
class ClientesTView(viewsets.ModelViewSet):
    serializer_class = ClientesTSerializer
    queryset = Clientes.objects.all()
#-------------------------------------------------------

#UsuariosC default rest framework----------------------
class UsuariosCView(viewsets.ModelViewSet):
    serializer_class = UsuariosCSerializer
    queryset = Usuarios.objects.all()
#----------------------------------------------------------

#casos default rest framework-------------------------
class CasosView(viewsets.ModelViewSet):
    serializer_class = CasosSerializer
    queryset = Casos.objects.all()
    permission_classes = [IsAuthenticatedWithToken]  # Asegurar que tengan token
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
    def create(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

        if payload.get('rol') != 'admin':
            return Response({'error': 'Acceso denegado: solo permitido para admin'}, status=403)
        return super().destroy(request, *args, **kwargs)
    ######-VALIDACIONES DE RUTA PARA USERS ESTANDAR--------------------------------------------
#------------------------------------------------------

#Funcion ruta casos relacionado con usuario y clientes
class CasosCView(viewsets.ModelViewSet):
    serializer_class = CasosCSerializer
    queryset = Casos.objects.all()
#-------------------------------------------------------------------------------------------------