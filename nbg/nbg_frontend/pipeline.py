from social_core.exceptions import AuthAlreadyAssociated
from django.shortcuts import redirect

def your_custom_function(strategy, details, backend, user=None, *args, **kwargs):
    if 'social' in kwargs:
        if isinstance(kwargs['social'], AuthAlreadyAssociated):
            # Aqui você pode redirecionar para uma URL específica
            return redirect('/admin')
    return {}