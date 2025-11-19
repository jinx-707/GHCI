FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install && npm run build

# Back to app directory
WORKDIR /app

# Train models if needed
RUN cd ML && python train.py || true

# Copy models to backend
RUN mkdir -p backend/models && cp ML/models/*.pkl backend/models/ || true

# Expose ports
EXPOSE 8000 3000

# Start command
CMD ["python", "api_gateway.py"]