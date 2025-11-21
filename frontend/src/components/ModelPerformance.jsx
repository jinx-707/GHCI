import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import apiService from "../services/api";

const ModelPerformance = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [performance, setPerformance] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [perfData, confData] = await Promise.all([
        apiService.getModelPerformance(),
        apiService.getConfidenceAnalytics()
      ]);
      
      setPerformance(perfData);
      setConfidence(confData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Set default data when backend has no transactions yet
      setPerformance({
        total_predictions: 0,
        high_confidence_rate: 0,
        user_correction_rate: 0,
        ml_available: false,
        feedback_entries: 0,
        accuracy_estimate: 0
      });
      setConfidence({
        avg_confidence: 0,
        high_confidence: 0,
        low_confidence: 0,
        total_transactions: 0,
        methods_used: { rule: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        padding: 20,
        textAlign: "center",
      }}>
        <div style={{ color: colors.text }}>Loading performance metrics...</div>
      </div>
    );
  }

  const confidenceData = confidence ? [
    { name: "High Confidence", value: confidence.high_confidence, color: colors.success },
    { name: "Medium Confidence", value: (confidence.total_transactions || 0) - confidence.high_confidence - confidence.low_confidence, color: colors.warning },
    { name: "Low Confidence", value: confidence.low_confidence, color: colors.error },
  ].filter(item => item.value > 0) : [];

  const methodData = confidence?.methods_used ? Object.entries(confidence.methods_used).map(([method, count]) => ({
    method: method.replace('_', ' ').toUpperCase(),
    count,
    color: method === 'ml' ? colors.accent : method === 'user_corrected' ? colors.success : colors.warning
  })) : [];

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
        🧠 AI Model Performance
      </h3>

      {/* Key Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}>
        <div style={{
          textAlign: "center",
          padding: 16,
          background: colors.glass,
          borderRadius: 12,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 800,
            color: colors.accent,
          }}>
            {Math.round((performance?.accuracy_estimate || 0) * 100)}%
          </div>
          <div style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
          }}>
            Accuracy
          </div>
        </div>

        <div style={{
          textAlign: "center",
          padding: 16,
          background: colors.glass,
          borderRadius: 12,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 800,
            color: colors.success,
          }}>
            {performance?.total_predictions || 0}
          </div>
          <div style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
          }}>
            Predictions
          </div>
        </div>

        <div style={{
          textAlign: "center",
          padding: 16,
          background: colors.glass,
          borderRadius: 12,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 800,
            color: colors.warning,
          }}>
            {performance?.feedback_entries || 0}
          </div>
          <div style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
          }}>
            Corrections
          </div>
        </div>

        <div style={{
          textAlign: "center",
          padding: 16,
          background: colors.glass,
          borderRadius: 12,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 800,
            color: performance?.ml_available ? colors.success : colors.error,
          }}>
            {performance?.ml_available ? "✅" : "❌"}
          </div>
          <div style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
          }}>
            ML Model
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}>
        {/* Confidence Distribution */}
        <div>
          <h4 style={{
            margin: "0 0 12px 0",
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
          }}>
            Confidence Distribution
          </h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Method Usage */}
        <div>
          <h4 style={{
            margin: "0 0 12px 0",
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
          }}>
            Prediction Methods
          </h4>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodData}>
                <XAxis 
                  dataKey="method" 
                  stroke={colors.textSecondary}
                  fontSize={10}
                />
                <YAxis stroke={colors.textSecondary} />
                <Tooltip
                  contentStyle={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {methodData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
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
          📊 Performance Insights
        </h4>
        
        <div style={{
          display: "grid",
          gap: 8,
          fontSize: 12,
          color: colors.textSecondary,
        }}>
          <div>
            • High confidence rate: {Math.round((performance?.high_confidence_rate || 0) * 100)}%
          </div>
          <div>
            • User correction rate: {Math.round((performance?.user_correction_rate || 0) * 100)}%
          </div>
          <div>
            • Average confidence: {Math.round((confidence?.avg_confidence || 0) * 100)}%
          </div>
          <div style={{
            color: performance?.ml_available ? colors.success : colors.warning,
            fontWeight: 600,
          }}>
            • {performance?.ml_available ? "ML model active - Enhanced accuracy" : "Rule-based system - Consider training ML model"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;