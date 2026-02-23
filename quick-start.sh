#!/bin/bash

# Quick Start Script for Metric Alerting Platform (macOS/Linux)

echo ""
echo "========================================"
echo "  Real-Time Metric Alerting Platform"
echo "  Quick Start Script"
echo "========================================"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Checking Node.js version..."
node --version
echo ""

echo "[1/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "[3/4] Starting backend server (port 5000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..
echo "✓ Backend running (PID: $BACKEND_PID)"
echo ""

sleep 2

echo "[4/4] Starting frontend dev server (port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo "✓ Frontend running (PID: $FRONTEND_PID)"
echo ""

echo "========================================"
echo "  ✓ Application Started!"
echo "========================================"
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:5000"
echo "  API Docs:  See README.md"
echo ""
echo "Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Wait for both processes
wait
