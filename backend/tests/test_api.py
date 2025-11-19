import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add root to path to import api_gateway
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from api_gateway import app

client = TestClient(app)

def test_health():
    r = client.get('/api/v1/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'
