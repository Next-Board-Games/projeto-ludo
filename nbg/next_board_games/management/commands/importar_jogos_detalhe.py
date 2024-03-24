from django.core.management.base import BaseCommand, CommandError
import json
from next_board_games.models import Jogo, Mecanica, Categoria, Tema, Profissional

class Command(BaseCommand):
    help = 'Importa jogos de um arquivo JSON para o banco de dados'

    def add_arguments(self, parser):
        parser.add_argument('arquivo_json', type=str, help='O caminho do arquivo JSON para importar')

    def handle(self, *args, **kwargs):
        arquivo_json = kwargs['arquivo_json']
        try:
            with open(arquivo_json, 'r') as arquivo:
                jogos = json.load(arquivo)
        except FileNotFoundError:
            raise CommandError(f'O arquivo {arquivo_json} não foi encontrado.')

        for jogo_data in jogos:
            jogo, _ = Jogo.objects.update_or_create(
                id_jogo=jogo_data['id_jogo'],
                defaults={
                    'nm_jogo': jogo_data['nm_jogo'],
                    'thumb': jogo_data['thumb'],
                    'tp_jogo': jogo_data['tp_jogo'],
                    'link': jogo_data['link'],
                    'ano_publicacao': jogo_data['ano_publicacao'],
                    'ano_nacional': jogo_data['ano_nacional'],
                    'qt_jogadores_min': jogo_data['qt_jogadores_min'],
                    'qt_jogadores_max': jogo_data['qt_jogadores_max'],
                    'vl_tempo_jogo': jogo_data['vl_tempo_jogo'],
                    'idade_minima': jogo_data['idade_minima'],
                    'qt_tem': jogo_data['qt_tem'],
                    'qt_teve': jogo_data['qt_teve'],
                    'qt_favorito': jogo_data['qt_favorito'],
                    'qt_quer': jogo_data['qt_quer'],
                    'qt_jogou': jogo_data['qt_jogou']
                }
            )

            for mecanica_data in jogo_data['mecanicas']:
                mecanica, _ = Mecanica.objects.get_or_create(**mecanica_data)
                jogo.mecanicas.add(mecanica)

            for categoria_data in jogo_data['categorias']:
                categoria, _ = Categoria.objects.get_or_create(**categoria_data)
                jogo.categorias.add(categoria)

            for tema_data in jogo_data['temas']:
                tema, _ = Tema.objects.get_or_create(**tema_data)
                jogo.temas.add(tema)

            for artista_data in jogo_data['artistas']:
                artista, _ = Profissional.objects.get_or_create(**artista_data)
                jogo.artistas.add(artista)

            for designer_data in jogo_data['designers']:
                designer, _ = Profissional.objects.get_or_create(**designer_data)
                jogo.designers.add(designer)

            self.stdout.write(self.style.SUCCESS(f'Sucesso ao importar "{jogo.nm_jogo}"'))

