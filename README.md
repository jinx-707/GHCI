# GHCI - Financial Coach AI System

A comprehensive financial coaching AI system that provides transaction categorization, spending analysis, forecasting, and personalized financial advice.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
./start.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
pip install -r requirements.txt
cd frontend && npm install && cd ..

# Train models
cd ML && python train.py && cd ..

# Start API
python api_gateway.py &

# Start frontend
cd frontend && npm run dev
```

### Option 3: Docker
```bash
docker-compose up --build
```

## 📊 System Architecture

- **Frontend**: React.js with Vite
- **Backend**: FastAPI with ML integration
- **Integration Layer**: Data ingestion and processing
- **ML Models**: Scikit-learn for categorization and fraud detection
- **Database**: SQLite (default) or PostgreSQL

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **System Status**: http://localhost:8000/api/v1/status

## 🔧 Features

- ✅ Transaction categorization using ML
- ✅ Spending analysis and insights
- ✅ Cash flow forecasting
- ✅ Fraud detection
- ✅ Budget tracking
- ✅ Financial coaching recommendations
- ✅ Data visualization
- ✅ File upload for transaction data

## 📁 Project Structure

```
GHCI/
├── frontend/          # React frontend
├── backend/           # FastAPI backend
├── integration/       # Data integration layer
├── ML/               # Machine learning models
├── api_gateway.py    # Unified API gateway
├── config.py         # System configuration
├── start.sh          # Startup script
└── requirements.txt  # Python dependencies
```

## 🛠️ Development

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Environment Variables
```bash
DATABASE_URL=sqlite:///./ghci.db
DEBUG=true
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

### Testing
```bash
# Backend tests
cd backend && python -m pytest

# Integration tests
cd integration && python -m pytest

# ML tests
cd ML && python test.py
```

## 📈 Usage

1. **Upload Transactions**: Use the web interface to upload CSV files
2. **View Dashboard**: Monitor spending patterns and insights
3. **Get Predictions**: Real-time transaction categorization
4. **Receive Coaching**: Personalized financial advice
5. **Track Budget**: Set and monitor budget goals

## 🔒 Security

- Input validation and sanitization
- SQL injection prevention
- CORS protection
- Secure file upload handling

## 📝 License

MIT License - see LICENSE file for details