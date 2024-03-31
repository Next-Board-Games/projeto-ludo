from django.shortcuts import redirect
from .pipeline import SocialAuthAlreadyAssociated

class SocialAuthExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

from django.http import JsonResponse

def process_exception(self, request, exception):
    if isinstance(exception, SocialAuthAlreadyAssociated):
        return JsonResponse({'error': 'This social account is already associated with a user.'}, status=409)