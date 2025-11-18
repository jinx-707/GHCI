import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const cardStyle = (theme) => ({
  background: theme === "light" ? "white" : "rgba(255,255,255,0.06)",
  padding: 22,
  borderRadius: 20,
  boxShadow:
    theme === "light"
      ? "0 6px 20px rgba(0,0,0,0.06)"
      : "0 6px 20px rgba(0,0,0,0.4)",
  border:
    theme === "light"
      ? "1px solid rgba(0,0,0,0.06)"
      : "1px solid rgba(255,255,255,0.1)",
  color: theme === "light" ? "#0f172a" : "white",
});

const Lifestyle = () => {
  const { theme } = useTheme();

  // Currency Converter
  const [amount, setAmount] = useState(1000);
  const conversionRate = 0.011; // INR -> USD demo
  const converted = (amount * conversionRate).toFixed(2);

  return (
    <div style={{ display: "grid", gap: 24 }}>

      {/* Smart Shopping Title */}
      <h2 style={{ marginBottom: 10 }}>🛍️ Smart Lifestyle Assistant</h2>

      {/* Smart Shopping Advisor */}
      <div style={cardStyle(theme)}>
        <h3 style={{ marginBottom: 12 }}>🛒 Smart Shopping Advisor</h3>
        <p style={{ opacity: 0.7 }}>
          Compare prices across platforms instantly.
        </p>

        <div style={{ marginTop: 14, display: "grid", gap: 18 }}>
          {[
            {
              product: "iPhone 15",
              prices: [
                ["Amazon", 799],
                ["Flipkart", 829],
                ["Best Buy", 799],
              ],
              cashback: "5% Cashback",
            },
            {
              product: "Samsung TV 55\"",
              prices: [
                ["Amazon", 599],
                ["Flipkart", 649],
                ["Best Buy", 579],
              ],
              cashback: "3% Cashback",
            },
            {
              product: "Laptop Dell XPS",
              prices: [
                ["Amazon", 1299],
                ["Flipkart", 1350],
                ["Best Buy", 1249],
              ],
              cashback: "2% Cashback",
            },
          ].map((item, i) => {
            const best = Math.min(...item.prices.map((p) => p[1]));
            return (
              <div
                key={i}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background:
                    theme === "light"
                      ? "#fafafa"
                      : "rgba(255,255,255,0.04)",
                  border:
                    theme === "light"
                      ? "1px solid rgba(0,0,0,0.06)"
                      : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {item.product}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                  }}
                >
                  {item.prices.map(([store, price]) => (
                    <div
                      key={store}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        background:
                          price === best
                            ? "var(--accent)"
                            : theme === "light"
                              ? "white"
                              : "rgba(255,255,255,0.06)",
                        color:
                          price === best
                            ? "white"
                            : theme === "light"
                              ? "#1e293b"
                              : "white",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {store}
                      <br />₹{price}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  Best: ₹{best} • {item.cashback}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Deals */}
      <div style={cardStyle(theme)}>
        <h3 style={{ marginBottom: 12 }}>🏬 Local Deals Nearby</h3>
        <div style={{ display: "grid", gap: 14 }}>
          {[
            ["Whole Foods", "20% off groceries", "0.5 mi"],
            ["Shell Gas", "10 cents off per gallon", "1.2 mi"],
            ["Target", "15% off household items", "2.3 mi"],
          ].map(([store, offer, dist], i) => (
            <div
              key={i}
              style={{
                padding: 14,
                borderRadius: 14,
                background:
                  theme === "light"
                    ? "#fafafa"
                    : "rgba(255,255,255,0.04)",
                border:
                  theme === "light"
                    ? "1px solid rgba(0,0,0,0.05)"
                    : "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{store}</strong>
                <div style={{ opacity: 0.7 }}>{offer}</div>
              </div>
              <div>{dist}</div>
            </div>
          ))}
        </div>

        <input
          placeholder="Enter your location for more deals"
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            border: "none",
            width: "100%",
            background:
              theme === "light" ? "#f3f4f6" : "rgba(255,255,255,0.05)",
            color: theme === "light" ? "#1e293b" : "white",
          }}
        />
      </div>

      {/* Currency Converter */}
      <div style={cardStyle(theme)}>
        <h3 style={{ marginBottom: 12 }}>💱 Currency Converter</h3>

        <div style={{ display: "grid", gap: 12 }}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "none",
              background:
                theme === "light" ? "#f3f4f6" : "rgba(255,255,255,0.06)",
              color: theme === "light" ? "#0f172a" : "white",
            }}
          />

          <div
            style={{
              padding: 14,
              borderRadius: 16,
              background:
                theme === "light"
                  ? "#f9fafb"
                  : "rgba(255,255,255,0.04)",
            }}
          >
            <strong>{amount} INR</strong> ={" "}
            <strong>{converted} USD</strong>
            <br />
            <span style={{ opacity: 0.7 }}>
              Rate: 1 INR = {conversionRate.toFixed(4)} USD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;
