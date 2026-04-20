import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const INTENT_COLORS = {
  Serious:   "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Casual:    "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Exploring: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Healing:   "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const IntentBadge = ({ intent }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs border ${INTENT_COLORS[intent] || "bg-white/10 text-white/60 border-white/10"}`}>
    {intent}
  </span>
);

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
    <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
    <p className="text-white text-3xl font-semibold font-serif">{value ?? "—"}</p>
    {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats]         = useState(null);
  const [leads, setLeads]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState("");
  const [intentFilter, setIntent] = useState("");
  const [selectedLead, setSelected] = useState(null);
  const [loading, setLoading]     = useState(true);

  const fetchLeads = useCallback(async (s, i) => {
    try {
      const params = {};
      if (s) params.search = s;
      if (i) params.intent = i;
      const res = await API.get("/community/leads", { params });
      setLeads(res.data.leads);
      setTotal(res.data.total);
    } catch {
      /* handled by interceptor */
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("tangle_token");
    if (!token) { navigate("/login"); return; }

    const init = async () => {
      try {
        const [statsRes] = await Promise.all([
          API.get("/community/stats"),
          fetchLeads("", ""),
        ]);
        setStats(statsRes.data);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate, fetchLeads]);

  useEffect(() => {
    const t = setTimeout(() => fetchLeads(search, intentFilter), 300);
    return () => clearTimeout(t);
  }, [search, intentFilter, fetchLeads]);

  const handleExport = () => {
    const token = localStorage.getItem("tangle_token");
    const base  = process.env.REACT_APP_API_BASE || "http://localhost:5050/api";
    window.open(`${base}/community/export?token=${token}`, "_blank");
  };

  const logout = () => {
    localStorage.removeItem("tangle_token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0710] flex items-center justify-center">
        <p className="text-white/40 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0710] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f0b14] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8547a] to-[#9b59b6] flex items-center justify-center text-sm font-bold">T</div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">Tangle Admin</h1>
            <p className="text-white/30 text-xs">Community Dashboard</p>
          </div>
        </div>
        <button onClick={logout} className="text-white/40 hover:text-white/70 text-xs transition-colors">
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="col-span-2 md:col-span-1">
            <StatCard label="Total Members" value={stats?.total} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <StatCard label="Joined Today" value={stats?.today} />
          </div>
          {["Serious", "Casual", "Exploring", "Healing"].map((intent) => (
            <div key={intent} className="col-span-1">
              <StatCard label={intent} value={stats?.intents?.[intent] ?? 0} />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#e8547a]/50 transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            {["", "Serious", "Casual", "Exploring", "Healing"].map((i) => (
              <button
                key={i}
                onClick={() => setIntent(i)}
                className={`px-4 py-2 rounded-xl text-xs transition-colors ${
                  intentFilter === i
                    ? "bg-[#e8547a] text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                }`}
              >
                {i || "All"}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors flex items-center gap-2"
          >
            ↓ Export CSV
          </button>
        </div>

        {/* Count */}
        <p className="text-white/30 text-xs -mt-4">
          Showing {leads.length} of {total} members
        </p>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/30 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Age</th>
                  <th className="text-left px-5 py-3">Gender</th>
                  <th className="text-left px-5 py-3">Intent</th>
                  <th className="text-left px-5 py-3">Joined</th>
                  <th className="text-left px-5 py-3">Story</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-white/20 text-sm">
                      No members found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-white font-medium">{lead.name}</td>
                      <td className="px-5 py-3.5 text-white/50">{lead.email}</td>
                      <td className="px-5 py-3.5 text-white/50">{lead.age}</td>
                      <td className="px-5 py-3.5 text-white/50">{lead.gender}</td>
                      <td className="px-5 py-3.5">
                        <IntentBadge intent={lead.intent} />
                      </td>
                      <td className="px-5 py-3.5 text-white/40 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setSelected(lead)}
                          className="text-[#e8547a] hover:text-[#f2a0b0] text-xs transition-colors"
                        >
                          Read →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#16101d] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold text-lg">{selectedLead.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/40 text-xs">{selectedLead.age} · {selectedLead.gender}</span>
                  <IntentBadge intent={selectedLead.intent} />
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-white/30 hover:text-white text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Their Story</p>
            <p className="text-white/80 text-sm leading-7 whitespace-pre-wrap">{selectedLead.story}</p>
            <p className="text-white/20 text-xs mt-6">
              {selectedLead.email} · Joined {new Date(selectedLead.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
