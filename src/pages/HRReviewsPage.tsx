/**
 * =============================================
 * HR Reviews Page
 * View candidates who passed tech review
 * Add HR feedback and final hiring decisions
 * =============================================
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockCandidates, mockHRFeedback, mockTechnicalFeedback } from "@/data/mockData";
import { HRFeedback, FinalDecision } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const HRReviewsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  /* Candidates in HR review stage or who passed technical */
  const hrCandidates = mockCandidates.filter(
    (c) => c.status === "hr_review" || c.status === "selected" || c.status === "on_hold"
  );

  const [feedbacks, setFeedbacks] = useState<HRFeedback[]>(mockHRFeedback);
  const [showForm, setShowForm] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  /** Open HR feedback form */
  const openFeedback = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setShowForm(true);
  };

  /** Save HR feedback */
  const handleSave = (data: Partial<HRFeedback>) => {
    const newFeedback: HRFeedback = {
      id: `hf${Date.now()}`,
      candidateId: selectedCandidateId!,
      reviewerId: user!.id,
      cultureFit: data.cultureFit || 5,
      communication: data.communication || 5,
      salaryExpectation: data.salaryExpectation || "",
      comments: data.comments || "",
      finalDecision: data.finalDecision || "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFeedbacks((prev) => [...prev, newFeedback]);
    setShowForm(false);
    setSelectedCandidateId(null);
    toast({ title: "HR Review submitted" });
  };

  /** Get existing HR feedback for a candidate */
  const getFeedback = (candidateId: string) => feedbacks.find((f) => f.candidateId === candidateId);

  /** Get technical feedback for context */
  const getTechFeedback = (candidateId: string) =>
    mockTechnicalFeedback.find((f) => f.candidateId === candidateId);

  /** Decision badge */
  const decisionBadge = (decision: FinalDecision) => {
    const styles: Record<FinalDecision, string> = {
      selected: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
      on_hold: "bg-warning/10 text-warning",
      pending: "bg-muted text-muted-foreground",
    };
    return (
      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${styles[decision]}`}>
        {decision.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl text-foreground">HR Reviews</h1>

      {hrCandidates.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No candidates in HR review queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hrCandidates.map((c) => {
            const hrFeedback = getFeedback(c.id);
            const techFeedback = getTechFeedback(c.id);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.position} · {c.experience} yrs</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {hrFeedback ? decisionBadge(hrFeedback.finalDecision) : (
                      <Button onClick={() => openFeedback(c.id)} size="sm" className="gap-2">
                        <CheckCircle className="h-4 w-4" /> Add HR Review
                      </Button>
                    )}
                  </div>
                </div>

                {/* Show tech review summary if available */}
                {techFeedback && (
                  <div className="mt-3 rounded-lg bg-info/5 p-3 text-sm">
                    <p className="font-medium text-foreground">Tech Review Summary</p>
                    <p className="text-muted-foreground">
                      Skills: {techFeedback.technicalSkills}/10 · Problem Solving: {techFeedback.problemSolving}/10 · 
                      Result: {techFeedback.result.replace("_", " ")}
                    </p>
                  </div>
                )}

                {/* Show HR feedback if exists */}
                {hrFeedback && (
                  <div className="mt-3 rounded-lg bg-accent/50 p-4 text-sm">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <p className="text-muted-foreground">Culture Fit: <span className="font-medium text-foreground">{hrFeedback.cultureFit}/10</span></p>
                      <p className="text-muted-foreground">Communication: <span className="font-medium text-foreground">{hrFeedback.communication}/10</span></p>
                      <p className="text-muted-foreground">Salary: <span className="font-medium text-foreground">{hrFeedback.salaryExpectation}</span></p>
                    </div>
                    <p className="mt-2 text-muted-foreground">{hrFeedback.comments}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* HR Feedback modal */}
      <AnimatePresence>
        {showForm && selectedCandidateId && (
          <HRFeedbackModal
            candidateName={hrCandidates.find((c) => c.id === selectedCandidateId)?.name || ""}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setSelectedCandidateId(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/** HR feedback form modal */
const HRFeedbackModal = ({
  candidateName, onSave, onClose,
}: {
  candidateName: string;
  onSave: (data: Partial<HRFeedback>) => void;
  onClose: () => void;
}) => {
  const [cultureFit, setCultureFit] = useState("7");
  const [communication, setCommunication] = useState("7");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [comments, setComments] = useState("");
  const [finalDecision, setFinalDecision] = useState<FinalDecision>("pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      cultureFit: parseInt(cultureFit),
      communication: parseInt(communication),
      salaryExpectation, comments, finalDecision,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-card-hover max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl text-foreground">HR Review</h2>
            <p className="text-sm text-muted-foreground">{candidateName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground">Culture Fit (1-10)</Label>
              <div className="flex items-center gap-2">
                <Input type="range" min="1" max="10" value={cultureFit} onChange={(e) => setCultureFit(e.target.value)} className="flex-1" />
                <span className="w-8 text-center text-sm font-medium text-foreground">{cultureFit}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Communication (1-10)</Label>
              <div className="flex items-center gap-2">
                <Input type="range" min="1" max="10" value={communication} onChange={(e) => setCommunication(e.target.value)} className="flex-1" />
                <span className="w-8 text-center text-sm font-medium text-foreground">{communication}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Salary Expectation</Label>
            <Input value={salaryExpectation} onChange={(e) => setSalaryExpectation(e.target.value)} placeholder="e.g. $90,000" className="bg-background" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Final Decision</Label>
            <select value={finalDecision} onChange={(e) => setFinalDecision(e.target.value as FinalDecision)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="pending">Pending</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Comments</Label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="HR assessment notes..." />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HRReviewsPage;
