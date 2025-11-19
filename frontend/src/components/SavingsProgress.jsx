import React from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";

const SavingsProgress = () => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  
  const savingsGoal = 500000; // 5 lakh rupees
  const currentSavings = 315000; // 3.15 lakh rupees
  const percent = Math.round((currentSavings / savingsGoal) * 100);
  const remaining = savingsGoal - currentSavings;

  return (
    <div className="card" style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
        }}>
          Savings Goal
        </h3>
        <div style={{
          fontSize: 24,
        }}>
          🎯
        </div>
      </div>

      {/* Progress Circle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}>
        <div style={{
          position: "relative",
          width: 120,
          height: 120,
        }}>
          <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={colors.border}
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={colors.accent}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - percent / 100)}`}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s ease-in-out",
              }}
            />
          </svg>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 24,
              fontWeight: 800,
              color: colors.accent,
            }}>
              {percent}%
            </div>
            <div style={{
              fontSize: 12,
              color: colors.textSecondary,
            }}>
              Complete
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        marginBottom: 16,
      }}>
        <div style={{
          height: 8,
          width: "100%",
          background: colors.border,
          borderRadius: 4,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${percent}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentHover})`,
            borderRadius: 4,
            transition: "width 1s ease-in-out",
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}>
        <div style={{
          textAlign: "center",
          padding: 12,
          background: colors.glass,
          borderRadius: 8,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.success,
          }}>
            {formatRupees(currentSavings)}
          </div>
          <div style={{
            fontSize: 12,
            color: colors.textSecondary,
          }}>
            Saved
          </div>
        </div>
        
        <div style={{
          textAlign: "center",
          padding: 12,
          background: colors.glass,
          borderRadius: 8,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.warning,
          }}>
            {formatRupees(remaining)}
          </div>
          <div style={{
            fontSize: 12,
            color: colors.textSecondary,
          }}>
            Remaining
          </div>
        </div>
      </div>

      {/* Goal Info */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: colors.glass,
        borderRadius: 8,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 4,
        }}>
          Goal Target
        </div>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.text,
        }}>
          {formatRupees(savingsGoal)}
        </div>
      </div>

      {/* Monthly Progress */}
      <div style={{
        marginTop: 16,
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
          <span style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}>
            Monthly Target
          </span>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
          }}>
            {formatRupees(25000)}
          </span>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}>
            This Month
          </span>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.success,
          }}>
            {formatRupees(31500)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SavingsProgress;