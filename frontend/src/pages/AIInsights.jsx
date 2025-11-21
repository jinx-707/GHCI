import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import TransactionUpload from "../components/TransactionUpload";
import FeedbackSystem from "../components/FeedbackSystem";
import ModelPerformance from "../components/ModelPerformance";
import LiveMLTest from "../components/LiveMLTest";

const AIInsights = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [activeTab, setActiveTab] = useState("upload");
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: "upload", label: "📁 Upload Data", icon: "📁" },
    { id: "test", label: "🤖 Live ML Test", icon: "🤖" },
    { id: "feedback", label: "🎯 AI Feedback", icon: "🎯" },
    { id: "performance", label: "🧠 Performance", icon: "🧠" },
  ];

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("feedback");
  };

  return (
    <div className="fadeIn" style={{ display: "grid", gap: 20 }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: colors.text,
          }}>
            🤖 FinCoach AI Insights
          </h1>
          <p style={{
            margin: "8px 0 0 0",
            color: colors.textSecondary,
            fontSize: 16,
          }}>
            Upload transactions, provide feedback, and monitor AI performance
          </p>
        </div>
        
        <div style={{
          padding: "8px 16px",
          background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}10)`,
          border: `1px solid ${colors.accent}30`,
          borderRadius: 20,
          color: colors.accent,
          fontSize: 14,
          fontWeight: 600,
        }}>
          🚀 Enhanced AI System
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: 4,
        padding: 4,
        background: colors.glass,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border: "none",
              background: activeTab === tab.id ? colors.accent : "transparent",
              color: activeTab === tab.id ? "white" : colors.text,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "upload" && (
          <div style={{ display: "grid", gap: 20 }}>
            <TransactionUpload onUploadSuccess={handleUploadSuccess} />
            
            {/* Instructions */}
            <div className="card" style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}>
              <h3 style={{
                margin: "0 0 16px 0",
                fontSize: 18,
                fontWeight: 700,
                color: colors.text,
              }}>
                📋 CSV Format Instructions
              </h3>
              
              <div style={{
                display: "grid",
                gap: 16,
              }}>
                <div>
                  <h4 style={{
                    margin: "0 0 8px 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.text,
                  }}>
                    Required Columns:
                  </h4>
                  <div style={{
                    padding: 12,
                    background: colors.glass,
                    borderRadius: 8,
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: colors.text,
                  }}>
                    description, amount, date
                  </div>
                </div>
                
                <div>
                  <h4 style={{
                    margin: "0 0 8px 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.text,
                  }}>
                    Example CSV:
                  </h4>
                  <div style={{
                    padding: 12,
                    background: colors.glass,
                    borderRadius: 8,
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: colors.text,
                    whiteSpace: "pre-line",
                  }}>
{`description,amount,date
Starbucks Coffee,450,2024-01-15
Amazon Purchase,2500,2024-01-16
Uber Ride,280,2024-01-17`}
                  </div>
                </div>
                
                <div style={{
                  padding: 12,
                  background: colors.accent + "10",
                  borderRadius: 8,
                  fontSize: 12,
                  color: colors.textSecondary,
                }}>
                  💡 The AI will automatically categorize transactions and provide confidence scores. 
                  Low-confidence predictions will appear in the Feedback tab for your review.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "test" && (
          <LiveMLTest key={refreshKey} />
        )}

        {activeTab === "feedback" && (
          <FeedbackSystem key={refreshKey} />
        )}

        {activeTab === "performance" && (
          <ModelPerformance key={refreshKey} />
        )}
      </div>

      {/* Features Overview */}
      <div className="card" style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
        }}>
          🚀 FinCoach AI Features
        </h3>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16,
        }}>
          {[
            {
              icon: "🧠",
              title: "ML-Powered Categorization",
              desc: "Advanced machine learning with confidence scoring"
            },
            {
              icon: "🎯",
              title: "Human-in-the-Loop Learning",
              desc: "Your corrections improve AI accuracy over time"
            },
            {
              icon: "📊",
              title: "Explainable AI",
              desc: "See why the AI made each prediction"
            },
            {
              icon: "🔒",
              title: "Privacy-First",
              desc: "All processing happens locally, no cloud dependency"
            },
            {
              icon: "📈",
              title: "Performance Monitoring",
              desc: "Real-time metrics and model performance tracking"
            },
            {
              icon: "🌐",
              title: "Multi-language Support",
              desc: "Handles transactions in multiple languages"
            }
          ].map((feature, index) => (
            <div key={index} style={{
              padding: 16,
              background: colors.glass,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{
                fontSize: 24,
                marginBottom: 8,
              }}>
                {feature.icon}
              </div>
              <div style={{
                fontWeight: 600,
                color: colors.text,
                marginBottom: 4,
                fontSize: 14,
              }}>
                {feature.title}
              </div>
              <div style={{
                fontSize: 12,
                color: colors.textSecondary,
                lineHeight: 1.4,
              }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;