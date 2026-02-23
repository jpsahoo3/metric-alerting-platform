# Real-Time Metric Alerting Platform

A full-stack alerting system for monitoring operational metrics in real-time. Configure alert rules, ingest metrics via REST API, and automatically trigger alerts when thresholds are breached.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Deployment](#deployment)

## Architecture

**Frontend** (React + Vite)
UI for managing alert rules, simulating metrics, and viewing alert history

**Backend** (Express.js)
REST API with in-memory data store for alert rules and triggered events

**Data Flow:** Configure alerts → Submit metrics → Auto-evaluate → Trigger alerts → View history

## Features

- **Alert Rules Management** - Create, view, and delete alert rules with threshold-based conditions
- **Real-Time Metric Ingestion** - Accept metric data via REST API with optional timestamps
- **Automatic Alert Triggering** - Evaluate metrics against rules with GT, LT, GTE, LTE, EQ comparators
- **Alert History** - View triggered alerts with filtering and statistics
- **Responsive UI** - React-based frontend with real-time updates

## Quick Start

**Prerequisites:** Node.js 16+ and npm

```bash
# Automated setup (Recommended)
./quick-start.sh          # macOS/Linux
# or
quick-start.bat           # Windows

# Manual setup
# Terminal 1: Backend
cd backend && npm install && npm start

# Terminal 2: Frontend
cd frontend && npm install && npm run dev

# Access: http://localhost:3000
```

---



## API Reference

### Alerts

**Create Alert**
```
POST /alerts
Content-Type: application/json

{
  "name": "CPU High",
  "metricName": "cpu_usage",
  "threshold": 80,
  "comparator": "GT",
  "alertMessage": "CPU is high"
}
```

**List Alerts**
```
GET /alerts
```

**Delete Alert**
```
DELETE /alerts/{id}
```

### Metrics

**Submit Metric**
```
POST /metrics
Content-Type: application/json

{
  "metricName": "cpu_usage",
  "value": 95,
  "timestamp": "2024-01-01T10:00:00.000Z"  // Optional
}
```

### Alert Events

**Get Events**
```
GET /alert-events
```

**Filter Events**
```
GET /alert-events?metricName=cpu_usage&alertName=CPU%20High
```

Supported comparators: `GT`, `LT`, `GTE`, `LTE`, `EQ`

---

## Project Structure

```
metric-alerting-platform/
├── backend/
│   ├── src/
│   │   ├── index.js              - Express server & routes
│   │   ├── alertService.js       - Business logic & evaluation
│   │   └── models.js             - In-memory data store
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertManagement.jsx
│   │   │   ├── MetricSimulation.jsx
│   │   │   └── AlertEvents.jsx
│   │   ├── services/
│   │   │   └── api.js            - API client
│   │   ├── styles/
│   │   │   └── styles.css        - Global styles
│   │   ├── App.jsx               - Main component & routing
│   │   └── main.jsx              - Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── tests/
│   ├── api.test.py               - Integration tests
│   └── requirements.txt
│
├── .gitignore
├── quick-start.sh                - macOS/Linux setup script
├── quick-start.bat               - Windows setup script
└── README.md
```

---

## Deployment

### Development

```bash
cd backend && npm install && npm start   # Backend on port 5000
cd frontend && npm install && npm run dev # Frontend on port 3000
```

### Production

**Frontend (Vercel, Netlify, etc.)**
```bash
npm run build
# Deploy the dist/ folder
```

**Backend (Render, Railway, etc.)**
```bash
npm start
```

Set environment variable for API port if needed.

---

**Last Updated:** February 2024
