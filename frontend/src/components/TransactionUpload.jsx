import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { formatRupees } from "../utils/currency";

const TransactionUpload = ({ onUploadSuccess }) => {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await apiService.uploadTransactions(file);
      setUploadResult(result);
      if (onUploadSuccess) onUploadSuccess(result);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({ error: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="card" style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      padding: 20,
    }}>
      <h3 style={{
        margin: "0 0 16px 0",
        fontSize: 18,
        fontWeight: 700,
        color: colors.text,
      }}>
        📁 Upload Transactions
      </h3>

      <div
        style={{
          border: `2px dashed ${dragActive ? colors.accent : colors.border}`,
          borderRadius: 12,
          padding: 40,
          textAlign: "center",
          background: dragActive ? colors.accent + "10" : colors.glass,
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div>
            <div style={{
              fontSize: 48,
              marginBottom: 16,
            }}>⏳</div>
            <div style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: 600,
            }}>
              Processing transactions...
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              fontSize: 48,
              marginBottom: 16,
            }}>📊</div>
            <div style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Drop CSV file here or click to browse
            </div>
            <div style={{
              color: colors.textSecondary,
              fontSize: 14,
            }}>
              Required columns: description, amount, date
            </div>
          </div>
        )}
      </div>

      {uploadResult && (
        <div style={{
          marginTop: 20,
          padding: 16,
          background: colors.success + "20",
          border: `1px solid ${colors.success}30`,
          borderRadius: 8,
        }}>
          <div style={{
            color: colors.success,
            fontWeight: 600,
            marginBottom: 8,
          }}>
            ✅ {uploadResult.message}
          </div>
          <div style={{
            fontSize: 14,
            color: colors.textSecondary,
          }}>
            ML Model: {uploadResult.ml_used ? "✅ Active" : "❌ Using Rules"}
          </div>
          
          {uploadResult.transactions && uploadResult.transactions.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 8,
              }}>
                Sample Processed Transactions:
              </div>
              {uploadResult.transactions.slice(0, 3).map((txn, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 8,
                  background: colors.glass,
                  borderRadius: 6,
                  marginBottom: 4,
                  fontSize: 12,
                }}>
                  <span style={{ color: colors.text }}>
                    {txn.description.substring(0, 30)}...
                  </span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      color: txn.confidence > 0.8 ? colors.success : 
                             txn.confidence > 0.5 ? colors.warning : colors.error,
                      fontWeight: 600,
                    }}>
                      {txn.category}
                    </span>
                    <span style={{
                      color: colors.textSecondary,
                      fontSize: 10,
                    }}>
                      {Math.round(txn.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionUpload;