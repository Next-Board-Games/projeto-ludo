from django.core.management.base import BaseCommand
from django.db import connection
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from next_board_games.models import Jogo
import numpy as np

class Command(BaseCommand):
    help = 'Determina automaticamente o melhor número de clusters usando o método do cotovelo, sem visualização.'

    def handle(self, *args, **options):
        sql_query = "SELECT * FROM next_board_games_jogo"
        
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            df = pd.DataFrame(rows, columns=columns)

        num_columns = ['qt_jogadores_min', 'qt_jogadores_max', 'vl_tempo_jogo', 'idade_minima']
        num_imputer = SimpleImputer(strategy='mean')
        
        preprocessor = ColumnTransformer(transformers=[
            ('num', Pipeline(steps=[('imputer', num_imputer), ('scaler', StandardScaler())]), num_columns)
        ])

        # Preparar dados
        df_clustering = df[num_columns]
        data_prepared = preprocessor.fit_transform(df_clustering)

        # Método do Cotovelo sem plotar
        distortions = []
        K = range(1, 11)  # Testando de 1 a 10 clusters
        for k in K:
            kmeanModel = KMeans(n_clusters=k, random_state=42)
            kmeanModel.fit(data_prepared)
            distortions.append(kmeanModel.inertia_)

        # Identificar o ponto do cotovelo
        k_optimal = self.find_elbow_point(distortions)

        # Recalcular o modelo usando o número ideal de clusters encontrado
        final_kmeans = KMeans(n_clusters=k_optimal, random_state=42, n_init=10)
        df['cluster'] = final_kmeans.fit_predict(data_prepared)

        # Atualizar cada jogo com seu cluster
        for index, row in df.iterrows():
            Jogo.objects.filter(id_jogo=row['id_jogo']).update(cluster=row['cluster'])

        self.stdout.write(self.style.SUCCESS(f'Dados preparados e modelo de clustering recalibrado com sucesso usando {k_optimal} clusters.'))

    def find_elbow_point(self, distortions):
        """
        Identifica o ponto de cotovelo analisando a curva de distorção.
        """
        # Calcula a segunda derivada das distorções
        second_derivative = np.diff(distortions, 2)
        # O ponto de cotovelo é onde a segunda derivada é máxima (em valor absoluto)
        elbow_point = np.argmin(second_derivative) + 1  # +1 devido ao cálculo da diferença
        return elbow_point + 1  # +1 para compensar o início do range de K em 1