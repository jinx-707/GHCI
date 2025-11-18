from __future__ import annotations

from fastapi import FastAPI

from integration.api.endpoints import ingestion_routes, transaction_routes, portfolio_routes, feedback_routes


def create_app() -> FastAPI:
    app = FastAPI(title="FinCoach AI - Integration Layer")
    app.include_router(ingestion_routes.router)
    app.include_router(transaction_routes.router)
    app.include_router(portfolio_routes.router)
    app.include_router(feedback_routes.router)
    return app


app = create_app()
