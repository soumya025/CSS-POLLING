"use client";
// src/components/AdminDashboardClient.tsx
// Full admin dashboard: stats, charts (recharts), vote table, search, export, reset

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface VoteRecord {
  id: string;
  email: string;
  candidate: string;
  createdAt: string;
}

interface CandidateStat {
  name: string;
  count: number;
  percentage: string;
}

interface StatsData {
  total: number;
  candidates: CandidateStat[];
  votes: VoteRecord[];
}

const COLORS = ["#6366f1", "#3b82f6", "#8b5cf6", "#06b6d4"];

const CANDIDATE_COLORS: Record<string, string> = {
  "Raunak Bhattacharjee": "#6366f1",
  "Rishi Karmakar": "#3b82f6",
};

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch {
      setError("Failed to load statistics. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleExport = () => {
    window.location.href = "/api/admin/export";
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed");
      setResetSuccess(true);
      setShowResetModal(false);
      await fetchStats();
      setTimeout(() => setResetSuccess(false), 3000);
    } catch {
      setError("Reset failed. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  // Filter votes by search
  const filteredVotes = stats?.votes.filter((v) =>
    v.email.toLowerCase().includes(search.toLowerCase()) ||
    v.candidate.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date(dateStr));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center text-red-400">
        <p className="mb-4">{error}</p>
        <button onClick={fetchStats} className="btn-primary text-sm">
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const barData = stats?.candidates.map((c) => ({
    name: c.name.split(" ")[0], // First name for chart
    fullName: c.name,
    votes: c.count,
    fill: CANDIDATE_COLORS[c.name] || COLORS[0],
  })) || [];

  const pieData = stats?.candidates.map((c) => ({
    name: c.name,
    value: c.count,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Success banner */}
      {resetSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 text-green-400 text-sm animate-scale-in">
          ✓ Poll has been reset successfully. You can start a new voting session.
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 col-span-2 lg:col-span-1">
          <p className="text-gray-500 text-sm mb-1">Total Votes</p>
          <p className="text-4xl font-bold gradient-text">{stats?.total || 0}</p>
        </div>
        {stats?.candidates.map((c, i) => (
          <div key={c.name} className="glass-card p-6">
            <p className="text-gray-500 text-xs mb-1 truncate">{c.name.split(" ")[0]}</p>
            <p className="text-3xl font-bold text-white">{c.count}</p>
            <p className="text-sm mt-1" style={{ color: COLORS[i] }}>{c.percentage}%</p>
          </div>
        ))}
        {(stats?.candidates.length || 0) < 2 && (
          // Placeholder cards if candidates haven't been voted for yet
          Array.from({ length: 2 - (stats?.candidates.length || 0) }).map((_, i) => (
            <div key={`placeholder-${i}`} className="glass-card p-6 opacity-40">
              <p className="text-gray-500 text-xs mb-1">—</p>
              <p className="text-3xl font-bold text-gray-700">0</p>
              <p className="text-sm mt-1 text-gray-700">0%</p>
            </div>
          ))
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
            Votes by Candidate
          </h2>
          {(stats?.total || 0) === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
              No votes yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 13 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    color: "#fff",
                  }}
                  formatter={(value, _, props) => [value, props.payload.fullName]}
                />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Vote Share
          </h2>
          {(stats?.total || 0) === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
              No votes yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,30,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    color: "#fff",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Percentage bars */}
      {(stats?.total || 0) > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-5">Vote Distribution</h2>
          <div className="space-y-4">
            {stats?.candidates.map((c, i) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300">{c.name}</span>
                  <span className="text-gray-400">{c.count} votes ({c.percentage}%)</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${c.percentage}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vote log table */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-white font-semibold">
            Vote Log{" "}
            <span className="text-gray-600 font-normal text-sm ml-1">
              ({filteredVotes.length} record{filteredVotes.length !== 1 ? "s" : ""})
            </span>
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by email or candidate…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500/50 w-64"
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredVotes.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {search ? "No results match your search." : "No votes have been cast yet."}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Candidate</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Timestamp (IST)</th>
                </tr>
              </thead>
              <tbody>
                {filteredVotes.map((vote, i) => (
                  <tr
                    key={vote.id}
                    className="border-b border-white/3 hover:bg-white/2 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-600">{i + 1}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-xs">{vote.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `${CANDIDATE_COLORS[vote.candidate] || COLORS[0]}20`,
                          color: CANDIDATE_COLORS[vote.candidate] || COLORS[0],
                          border: `1px solid ${CANDIDATE_COLORS[vote.candidate] || COLORS[0]}40`,
                        }}
                      >
                        {vote.candidate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(vote.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reset poll section */}
      <div className="glass-card p-6 border-red-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold mb-1">Reset Poll</h2>
            <p className="text-gray-500 text-sm">
              Permanently deletes all votes. Use this to start a fresh voting session.
            </p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            disabled={(stats?.total || 0) === 0}
            className="py-2.5 px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            🗑 Reset Poll
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass-card max-w-md w-full p-8 animate-scale-in">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Reset the Poll?</h3>
            <p className="text-gray-400 text-sm text-center mb-2">
              This will permanently delete all <span className="text-red-400 font-semibold">{stats?.total} votes</span>.
            </p>
            <p className="text-gray-600 text-xs text-center mb-8">
              This action cannot be undone. Consider exporting the CSV before resetting.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={resetting}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all text-sm font-medium disabled:opacity-50"
              >
                {resetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting…
                  </span>
                ) : "Yes, Reset All Votes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
