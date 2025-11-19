"""
Unified configuration for GHCI system
"""
import os
from dataclasses import dataclass
from pathlib import Path

@dataclass
class GHCIConfig:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ghci.db")
    
    # Ports
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    FRONTEND_PORT: int = int(os.getenv("FRONTEND_PORT", "3000"))
    INTEGRATION_PORT: int = int(os.getenv("INTEGRATION_PORT", "8001"))
    
    # Paths
    ROOT_DIR: Path = Path(__file__).parent
    MODELS_DIR: Path = ROOT_DIR / "ML" / "models"
    DATA_DIR: Path = ROOT_DIR / "data"
    LOGS_DIR: Path = ROOT_DIR / "logs"
    
    # ML Settings
    MODEL_VERSION: str = "1.0.0"
    BATCH_SIZE: int = 32
    
    # API Settings
    CORS_ORIGINS: list = None
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    def __post_init__(self):
        if self.CORS_ORIGINS is None:
            self.CORS_ORIGINS = [
                f"http://localhost:{self.FRONTEND_PORT}",
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ]
        
        # Create directories
        self.MODELS_DIR.mkdir(parents=True, exist_ok=True)
        self.DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.LOGS_DIR.mkdir(parents=True, exist_ok=True)

config = GHCIConfig()