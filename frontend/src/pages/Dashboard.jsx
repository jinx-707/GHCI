import useTransactions from "../hooks/useTransactions";

export default function Dashboard() {
  const { data, loading } = useTransactions();

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      {loading ? (
        <p>Loading transactions…</p>
      ) : (
        <>
          <h3>Recent</h3>
          <ul>
            {data.slice(0, 5).map(t => (
              <li key={t.id}>
                {t.date} — {t.merchant} — ₹{t.amount} — {t.category}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
