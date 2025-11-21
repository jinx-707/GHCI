const API_BASE_URL = 'http://localhost:8000';

// Mock data for fallback
const mockData = {
  transactions: [
    { id: '1', description: 'Starbucks Coffee', amount: 450, category: 'Dining', date: '2024-01-15' },
    { id: '2', description: 'Amazon Purchase', amount: 2500, category: 'Shopping', date: '2024-01-16' },
  ],
  categories: {
    'Dining': { total: 15000, count: 12 },
    'Shopping': { total: 25000, count: 8 },
    'Transportation': { total: 8000, count: 15 },
  }
};

class APIService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Return mock data for offline mode
      if (endpoint === '/api/v1/status') {
        return { 
          status: 'offline', 
          backend: 'offline',
          ml_models: { status: 'offline' },
          database: { status: 'offline' }
        };
      }
      if (endpoint === '/api/v1/predict') {
        return {
          success: false,
          prediction: {
            category: 'Other',
            category_confidence: 0.5,
            fraud_probability: 0.1,
            is_fraud: false,
            fraud_risk_level: 'LOW',
            amount_formatted: options.body ? `₹${JSON.parse(options.body).amount?.toLocaleString('en-IN') || '0'}` : '₹0',
            error: 'Backend offline - using fallback prediction'
          }
        };
      }
      throw error;
    }
  }

  async predict(text, amount = 0) {
    try {
      return await this.request('/api/v1/predict', {
        method: 'POST',
        body: JSON.stringify({ text, amount }),
      });
    } catch (error) {
      // Offline fallback prediction
      const fraudScore = this.calculateOfflineFraudScore(text, amount);
      return {
        success: true,
        prediction: {
          text: text,
          amount: amount,
          amount_formatted: `₹${amount?.toLocaleString('en-IN') || '0'}`,
          category: this.predictOfflineCategory(text),
          category_confidence: 0.85,
          fraud_probability: fraudScore,
          is_fraud: fraudScore > 0.5,
          fraud_risk_level: fraudScore > 0.8 ? 'CRITICAL' : fraudScore > 0.6 ? 'HIGH' : fraudScore > 0.4 ? 'MEDIUM' : 'LOW',
          risk_factors: this.getOfflineRiskFactors(text, amount),
          model_version: 'offline_fallback'
        }
      };
    }
  }

  calculateOfflineFraudScore(text, amount) {
    let score = 0.0;
    
    // High amount risk
    if (amount > 100000) score += 0.4;
    else if (amount > 50000) score += 0.2;
    else if (amount > 25000) score += 0.1;
    
    // Suspicious keywords
    const suspicious = ['unknown', 'suspicious', 'fake', 'fraud', 'scam', 'unauthorized'];
    if (suspicious.some(word => text.toLowerCase().includes(word))) {
      score += 0.5;
    }
    
    // Vague description
    if (text.split(' ').length < 3) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  predictOfflineCategory(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('starbucks') || textLower.includes('coffee') || textLower.includes('restaurant') || textLower.includes('food') || textLower.includes('cafe')) return 'Dining';
    if (textLower.includes('amazon') || textLower.includes('flipkart') || textLower.includes('shopping') || textLower.includes('mall')) return 'Shopping';
    if (textLower.includes('uber') || textLower.includes('ola') || textLower.includes('taxi') || textLower.includes('petrol') || textLower.includes('fuel')) return 'Transportation';
    if (textLower.includes('netflix') || textLower.includes('hotstar') || textLower.includes('subscription') || textLower.includes('movie')) return 'Entertainment';
    if (textLower.includes('bank') || textLower.includes('emi') || textLower.includes('loan') || textLower.includes('hdfc') || textLower.includes('sbi')) return 'Banking';
    if (textLower.includes('grocery') || textLower.includes('bazaar') || textLower.includes('mart') || textLower.includes('supermarket')) return 'Groceries';
    
    return 'Other';
  }

  getOfflineRiskFactors(text, amount) {
    const factors = [];
    
    if (amount > 50000) factors.push('High amount');
    if (['unknown', 'suspicious', 'fake'].some(word => text.toLowerCase().includes(word))) {
      factors.push('Suspicious keywords');
    }
    if (text.split(' ').length < 3) factors.push('Vague description');
    if (factors.length === 0) factors.push('Normal transaction');
    
    return factors;
  }

  async getTransactions() {
    return this.request('/api/v1/transactions');
  }

  async getCategoryAnalytics() {
    return this.request('/api/v1/analytics/categories');
  }

  async getConfidenceAnalytics() {
    return this.request('/api/v1/analytics/confidence');
  }

  async getModelPerformance() {
    return this.request('/api/v1/model/performance');
  }

  async submitFeedback(correction) {
    return this.request('/api/v1/feedback/correct', {
      method: 'POST',
      body: JSON.stringify(correction),
    });
  }

  async uploadTransactions(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/upload-transactions`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      return await this.request('/api/v1/status');
    } catch (error) {
      return {
        status: 'offline',
        backend: 'offline',
        integration: 'offline',
        ml_models: { status: 'offline', type: 'unavailable' },
        database: { status: 'offline' },
        coordinator: { status: 'offline' },
        error: 'Backend not reachable'
      };
    }
  }

  async testMLPrediction() {
    return this.request('/api/v1/predict/test');
  }

  async getModelStatus() {
    return this.request('/api/v1/model/status');
  }
}

export default new APIService();