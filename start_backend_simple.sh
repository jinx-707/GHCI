#!/bin/bash

echo "🚀 Starting GHCI Backend..."

# Kill any existing backend processes
pkill -f "api_gateway.py" 2>/dev/null || true
pkill -f "python.*8000" 2>/dev/null || true

# Wait a moment
sleep 2

# Start the backend
echo "Starting API Gateway on port 8000..."
cd "$(dirname "$0")"
python3 api_gateway.py &

# Wait for backend to start
sleep 5

# Test if backend is running
if curl -s http://localhost:8000/api/v1/status > /dev/null; then
    echo "✅ Backend started successfully!"
    echo "🌐 API available at: http://localhost:8000"
    echo "📚 API docs at: http://localhost:8000/docs"
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo "Backend is running in the background..."