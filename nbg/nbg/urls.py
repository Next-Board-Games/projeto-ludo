"""
URL configuration for nbg project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from next_board_games import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('recomendar-jogos/', views.recomendar_jogos_view, name='recomendar-jogos'),
    # Novas rotas para buscar mecânicas, categorias e temas
    path('get-mecanicas/', views.get_mecanicas_view, name='get-mecanicas'),
    path('get-categorias/', views.get_categorias_view, name='get-categorias'),
    path('get-temas/', views.get_temas_view, name='get-temas'),
    path('get-nomes-jogos/', views.get_nomes_jogos_view, name='get-nomes-jogos'),
    path('search-game-names/', views.search_game_names_view, name='search-game-names'),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('oauth/callback', views.oauth_callback, name='oauth-callback'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)