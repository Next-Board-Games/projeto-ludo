from django.contrib.auth import login
from social_core.exceptions import AuthAlreadyAssociated
from social_django.models import UserSocialAuth

def already_registered(strategy, details, response, uid, user=None, *args, **kwargs):
    if user:
        return {'is_new': False, 'user': user}

    try:
        social = UserSocialAuth.objects.get(provider=kwargs['backend'].name, uid=uid)
        user = social.user
        # Efetua o login do usuário sem a necessidade de redirecionamento
        login(strategy.request, user, backend='django.contrib.auth.backends.ModelBackend')
        # Indica que o usuário já existe e foi logado
        return {'is_new': False, 'user': user}
    except UserSocialAuth.DoesNotExist:
        # Caso não exista, o processo continua para criar um novo usuário
        return