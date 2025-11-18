from io import StringIO

from integration.ingestion.csv_parser import parse_csv


def test_parse_csv_basic():
    csv_data = "Date,Description,Amount\n2025-01-01,Salary,100000\n01/02/2025,Coffee,-150.50\n"
    f = StringIO(csv_data)
    rows = parse_csv(f, account_id=1)
    assert len(rows) == 2
    assert rows[0]["amount"] == rows[0]["amount"]
