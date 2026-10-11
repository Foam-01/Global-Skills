// SearchProducts.tsx — bug report: "typing fast in the search box sometimes shows results for an OLD query
// (e.g. typed 'coffee' but results are for 'cof'). Happens more on slow mobile networks."
import { useEffect, useState } from "react";

export function SearchProducts() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    fetch(`/api/products?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.items));
  }, [q]);

  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{results.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
