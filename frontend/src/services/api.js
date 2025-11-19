const API_BASE_URL = 'http://localhost:8001';

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
      throw error;
    }
  }

  async predict(text, amount = null) {
    return this.request('/api/v1/predict', {
      method: 'POST',
      body: JSON.stringify({ text, amount }),
    });
  }

  async getTestData() {
    return this.request('/api/v1/predict/test');
  }

  async getStatus() {
    return this.request('/api/v1/status');
  }

  async getHealth() {
    return this.request('/api/v1/health');
  }

  async getInsights(transactions) {
    return this.request('/api/v1/insights', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  }
}

export default new APIService();