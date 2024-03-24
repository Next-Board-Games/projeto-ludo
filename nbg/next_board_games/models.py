from django.db import models

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
    thumb = models.URLField()
    tp_jogo = models.CharField(max_length=1)
    link = models.URLField()
    ano_publicacao = models.IntegerField()
    ano_nacional = models.IntegerField()
    qt_jogadores_min = models.IntegerField()
    qt_jogadores_max = models.IntegerField()
    vl_tempo_jogo = models.IntegerField()
    idade_minima = models.IntegerField()
    qt_tem = models.IntegerField()
    qt_teve = models.IntegerField()
    qt_favorito = models.IntegerField()
    qt_quer = models.IntegerField()
    qt_jogou = models.IntegerField()
    mecanicas = models.ManyToManyField(Mecanica)
    categorias = models.ManyToManyField(Categoria)
    temas = models.ManyToManyField(Tema)
    artistas = models.ManyToManyField(Profissional, related_name='artistas')
    designers = models.ManyToManyField(Profissional, related_name='designers')
