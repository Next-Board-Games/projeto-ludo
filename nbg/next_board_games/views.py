from django.core.cache import cache
from django.db.models import F, Value, IntegerField
from django.db.models.functions import Coalesce
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Jogo
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from .models import (CustomUser, Mecanica, Categoria, Tema, Profissional, Jogo,
                     ColecaoUsuario, AvaliacaoUsuario, ListaDesejos, JogosJogados, JogosTidos)
from .serializers import (CustomUserSerializer, MecanicaSerializer, CategoriaSerializer, 
                          TemaSerializer, ProfissionalSerializer, JogoSerializer,
                          ColecaoUsuarioSerializer, AvaliacaoUsuarioSerializer, 
                          ListaDesejosSerializer, JogosJogadosSerializer, JogosTidosSerializer)

@api_view(['GET'])
@permission_classes([AllowAny])
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

@api_view(['GET'])
def search_game_names_view(request):
    query = request.GET.get('query', '')
    if query:
        # Filter game names by query
        nomes_jogos = Jogo.objects.filter(nm_jogo__icontains=query).values_list('nm_jogo', flat=True)
    else:
        # Return all game names if no query is provided
        nomes_jogos = Jogo.objects.all().values_list('nm_jogo', flat=True)
    return JsonResponse(list(nomes_jogos), safe=False)

def oauth_callback(request):
    # Aqui você lidaria com a troca do código de autorização por um token
    # Por ora, vamos apenas imprimir o que recebemos
    auth_code = request.GET.get('code', None)
    if auth_code:
        print(f"Código de Autorização Recebido: {auth_code}")
        # Aqui você faria a troca por um token, etc.
    return JsonResponse({'status': 'Recebido o código de autorização', 'code': auth_code})

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # Adicione permissões específicas se necessário

class MecanicaViewSet(viewsets.ModelViewSet):
    queryset = Mecanica.objects.all()
    serializer_class = MecanicaSerializer
    # IsAdminUser restringe este ViewSet a administradores
    permission_classes = [IsAdminUser]

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminUser]

class TemaViewSet(viewsets.ModelViewSet):
    queryset = Tema.objects.all()
    serializer_class = TemaSerializer
    permission_classes = [IsAdminUser]

class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer
    permission_classes = [IsAdminUser]

class JogoViewSet(viewsets.ModelViewSet):
    queryset = Jogo.objects.all()
    serializer_class = JogoSerializer
    permission_classes = [IsAdminUser]

# Para ViewSets sem um queryset fixo, definimos o método get_queryset e usamos basename no registro
class ColecaoUsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = ColecaoUsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ColecaoUsuario.objects.filter(usuario=self.request.user)

class AvaliacaoUsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = AvaliacaoUsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AvaliacaoUsuario.objects.filter(usuario=self.request.user)

class ListaDesejosViewSet(viewsets.ModelViewSet):
    serializer_class = ListaDesejosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ListaDesejos.objects.filter(usuario=self.request.user)

class JogosJogadosViewSet(viewsets.ModelViewSet):
    serializer_class = JogosJogadosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JogosJogados.objects.filter(usuario=self.request.user)

class JogosTidosViewSet(viewsets.ModelViewSet):
    serializer_class = JogosTidosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JogosTidos.objects.filter(usuario=self.request.user)