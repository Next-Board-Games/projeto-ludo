from django.core.cache import cache
from django.db.models import F, Value, IntegerField
from django.db.models.functions import Coalesce
from django.http import JsonResponse
from .models import Jogo
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from .models import (CustomUser, Mecanica, Categoria, Tema, Profissional, Jogo,
                     ColecaoUsuario, AvaliacaoUsuario, ListaDesejos, JogosJogados, JogosTidos)
from .serializers import (CustomUserSerializer, MecanicaSerializer, CategoriaSerializer, 
                          TemaSerializer, ProfissionalSerializer, JogoSerializer,
                          ColecaoUsuarioSerializer, AvaliacaoUsuarioSerializer, 
                          ListaDesejosSerializer, JogosJogadosSerializer, JogosTidosSerializer)
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, DateField
from django.db.models.functions import TruncDay
from rest_framework import status
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404

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
    
@api_view(['GET'])
@permission_classes([AllowAny])
def estatisticas_view(request):
    jogos_count = Jogo.objects.count()
    categorias_count = Categoria.objects.count()
    mecanicas_count = Mecanica.objects.count()
    temas_count = Tema.objects.count()
    
    estatisticas = {
        'jogos': jogos_count,
        'categorias': categorias_count,
        'mecanicas': mecanicas_count,
        'temas': temas_count
    }
    
    return JsonResponse(estatisticas)

@api_view(['GET'])
def informar_usuario_view(request):
    messages.add_message(request, messages.ERROR, 'Esta conta já está associada a um usuário.')
    return HttpResponseRedirect('/login/')  # Atualize conforme a URL do seu login

# No arquivo views.py

@api_view(['GET'])
def check_user_login(request):
    if request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True, "username": request.user.username}, status=200)
    else:
        return JsonResponse({"isAuthenticated": False}, status=200)

def api_status(request):
    return JsonResponse({"status": "API is up and running!"})

class JogoPagination(PageNumberPagination):
    page_size = 10  # Quantidade de itens por página
    page_size_query_param = 'page_size'
    max_page_size = 100

class JogoViewSet(viewsets.ModelViewSet):
    queryset = Jogo.objects.all()
    serializer_class = JogoSerializer
    pagination_class = JogoPagination

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def estatisticas_usuarios_por_dia(request):
    data_inicio = request.query_params.get('data_inicio')
    data_fim = request.query_params.get('data_fim')
    data_inicio = parse_date(data_inicio) if data_inicio else None
    data_fim = parse_date(data_fim) if data_fim else None
    
    queryset = CustomUser.objects.annotate(date=TruncDay('date_joined'))
    if data_inicio and data_fim:
        queryset = queryset.filter(date__range=[data_inicio, data_fim])
    novos_usuarios = queryset.values('date').annotate(count=Count('id'))
    return Response(novos_usuarios)

@api_view(['GET'])
@permission_classes([AllowAny])
def estatisticas_jogos_por_mecanica(request):
    parametro_mecanica = request.query_params.get('mecanica')
    
    if parametro_mecanica.isdigit():
        # Trata como ID
        mecanica = get_object_or_404(Mecanica, pk=parametro_mecanica)
        jogos = Jogo.objects.filter(mecanicas=mecanica)
    else:
        # Trata como nome
        mecanica = get_object_or_404(Mecanica, nm_mecanica=parametro_mecanica)
        jogos = Jogo.objects.filter(mecanicas=mecanica)
    
    jogos_por_mecanica = jogos.values('mecanicas__nm_mecanica').annotate(total=Count('mecanicas')).order_by('-total')
    return Response(list(jogos_por_mecanica))

@api_view(['GET'])
@permission_classes([AllowAny])
def estatisticas_jogos_por_tema(request):
    parametro_tema = request.query_params.get('tema')
    
    if parametro_tema.isdigit():
        # Trata como ID
        tema = get_object_or_404(Tema, pk=parametro_tema)
        jogos = Jogo.objects.filter(temas=tema)
    else:
        # Trata como nome
        tema = get_object_or_404(Tema, nm_tema=parametro_tema)
        jogos = Jogo.objects.filter(temas=tema)
    
    jogos_por_tema = jogos.values('temas__nm_tema').annotate(total=Count('temas')).order_by('-total')
    return Response(list(jogos_por_tema))

@api_view(['GET'])
@permission_classes([AllowAny])
def estatisticas_jogos_por_categoria(request):
    parametro_categoria = request.query_params.get('categoria')
    
    if parametro_categoria.isdigit():
        # Trata como ID
        categoria = get_object_or_404(Categoria, pk=parametro_categoria)
        jogos = Jogo.objects.filter(categorias=categoria)
    else:
        # Trata como nome
        categoria = get_object_or_404(Categoria, nm_categoria=parametro_categoria)
        jogos = Jogo.objects.filter(categorias=categoria)
    
    jogos_por_categoria = jogos.values('categorias__nm_categoria').annotate(total=Count('categorias')).order_by('-total')
    return Response(list(jogos_por_categoria))

@api_view(['GET'])
@permission_classes([AllowAny])
def estatisticas_jogos(request):
    # Recupere os parâmetros de filtro da query string
    categoria = request.query_params.get('categoria')
    mecanica = request.query_params.get('mecanica')
    tema = request.query_params.get('tema')

    # Comece com todos os jogos
    jogos = Jogo.objects.all()

    # Aplique os filtros conforme necessário
    if categoria:
        jogos = jogos.filter(categorias__nm_categoria=categoria)
    if mecanica:
        jogos = jogos.filter(mecanicas__nm_mecanica=mecanica)
    if tema:
        jogos = jogos.filter(temas__nm_tema=tema)

    # Aqui, você irá simplesmente contar o total de jogos após aplicar os filtros
    total_jogos = jogos.count()

    # Crie a resposta
    resposta = {
        "total": total_jogos
    }

    return Response(resposta)