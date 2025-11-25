from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.core.config import settings
from fastapi import HTTPException, status

def verify_google_token(token: str) -> dict:
    try:
        # Verify the token using Google's library
        id_info = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )

        # Google accounts have multiple issuers, check both
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # Return the user info (email, name, picture, etc.)
        return id_info
    except ValueError as e:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google Token",
        )