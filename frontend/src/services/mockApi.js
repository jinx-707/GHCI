import apiService from './api.js';

export const fetchTransactions = async () => {
  try {
    const response = await apiService.getTransactions();
    return response.transactions || [];
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    return [
      { id: 1, merchant: "Starbucks Coffee Day", amount: 450, category: "Dining", date: "2025-11-01" },
      { id: 2, merchant: "Amazon Flipkart", amount: 7500, category: "Shopping", date: "2025-11-03" },
      { id: 3, merchant: "HP Petrol Pump", amount: 3800, category: "Transportation", date: "2025-11-05" },
      { id: 4, merchant: "BESCOM Electricity", amount: 7500, category: "Utilities", date: "2025-10-28" },
      { id: 5, merchant: "Big Bazaar Grocery", amount: 10500, category: "Groceries", date: "2025-11-07" }
    ];
  }
};

export const mockApi = {
  getTransactions: fetchTransactions,
  
  getInsights: async () => {
    try {
      return await apiService.getMockInsights();
    } catch (error) {
      return {
        totalSpent: 125000,
        categories: {
          'Dining': 29800,
          'Shopping': 45600,
          'Transportation': 14500,
          'Utilities': 22500,
          'Groceries': 12500
        },
        monthlyTrend: 'up',
        savingsRate: 0.15
      };
    }
  },
  
  predict: async (text) => {
    try {
      return await apiService.predict(text);
    } catch (error) {
      return { category: 'Unknown', confidence: 0.5 };
    }
  }
};