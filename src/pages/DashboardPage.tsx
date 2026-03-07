/**
 * =============================================
 * Dashboard Page
 * Role-aware overview with stats cards
 * Shows relevant info based on logged-in user role
 * =============================================
 */

import { useAuth } from "@/contexts/AuthContext";
import { mockCandidates, mockTechnicalFeedback, mockHRFeedback } from "@/data/mockData";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, Clock, TrendingUp, FileText } from "lucide-react";

/** Stat card component */
const StatCard = ({
  label, value, icon: Icon, color,
}: {
  label: string; value: number | string; icon: React.ElementType; color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card p-5 shadow-card"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuth();

  /* Compute stats from mock data */
  const totalCandidates = mockCandidates.length;
  const pending = mockCandidates.filter((c) => c.status === "pending").length;
  const selected = mockCandidates.filter((c) => c.status === "selected").length;
  const rejected = mockCandidates.filter((c) => c.status === "rejected").length;
  const inReview = mockCandidates.filter((c) =>
    c.status === "technical_review" || c.status === "hr_review"
  ).length;
  const onHold = mockCandidates.filter((c) => c.status === "on_hold").length;

  /* Candidates assigned to current technical interviewer */
  const myAssigned = mockCandidates.filter((c) => c.assignedInterviewerId === user?.id);

  /* HR-specific: candidates in HR review stage */
  const hrQueue = mockCandidates.filter((c) => c.status === "hr_review");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome section */}
      <div>
        <h1 className="font-display text-2xl text-foreground">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's an overview of your interview pipeline
        </p>
      </div>

      {/* ===== ADMIN STATS ===== */}
      {user?.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Candidates" value={totalCandidates} icon={Users} color="bg-primary/10 text-primary" />
          <StatCard label="In Review" value={inReview} icon={Clock} color="bg-info/10 text-info" />
          <StatCard label="Selected" value={selected} icon={CheckCircle} color="bg-success/10 text-success" />
          <StatCard label="Rejected" value={rejected} icon={XCircle} color="bg-destructive/10 text-destructive" />
        </div>
      )}

      {/* ===== TECH INTERVIEWER STATS ===== */}
      {user?.role === "technical" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Assigned to Me" value={myAssigned.length} icon={Users} color="bg-primary/10 text-primary" />
          <StatCard label="Reviews Given" value={mockTechnicalFeedback.filter((f) => f.interviewerId === user.id).length} icon={FileText} color="bg-info/10 text-info" />
          <StatCard label="Pending Review" value={myAssigned.filter((c) => c.status === "technical_review").length} icon={Clock} color="bg-warning/10 text-warning" />
        </div>
      )}

      {/* ===== HR STATS ===== */}
      {user?.role === "hr" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="HR Queue" value={hrQueue.length} icon={Users} color="bg-primary/10 text-primary" />
          <StatCard label="Reviews Given" value={mockHRFeedback.length} icon={FileText} color="bg-info/10 text-info" />
          <StatCard label="Final Decisions" value={selected + rejected + onHold} icon={TrendingUp} color="bg-success/10 text-success" />
        </div>
      )}

      {/* Recent candidates table (visible to all) */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-lg text-foreground">Recent Candidates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Position</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(user?.role === "technical" ? myAssigned : mockCandidates).slice(0, 5).map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="p-4 font-medium text-foreground">{c.name}</td>
                  <td className="p-4 text-muted-foreground">{c.position}</td>
                  <td className="p-4 text-muted-foreground">{c.experience} yrs</td>
                  <td className="p-4">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/** Status badge with color coding */
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    technical_review: "bg-info/10 text-info",
    hr_review: "bg-primary/10 text-primary",
    selected: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
    on_hold: "bg-muted text-muted-foreground",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    technical_review: "Tech Review",
    hr_review: "HR Review",
    selected: "Selected",
    rejected: "Rejected",
    on_hold: "On Hold",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || ""}`}>
      {labels[status] || status}
    </span>
  );
};

export default DashboardPage;
