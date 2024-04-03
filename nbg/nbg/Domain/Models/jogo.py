from django.db import models


class Jogo(models.Model):
    nm_jogo = models.CharField(max_length=255, verbose_name="Nome do Jogo")
    mecanicas = models.ManyToManyField('Mecanica', related_name='jogos', blank=True)
    categorias = models.ManyToManyField('Categoria', related_name='jogos', blank=True)
    temas = models.ManyToManyField('Tema', related_name='jogos', blank=True)
    qt_favorito = models.IntegerField(default=0, verbose_name="Quantidade Favoritos")
    qt_quer = models.IntegerField(default=0, verbose_name="Quantidade Querem")
    qt_tem = models.IntegerField(default=0, verbose_name="Quantidade Possuem")
    qt_jogou = models.IntegerField(default=0, verbose_name="Quantidade Jogaram")
    qt_teve = models.IntegerField(default=0, verbose_name="Quantidade Tiveram")
    cluster = models.IntegerField(null=True, blank=True, verbose_name="Cluster")
    link = models.URLField(max_length=1024, blank=True, null=True, verbose_name="Link")
    thumb = models.URLField(max_length=1024, blank=True, null=True, verbose_name="Thumbnail")

    class Meta:
        db_table = 'jogo'
        verbose_name = "Jogo"
        verbose_name_plural = "Jogos"

    def __str__(self):
        return self.nm_jogo
