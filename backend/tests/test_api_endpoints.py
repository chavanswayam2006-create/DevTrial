"""
DevTrail AI - API Endpoints and Vercel Route Compatibility Tests
Verifies that FastAPI serves all routes both with and without the '/api' prefix,
ensuring seamless compatibility with Vercel multi-service rewrites.
"""

import pytest
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoints():
    for url in ["/", "/health", "/api/health"]:
        res = client.get(url)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"


def test_curriculum_endpoints():
    for url in ["/curriculum", "/api/curriculum"]:
        res = client.get(url)
        assert res.status_code == 200
        data = res.json()
        assert "nodes" in data
        assert "edges" in data
        assert "node_a" in data["nodes"]
        assert "node_g" in data["nodes"]


def test_route_endpoints():
    payload = {
        "algorithm": "astar",
        "start_node": "node_a",
        "goal_node": "node_g",
        "mastered_nodes": ["node_a", "node_b"],
    }
    for url in ["/route", "/api/route"]:
        res = client.post(url, json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["path"][0] == "node_a"
        assert data["path"][-1] == "node_g"


def test_labs_list_endpoints():
    for url in ["/labs", "/api/labs"]:
        res = client.get(url)
        assert res.status_code == 200
        labs = res.json()
        assert len(labs) == 10
        assert labs[0]["id"] == "lab_01"
        assert labs[-1]["id"] == "lab_10"


def test_lab_run_endpoint():
    for url in ["/labs/lab_01/run", "/api/labs/lab_01/run"]:
        res = client.post(url, json={"quiz_score": 90, "confidence": 85})
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "peas_matrix" in data


def test_entrypoint_imports():
    """Verify that both api.index and main expose the FastAPI app instance."""
    from api.index import app as vercel_app
    from main import app as root_app
    assert vercel_app is not None
    assert root_app is not None
