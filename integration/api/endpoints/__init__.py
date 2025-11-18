"""Endpoints package aggregator for integration.api.endpoints

This module imports the endpoint modules so callers can do:
    from integration.api.endpoints import ingestion_routes
"""

from . import ingestion_routes, transaction_routes, portfolio_routes, feedback_routes

__all__ = ["ingestion_routes", "transaction_routes", "portfolio_routes", "feedback_routes"]
