from __future__ import annotations

import os
from pathlib import Path
from typing import IO


def save_upload(file_obj: IO, filename: str, upload_dir: str = "./data/uploads") -> str:
    Path(upload_dir).mkdir(parents=True, exist_ok=True)
    safe_name = Path(filename).name
    path = Path(upload_dir) / safe_name
    with open(path, "wb") as f:
        # file_obj might be UploadFile or file-like
        data = file_obj.read()
        if isinstance(data, str):
            data = data.encode("utf-8")
        f.write(data)
    return str(path)
