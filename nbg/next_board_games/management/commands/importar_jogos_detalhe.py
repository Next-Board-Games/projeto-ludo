from django.core.management.base import BaseCommand
import json
from django.db import transaction
from next_board_games.models import Jogo, Mecanica, Categoria, Tema, Profissional

class Command(BaseCommand):
    help = 'Importa jogos a partir de um arquivo JSON para o banco de dados'

    def add_arguments(self, parser):
        parser.add_argument('arquivo_json', type=str, help='O caminho do arquivo JSON contendo os jogos')

    @transaction.atomic
    def handle(self, *args, **options):
        arquivo_json = options['arquivo_json']
        
        with open(arquivo_json, 'r', encoding='utf-8') as file:
            jogos_data = json.load(file)
            
            for jogo_data in jogos_data:
                jogo = Jogo.objects.create(
                    id_jogo=jogo_data['id_jogo'],
                    nm_jogo=jogo_data['nm_jogo'],
                    thumb=jogo_data.get('thumb'),
                    tp_jogo=jogo_data.get('tp_jogo'),
                    link=jogo_data.get('link'),
                    ano_publicacao=jogo_data.get('ano_publicacao'),
                    ano_nacional=jogo_data.get('ano_nacional'),
                    qt_jogadores_min=jogo_data.get('qt_jogadores_min'),
                    qt_jogadores_max=jogo_data.get('qt_jogadores_max'),
                    vl_tempo_jogo=jogo_data.get('vl_tempo_jogo'),
                    idade_minima=jogo_data.get('idade_minima'),
                    qt_tem=jogo_data.get('qt_tem'),
                    qt_teve=jogo_data.get('qt_teve'),
                    qt_favorito=jogo_data.get('qt_favorito'),
                    qt_quer=jogo_data.get('qt_quer'),
                    qt_jogou=jogo_data.get('qt_jogou')
                )

                for mecanica_data in jogo_data['mecanicas']:
                    mecanica, _ = Mecanica.objects.get_or_create(
                        id_mecanica=mecanica_data['id_mecanica'],
                        defaults={'nm_mecanica': mecanica_data['nm_mecanica']}
                    )
                    jogo.mecanicas.add(mecanica)

                for categoria_data in jogo_data['categorias']:
                    categoria, _ = Categoria.objects.get_or_create(
                        id_categoria=categoria_data['id_categoria'],
                        defaults={'nm_categoria': categoria_data['nm_categoria']}
                    )
                    jogo.categorias.add(categoria)

                for tema_data in jogo_data['temas']:
                    tema, _ = Tema.objects.get_or_create(
                        id_tema=tema_data['id_tema'],
                        defaults={'nm_tema': tema_data['nm_tema']}
                    )
                    jogo.temas.add(tema)

                for artista_data in jogo_data['artistas']:
                    artista, _ = Profissional.objects.get_or_create(
                        id_profissional=artista_data['id_profissional'],
                        defaults={'nm_profissional': artista_data['nm_profissional']}
                    )
                    jogo.artistas.add(artista)

                for designer_data in jogo_data['designers']:
                    designer, _ = Profissional.objects.get_or_create(
                        id_profissional=designer_data['id_profissional'],
                        defaults={'nm_profissional': designer_data['nm_profissional']}
                    )
                    jogo.designers.add(designer)

                self.stdout.write(self.style.SUCCESS(f'Jogo "{jogo.nm_jogo}" importado com sucesso.'))