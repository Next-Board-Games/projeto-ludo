from django.core.cache import cache
from django.db.models import F, Value, IntegerField
from django.db.models.functions import Coalesce
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Jogo, Mecanica, Categoria, Tema

@api_view(['GET'])
def recomendar_jogos_view(request):
    nome = request.GET.get('nome', None)
    mecanicas = request.GET.getlist('mecanicas')
    categorias = request.GET.getlist('categorias')
    temas = request.GET.getlist('temas')

    cache_key = f'recomendacoes_{nome}_{"".join(mecanicas)}_{"".join(categorias)}_{"".join(temas)}'
    recomendacoes = cache.get(cache_key)

    if not recomendacoes:
        if nome:
            jogo_referencia = Jogo.objects.filter(nm_jogo__iexact=nome).first()
            if jogo_referencia:
                cluster_referencia = jogo_referencia.cluster
            else:
                return JsonResponse({'error': 'Jogo não encontrado'}, status=404)
            jogos = Jogo.objects.filter(cluster=cluster_referencia).exclude(id_jogo=jogo_referencia.id_jogo)
        else:
            jogos = Jogo.objects.all()

        if mecanicas:
            jogos = jogos.filter(mecanicas__nm_mecanica__in=mecanicas)
        if categorias:
            jogos = jogos.filter(categorias__nm_categoria__in=categorias)
        if temas:
            jogos = jogos.filter(temas__nm_tema__in=temas)

        jogos = jogos.annotate(
            popularity_score=Coalesce(F('qt_favorito'), Value(0)) * 5 +
            Coalesce(F('qt_quer'), Value(0)) * 4 +
            Coalesce(F('qt_tem'), Value(0)) * 3 +
            Coalesce(F('qt_jogou'), Value(0)) * 2 +
            Coalesce(F('qt_teve'), Value(0), output_field=IntegerField())
        ).distinct().order_by('-popularity_score')[:3]

        recomendacoes = list(jogos.values('id_jogo', 'nm_jogo', 'thumb', 'link', 'cluster', 'popularity_score'))
        cache.set(cache_key, recomendacoes, timeout=3600)

    return JsonResponse(recomendacoes, safe=False)

@api_view(['GET'])
def get_mecanicas_view(request):
    mecanicas = Mecanica.objects.all().values_list('nm_mecanica', flat=True)
    return JsonResponse(list(mecanicas), safe=False)

@api_view(['GET'])
def get_categorias_view(request):
    categorias = Categoria.objects.all().values_list('nm_categoria', flat=True)
    return JsonResponse(list(categorias), safe=False)

@api_view(['GET'])
def get_temas_view(request):
    temas = Tema.objects.all().values_list('nm_tema', flat=True)
    return JsonResponse(list(temas), safe=False)

@api_view(['GET'])
def get_nomes_jogos_view(request):
    nomes_jogos = Jogo.objects.all().values_list('nm_jogo', flat=True)
    return JsonResponse(list(nomes_jogos), safe=False)