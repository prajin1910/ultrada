export interface User {
  id: string;
  username: string;
  email: string;
  role: "STUDENT" | "PROFESSOR" | "ALUMNI";
  isVerified: boolean;
  isApproved?: boolean; // For alumni
}

export interface AlumniRequest {
  id: string;
  alumniId: string;
  alumniUsername: string;
  alumniEmail: string;
  professorId: string;
  professorEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  startTime: string; // ISO string format
  endTime: string; // ISO string format
  createdBy: string;
  assignedStudents: string[];
  status: "SCHEDULED" | "ONGOING" | "COMPLETED";
  durationMinutes?: number;
  allowLateSubmission?: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

export interface AIRoadmap {
  domain: string;
  timeframe: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  roadmap: string[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  answers: number[];
  score: number;
  completedAt: Date;
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  status: "PENDING" | "ONGOING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isOverdue: boolean;
}

export interface TaskStats {
  pending: number;
  ongoing: number;
  completed: number;
  overdue: number;
}

export interface ChatConversation {
  id: string;
  username: string;
  email: string;
  role: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isLastMessageFromMe?: boolean;
}
