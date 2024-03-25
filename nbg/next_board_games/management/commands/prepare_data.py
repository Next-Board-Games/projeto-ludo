from django.core.management.base import BaseCommand
from django.db import connection
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from next_board_games.models import Jogo

class Command(BaseCommand):
    help = 'Prepara os dados, treina o modelo de clustering e atualiza cada jogo com seu cluster'

    def handle(self, *args, **options):
        sql_query = "SELECT * FROM next_board_games_jogo"
        
        # Usar a conexão do Django para executar a consulta SQL
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            df = pd.DataFrame(rows, columns=columns)

        # Preparação dos dados e treinamento do modelo
        # Obs: A coluna de categorias, mecânicas e temas precisarão ser pré-processadas separadamente,
        # já que são relacionamentos ManyToMany e não serão diretamente acessíveis em um DataFrame.
        num_columns = ['qt_jogadores_min', 'qt_jogadores_max', 'vl_tempo_jogo', 'idade_minima']
        num_imputer = SimpleImputer(strategy='mean')
        
        preprocessor = ColumnTransformer(transformers=[
            ('num', Pipeline(steps=[('imputer', num_imputer), ('scaler', StandardScaler())]), num_columns)
        ])
        
        kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
        pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('cluster', kmeans)])
        
        # Filtrar o DataFrame para incluir somente as colunas numéricas especificadas
        df_clustering = df[num_columns]
        pipeline.fit(df_clustering)
        
        # Predizer os clusters para os dados
        df['cluster'] = pipeline.predict(df_clustering)
        
        # Atualizar cada jogo com seu cluster
        for index, row in df.iterrows():
            Jogo.objects.filter(id_jogo=row['id_jogo']).update(cluster=row['cluster'])

        self.stdout.write(self.style.SUCCESS('Dados preparados e modelo de clustering aplicado com sucesso.'))