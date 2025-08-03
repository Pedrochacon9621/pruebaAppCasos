from rest_framework.permissions import BasePermission
import jwt

SECRET_KEY = 'tu_clave_secreta'

class IsAuthenticatedWithToken(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Authorization')  # Obtener el token del encabezado
        if not token or 'Bearer ' not in token:  # Verificar si existe y está en el formato correcto
            return False

        try:
            token = token.split(' ')[1]  # Extraer solo el token después de "Bearer"
            jwt.decode(token, SECRET_KEY, algorithms=['HS256'])  # Decodificar el token
            return True  # Si el token es válido, permitir el acceso
        except jwt.ExpiredSignatureError:
            return False  # Token expirado
        except jwt.InvalidTokenError:
            return False  # Token inválido