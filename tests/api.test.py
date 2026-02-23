#!/usr/bin/env python3
"""
Simple API Test Script for Metric Alerting Platform
Run: python3 test_api.py
"""

import requests
import json
import time
from datetime import datetime

API_BASE = "http://localhost:5000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_health():
    """Test health check endpoint"""
    print_section("1. Health Check")
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"ERROR: {e}")

def test_get_alerts():
    """Get all alerts"""
    print_section("2. Get All Alerts")
    try:
        response = requests.get(f"{API_BASE}/alerts")
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"ERROR: {e}")

def test_create_alerts():
    """Create test alerts"""
    print_section("3. Create Alerts")
    
    alerts = [
        {
            "name": "High CPU Usage",
            "metricName": "cpu_usage",
            "threshold": 80,
            "comparator": "GT",
            "alertMessage": "CPU usage exceeded 80%!"
        },
        {
            "name": "High Memory Usage",
            "metricName": "memory_usage",
            "threshold": 85,
            "comparator": "GT",
            "alertMessage": "Memory usage exceeded 85%!"
        },
        {
            "name": "Disk Space Low",
            "metricName": "disk_usage",
            "threshold": 90,
            "comparator": "GT",
            "alertMessage": "Disk usage exceeded 90%!"
        }
    ]
    
    created_ids = []
    for alert in alerts:
        try:
            response = requests.post(f"{API_BASE}/alerts", json=alert)
            print(f"✓ Created: {alert['name']}")
            if response.status_code == 201:
                data = response.json()
                if data.get('success'):
                    created_ids.append(data['data']['id'])
                    print(f"  ID: {data['data']['id']}")
        except Exception as e:
            print(f"ERROR creating {alert['name']}: {e}")
    
    return created_ids

def test_submit_metrics():
    """Submit test metrics to trigger alerts"""
    print_section("4. Submit Metrics (Trigger Alerts)")
    
    metrics = [
        {"metricName": "cpu_usage", "value": 95, "message": "High CPU"},
        {"metricName": "memory_usage", "value": 92, "message": "High Memory"},
        {"metricName": "disk_usage", "value": 88, "message": "Normal Disk"},
    ]
    
    for metric in metrics:
        try:
            response = requests.post(
                f"{API_BASE}/metrics",
                json={
                    "metricName": metric["metricName"],
                    "value": metric["value"],
                    "timestamp": datetime.now().isoformat()
                }
            )
            data = response.json()
            triggered = data.get('data', {}).get('triggeredAlerts', 0)
            
            if triggered > 0:
                print(f"🚨 {metric['message']}: {metric['value']}")
                print(f"   ➜ {triggered} alert(s) triggered!")
                for event in data.get('data', {}).get('events', []):
                    print(f"   ✓ {event['alertMessage']}")
            else:
                print(f"✓ {metric['message']}: {metric['value']} (no alerts)")
        except Exception as e:
            print(f"ERROR: {e}")
        
        time.sleep(0.5)

def test_get_events():
    """Get all alert events"""
    print_section("5. Get All Alert Events")
    try:
        response = requests.get(f"{API_BASE}/alert-events")
        data = response.json()
        print(f"Status: {response.status_code}")
        print(f"Total Events: {len(data.get('data', []))}\n")
        
        for i, event in enumerate(data.get('data', [])[:5], 1):
            print(f"{i}. 🚨 {event['alertName']}")
            print(f"   Metric: {event['metricName']} = {event['metricValue']}")
            print(f"   Condition: {event['comparator']} {event['threshold']}")
            print(f"   Time: {event['timestamp']}")
            print()
    except Exception as e:
        print(f"ERROR: {e}")

def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║  Real-Time Metric Alerting Platform - API Test Suite      ║
║                                                            ║
║  Make sure both backend and frontend are running:         ║
║  Backend:  http://localhost:5000                          ║
║  Frontend: http://localhost:3000                          ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    # Run tests
    test_health()
    time.sleep(1)
    
    test_get_alerts()
    time.sleep(1)
    
    alert_ids = test_create_alerts()
    time.sleep(1)
    
    test_submit_metrics()
    time.sleep(1)
    
    test_get_events()
    
    print_section("✓ Test Complete!")
    print("Open http://localhost:3000 to see the UI in action\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\nERROR: {e}")
        print("Make sure the backend is running on http://localhost:5000")
