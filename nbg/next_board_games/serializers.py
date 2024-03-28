from rest_framework import serializers
from .models import (CustomUser, Mecanica, Categoria, Tema, Profissional, Jogo,
                     ColecaoUsuario, AvaliacaoUsuario, ListaDesejos, JogosJogados, JogosTidos)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'telefone', 'first_name', 'last_name']

class MecanicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mecanica
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = '__all__'

class ProfissionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profissional
        fields = '__all__'

class JogoSerializer(serializers.ModelSerializer):
    mecanicas = MecanicaSerializer(many=True, read_only=True)
    categorias = CategoriaSerializer(many=True, read_only=True)
    temas = TemaSerializer(many=True, read_only=True)
    artistas = ProfissionalSerializer(many=True, read_only=True)
    designers = ProfissionalSerializer(many=True, read_only=True)

    class Meta:
        model = Jogo
        fields = '__all__'

class ColecaoUsuarioSerializer(serializers.ModelSerializer):
    usuario = CustomUserSerializer(read_only=True)
    jogo = JogoSerializer(read_only=True)

    class Meta:
        model = ColecaoUsuario
        fields = '__all__'

class AvaliacaoUsuarioSerializer(serializers.ModelSerializer):
    usuario = CustomUserSerializer(read_only=True)
    jogo = JogoSerializer(read_only=True)

    class Meta:
        model = AvaliacaoUsuario
        fields = '__all__'

class ListaDesejosSerializer(serializers.ModelSerializer):
    usuario = CustomUserSerializer(read_only=True)
    jogo = JogoSerializer(read_only=True)

    class Meta:
        model = ListaDesejos
        fields = '__all__'

class JogosJogadosSerializer(serializers.ModelSerializer):
    usuario = CustomUserSerializer(read_only=True)
    jogo = JogoSerializer(read_only=True)

    class Meta:
        model = JogosJogados
        fields = '__all__'

class JogosTidosSerializer(serializers.ModelSerializer):
    usuario = CustomUserSerializer(read_only=True)
    jogo = JogoSerializer(read_only=True)

    class Meta:
        model = JogosTidos
        fields = '__all__'