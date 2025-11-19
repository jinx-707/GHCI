import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";

const ScenarioSimulator = ({ currentSpending = 185000 }) => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [scenarios, setScenarios] = useState({
    dining: 0,
    shopping: 0,
    transportation: 0,
    entertainment: 0
  });
  const [selectedScenario, setSelectedScenario] = useState('custom');

  const presetScenarios = {
    frugal: { dining: -30, shopping: -50, transportation: -20, entertainment: -40 },
    moderate: { dining: -15, shopping: -25, transportation: -10, entertainment: -20 },
    luxury: { dining: 25, shopping: 50, transportation: 15, entertainment: 30 },
    emergency: { dining: -60, shopping: -80, transportation: -40, entertainment: -70 }
  };

  const categorySpending = {
    dining: 29800,
    shopping: 45600,
    transportation: 14500,
    entertainment: 12500
  };

  const calculateImpact = () => {
    let totalSavings = 0;
    const impacts = {};
    
    Object.entries(scenarios).forEach(([category, change]) => {
      const currentAmount = categorySpending[category];
      const newAmount = currentAmount * (1 + change / 100);
      const savings = currentAmount - newAmount;
      impacts[category] = { currentAmount, newAmount, savings };
      totalSavings += savings;
    });

    return { impacts, totalSavings, newTotal: currentSpending - totalSavings };
  };

  const { impacts, totalSavings, newTotal } = calculateImpact();

  const applyPreset = (preset) => {
    setSelectedScenario(preset);
    setScenarios(presetScenarios[preset]);
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
        🧪 Advanced Scenario Simulator
      </h3>

      {/* Preset Scenarios */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 8,
        marginBottom: 20,
      }}>
        {Object.entries(presetScenarios).map(([key, _]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            style={{
              padding: "8px 12px",
              background: selectedScenario === key ? colors.accent : colors.glass,
              color: selectedScenario === key ? "white" : colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {key === 'frugal' && '💰'} {key === 'moderate' && '⚖️'} 
            {key === 'luxury' && '💎'} {key === 'emergency' && '🚨'} {key}
          </button>
        ))}
      </div>

      {/* Category Sliders */}
      <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
        {Object.entries(scenarios).map(([category, value]) => {
          const icons = { dining: '🍽️', shopping: '🛍️', transportation: '🚗', entertainment: '🎬' };
          const impact = impacts[category];
          
          return (
            <div key={category} style={{
              padding: 12,
              background: colors.glass,
              borderRadius: 8,
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}>
                <span style={{ color: colors.text, fontWeight: 600, textTransform: "capitalize" }}>
                  {icons[category]} {category}
                </span>
                <span style={{
                  color: value > 0 ? colors.error : value < 0 ? colors.success : colors.text,
                  fontWeight: 600,
                  fontSize: 14,
                }}>
                  {value > 0 ? '+' : ''}{value}%
                </span>
              </div>
              
              <input
                type="range"
                min="-80"
                max="50"
                value={value}
                onChange={(e) => {
                  setScenarios(prev => ({ ...prev, [category]: Number(e.target.value) }));
                  setSelectedScenario('custom');
                }}
                style={{
                  width: "100%",
                  height: 4,
                  background: colors.border,
                  borderRadius: 2,
                  outline: "none",
                }}
              />
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 4,
              }}>
                <span>{formatRupees(impact.currentAmount)} → {formatRupees(impact.newAmount)}</span>
                <span style={{ color: impact.savings > 0 ? colors.success : colors.error }}>
                  {impact.savings > 0 ? 'Save' : 'Spend'} {formatRupees(Math.abs(impact.savings))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results */}
      <div style={{
        padding: 16,
        background: totalSavings > 0 ? colors.success + "10" : colors.error + "10",
        borderRadius: 12,
        border: `1px solid ${totalSavings > 0 ? colors.success : colors.error}`,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 12,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 20,
              fontWeight: 800,
              color: colors.text,
            }}>
              {formatRupees(newTotal)}
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textSecondary,
            }}>
              New Monthly Total
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 20,
              fontWeight: 800,
              color: totalSavings > 0 ? colors.success : colors.error,
            }}>
              {totalSavings > 0 ? 'Save' : 'Spend'} {formatRupees(Math.abs(totalSavings))}
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textSecondary,
            }}>
              Monthly Impact
            </div>
          </div>
        </div>
        
        <div style={{
          fontSize: 14,
          color: colors.text,
          textAlign: "center",
          fontWeight: 500,
        }}>
          Annual Impact: {totalSavings > 0 ? 'Save' : 'Spend'} {formatRupees(Math.abs(totalSavings * 12))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;