from nbg.nbg.Infra.repositories.jogo_repository import JogoRepository

class GameService:
    def __init__(self):
        self.jogo_repository = JogoRepository()

    def get_game_recommendations(self, nome, mecanicas, categorias, temas):
        return self.jogo_repository.get_recommended_games(nome, mecanicas, categorias, temas)
