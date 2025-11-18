from __future__ import annotations

from typing import Generator

from fastapi import Depends

from integration.db.db import get_db


def get_db_dep() -> Generator:
    yield from get_db()
