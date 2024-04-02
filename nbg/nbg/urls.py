from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from next_board_games import views
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="NBG API",
        default_version='v1',
        description="Documentação da API para NBG",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@nbg.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'users', views.CustomUserViewSet)
router.register(r'mecanicas', views.MecanicaViewSet)
router.register(r'categorias', views.CategoriaViewSet)
router.register(r'temas', views.TemaViewSet)
router.register(r'profissionais', views.ProfissionalViewSet)
router.register(r'jogos', views.JogoViewSet)
# Especifica basename para ViewSets que dependem do usuário autenticado
router.register(r'colecoes', views.ColecaoUsuarioViewSet, basename='colecao-usuario')
router.register(r'avaliacoes', views.AvaliacaoUsuarioViewSet, basename='avaliacao-usuario')
router.register(r'listadesejos', views.ListaDesejosViewSet, basename='lista-desejos')
router.register(r'jogosjogados', views.JogosJogadosViewSet, basename='jogos-jogados')
router.register(r'jogostidos', views.JogosTidosViewSet, basename='jogos-tidos')

urlpatterns = [
    path('', views.api_status),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Modificação aqui para incluir todas as rotas do router sob o prefixo /api/
    path('api/recomendar-jogos/', views.recomendar_jogos_view, name='recomendar-jogos'),
    path('get-mecanicas/', views.get_mecanicas_view, name='get-mecanicas'),
    path('get-categorias/', views.get_categorias_view, name='get-categorias'),
    path('get-temas/', views.get_temas_view, name='get-temas'),
    path('get-nomes-jogos/', views.get_nomes_jogos_view, name='get-nomes-jogos'),
    path('search-game-names/', views.search_game_names_view, name='search-game-names'),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('oauth/callback', views.oauth_callback, name='oauth-callback'),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('estatisticas/', views.estatisticas_view, name='estatisticas'),
    path('informar-usuario/', views.informar_usuario_view, name='informar-usuario'),
    path('check-user-login/', views.check_user_login, name='check-user-login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)