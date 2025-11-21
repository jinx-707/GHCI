#!/bin/bash

echo "🚀 Starting Enhanced FinCoach AI System..."

# Kill any existing processes
pkill -f "python.*enhanced_backend.py" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null

# Start enhanced backend
echo "📡 Starting Enhanced Backend (Port 8002)..."
cd /Users/apple/GHCI
python enhanced_backend.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend (Port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Enhanced FinCoach AI System Started!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Enhanced API: http://localhost:8002"
echo "   API Docs: http://localhost:8002/docs"
echo ""
echo "🤖 New Features:"
echo "   • ML-powered transaction categorization"
echo "   • Confidence scoring & explainable AI"
echo "   • Human-in-the-loop feedback system"
echo "   • CSV upload processing"
echo "   • Real-time performance monitoring"
echo "   • AI Insights dashboard"
echo ""
echo "📁 Navigate to AI Insights page to:"
echo "   • Upload transaction CSV files"
echo "   • Provide feedback on AI predictions"
echo "   • Monitor model performance"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait