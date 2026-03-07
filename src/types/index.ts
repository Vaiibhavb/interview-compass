/**
 * =============================================
 * Interview Tracker - Type Definitions
 * All TypeScript interfaces for the application
 * =============================================
 */

/** User roles in the system */
export type UserRole = "admin" | "technical" | "hr";

/** Candidate interview status */
export type CandidateStatus = "pending" | "technical_review" | "hr_review" | "selected" | "rejected" | "on_hold";

/** Interview result */
export type InterviewResult = "pass" | "fail" | "next_round" | "pending";

/** Final hiring decision */
export type FinalDecision = "selected" | "rejected" | "on_hold" | "pending";

/** System user (admin, interviewer, HR) */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/** Candidate record */
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number; // years
  position: string;
  status: CandidateStatus;
  resumeUrl?: string;
  assignedInterviewerId?: string;
  createdAt: string;
  updatedAt: string;
}

/** Technical interview feedback */
export interface TechnicalFeedback {
  id: string;
  candidateId: string;
  interviewerId: string;
  technicalSkills: number; // 1-10
  problemSolving: number; // 1-10
  communication: number; // 1-10
  comments: string;
  result: InterviewResult;
  createdAt: string;
}

/** HR interview feedback */
export interface HRFeedback {
  id: string;
  candidateId: string;
  reviewerId: string;
  cultureFit: number; // 1-10
  communication: number; // 1-10
  salaryExpectation: string;
  comments: string;
  finalDecision: FinalDecision;
  createdAt: string;
}
