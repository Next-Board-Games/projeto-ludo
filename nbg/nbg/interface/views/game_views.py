from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from nbg.nbg.Domain.Services.game_service import GameService


@api_view(['GET'])
@permission_classes([AllowAny])
def recomendar_jogos_view(request):
    nome = request.GET.get('nome', None)
    mecanicas = request.GET.getlist('mecanicas')
    categorias = request.GET.getlist('categorias')
    temas = request.GET.getlist('temas')

    game_service = GameService()
    recomendacoes = game_service.get_game_recommendations(nome, mecanicas, categorias, temas)

    return JsonResponse(recomendacoes, safe=False)
