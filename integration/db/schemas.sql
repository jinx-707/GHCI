-- SQL reference schema for integration.db models

CREATE TABLE IF NOT EXISTS dim_accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    account_name VARCHAR(100),
    account_type VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fact_transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES dim_accounts(account_id) NOT NULL,
    txn_date DATE NOT NULL,
    posted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    description_raw TEXT NOT NULL,
    description_clean TEXT,
    amount NUMERIC(14,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    direction VARCHAR(10),
    category_pred VARCHAR(100),
    category_final VARCHAR(100),
    ml_confidence NUMERIC(4,2),
    source_type VARCHAR(20),
    is_anomaly BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS fact_portfolio (
    portfolio_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    month DATE NOT NULL,
    total_income NUMERIC(14,2) DEFAULT 0,
    total_expense NUMERIC(14,2) DEFAULT 0,
    savings NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    UNIQUE (user_id, month)
);

CREATE TABLE IF NOT EXISTS feedback_logs (
    feedback_id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES fact_transactions(transaction_id) NOT NULL,
    predicted_category VARCHAR(100),
    corrected_category VARCHAR(100),
    confidence_score NUMERIC(4,2),
    feedback_source VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);
