/**
 * =============================================
 * Candidates Management Page (Admin Only)
 * CRUD operations for candidate records
 * Search & filter, resume upload, assign interviewer
 * =============================================
 */

import { useState, useMemo } from "react";
import { mockCandidates, mockUsers } from "@/data/mockData";
import { Candidate, CandidateStatus } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Upload, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

/** All possible statuses for filter dropdown */
const statusOptions: { value: CandidateStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "technical_review", label: "Tech Review" },
  { value: "hr_review", label: "HR Review" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
];

const CandidatesPage = () => {
  /* State for candidate list (local copy for CRUD) */
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  /* Technical interviewers for assignment */
  const techInterviewers = mockUsers.filter((u) => u.role === "technical");

  /** Filtered and searched candidates */
  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

  /** Delete a candidate */
  const handleDelete = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Candidate deleted", description: "Record removed successfully." });
  };

  /** Open edit form */
  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  /** Open new form */
  const handleNew = () => {
    setEditingCandidate(null);
    setShowForm(true);
  };

  /** Save candidate (add or edit) */
  const handleSave = (data: Partial<Candidate>) => {
    if (editingCandidate) {
      // Update existing
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === editingCandidate.id ? { ...c, ...data, updatedAt: new Date().toISOString().split("T")[0] } : c
        )
      );
      toast({ title: "Candidate updated" });
    } else {
      // Add new
      const newCandidate: Candidate = {
        id: `c${Date.now()}`,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        experience: data.experience || 0,
        position: data.position || "",
        status: "pending",
        assignedInterviewerId: data.assignedInterviewerId,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setCandidates((prev) => [newCandidate, ...prev]);
      toast({ title: "Candidate added" });
    }
    setShowForm(false);
    setEditingCandidate(null);
  };

  /** Status badge styles */
  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      technical_review: "bg-info/10 text-info",
      hr_review: "bg-primary/10 text-primary",
      selected: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
      on_hold: "bg-muted text-muted-foreground",
    };
    const labels: Record<string, string> = {
      pending: "Pending", technical_review: "Tech Review", hr_review: "HR Review",
      selected: "Selected", rejected: "Rejected", on_hold: "On Hold",
    };
    return (
      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header with search, filter, add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl text-foreground">Candidate Management</h1>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" /> Add Candidate
        </Button>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | "all")}
            className="h-10 w-full sm:w-48 rounded-md border border-input bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Position</th>
                <th className="p-4 font-medium">Exp</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Assigned To</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{c.name}</td>
                  <td className="p-4 text-muted-foreground">{c.email}</td>
                  <td className="p-4 text-muted-foreground">{c.position}</td>
                  <td className="p-4 text-muted-foreground">{c.experience}y</td>
                  <td className="p-4">{statusBadge(c.status)}</td>
                  <td className="p-4 text-muted-foreground">
                    {mockUsers.find((u) => u.id === c.assignedInterviewerId)?.name || "—"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(c)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No candidates found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ADD / EDIT MODAL ===== */}
      <AnimatePresence>
        {showForm && (
          <CandidateFormModal
            candidate={editingCandidate}
            interviewers={techInterviewers}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingCandidate(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Candidate Add/Edit Form Modal
 * Includes resume upload field
 */
const CandidateFormModal = ({
  candidate, interviewers, onSave, onClose,
}: {
  candidate: Candidate | null;
  interviewers: { id: string; name: string }[];
  onSave: (data: Partial<Candidate>) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(candidate?.name || "");
  const [email, setEmail] = useState(candidate?.email || "");
  const [phone, setPhone] = useState(candidate?.phone || "");
  const [experience, setExperience] = useState(candidate?.experience?.toString() || "");
  const [position, setPosition] = useState(candidate?.position || "");
  const [assignedInterviewerId, setAssignedInterviewerId] = useState(candidate?.assignedInterviewerId || "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name, email, phone,
      experience: parseInt(experience) || 0,
      position,
      assignedInterviewerId: assignedInterviewerId || undefined,
      // TODO: Handle resume file upload to PHP backend
      resumeUrl: resumeFile ? resumeFile.name : candidate?.resumeUrl,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-card-hover max-h-[90vh] overflow-y-auto"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-foreground">
            {candidate ? "Edit Candidate" : "Add Candidate"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Experience (years)</Label>
              <Input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} required className="bg-background" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Position</Label>
            <Input value={position} onChange={(e) => setPosition(e.target.value)} required className="bg-background" />
          </div>

          {/* Assign interviewer dropdown */}
          <div className="space-y-2">
            <Label className="text-foreground">Assign Technical Interviewer</Label>
            <select
              value={assignedInterviewerId}
              onChange={(e) => setAssignedInterviewerId(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Not assigned</option>
              {interviewers.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          {/* Resume upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Resume (PDF/DOC)</Label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
                <Upload className="h-4 w-4" />
                {resumeFile ? resumeFile.name : "Choose file"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {/* TODO: Upload resume to PHP backend / file storage */}
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{candidate ? "Update" : "Add"} Candidate</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CandidatesPage;
