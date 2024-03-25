from django.core.management.base import BaseCommand
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sqlalchemy import create_engine
from django.conf import settings
import joblib
from io import BytesIO
from next_board_games.models import ModelStorage

class Command(BaseCommand):
    help = 'Prepara os dados, treina o modelo de clustering e salva o modelo no banco de dados'

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

        # Preparação dos dados e treinamento do modelo
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

        # Serialização e armazenamento do modelo
        buffer = BytesIO()
        joblib.dump(pipeline, buffer)
        buffer.seek(0)

        # Usando o Django ORM para inserção
        model_storage_instance = ModelStorage(model_data=buffer.getvalue())
        model_storage_instance.save()

        print("Modelo treinado salvo no banco de dados.")