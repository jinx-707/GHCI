#!/bin/bash

echo "🚀 Starting FinCoach AI Enhanced System..."

# Kill existing processes
pkill -f "python.*enhanced_backend.py" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null
lsof -ti :8002 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null

sleep 2

# Start enhanced backend
echo "📡 Starting Enhanced Backend..."
python enhanced_backend.py &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Upload sample data
echo "📊 Uploading sample transactions..."
curl -s -X POST -F "file=@sample_transactions.csv" http://localhost:8002/api/v1/upload-transactions > /dev/null

# Start frontend
echo "🎨 Starting Frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ System Ready!"
echo ""
echo "🌐 Access:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:8002"
echo ""
echo "🤖 Features:"
echo "   • Live ML predictions"
echo "   • CSV upload & processing"
echo "   • AI feedback system"
echo "   • Performance monitoring"
echo ""
echo "Press Ctrl+C to stop"

trap "echo '🛑 Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait