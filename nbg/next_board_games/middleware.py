from django.http import JsonResponse
from .exceptions import SocialAuthAlreadyAssociated
import logging

logger = logging.getLogger(__name__)

class SocialAuthExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, SocialAuthAlreadyAssociated):
            logger.info("SocialAuthAlreadyAssociated exception caught in middleware.")
            return JsonResponse({'error': 'This social account is already associated with a user.'}, status=409)