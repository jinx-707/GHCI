from __future__ import annotations

import os

import uvicorn

from integration.api.app import app


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("integration.api.app:app", host="0.0.0.0", port=port, reload=False)
