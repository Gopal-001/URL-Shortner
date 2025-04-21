import os
from pydantic import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "URL Shortener"
    
    # Base URL for the frontend (used to generate short URLs)
    FRONTEND_BASE_URL: str = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
    
    # Elasticsearch settings
    ELASTICSEARCH_HOST: str = os.getenv("ELASTICSEARCH_HOST", "localhost")
    ELASTICSEARCH_PORT: int = int(os.getenv("ELASTICSEARCH_PORT", "9200"))
    ELASTICSEARCH_URL: str = f"http://{ELASTICSEARCH_HOST}:{ELASTICSEARCH_PORT}"
    ELASTICSEARCH_API_KEY: str = os.getenv("ELASTICSEARCH_API_KEY", "")
    
    # URL shortening settings
    SHORT_URL_ALPHABET: str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    SHORT_URL_LENGTH: int = 6
    
    # CORS settings
    CORS_ORIGINS: list = ["http://localhost:5173"]
    
    class Config:
        case_sensitive = True

settings = Settings()
