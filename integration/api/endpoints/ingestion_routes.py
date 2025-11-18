from __future__ import annotations

import io
import logging

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from integration.api.deps import get_db_dep
from integration.ingestion.ingestion_service import ingest_csv_to_db
from integration.ingestion.utils.file_reader import save_upload
from integration.pipelines.cache_layer import clear_transaction_cache_for_user
from integration.db.models import Account

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/integration/transactions/upload-csv")
async def upload_csv(file: UploadFile = File(...), account_id: int = Form(...), db: Session = Depends(get_db_dep)):
    data = await file.read()
    file_like = io.StringIO(data.decode("utf-8"))
    inserted = ingest_csv_to_db(db, file_like, account_id, source_type="csv")
    # Invalidate caches for user(s) owning this account: resolve account -> user_id
    account = db.get(Account, account_id)
    if account and account.user_id:
        clear_transaction_cache_for_user(account.user_id)
    return {"inserted": inserted}
