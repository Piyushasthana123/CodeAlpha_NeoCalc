import pytest
from fastapi.testclient import TestClient
from main import app
from calculator import calculate
import database

client = TestClient(app)


def setup_function():
    database.init_db()
    database.clear_history()


def test_basic_addition():
    response = client.post("/api/calculate", json={"expression": "12+8"})
    assert response.status_code == 200
    assert response.json() == {"expression": "12+8", "result": 20}


def test_basic_subtraction():
    response = client.post("/api/calculate", json={"expression": "15-6"})
    assert response.status_code == 200
    assert response.json() == {"expression": "15-6", "result": 9}


def test_basic_multiplication():
    response = client.post("/api/calculate", json={"expression": "7*4"})
    assert response.status_code == 200
    assert response.json() == {"expression": "7*4", "result": 28}


def test_multiplication_unicode_symbol():
    response = client.post("/api/calculate", json={"expression": "7×4"})
    assert response.status_code == 200
    assert response.json()["result"] == 28


def test_basic_division():
    response = client.post("/api/calculate", json={"expression": "20/5"})
    assert response.status_code == 200
    assert response.json() == {"expression": "20/5", "result": 4}


def test_division_unicode_symbol():
    response = client.post("/api/calculate", json={"expression": "20÷5"})
    assert response.status_code == 200
    assert response.json()["result"] == 4


def test_decimal_calculation():
    response = client.post("/api/calculate", json={"expression": "5.5+2.5"})
    assert response.status_code == 200
    assert response.json() == {"expression": "5.5+2.5", "result": 8}


def test_decimal_floating_cleanup():
    response = client.post("/api/calculate", json={"expression": "0.1+0.2"})
    assert response.status_code == 200
    assert response.json()["result"] == 0.3


def test_operator_precedence():
    response = client.post("/api/calculate", json={"expression": "2+3*4"})
    assert response.status_code == 200
    assert response.json() == {"expression": "2+3*4", "result": 14}


def test_division_by_zero():
    response = client.post("/api/calculate", json={"expression": "10/0"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Cannot divide by zero"


def test_invalid_consecutive_operator_sequence():
    response = client.post("/api/calculate", json={"expression": "5++3"})
    assert response.status_code == 422
    assert "Invalid mathematical expression" in response.json()["detail"]


def test_incomplete_expression():
    response = client.post("/api/calculate", json={"expression": "8+"})
    assert response.status_code == 422
    assert "Invalid mathematical expression" in response.json()["detail"]


def test_empty_expression():
    response = client.post("/api/calculate", json={"expression": ""})
    assert response.status_code == 422


def test_arbitrary_code_injection_prevention():
    malicious = [
        "__import__('os').system('ls')",
        "eval('2+2')",
        "open('/etc/passwd').read()",
        "lambda: 5",
        "import sys",
    ]
    for expr in malicious:
        response = client.post("/api/calculate", json={"expression": expr})
        assert response.status_code == 422


def test_history_persistence_and_order():
    # Perform calculations
    client.post("/api/calculate", json={"expression": "7*4"})
    client.post("/api/calculate", json={"expression": "12+8"})

    # Fetch history
    history_resp = client.get("/api/history")
    assert history_resp.status_code == 200
    data = history_resp.json()["history"]

    assert len(data) == 2
    # Newest first
    assert data[0]["expression"] == "12+8"
    assert data[0]["result"] == 20
    assert data[1]["expression"] == "7*4"
    assert data[1]["result"] == 28


def test_clear_history():
    client.post("/api/calculate", json={"expression": "5+5"})
    history_resp = client.get("/api/history")
    assert len(history_resp.json()["history"]) == 1

    delete_resp = client.delete("/api/history")
    assert delete_resp.status_code == 200
    assert delete_resp.json()["message"] == "Calculation history cleared successfully"

    empty_history = client.get("/api/history")
    assert len(empty_history.json()["history"]) == 0


def test_route_aliases_without_api_prefix():
    # Test calculate without /api prefix
    calc_resp = client.post("/calculate", json={"expression": "10*3"})
    assert calc_resp.status_code == 200
    assert calc_resp.json()["result"] == 30

    # Test history without /api prefix
    hist_resp = client.get("/history")
    assert hist_resp.status_code == 200
    assert len(hist_resp.json()["history"]) == 1
    assert hist_resp.json()["history"][0]["expression"] == "10*3"

    # Test root and health check
    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    root_resp = client.get("/")
    assert root_resp.status_code == 200

    # Test delete history without /api prefix
    del_resp = client.delete("/history")
    assert del_resp.status_code == 200
    empty_resp = client.get("/history")
    assert len(empty_resp.json()["history"]) == 0

