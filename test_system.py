#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8002"

def test_status():
    try:
        response = requests.get(f"{BASE_URL}/api/v1/status")
        print("✅ Status:", response.json())
        return True
    except Exception as e:
        print("❌ Status failed:", e)
        return False

def test_predict():
    try:
        data = {"description": "Starbucks Coffee", "amount": 450}
        response = requests.post(f"{BASE_URL}/api/v1/predict", json=data)
        print("✅ Predict:", response.json())
        return True
    except Exception as e:
        print("❌ Predict failed:", e)
        return False

def test_transactions():
    try:
        response = requests.get(f"{BASE_URL}/api/v1/transactions")
        print("✅ Transactions:", response.json())
        return True
    except Exception as e:
        print("❌ Transactions failed:", e)
        return False

if __name__ == "__main__":
    print("🧪 Testing Enhanced Backend...")
    
    tests = [test_status, test_predict, test_transactions]
    passed = sum(test() for test in tests)
    
    print(f"\n📊 Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All systems working!")
    else:
        print("⚠️ Some issues found")