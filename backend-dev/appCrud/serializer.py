from rest_framework import serializers
from .models import Usuarios, Categorias, Clientes, Casos

#SERIALIZERS RUTAS DEFAULT REST FRAMEWORK CRUD------------------------------------------
class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = '__all__'

class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = '__all__'


class CasosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Casos
        fields = '__all__'
#--------------------------------DEFAULTS SERIALIZERS-----------------------------------------

#-----------------------------------------SERIALIZERS PERSONALIZADOS----------------------------------------------------------------------------------
# Serializer para la consulta de los casos - relacion entre casos y Usuarios:
class UsuariosCSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id_user','nombre1','apellido1']
#--------------------------------------------------------------------------------------


# Serializer para la consulta de los Clientes - relacion entre clientes y categorias:
class ClientesCSerializer(serializers.ModelSerializer):
    id_cat = CategoriasSerializer() #en este si se uso categorias del crud default
    class Meta:
        model = Clientes
        fields = ['id_client','nombre1_client', 'apellido1_client', 'id_cat']
#---------------------------------------------------------------------------------------

# Serializer para la consulta de los Casos - relacion entre casos con clientes/categorias y usuarios:
class CasosCSerializer(serializers.ModelSerializer):
    id_client = ClientesCSerializer()
    id_user = UsuariosCSerializer()
    class Meta:
        model = Casos
        fields = '__all__'
#-------------------------------------------------------------------------

#serializar Clientes consulta Para la tabla del frontend-----------------------------------------------------
class ClientesTSerializer(serializers.ModelSerializer):
    id_cat = CategoriasSerializer()
    class Meta:
        model = Clientes
        fields = '__all__'
#-------------------------------------------------------------------------------------------