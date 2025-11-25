from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 1. We specify the TYPE (: str)
    # 2. We specify a DEFAULT value (= "...")
    # 3. Pydantic automatically checks your .env file for these names.
    
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "blind_connect"
    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Your Google ID
    GOOGLE_CLIENT_ID: str = "1055327279448-jfet3d41q36jmoem2hg9f0g1gt9rorqg.apps.googleusercontent.com"

    class Config:
        env_file = ".env"

settings = Settings()