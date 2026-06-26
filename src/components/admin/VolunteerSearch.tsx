import { useState, useEffect, useRef } from "react";

interface Volunteer {
  id: string;
  fullName: string;
  email: string | null;
  district: string | null;
}

interface VolunteerSearchProps {
  onSelect: (volunteer: Volunteer) => void;
  placeholder?: string;
}

export default function VolunteerSearch({ onSelect, placeholder = "Search volunteers…" }: VolunteerSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/volunteers?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: Volunteer[] = await res.json();
          setResults(data.slice(0, 8));
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}
      />
      {loading && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#9ca3af" }}>…</span>}
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "white", border: "1px solid #e5e7eb", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50 }}>
          {results.map((v) => (
            <button
              key={v.id}
              onClick={() => { onSelect(v); setQuery(v.fullName); setOpen(false); }}
              style={{ width: "100%", padding: "10px 14px", textAlign: "left", border: "none", background: "none", cursor: "pointer", borderBottom: "1px solid #f3f4f6", display: "block" }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v.fullName}</span>
              {v.district && <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>{v.district}</span>}
              {v.email && <div style={{ fontSize: 12, color: "#9ca3af" }}>{v.email}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
