from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass
class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/fincoach"
    )
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./data/uploads")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


def get_settings() -> Settings:
    return Settings()
