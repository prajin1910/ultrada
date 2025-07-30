import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";
const DOCUMENT_API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    // Only handle 401 errors for authentication endpoints or when token exists
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      const currentPath = window.location.pathname;
      
      // Only clear session if we have a token and we're not on auth pages
      if (token && !currentPath.includes("/login") && !currentPath.includes("/register")) {
        console.warn("Session expired, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: any) => api.post("/auth/register", userData),
  verifyOTP: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),
  login: (credentials: any) => api.post("/auth/login", credentials),
  resendOTP: (email: string) => api.post("/auth/resend-otp", { email }),
};

export const alumniAPI = {
  requestApproval: (alumniData: any) =>
    api.post("/alumni/request-approval", alumniData),
  getPendingRequests: (professorId: string) =>
    api.get(`/alumni/pending-requests/${professorId}`),
  approveRequest: (requestId: string) =>
    api.put(`/alumni/approve/${requestId}`),
  rejectRequest: (requestId: string) => api.put(`/alumni/reject/${requestId}`),
};

export const assessmentAPI = {
  create: (assessmentData: any) => api.post("/assessments", assessmentData),
  update: (assessmentId: string, assessmentData: any) => api.put(`/assessments/${assessmentId}`, assessmentData),
  delete: (assessmentId: string) => api.delete(`/assessments/${assessmentId}`),
  getById: (assessmentId: string) => api.get(`/assessments/${assessmentId}`),
  getByStudent: (studentId: string) =>
    api.get(`/assessments/student/${studentId}`),
  getByProfessor: (professorId: string) =>
    api.get(`/assessments/professor/${professorId}`),
  submit: (assessmentId: string, submissionData: any) =>
    api.post(`/assessments/${assessmentId}/submit`, submissionData),
  getResults: (assessmentId: string) =>
    api.get(`/assessments/${assessmentId}/results`),
  getResultsWithStudents: (assessmentId: string) =>
    api.get(`/assessments/${assessmentId}/results-with-students`),
  getStudentResults: (studentId: string) =>
    api.get(`/assessments/results/student/${studentId}`),
  getStatus: (assessmentId: string) =>
    api.get(`/assessments/${assessmentId}/status`),
  // Add method to check if student has already submitted
  checkSubmission: (assessmentId: string, studentId: string) =>
    api.get(`/assessments/${assessmentId}/submission/${studentId}`),
};

export const chatAPI = {
  sendMessage: (messageData: any) => api.post("/chat/send", messageData),
  getMessages: (userId1: string, userId2: string) =>
    api.get(`/chat/messages/${userId1}/${userId2}`),
  findUser: (query: string) => api.get(`/users/search?q=${query}`),
  getConversations: (userId: string) =>
    api.get(`/chat/conversations/${userId}`),
};

export const aiAPI = {
  generateRoadmap: (data: any) => api.post("/ai/roadmap", data),
  generateAssessment: (data: any) => api.post("/ai/assessment", data),
  explainAnswer: (question: string, correctAnswer: string) =>
    api.post("/ai/explain", { question, correctAnswer }),
  evaluateAnswers: (assessmentData: any) =>
    api.post("/ai/evaluate", assessmentData),
};

// Task API
export const taskAPI = {
  create: (studentId: string, taskData: any) =>
    api.post(`/tasks?studentId=${studentId}`, taskData),
  getAll: (studentId: string) => api.get(`/tasks/student/${studentId}`),
  getByStatus: (studentId: string, status: string) =>
    api.get(`/tasks/student/${studentId}/status/${status}`),
  getById: (taskId: string, studentId: string) =>
    api.get(`/tasks/${taskId}?studentId=${studentId}`),
  update: (taskId: string, studentId: string, taskData: any) =>
    api.put(`/tasks/${taskId}?studentId=${studentId}`, taskData),
  delete: (taskId: string, studentId: string) =>
    api.delete(`/tasks/${taskId}?studentId=${studentId}`),
  markCompleted: (taskId: string, studentId: string) =>
    api.put(`/tasks/${taskId}/complete?studentId=${studentId}`),
  updateStatus: (taskId: string, studentId: string, status: string) =>
    api.put(`/tasks/${taskId}/status?studentId=${studentId}&status=${status}`),
  getStats: (studentId: string) => api.get(`/tasks/student/${studentId}/stats`),
  getOverdue: (studentId: string) =>
    api.get(`/tasks/student/${studentId}/overdue`),
  getDueSoon: (studentId: string) =>
    api.get(`/tasks/student/${studentId}/due-soon`),
};

// Document Analysis API Types
export interface FlowchartResponse {
  success: boolean;
  mermaidCode: string;
  extractedText: string;
}

export interface ApiError {
  error: string;
}

// Document Analysis API Functions
export async function generateFlowchart(
  file: File
): Promise<FlowchartResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log(
      "Making request to:",
      `${DOCUMENT_API_BASE_URL}/api/generate-flowchart`
    );

    const response = await fetch(
      `${DOCUMENT_API_BASE_URL}/api/generate-flowchart`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || "Failed to generate flowchart");
      } else {
        // If not JSON, it might be HTML error page
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Expected JSON but got:", textResponse);
      throw new Error("Server returned invalid response format");
    }

    return response.json();
  } catch (error) {
    console.error("generateFlowchart error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to document analysis server. Please check if it's running on port 3002."
      );
    }
    throw error;
  }
}

export async function checkServerHealth(): Promise<{
  status: string;
  message: string;
}> {
  try {
    console.log(
      "Checking server health at:",
      `${DOCUMENT_API_BASE_URL}/api/health`
    );

    const response = await fetch(`${DOCUMENT_API_BASE_URL}/api/health`);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Expected JSON but got:", textResponse);
      throw new Error("Server returned invalid response format");
    }

    return response.json();
  } catch (error) {
    console.error("checkServerHealth error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to document analysis server. Please check if it's running on port 3002."
      );
    }
    throw error;
  }
}

export default api;
