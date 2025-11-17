import { useEffect, useState } from "react";
import { fetchTransactions } from "../services/mockApi";

export default function useTransactions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, setData, loading };
}
