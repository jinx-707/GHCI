import useTransactions from "../hooks/useTransactions";

export default function Transactions() {
  const { data, setData } = useTransactions();

  const changeCategory = (id, newCat) => {
    setData(prev =>
      prev.map(t =>
        t.id === id ? { ...t, category: newCat } : t
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Transactions</h2>

      {data.map(t => (
        <div
          key={t.id}
          style={{
            marginBottom: 12,
            padding: 8,
            border: "1px solid #eee",
          }}
        >
          <div>
            <strong>{t.merchant}</strong> — ₹{t.amount} • {t.date}
          </div>

          <label>Category: </label>
          <select
            value={t.category}
            onChange={e => changeCategory(t.id, e.target.value)}
          >
            <option>Dining</option>
            <option>Shopping</option>
            <option>Utilities</option>
            <option>Fuel</option>
            <option>Groceries</option>
            <option>Other</option>
          </select>
        </div>
      ))}
    </div>
  );
}
