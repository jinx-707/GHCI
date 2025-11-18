FinCoach AI — Integration Layer (Member 3)
=========================================

This package implements a local/offline integration layer for FinCoach AI.

Quick start
-----------

1. Create a PostgreSQL database (example):

   ```bash
   psql -c "CREATE DATABASE fincoach;"
   ```

2. Set `DATABASE_URL` env var, e.g.:

   ```bash
   export DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/fincoach
   ```

3. Install requirements:

   ```bash
   pip install -r integration/requirements.txt
   ```

4. Create tables (simple option):

   ```bash
   psql -d fincoach -f integration/db/schemas.sql
   ```

   Or use Alembic (not scaffolded here) and the `schemas.sql` as reference.

5. Run the app:

   ```bash
   python integration/main.py
   ```

API endpoints
-------------

- POST `/integration/transactions/upload-csv` form-data `file`, `account_id`
- GET `/integration/transactions/unclassified`
- POST `/integration/transactions/apply-ml` body: list of `{transaction_id,predicted_category,confidence}`
- POST `/integration/feedback` body: feedback payload
- POST `/integration/users/{user_id}/portfolio/recompute`
- GET `/integration/users/{user_id}/portfolio`

CSV format
----------
CSV should contain columns: `Date, Description, Amount` (Date supports `YYYY-MM-DD` or `DD/MM/YYYY`).
