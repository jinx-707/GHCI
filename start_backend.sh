#!/bin/bash

# GHCI Backend Startup Script
set -e  # Exit on error

echo "🚀 Starting GHCI Backend..."
echo "============================"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
REQUIRED_VERSION="3.9"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python 3.9+ is required. You have Python $PYTHON_VERSION"
    exit 1
fi

# Kill any existing processes on port 8000
echo ""
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
pkill -f "python.*api_gateway" 2>/dev/null || true
pkill -f "uvicorn.*api_gateway" 2>/dev/null || true
sleep 1

# Check if port is still in use
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 is still in use. Please manually kill the process."
    exit 1
fi

# Set environment variables
export DATABASE_URL="sqlite:///./ghci.db"
export DEBUG="true"
export BACKEND_PORT="8000"

# Check if dependencies are installed
echo ""
echo "🔍 Checking dependencies..."
MISSING_DEPS=0

for package in fastapi uvicorn pydantic sqlalchemy scikit-learn numpy pandas; do
    if ! python3 -c "import ${package}" 2>/dev/null; then
        echo "⚠️  Missing: $package"
        MISSING_DEPS=1
    fi
done

if [ $MISSING_DEPS -eq 1 ]; then
    echo ""
    echo "📦 Installing Python dependencies..."
    pip3 install -r requirements.txt || {
        echo "❌ Failed to install dependencies"
        exit 1
    }
else
    echo "✅ All dependencies installed"
fi

# Verify numpy/scikit-learn compatibility
echo ""
echo "🔍 Verifying package compatibility..."
python3 -c "
import numpy
import sklearn
try:
    from sklearn.cluster import KMeans
    print(f'✅ NumPy {numpy.__version__} and scikit-learn {sklearn.__version__} are compatible')
except Exception as e:
    print(f'❌ Compatibility issue: {e}')
    print('💡 Try: pip3 uninstall -y numpy scikit-learn && pip3 install \"numpy<2.0\" scikit-learn==1.2.2')
    exit(1)
" || {
    echo ""
    echo "⚠️  Package compatibility issue detected"
    read -p "Fix automatically? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pip3 uninstall -y numpy scikit-learn
        pip3 install "numpy>=1.26.0,<2.0.0" scikit-learn==1.2.2
    else
        echo "Please fix the compatibility issue and try again"
        exit 1
    fi
}

echo ""
echo "🔧 Starting API gateway on port 8000..."
echo ""
echo "📖 API Docs:     http://localhost:8000/docs"
echo "💚 Health Check: http://localhost:8000/api/v1/health"
echo "📊 Status:       http://localhost:8000/api/v1/status"
echo ""
echo "Press Ctrl+C to stop"
echo "============================"
echo ""

# Start the backend
python3 api_gateway.py


