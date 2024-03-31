import logging
from social_core.exceptions import AuthAlreadyAssociated
from social_django.models import UserSocialAuth

# Define your custom exception here
class SocialAuthAlreadyAssociated(AuthAlreadyAssociated):
    pass

# Set up logging
logger = logging.getLogger(__name__)

def already_registered(strategy, details, response, uid, user=None, *args, **kwargs):
    logger.info('Running already_registered function')
    if user:
        logger.info('User is provided')
        return {'is_new': False, 'user': user}

    try:
        logger.info('Trying to get social auth')
        social = UserSocialAuth.objects.get(provider=kwargs['backend'].name, uid=uid)
        user = social.user
        logger.info('Social auth exists, returning the user')
        return {'is_new': False, 'user': user}
    except UserSocialAuth.DoesNotExist:
        logger.info('Social auth does not exist, continuing to create a new user')
        return
    except AuthAlreadyAssociated:
        logger.error('AuthAlreadyAssociated exception is raised')
        raise SocialAuthAlreadyAssociated(strategy.backend)