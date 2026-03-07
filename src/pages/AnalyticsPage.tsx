/**
 * =============================================
 * Analytics Dashboard Page
 * Interview statistics with charts
 * Visualize candidate pipeline data
 * =============================================
 */

import { mockCandidates, mockTechnicalFeedback } from "@/data/mockData";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const AnalyticsPage = () => {
  /* ===== Compute analytics data ===== */

  /** Candidates by status (for bar chart) */
  const statusCounts = [
    { name: "Pending", count: mockCandidates.filter((c) => c.status === "pending").length, fill: "hsl(38, 92%, 50%)" },
    { name: "Tech Review", count: mockCandidates.filter((c) => c.status === "technical_review").length, fill: "hsl(210, 70%, 52%)" },
    { name: "HR Review", count: mockCandidates.filter((c) => c.status === "hr_review").length, fill: "hsl(38, 72%, 50%)" },
    { name: "Selected", count: mockCandidates.filter((c) => c.status === "selected").length, fill: "hsl(152, 60%, 42%)" },
    { name: "Rejected", count: mockCandidates.filter((c) => c.status === "rejected").length, fill: "hsl(0, 72%, 51%)" },
    { name: "On Hold", count: mockCandidates.filter((c) => c.status === "on_hold").length, fill: "hsl(220, 10%, 46%)" },
  ];

  /** Interview results distribution (for pie chart) */
  const resultCounts = [
    { name: "Pass", value: mockTechnicalFeedback.filter((f) => f.result === "pass").length },
    { name: "Fail", value: mockTechnicalFeedback.filter((f) => f.result === "fail").length },
    { name: "Next Round", value: mockTechnicalFeedback.filter((f) => f.result === "next_round").length },
  ];
  const pieColors = ["hsl(152, 60%, 42%)", "hsl(0, 72%, 51%)", "hsl(210, 70%, 52%)"];

  /** Average scores */
  const avgTech = mockTechnicalFeedback.length > 0
    ? (mockTechnicalFeedback.reduce((sum, f) => sum + f.technicalSkills, 0) / mockTechnicalFeedback.length).toFixed(1)
    : "N/A";
  const avgProblem = mockTechnicalFeedback.length > 0
    ? (mockTechnicalFeedback.reduce((sum, f) => sum + f.problemSolving, 0) / mockTechnicalFeedback.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl text-foreground">Interview Analytics</h1>

      {/* Summary stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox label="Total Candidates" value={mockCandidates.length} />
        <StatBox label="Interviews Done" value={mockTechnicalFeedback.length} />
        <StatBox label="Avg Tech Score" value={avgTech} />
        <StatBox label="Avg Problem Solving" value={avgProblem} />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart — candidates by stage */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-lg text-foreground">Candidates by Stage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(36, 16%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(40, 25%, 99%)",
                  border: "1px solid hsl(36, 16%, 88%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusCounts.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart — interview results */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-display text-lg text-foreground">Interview Results</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={resultCounts}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {resultCounts.map((_, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

/** Small stat box component */
const StatBox = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

export default AnalyticsPage;
