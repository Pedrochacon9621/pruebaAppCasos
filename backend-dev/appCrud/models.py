from django.db import models

# Create your models here.

class Usuarios(models.Model):
    id_user = models.AutoField(primary_key=True)
    user = models.CharField(max_length=20, null=False) 
    cedula = models.IntegerField(unique=True, null=False)
    nombre1 = models.CharField(max_length=50, null=False)
    nombre2 = models.CharField(max_length=50, null=True)
    apellido1 = models.CharField(max_length=50, null=False)
    apellido2 = models.CharField(max_length=50, null=True)
    rol = models.CharField(max_length=20, null=False)
    clave = models.CharField(max_length=20, null=False)

class Categorias(models.Model):
    id_cat = models.AutoField(primary_key=True)
    nombre_cat = models.CharField(max_length=50, null=False)

class Clientes(models.Model):
    id_client = models.AutoField(primary_key=True)
    id_cat = models.ForeignKey(Categorias, on_delete=models.SET_NULL, null=True)
    cedula_client = models.IntegerField(null=False, unique=True)
    nombre1_client = models.CharField(max_length=50, null=False)
    nombre2_client = models.CharField(max_length=50, null=True)
    apellido1_client = models.CharField(max_length=50, null=False)
    apellido2_client = models.CharField(max_length=50, null=True)

class Casos(models.Model):
    id_caso = models.AutoField(primary_key=True)
    id_client = models.ForeignKey(Clientes, on_delete=models.CASCADE, null=False)
    id_user = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True) #en programacion se debe manejar esto
    nombre_caso = models.CharField(max_length=100, null=False)
    descripcion_caso = models.CharField(max_length=255, null=True)
    listo = models.BooleanField(null=False)

