# Generated by Django 5.0.3 on 2024-03-24 23:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id_categoria', models.IntegerField(primary_key=True, serialize=False)),
                ('nm_categoria', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Mecanica',
            fields=[
                ('id_mecanica', models.IntegerField(primary_key=True, serialize=False)),
                ('nm_mecanica', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Profissional',
            fields=[
                ('id_profissional', models.IntegerField(primary_key=True, serialize=False)),
                ('nm_profissional', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Tema',
            fields=[
                ('id_tema', models.IntegerField(primary_key=True, serialize=False)),
                ('nm_tema', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Jogo',
            fields=[
                ('id_jogo', models.IntegerField(primary_key=True, serialize=False)),
                ('nm_jogo', models.CharField(max_length=255)),
                ('thumb', models.URLField()),
                ('tp_jogo', models.CharField(max_length=1)),
                ('link', models.URLField()),
                ('ano_publicacao', models.IntegerField()),
                ('ano_nacional', models.IntegerField()),
                ('qt_jogadores_min', models.IntegerField()),
                ('qt_jogadores_max', models.IntegerField()),
                ('vl_tempo_jogo', models.IntegerField()),
                ('idade_minima', models.IntegerField()),
                ('qt_tem', models.IntegerField()),
                ('qt_teve', models.IntegerField()),
                ('qt_favorito', models.IntegerField()),
                ('qt_quer', models.IntegerField()),
                ('qt_jogou', models.IntegerField()),
                ('categorias', models.ManyToManyField(to='next_board_games.categoria')),
                ('mecanicas', models.ManyToManyField(to='next_board_games.mecanica')),
                ('artistas', models.ManyToManyField(related_name='artistas', to='next_board_games.profissional')),
                ('designers', models.ManyToManyField(related_name='designers', to='next_board_games.profissional')),
                ('temas', models.ManyToManyField(to='next_board_games.tema')),
            ],
        ),
    ]
