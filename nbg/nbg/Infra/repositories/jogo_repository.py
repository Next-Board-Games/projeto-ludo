from django.core.cache import cache
from nbg.nbg.Domain.Models.jogo import Jogo

class JogoRepository:
    def get_recommended_games(self, nome, mecanicas, categorias, temas):
        cache_key = f'recomendacoes_{nome}_{"".join(mecanicas)}_{"".join(categorias)}_{"".join(temas)}'
        recomendacoes = cache.get(cache_key)

        if not recomendacoes:
            jogos_query = Jogo.objects.all()
            if nome:
                jogos_query = jogos_query.filter(nm_jogo__iexact=nome)

            recomendacoes = list(jogos_query.values('id_jogo', 'nm_jogo', 'thumb', 'link', 'cluster', 'popularity_score')[:3])
            cache.set(cache_key, recomendacoes, timeout=3600)
        return recomendacoes
