import logging
from social_django.models import UserSocialAuth
from social_core.exceptions import AuthAlreadyAssociated
from .exceptions import SocialAuthAlreadyAssociated

# Set up detailed logging
logger = logging.getLogger(__name__)

def already_registered(strategy, details, response, uid, user=None, *args, **kwargs):
    logger.info("Entering the already_registered function in the pipeline.")

    if user:
        logger.info(f"A user is already provided: {user.username}")
        return {'is_new': False, 'user': user}

    try:
        social = UserSocialAuth.objects.get(provider=kwargs['backend'].name, uid=uid)
        logger.info(f"Found an existing association for UID {uid} with user: {social.user.username}")
        # Raising custom exception when the social account is already associated
        raise SocialAuthAlreadyAssociated(strategy.backend.name, social.user)
    except UserSocialAuth.DoesNotExist:
        logger.info("No existing association found, proceeding with the pipeline.")
        return
    except AuthAlreadyAssociated as e:
        logger.error(f"AuthAlreadyAssociated exception caught for user {user}, UID {uid}.")
        raise SocialAuthAlreadyAssociated(strategy.backend.name) from e