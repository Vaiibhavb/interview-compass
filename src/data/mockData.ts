/**
 * =============================================
 * Mock Data for Interview Tracker
 * Replace with actual API calls / PHP backend
 * =============================================
 */

import { User, Candidate, TechnicalFeedback, HRFeedback } from "@/types";

/** Default system users */
export const mockUsers: User[] = [
  { id: "u1", name: "Sarah Admin", email: "admin@company.com", role: "admin" },
  { id: "u2", name: "James Tech", email: "james@company.com", role: "technical" },
  { id: "u3", name: "Maria HR", email: "maria@company.com", role: "hr" },
  { id: "u4", name: "David Tech", email: "david@company.com", role: "technical" },
];

/** Default candidate records */
export const mockCandidates: Candidate[] = [
  {
    id: "c1", name: "Alice Johnson", email: "alice@email.com", phone: "+1-555-0101",
    experience: 5, position: "Senior Frontend Developer", status: "technical_review",
    assignedInterviewerId: "u2", createdAt: "2026-02-15", updatedAt: "2026-02-20",
  },
  {
    id: "c2", name: "Bob Smith", email: "bob@email.com", phone: "+1-555-0102",
    experience: 3, position: "Backend Developer", status: "hr_review",
    assignedInterviewerId: "u4", createdAt: "2026-02-10", updatedAt: "2026-02-25",
  },
  {
    id: "c3", name: "Carol Williams", email: "carol@email.com", phone: "+1-555-0103",
    experience: 7, position: "Full Stack Engineer", status: "selected",
    assignedInterviewerId: "u2", createdAt: "2026-01-20", updatedAt: "2026-03-01",
  },
  {
    id: "c4", name: "Daniel Brown", email: "daniel@email.com", phone: "+1-555-0104",
    experience: 2, position: "Junior Developer", status: "rejected",
    assignedInterviewerId: "u4", createdAt: "2026-02-01", updatedAt: "2026-02-28",
  },
  {
    id: "c5", name: "Emma Davis", email: "emma@email.com", phone: "+1-555-0105",
    experience: 4, position: "UI/UX Designer", status: "pending",
    createdAt: "2026-03-01", updatedAt: "2026-03-01",
  },
  {
    id: "c6", name: "Frank Miller", email: "frank@email.com", phone: "+1-555-0106",
    experience: 6, position: "DevOps Engineer", status: "on_hold",
    assignedInterviewerId: "u2", createdAt: "2026-02-18", updatedAt: "2026-03-05",
  },
];

/** Sample technical feedback */
export const mockTechnicalFeedback: TechnicalFeedback[] = [
  {
    id: "tf1", candidateId: "c1", interviewerId: "u2",
    technicalSkills: 8, problemSolving: 7, communication: 9,
    comments: "Strong React skills, good problem-solving approach.",
    result: "next_round", createdAt: "2026-02-20",
  },
  {
    id: "tf2", candidateId: "c2", interviewerId: "u4",
    technicalSkills: 7, problemSolving: 8, communication: 6,
    comments: "Good backend knowledge, needs improvement in communication.",
    result: "pass", createdAt: "2026-02-22",
  },
  {
    id: "tf3", candidateId: "c3", interviewerId: "u2",
    technicalSkills: 9, problemSolving: 9, communication: 8,
    comments: "Excellent candidate. Very strong across the board.",
    result: "pass", createdAt: "2026-02-15",
  },
  {
    id: "tf4", candidateId: "c4", interviewerId: "u4",
    technicalSkills: 4, problemSolving: 3, communication: 5,
    comments: "Needs more experience. Struggled with basic concepts.",
    result: "fail", createdAt: "2026-02-25",
  },
];

/** Sample HR feedback */
export const mockHRFeedback: HRFeedback[] = [
  {
    id: "hf1", candidateId: "c2", reviewerId: "u3",
    cultureFit: 8, communication: 7, salaryExpectation: "$85,000",
    comments: "Good fit for the team. Salary within range.",
    finalDecision: "pending", createdAt: "2026-02-26",
  },
  {
    id: "hf2", candidateId: "c3", reviewerId: "u3",
    cultureFit: 9, communication: 9, salaryExpectation: "$120,000",
    comments: "Excellent cultural fit. Strong recommendation to hire.",
    finalDecision: "selected", createdAt: "2026-02-28",
  },
];
