from django.core.management.base import BaseCommand
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sqlalchemy import create_engine
from django.conf import settings

class Command(BaseCommand):
    help = 'Prepara os dados e treina o modelo de clustering'

    def handle(self, *args, **kwargs):
        # Acesso à configuração do banco de dados a partir de settings.py
        db_settings = settings.DATABASES['default']
        user = db_settings['USER']
        password = db_settings['PASSWORD']
        database = db_settings['NAME']
        host = db_settings['HOST']
        port = db_settings['PORT']
        engine = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{database}')

        # Query SQL para selecionar os dados
        sql_query = "SELECT * FROM jogos"
        
        # Carregar os dados diretamente do PostgreSQL
        df = pd.read_sql_query(sql_query, engine)

        # Pré-processamento, imputadores e preprocessor permanecem inalterados, como no código original

        num_imputer = SimpleImputer(strategy='mean')
        cat_imputer = SimpleImputer(strategy='constant', fill_value='desconhecido')

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', Pipeline(steps=[('imputer', num_imputer), ('scaler', StandardScaler())]), ['qt_jogadores_min', 'qt_jogadores_max', 'vl_tempo_jogo', 'idade_minima']),
                ('cat', Pipeline(steps=[('imputer', cat_imputer), ('encoder', OneHotEncoder(handle_unknown='ignore'))]), ['mecanicas', 'categorias', 'temas'])
            ]
        )

        kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
        pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('cluster', kmeans)])

        cols_for_clustering = ['qt_jogadores_min', 'qt_jogadores_max', 'vl_tempo_jogo', 'idade_minima', 'mecanicas', 'categorias', 'temas']
        df_clustering = df[cols_for_clustering]
        pipeline.fit(df_clustering)

        df['cluster'] = pipeline.predict(df_clustering)

        popularity_cols = ['qt_quer', 'qt_favorito', 'qt_jogou', 'qt_tem', 'qt_teve']
        df['popularity_score'] = df[popularity_cols].sum(axis=1)