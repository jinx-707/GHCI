#!/bin/bash

# GHCI Unified Startup Script
echo "🚀 Starting GHCI Financial Coach AI System..."
echo "=============================================="

# Check prerequisites
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

# Kill any existing processes on ports 8000 and 3000/5173
echo ""
echo "🧹 Cleaning up existing processes..."
# Kill processes on specific ports
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
# Kill processes by name
pkill -f "python.*api_gateway" 2>/dev/null || true
pkill -f "uvicorn.*api_gateway" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Set environment variables
export DATABASE_URL="sqlite:///./ghci.db"
export DEBUG="true"
export BACKEND_PORT="8000"
export FRONTEND_PORT="3000"

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

# Check and copy models
echo ""
echo "🤖 Checking ML models..."
if [ ! -f "ML/models/model.pkl" ]; then
    echo "⚠️  ML models not found. Training models..."
    cd ML && python3 train.py && cd ..
fi

# Copy models to backend if needed
if [ -f "ML/models/model.pkl" ] && [ ! -f "backend/models/model.pkl" ]; then
    echo "📋 Copying models to backend..."
    mkdir -p backend/models
    cp ML/models/*.pkl backend/models/ 2>/dev/null || true
fi

# Start API gateway
echo ""
echo "🔧 Starting unified API gateway..."
python3 api_gateway.py &
API_PID=$!

# Wait for API to be ready
echo "⏳ Waiting for API to start..."
sleep 3

# Check if API is running
if curl -s http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✅ API gateway is running on port 8000"
else
    echo "⚠️  API gateway may not be ready yet, continuing..."
fi

# Start frontend
echo ""
echo "🎨 Starting frontend..."
cd frontend
npm run dev -- --port 3000 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ GHCI System Started Successfully!"
echo "===================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo "💚 Health Check: http://localhost:8000/api/v1/health"
echo "===================================="
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $API_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
