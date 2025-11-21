import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import apiService from "../services/api";

const LiveMLTest = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [testInput, setTestInput] = useState({
    text: "Suspicious unknown UPI payment",
    amount: 25000
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const testCases = [
    { text: "Starbucks Coffee Day purchase", amount: 450 },
    { text: "Amazon Flipkart shopping", amount: 7500 },
    { text: "Suspicious unknown UPI payment", amount: 25000 },
    { text: "HDFC Bank EMI payment", amount: 155000 },
    { text: "Netflix Hotstar subscription", amount: 1300 },
    { text: "Big Bazaar grocery shopping", amount: 10500 },
    { text: "Shell HP petrol pump", amount: 3800 },
    { text: "Fake subscription charge", amount: 2500 }
  ];

  const handlePredict = async () => {
    if (!testInput.text.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiService.predict(testInput.text, testInput.amount);
      setPrediction(response.prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      // This should not happen now due to fallback in apiService
      setPrediction({
        error: 'Prediction failed unexpectedly.',
        text: testInput.text,
        amount: testInput.amount
      });
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const response = await apiService.predict(testCase.text, testCase.amount);
        results.push({
          input: testCase,
          prediction: response.prediction,
          status: response.prediction.model_version === 'offline_fallback' ? 'offline' : 'success'
        });
      } catch (error) {
        results.push({
          input: testCase,
          error: error.message,
          status: 'error'
        });
      }
    }
    
    setTestResults(results);
    setLoading(false);
  };

  const getFraudRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return colors.error;
      case 'HIGH': return '#ff6b35';
      case 'MEDIUM': return colors.warning;
      case 'LOW': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="card" style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
    }}>
      <h3 style={{
        margin: "0 0 20px 0",
        fontSize: 18,
        fontWeight: 700,
        color: colors.text,
      }}>
        🤖 Live ML Prediction Test
      </h3>

      {/* Manual Test Input */}
      <div style={{
        display: "grid",
        gap: 16,
        marginBottom: 24,
        padding: 16,
        background: colors.glass,
        borderRadius: 12,
      }}>
        <h4 style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: colors.text,
        }}>
          Test Individual Transaction
        </h4>
        
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: 4,
              fontSize: 12,
              fontWeight: 600,
              color: colors.text,
            }}>
              Transaction Description
            </label>
            <input
              type="text"
              value={testInput.text}
              onChange={(e) => setTestInput({ ...testInput, text: e.target.value })}
              placeholder="Enter transaction description..."
              style={{
                width: "100%",
                padding: "8px 12px",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                background: colors.cardBg,
                color: colors.text,
                fontSize: 14,
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: "block",
              marginBottom: 4,
              fontSize: 12,
              fontWeight: 600,
              color: colors.text,
            }}>
              Amount (₹)
            </label>
            <input
              type="number"
              value={testInput.amount}
              onChange={(e) => setTestInput({ ...testInput, amount: parseFloat(e.target.value) || 0 })}
              placeholder="Enter amount..."
              style={{
                width: "100%",
                padding: "8px 12px",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                background: colors.cardBg,
                color: colors.text,
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handlePredict}
            disabled={loading || !testInput.text.trim()}
            style={{
              padding: "8px 16px",
              background: colors.accent,
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !testInput.text.trim() ? 0.6 : 1,
            }}
          >
            {loading ? "Predicting..." : "🔮 Predict"}
          </button>
          
          <button
            onClick={runAllTests}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: colors.glass,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Running..." : "🧪 Run All Tests"}
          </button>
        </div>
      </div>

      {/* Single Prediction Result */}
      {prediction && (
        <div style={{
          marginBottom: 24,
          padding: 16,
          background: prediction.error ? colors.error + "10" : colors.glass,
          border: `1px solid ${prediction.error ? colors.error + "30" : colors.border}`,
          borderRadius: 12,
        }}>
          <h4 style={{
            margin: "0 0 12px 0",
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
          }}>
            Prediction Result
          </h4>
          
          {prediction.error ? (
            <div style={{ color: colors.error, fontSize: 14 }}>
              ❌ {prediction.error}
            </div>
          ) : (
            <div>
              {prediction.model_version === 'offline_fallback' && (
                <div style={{
                  padding: 8,
                  background: colors.warning + "20",
                  border: `1px solid ${colors.warning}30`,
                  borderRadius: 6,
                  fontSize: 12,
                  color: colors.warning,
                  marginBottom: 12,
                  textAlign: "center"
                }}>
                  ⚠️ Backend offline - using fallback prediction
                </div>
              )}
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                    Category
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600, 
                    color: colors.accent 
                  }}>
                    {prediction.category || 'Unknown'}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>
                    Confidence: {Math.round((prediction.category_confidence || 0) * 100)}%
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                    Fraud Risk
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600, 
                    color: getFraudRiskColor(prediction.fraud_risk_level)
                  }}>
                    {prediction.fraud_risk_level || 'LOW'} RISK
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>
                    Probability: {Math.round((prediction.fraud_probability || 0) * 100)}%
                  </div>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                    Amount
                  </div>
                  <div style={{ fontSize: 14, color: colors.text }}>
                    {prediction.amount_formatted || formatAmount(prediction.amount)}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                    Is Fraud
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: prediction.is_fraud ? colors.error : colors.success,
                    fontWeight: 600
                  }}>
                    {prediction.is_fraud ? "⚠️ YES" : "✅ NO"}
                  </div>
                </div>
              </div>

              {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                    Risk Factors
                  </div>
                  <div style={{ fontSize: 12, color: colors.warning }}>
                    {prediction.risk_factors.join(", ")}
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Test Results */}
      {testResults.length > 0 && (
        <div>
          <h4 style={{
            margin: "0 0 16px 0",
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
          }}>
            Batch Test Results ({testResults.length} tests)
          </h4>
          
          <div style={{ display: "grid", gap: 12 }}>
            {testResults.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  background: result.status === 'error' ? colors.error + "10" : colors.glass,
                  border: `1px solid ${result.status === 'error' ? colors.error + "30" : colors.border}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                    {result.input.text}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>
                    {formatAmount(result.input.amount)}
                  </div>
                </div>
                
                {result.status === 'error' ? (
                  <div style={{ fontSize: 12, color: colors.error }}>
                    ❌ {result.error}
                  </div>
                ) : (
                  <div>
                    {result.status === 'offline' && (
                      <div style={{
                        fontSize: 10,
                        color: colors.warning,
                        marginBottom: 4,
                        fontWeight: 600
                      }}>
                        ⚠️ OFFLINE MODE
                      </div>
                    )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: colors.accent, fontWeight: 600 }}>
                        {result.prediction.category}
                      </span>
                      <span style={{ color: colors.textSecondary, marginLeft: 8 }}>
                        ({Math.round((result.prediction.category_confidence || 0) * 100)}%)
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 600,
                      color: getFraudRiskColor(result.prediction.fraud_risk_level)
                    }}>
                      {result.prediction.fraud_risk_level || 'LOW'} RISK
                      {result.prediction.is_fraud && " ⚠️"}
                    </div>
                  </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Test Buttons */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: colors.glass,
        borderRadius: 12,
      }}>
        <h4 style={{
          margin: "0 0 12px 0",
          fontSize: 14,
          fontWeight: 600,
          color: colors.text,
        }}>
          Quick Test Cases
        </h4>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 8,
        }}>
          {testCases.slice(0, 4).map((testCase, index) => (
            <button
              key={index}
              onClick={() => setTestInput(testCase)}
              style={{
                padding: "8px 12px",
                background: "transparent",
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                {testCase.text.substring(0, 20)}...
              </div>
              <div style={{ color: colors.textSecondary }}>
                {formatAmount(testCase.amount)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMLTest;