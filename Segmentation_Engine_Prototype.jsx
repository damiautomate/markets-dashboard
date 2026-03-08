import { useState } from "react";

const MOCK_PRODUCTS = ["All Products", "Premium Coffee Beans", "Organic Tea Set", "Espresso Machine", "French Press", "Coffee Grinder", "Tea Infuser", "Travel Mug Set"];
const MOCK_CATEGORIES = ["All Categories", "Coffee", "Tea", "Equipment", "Accessories"];
const MOCK_LOCATIONS = ["All Locations", "New York", "California", "Texas", "Florida", "Illinois", "Ohio"];

const MOCK_RESULTS = [
  { id: 1, name: "Sarah Mitchell", email: "sarah@email.com", location: "New York", orders: 14, revenue: "$3,240", aov: "$231", lastOrder: "12 days ago", trend: "up" },
  { id: 2, name: "James Cooper", email: "james@email.com", location: "California", orders: 8, revenue: "$1,890", aov: "$236", lastOrder: "45 days ago", trend: "down" },
  { id: 3, name: "Maria Garcia", email: "maria@email.com", location: "Texas", orders: 22, revenue: "$5,120", aov: "$233", lastOrder: "3 days ago", trend: "up" },
  { id: 4, name: "David Chen", email: "david@email.com", location: "Florida", orders: 5, revenue: "$980", aov: "$196", lastOrder: "92 days ago", trend: "down" },
  { id: 5, name: "Emily Watson", email: "emily@email.com", location: "Illinois", orders: 11, revenue: "$2,640", aov: "$240", lastOrder: "18 days ago", trend: "stable" },
  { id: 6, name: "Robert Kim", email: "robert@email.com", location: "Ohio", orders: 3, revenue: "$420", aov: "$140", lastOrder: "134 days ago", trend: "down" },
  { id: 7, name: "Lisa Patel", email: "lisa@email.com", location: "New York", orders: 17, revenue: "$4,080", aov: "$240", lastOrder: "7 days ago", trend: "up" },
  { id: 8, name: "Tom Bradley", email: "tom@email.com", location: "California", orders: 6, revenue: "$1,340", aov: "$223", lastOrder: "67 days ago", trend: "down" },
];

const PRESET_QUERIES = [
  { label: "Bought X last year, not this year", icon: "🔄", desc: "Find customers who purchased a specific product last year but haven't purchased it this year" },
  { label: "Bought X, never bought Y", icon: "🔀", desc: "Find cross-sell opportunities — customers who buy one product but not another" },
  { label: "Hasn't reordered in 90+ days", icon: "⏰", desc: "Find customers overdue for a reorder based on their purchase history" },
  { label: "Declining purchase behavior", icon: "📉", desc: "Find customers whose order frequency or spend is trending downward" },
];

export default function SegmentationEngine() {
  const [activeTab, setActiveTab] = useState("filters");
  const [showResults, setShowResults] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(false);

  // Filter states
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2026-03-06");
  const [product, setProduct] = useState("All Products");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [minOrders, setMinOrders] = useState("");
  const [maxOrders, setMaxOrders] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [minAov, setMinAov] = useState("");
  const [daysSinceOrder, setDaysSinceOrder] = useState("");
  const [comparison, setComparison] = useState("none");

  const handleRun = () => {
    setShowResults(true);
    setSelectedCustomers([]);
    setSelectAll(false);
    setPushed(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(MOCK_RESULTS.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleCustomer = (id) => {
    setSelectedCustomers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePush = () => {
    setPushing(true);
    setTimeout(() => {
      setPushing(false);
      setPushed(true);
    }, 2000);
  };

  const trendIcon = (t) => t === "up" ? "↑" : t === "down" ? "↓" : "→";
  const trendColor = (t) => t === "up" ? "#22c55e" : t === "down" ? "#ef4444" : "#94a3b8";

  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(148,163,184,0.1)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(15,23,42,0.8)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>CI</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Customer Intelligence</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Segmentation Engine</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#64748B", padding: "6px 12px", background: "rgba(34,197,94,0.1)", borderRadius: 6, border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ color: "#22c55e", marginRight: 6 }}>●</span>Last sync: 2 hours ago
          </div>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 67px)" }}>
        {/* Left Panel — Filters */}
        <div style={{ width: 360, borderRight: "1px solid rgba(148,163,184,0.08)", overflowY: "auto", background: "rgba(15,23,42,0.4)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
            {[{ key: "filters", label: "Manual Filters", icon: "⚙️" }, { key: "queries", label: "Smart Queries", icon: "🧠" }].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowResults(false); setPushed(false); }}
                style={{
                  flex: 1, padding: "14px 8px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                  background: activeTab === tab.key ? "rgba(59,130,246,0.08)" : "transparent",
                  color: activeTab === tab.key ? "#60a5fa" : "#64748B",
                  borderBottom: activeTab === tab.key ? "2px solid #3b82f6" : "2px solid transparent",
                  fontFamily: "inherit", transition: "all 0.2s"
                }}
              >{tab.icon} {tab.label}</button>
            ))}
          </div>

          {activeTab === "filters" ? (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Date Range</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <InputField label="From" type="date" value={dateFrom} onChange={setDateFrom} />
                <InputField label="To" type="date" value={dateTo} onChange={setDateTo} />
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Product & Category</div>
              <SelectField label="Product" value={product} onChange={setProduct} options={MOCK_PRODUCTS} />
              <SelectField label="Category" value={category} onChange={setCategory} options={MOCK_CATEGORIES} />

              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, marginTop: 20 }}>Customer Filters</div>
              <SelectField label="Location" value={location} onChange={setLocation} options={MOCK_LOCATIONS} />

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <InputField label="Min Orders" type="number" value={minOrders} onChange={setMinOrders} placeholder="0" />
                <InputField label="Max Orders" type="number" value={maxOrders} onChange={setMaxOrders} placeholder="∞" />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <InputField label="Min Revenue ($)" type="number" value={minRevenue} onChange={setMinRevenue} placeholder="0" />
                <InputField label="Max Revenue ($)" type="number" value={maxRevenue} onChange={setMaxRevenue} placeholder="∞" />
              </div>
              <InputField label="Min Avg Order Value ($)" type="number" value={minAov} onChange={setMinAov} placeholder="0" />
              <InputField label="Days Since Last Order (≥)" type="number" value={daysSinceOrder} onChange={setDaysSinceOrder} placeholder="e.g. 90" />

              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, marginTop: 20 }}>Comparison</div>
              <SelectField label="Period" value={comparison} onChange={setComparison} options={["none", "This Year vs Last Year", "This Quarter vs Last Quarter"]} />

              <button onClick={handleRun} style={{
                width: "100%", padding: "12px", marginTop: 24, border: "none", borderRadius: 8, cursor: "pointer",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontSize: 14, fontWeight: 600,
                fontFamily: "inherit", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
              }}>
                Run Segment →
              </button>
            </div>
          ) : (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Product & Time-Based Queries</div>
              {PRESET_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setActivePreset(i); setShowResults(false); setPushed(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "14px 16px", marginBottom: 8, border: activePreset === i ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(148,163,184,0.1)",
                    borderRadius: 10, cursor: "pointer", background: activePreset === i ? "rgba(59,130,246,0.08)" : "rgba(30,41,59,0.5)",
                    transition: "all 0.2s", fontFamily: "inherit"
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: activePreset === i ? "#60a5fa" : "#E2E8F0", marginBottom: 4 }}>
                    {q.icon} {q.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{q.desc}</div>
                </button>
              ))}

              {activePreset !== null && (
                <div style={{ marginTop: 16, padding: 16, background: "rgba(30,41,59,0.6)", borderRadius: 10, border: "1px solid rgba(148,163,184,0.1)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Configure Query</div>
                  {activePreset === 0 && (
                    <>
                      <SelectField label="Product purchased last year" value={product} onChange={setProduct} options={MOCK_PRODUCTS.slice(1)} />
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, marginBottom: 8 }}>Will find customers who bought this product in 2025 but have not purchased it in 2026.</div>
                    </>
                  )}
                  {activePreset === 1 && (
                    <>
                      <SelectField label="Purchased this product" value={product} onChange={setProduct} options={MOCK_PRODUCTS.slice(1)} />
                      <SelectField label="But never purchased" value={category} onChange={setCategory} options={MOCK_PRODUCTS.slice(1)} />
                    </>
                  )}
                  {activePreset === 2 && (
                    <>
                      <SelectField label="Product" value={product} onChange={setProduct} options={MOCK_PRODUCTS.slice(1)} />
                      <InputField label="Days since last purchase (≥)" type="number" value={daysSinceOrder} onChange={setDaysSinceOrder} placeholder="90" />
                    </>
                  )}
                  {activePreset === 3 && (
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                      This query automatically identifies customers whose order frequency or total spend has decreased compared to the same period last year.
                    </div>
                  )}
                  <button onClick={handleRun} style={{
                    width: "100%", padding: "12px", marginTop: 16, border: "none", borderRadius: 8, cursor: "pointer",
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontSize: 14, fontWeight: 600,
                    fontFamily: "inherit", boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
                  }}>
                    Run Query →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel — Results */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {!showResults ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Build Your Segment</div>
              <div style={{ fontSize: 13, color: "#64748B", textAlign: "center", maxWidth: 320 }}>
                Use the filters on the left to define your customer segment, then click "Run" to see matching customers.
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Segment Results</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                    <span style={{ color: "#60a5fa", fontWeight: 600 }}>{MOCK_RESULTS.length} customers</span> match your criteria
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{
                    padding: "9px 16px", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 8, cursor: "pointer",
                    background: "rgba(30,41,59,0.6)", color: "#E2E8F0", fontSize: 12, fontWeight: 600, fontFamily: "inherit"
                  }}>
                    📥 Export CSV
                  </button>
                  <button
                    onClick={handlePush}
                    disabled={selectedCustomers.length === 0 || pushing || pushed}
                    style={{
                      padding: "9px 20px", border: "none", borderRadius: 8, cursor: selectedCustomers.length === 0 ? "not-allowed" : "pointer",
                      background: pushed ? "linear-gradient(135deg, #22c55e, #16a34a)" : pushing ? "rgba(59,130,246,0.5)" : selectedCustomers.length === 0 ? "rgba(59,130,246,0.2)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                      color: "white", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                      boxShadow: selectedCustomers.length > 0 && !pushed ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
                      transition: "all 0.3s", opacity: selectedCustomers.length === 0 ? 0.5 : 1
                    }}
                  >
                    {pushed ? "✓ Pushed to ActiveCampaign" : pushing ? "Pushing..." : `Push to ActiveCampaign (${selectedCustomers.length})`}
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Customers", value: "8", color: "#3b82f6" },
                  { label: "Total Revenue", value: "$19,710", color: "#8b5cf6" },
                  { label: "Avg Order Value", value: "$218", color: "#06b6d4" },
                  { label: "Avg Orders", value: "10.8", color: "#22c55e" },
                ].map((card, i) => (
                  <div key={i} style={{
                    padding: "16px 18px", borderRadius: 10, background: "rgba(30,41,59,0.6)",
                    border: "1px solid rgba(148,163,184,0.08)"
                  }}>
                    <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: card.color, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Results Table */}
              <div style={{ borderRadius: 10, border: "1px solid rgba(148,163,184,0.08)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(30,41,59,0.8)" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} style={{ accentColor: "#3b82f6" }} />
                      </th>
                      {["Customer", "Location", "Orders", "Revenue", "AOV", "Last Order", "Trend"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_RESULTS.map((row, i) => (
                      <tr key={row.id} style={{
                        background: i % 2 === 0 ? "rgba(15,23,42,0.4)" : "rgba(30,41,59,0.3)",
                        transition: "background 0.15s",
                        borderBottom: "1px solid rgba(148,163,184,0.05)"
                      }}>
                        <td style={{ padding: "10px 16px" }}>
                          <input type="checkbox" checked={selectedCustomers.includes(row.id)} onChange={() => toggleCustomer(row.id)} style={{ accentColor: "#3b82f6" }} />
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{row.name}</div>
                          <div style={{ fontSize: 11, color: "#64748B" }}>{row.email}</div>
                        </td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "#94a3b8" }}>{row.location}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#E2E8F0" }}>{row.orders}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#E2E8F0" }}>{row.revenue}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#94a3b8" }}>{row.aov}</td>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: "#94a3b8" }}>{row.lastOrder}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{
                            fontSize: 13, fontWeight: 700, color: trendColor(row.trend),
                            display: "inline-flex", alignItems: "center", gap: 4
                          }}>
                            {trendIcon(row.trend)} {row.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12, flex: 1 }}>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.15)",
          background: "rgba(15,23,42,0.6)", color: "#E2E8F0", fontSize: 13, fontFamily: "inherit",
          outline: "none", boxSizing: "border-box", transition: "border 0.2s"
        }}
        onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(148,163,184,0.15)"}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.15)",
          background: "rgba(15,23,42,0.6)", color: "#E2E8F0", fontSize: 13, fontFamily: "inherit",
          outline: "none", cursor: "pointer", transition: "border 0.2s"
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
