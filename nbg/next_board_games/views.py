from django.core.cache import cache
from django.db.models import F
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Jogo
from django.db.models import ExpressionWrapper, fields

@api_view(['GET'])
def recomendar_jogos_view(request):
    nome = request.GET.get('nome', None)
    mecanicas = request.GET.getlist('mecanicas')
    categorias = request.GET.getlist('categorias')
    temas = request.GET.getlist('temas')

    cache_key = f'recomendacoes_{nome}_{"".join(mecanicas)}_{"".join(categorias)}_{"".join(temas)}'
    recomendacoes = cache.get(cache_key)

    if not recomendacoes:
        jogos = Jogo.objects.all()

        if nome:
            jogos = jogos.filter(nm_jogo__icontains=nome)

        for mecanica in mecanicas:
            jogos = jogos.filter(mecanicas__nm_mecanica__icontains=mecanica)

        for categoria in categorias:
            jogos = jogos.filter(categorias__nm_categoria__icontains=categoria)

        for tema in temas:
            jogos = jogos.filter(temas__nm_tema__icontains=tema)

        # Calcula o popularity_score como a soma dos campos especificados
        jogos = jogos.annotate(popularity_score=ExpressionWrapper(F('qt_quer') + F('qt_favorito') + F('qt_jogou') + F('qt_tem') + F('qt_teve'), output_field=fields.IntegerField())).order_by('-popularity_score')[:3]

        recomendacoes = list(jogos.values('id_jogo', 'nm_jogo', 'cluster', 'popularity_score'))
        cache.set(cache_key, recomendacoes, timeout=3600)

    return JsonResponse(recomendacoes, safe=False)