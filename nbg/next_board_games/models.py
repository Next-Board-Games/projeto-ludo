from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    telefone = models.CharField(max_length=15, blank=True, null=True)

class Mecanica(models.Model):
    id_mecanica = models.IntegerField(primary_key=True)
    nm_mecanica = models.CharField(max_length=255)

class Categoria(models.Model):
    id_categoria = models.IntegerField(primary_key=True)
    nm_categoria = models.CharField(max_length=255)

class Tema(models.Model):
    id_tema = models.IntegerField(primary_key=True)
    nm_tema = models.CharField(max_length=255)

class Profissional(models.Model):
    id_profissional = models.IntegerField(primary_key=True)
    nm_profissional = models.CharField(max_length=255)

class Jogo(models.Model):
    id_jogo = models.IntegerField(primary_key=True)
    nm_jogo = models.CharField(max_length=255)
    thumb = models.URLField(null=True, blank=True)  # Permite nulo
    tp_jogo = models.CharField(max_length=1, null=True, blank=True)  # Permite nulo
    link = models.URLField(null=True, blank=True)  # Permite nulo
    ano_publicacao = models.IntegerField(null=True, blank=True)
    ano_nacional = models.IntegerField(null=True, blank=True)
    qt_jogadores_min = models.IntegerField(null=True, blank=True)
    qt_jogadores_max = models.IntegerField(null=True, blank=True)
    vl_tempo_jogo = models.IntegerField(null=True, blank=True)
    idade_minima = models.IntegerField(null=True, blank=True)
    qt_tem = models.IntegerField(null=True, blank=True)
    qt_teve = models.IntegerField(null=True, blank=True)
    qt_favorito = models.IntegerField(null=True, blank=True)
    qt_quer = models.IntegerField(null=True, blank=True)
    qt_jogou = models.IntegerField(null=True, blank=True)
    mecanicas = models.ManyToManyField(Mecanica, blank=True)  # M2M relation
    categorias = models.ManyToManyField(Categoria, blank=True)  # M2M relation
    temas = models.ManyToManyField(Tema, blank=True)  # M2M relation
    artistas = models.ManyToManyField(Profissional, related_name='artistas', blank=True)  # M2M relation
    designers = models.ManyToManyField(Profissional, related_name='designers', blank=True)  # M2M relation
    cluster = models.IntegerField(null=True, blank=True)  # Permite nulo

class TrainedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    model_data = models.BinaryField()

    def __str__(self):
        return f'Model saved on {self.created_at}'

class ModelStorage(models.Model):
    model_data = models.BinaryField()

class ColecaoUsuario(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE)
    data_aquisicao = models.DateField()
    teve = models.BooleanField(default=False)

class AvaliacaoUsuario(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE)
    avaliacao = models.IntegerField()
    comentario = models.TextField(blank=True, null=True)

class ListaDesejos(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE)

class JogosJogados(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE)
    jogado_em = models.DateField()

class JogosTidos(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE)
    teve = models.BooleanField(default=True)
