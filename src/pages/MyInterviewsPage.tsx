/**
 * =============================================
 * Technical Interviewer - My Interviews Page
 * View assigned candidates, add technical feedback
 * Update candidate status (Pass/Fail/Next Round)
 * =============================================
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockCandidates, mockTechnicalFeedback } from "@/data/mockData";
import { TechnicalFeedback, InterviewResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const MyInterviewsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  /* Get candidates assigned to current interviewer */
  const assigned = mockCandidates.filter((c) => c.assignedInterviewerId === user?.id);

  /* Local feedback state */
  const [feedbacks, setFeedbacks] = useState<TechnicalFeedback[]>(mockTechnicalFeedback);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  /** Open feedback form for a candidate */
  const openFeedback = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setShowFeedbackForm(true);
  };

  /** Save feedback */
  const handleSaveFeedback = (data: Partial<TechnicalFeedback>) => {
    const newFeedback: TechnicalFeedback = {
      id: `tf${Date.now()}`,
      candidateId: selectedCandidateId!,
      interviewerId: user!.id,
      technicalSkills: data.technicalSkills || 5,
      problemSolving: data.problemSolving || 5,
      communication: data.communication || 5,
      comments: data.comments || "",
      result: data.result || "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFeedbacks((prev) => [...prev, newFeedback]);
    setShowFeedbackForm(false);
    setSelectedCandidateId(null);
    toast({ title: "Feedback submitted", description: "Technical review saved successfully." });
  };

  /** Get existing feedback for a candidate */
  const getFeedback = (candidateId: string) =>
    feedbacks.find((f) => f.candidateId === candidateId && f.interviewerId === user?.id);

  /** Result badge */
  const resultBadge = (result: InterviewResult) => {
    const styles: Record<InterviewResult, string> = {
      pass: "bg-success/10 text-success",
      fail: "bg-destructive/10 text-destructive",
      next_round: "bg-info/10 text-info",
      pending: "bg-warning/10 text-warning",
    };
    return (
      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${styles[result]}`}>
        {result.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl text-foreground">My Interviews</h1>

      {assigned.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No candidates assigned to you yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assigned.map((c) => {
            const feedback = getFeedback(c.id);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.position} · {c.experience} yrs exp</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {feedback ? (
                      <div className="text-right">
                        {resultBadge(feedback.result)}
                        <p className="mt-1 text-xs text-muted-foreground">
                          Score: {Math.round((feedback.technicalSkills + feedback.problemSolving + feedback.communication) / 3)}/10
                        </p>
                      </div>
                    ) : (
                      <Button onClick={() => openFeedback(c.id)} size="sm" className="gap-2">
                        <Star className="h-4 w-4" /> Add Feedback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Show existing feedback details */}
                {feedback && (
                  <div className="mt-4 rounded-lg bg-accent/50 p-4">
                    <div className="grid gap-2 sm:grid-cols-3 text-sm">
                      <p className="text-muted-foreground">Technical: <span className="font-medium text-foreground">{feedback.technicalSkills}/10</span></p>
                      <p className="text-muted-foreground">Problem Solving: <span className="font-medium text-foreground">{feedback.problemSolving}/10</span></p>
                      <p className="text-muted-foreground">Communication: <span className="font-medium text-foreground">{feedback.communication}/10</span></p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{feedback.comments}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Feedback form modal */}
      <AnimatePresence>
        {showFeedbackForm && selectedCandidateId && (
          <TechFeedbackModal
            candidateName={assigned.find((c) => c.id === selectedCandidateId)?.name || ""}
            onSave={handleSaveFeedback}
            onClose={() => { setShowFeedbackForm(false); setSelectedCandidateId(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/** Technical feedback form modal */
const TechFeedbackModal = ({
  candidateName, onSave, onClose,
}: {
  candidateName: string;
  onSave: (data: Partial<TechnicalFeedback>) => void;
  onClose: () => void;
}) => {
  const [technicalSkills, setTechnicalSkills] = useState("7");
  const [problemSolving, setProblemSolving] = useState("7");
  const [communication, setCommunication] = useState("7");
  const [comments, setComments] = useState("");
  const [result, setResult] = useState<InterviewResult>("pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      technicalSkills: parseInt(technicalSkills),
      problemSolving: parseInt(problemSolving),
      communication: parseInt(communication),
      comments,
      result,
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
            <h2 className="font-display text-xl text-foreground">Technical Feedback</h2>
            <p className="text-sm text-muted-foreground">{candidateName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Score sliders */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-foreground">Technical Skills</Label>
              <div className="flex items-center gap-2">
                <Input type="range" min="1" max="10" value={technicalSkills} onChange={(e) => setTechnicalSkills(e.target.value)} className="flex-1" />
                <span className="w-8 text-center text-sm font-medium text-foreground">{technicalSkills}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Problem Solving</Label>
              <div className="flex items-center gap-2">
                <Input type="range" min="1" max="10" value={problemSolving} onChange={(e) => setProblemSolving(e.target.value)} className="flex-1" />
                <span className="w-8 text-center text-sm font-medium text-foreground">{problemSolving}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Communication</Label>
              <div className="flex items-center gap-2">
                <Input type="range" min="1" max="10" value={communication} onChange={(e) => setCommunication(e.target.value)} className="flex-1" />
                <span className="w-8 text-center text-sm font-medium text-foreground">{communication}</span>
              </div>
            </div>
          </div>

          {/* Result dropdown */}
          <div className="space-y-2">
            <Label className="text-foreground">Result</Label>
            <select value={result} onChange={(e) => setResult(e.target.value as InterviewResult)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="pending">Pending</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="next_round">Next Round</option>
            </select>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label className="text-foreground">Comments</Label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Detailed feedback about the candidate..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Feedback</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MyInterviewsPage;
