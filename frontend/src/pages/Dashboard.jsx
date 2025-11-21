import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePrediction } from "../hooks/useAPI";
import { formatRupees } from "../utils/currency";
import apiService from "../services/api";

const Dashboard = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await apiService.getStatus();
        setSystemStatus(status);
      } catch (error) {
        setSystemStatus({ 
          status: 'offline',
          error: 'Backend offline',
          backend: 'offline'
        });
      }
    };
    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiService.predict(text, amount ? parseFloat(amount) : 0);
      const result = response.prediction || response;
      setPrediction(result);
    } catch (error) {
      setPrediction({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fadeIn" style={{ display: "grid", gap: 24 }}>
      {/* System Status */}
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          color: colors.text,
          fontSize: 18,
          fontWeight: 700,
        }}>
          🔗 Live Backend Connection
        </h3>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 12,
          background: colors.glass,
          borderRadius: 8,
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: systemStatus?.status === 'offline' || systemStatus?.error ? colors.error : colors.success,
          }} />
          <span style={{ color: colors.text, fontWeight: 500 }}>
            {systemStatus?.status === 'offline' || systemStatus?.error ? 
              '⚫ OFFLINE - Using Fallback Predictions' : 
              '🟢 ONLINE - Live Backend Connected'
            }
          </span>
          {systemStatus && systemStatus.status !== 'offline' && !systemStatus.error && (
            <span style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: colors.textSecondary,
            }}>
              ML: {systemStatus.ml_models?.status === 'loaded' ? '✅ Active' : '📋 Rules Only'}
            </span>
          )}
        </div>
        
        {(systemStatus?.status === 'offline' || systemStatus?.error) && (
          <div style={{
            marginTop: 12,
            padding: 12,
            background: colors.warning + "20",
            border: `1px solid ${colors.warning}30`,
            borderRadius: 8,
            fontSize: 14,
            color: colors.warning,
          }}>
            ⚠️ Backend is offline. The system is using intelligent fallback predictions with rule-based fraud detection. All features remain functional.
          </div>
        )}
      </div>

      {/* Live Prediction Test */}
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{
          margin: "0 0 20px 0",
          color: colors.text,
          fontSize: 18,
          fontWeight: 700,
        }}>
          🤖 Live ML Prediction
        </h3>
        
        <div style={{ display: "grid", gap: 16 }}>
          <input
            type="text"
            placeholder="Enter transaction description (e.g., Starbucks Coffee Day)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: colors.glass,
              color: colors.text,
              fontSize: 16,
            }}
          />
          
          <input
            type="number"
            placeholder="Amount in rupees (e.g., 450)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: colors.glass,
              color: colors.text,
              fontSize: 16,
            }}
          />
          
          <button
            onClick={handlePredict}
            disabled={loading || !text.trim()}
            className="btn btn-primary"
            style={{
              background: colors.accent,
              color: "white",
              padding: 12,
              borderRadius: 8,
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Predicting..." : "🔮 Get Live Prediction"}
          </button>
        </div>

        {prediction && (
          <div style={{
            marginTop: 20,
            padding: 16,
            background: colors.glass,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
          }}>
            {prediction.error ? (
              <div style={{ color: colors.error }}>
                Error: {prediction.error}
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>
                    Category:
                  </span>
                  <span style={{
                    color: colors.accent,
                    fontWeight: 700,
                    fontSize: 16,
                  }}>
                    {prediction.category || 'Other'}
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>
                    Confidence:
                  </span>
                  <span style={{ color: colors.success }}>
                    {Math.round((prediction.category_confidence || 0.5) * 100)}%
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>
                    Method:
                  </span>
                  <span style={{
                    color: prediction.model_version === 'enhanced' ? colors.accent : 
                           prediction.model_version === 'offline_fallback' ? colors.warning : colors.textSecondary,
                    fontWeight: 600,
                  }}>
                    {prediction.model_version === 'enhanced' ? '🧠 ML Model' : 
                     prediction.model_version === 'offline_fallback' ? '⚡ Offline Fallback' : '📋 Rule-based'}
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>
                    Fraud Risk:
                  </span>
                  <span style={{
                    color: prediction.fraud_risk_level === 'LOW' ? colors.success :
                           prediction.fraud_risk_level === 'MEDIUM' ? colors.warning : 
                           prediction.fraud_risk_level === 'HIGH' ? '#ff6b35' : colors.error,
                    fontWeight: 600,
                  }}>
                    {prediction.fraud_risk_level || 'LOW'} RISK ({Math.round((prediction.fraud_probability || 0.05) * 100)}%)
                    {prediction.is_fraud && ' ⚠️'}
                  </span>
                </div>
                
                {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ color: colors.text, fontWeight: 600 }}>
                      Risk Factors:
                    </span>
                    <span style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                    }}>
                      {prediction.risk_factors.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Test Buttons */}
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          color: colors.text,
          fontSize: 18,
          fontWeight: 700,
        }}>
          ⚡ Quick Tests
        </h3>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}>
          {[
            { text: "Starbucks Coffee Day", amount: 450 },
            { text: "Amazon Shopping", amount: 7500 },
            { text: "HDFC Bank EMI", amount: 155000 },
            { text: "Suspicious unknown UPI payment", amount: 25000 }
          ].map((test, index) => (
            <button
              key={index}
              onClick={() => {
                setText(test.text);
                setAmount(test.amount.toString());
              }}
              style={{
                padding: 12,
                background: colors.glass,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                color: colors.text,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {test.text} - {formatRupees(test.amount)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;