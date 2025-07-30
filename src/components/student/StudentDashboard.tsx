import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  MessageCircle,
  BookOpen,
  Calendar,
  Brain,
  Target,
  LogOut,
  Star,
  FileText,
  CheckSquare,
} from "lucide-react";
import ChatSection from "../common/ChatSection";
import AssessmentSection from "./AssessmentSection";
import AIRoadmapSection from "./AIRoadmapSection";
import AIPracticeSection from "./AIPracticeSection";
import DocumentAnalysis from "./DocumentAnalysis";
import TaskManagementSection from "./TaskManagementSection";
import { assessmentAPI } from "../../services/api";
import { Assessment, AssessmentResult } from "../../types";
import toast from "react-hot-toast";

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<
    AssessmentResult[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [assessmentFilter, setAssessmentFilter] = useState<
    "ongoing" | "past" | "future"
  >("ongoing");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "assessments", label: "Assessments", icon: Calendar },
    { id: "tasks", label: "Task Management", icon: CheckSquare },
    { id: "ai-practice", label: "Practice & Learn", icon: Brain },
    { id: "ai-roadmap", label: "Roadmap", icon: Target },
    { id: "document-analysis", label: "Document Analysis", icon: FileText },
    { id: "chat", label: "Messages", icon: MessageCircle },
  ];

  useEffect(() => {
    if (user) {
      fetchAssessments();
      fetchAssessmentResults();
    }

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [user]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await assessmentAPI.getByStudent(user!.id);
      setAssessments(response.data);
    } catch (error) {
      toast.error("Failed to fetch assessments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentResults = async () => {
    setResultsLoading(true);
    try {
      const response = await assessmentAPI.getStudentResults(user!.id);
      setAssessmentResults(response.data);
    } catch (error) {
      console.error("Failed to fetch assessment results:", error);
      // Don't show error toast as results might not exist yet
    } finally {
      setResultsLoading(false);
    }
  };

  const getAssessmentStatus = (assessment: Assessment) => {
    const now = currentTime;
    const startTime = new Date(assessment.startTime);
    const endTime = new Date(assessment.endTime);

    if (now < startTime) {
      return { status: "FUTURE", label: "FUTURE" };
    } else if (now >= startTime && now <= endTime) {
      return { status: "ONGOING", label: "ONGOING" };
    } else {
      return { status: "PAST", label: "PAST" };
    }
  };

  const getOngoingAssessments = () => {
    return assessments.filter((assessment) => {
      const status = getAssessmentStatus(assessment);
      return status.status === "ONGOING";
    });
  };

  const getPastAssessments = () => {
    return assessments.filter((assessment) => {
      const status = getAssessmentStatus(assessment);
      return status.status === "PAST";
    });
  };

  const getFutureAssessments = () => {
    return assessments.filter((assessment) => {
      const status = getAssessmentStatus(assessment);
      return status.status === "FUTURE";
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Generate activity tracker data based on real assessment results (12 weeks, 7 days each)
  const generateActivityData = () => {
    const weeks = 12;
    const daysPerWeek = 7;
    const today = new Date();
    const activities = [];

    for (let week = weeks - 1; week >= 0; week--) {
      const weekData = [];
      for (let day = 0; day < daysPerWeek; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + (6 - day)));

        // Check if user has activity on this date based on completed assessments
        const dateStr = date.toISOString().split("T")[0];
        const activitiesOnDate = assessmentResults.filter((result) => {
          const resultDate = new Date(result.completedAt)
            .toISOString()
            .split("T")[0];
          return resultDate === dateStr;
        });

        // Activity level based on real assessment results
        const activityLevel = Math.min(activitiesOnDate.length, 4); // Cap at 4 for visual consistency

        weekData.push({
          date: dateStr,
          level: activityLevel,
          count: activityLevel,
          activities:
            activitiesOnDate.length > 0
              ? `${activitiesOnDate.length} assessment${
                  activitiesOnDate.length > 1 ? "s" : ""
                } completed`
              : "No activity",
        });
      }
      activities.push(weekData);
    }
    return activities;
  };

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gray-100 border border-gray-200";
      case 1:
        return "bg-green-200 border border-green-300";
      case 2:
        return "bg-green-300 border border-green-400";
      case 3:
        return "bg-green-500 border border-green-600";
      case 4:
        return "bg-green-700 border border-green-800";
      default:
        return "bg-gray-100 border border-gray-200";
    }
  }; // Calculate current and best streaks based on real assessment results
  const calculateStreaks = () => {
    if (assessmentResults.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    // Sort assessment results by completion date
    const sortedResults = assessmentResults
      .slice()
      .sort(
        (a, b) =>
          new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      );

    // Get unique dates when assessments were completed
    const completionDates = [
      ...new Set(
        sortedResults.map(
          (result) => new Date(result.completedAt).toISOString().split("T")[0]
        )
      ),
    ].sort();

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Check if there's activity today or yesterday for current streak
    const hasRecentActivity =
      completionDates.includes(today) || completionDates.includes(yesterdayStr);

    if (hasRecentActivity) {
      currentStreak = 1;

      // Calculate consecutive days backwards from the most recent activity
      for (let i = completionDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(completionDates[i + 1]);
        const prevDate = new Date(completionDates[i]);
        const diffDays = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate best streak
    for (let i = 1; i < completionDates.length; i++) {
      const currentDate = new Date(completionDates[i]);
      const prevDate = new Date(completionDates[i - 1]);
      const diffDays = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    bestStreak = Math.max(bestStreak, tempStreak);
    bestStreak = Math.max(bestStreak, currentStreak);

    return { currentStreak, bestStreak };
  };

  // Calculate real performance metrics based on actual assessment results
  const calculatePerformanceMetrics = () => {
    if (assessmentResults.length === 0) {
      return {
        successRate: 0,
        averageScore: 0,
        completionRate: 0,
      };
    }

    // Calculate success rate based on actual scores (70% or higher is successful)
    const successfulAssessments = assessmentResults.filter((result) => {
      const assessment = assessments.find((a) => a.id === result.assessmentId);
      if (!assessment) return false;
      const percentage = (result.score / assessment.questions.length) * 100;
      return percentage >= 70;
    });
    const successRate = Math.round(
      (successfulAssessments.length / assessmentResults.length) * 100
    );

    // Calculate average score based on actual results
    const totalPercentage = assessmentResults.reduce((sum, result) => {
      const assessment = assessments.find((a) => a.id === result.assessmentId);
      if (!assessment) return sum;
      const percentage = (result.score / assessment.questions.length) * 100;
      return sum + percentage;
    }, 0);
    const averageScore = Math.round(totalPercentage / assessmentResults.length);

    // Calculate completion rate based on available assessments
    const completedAssessments = getPastAssessments().filter((assessment) =>
      assessmentResults.some((result) => result.assessmentId === assessment.id)
    );
    const completionRate =
      assessments.length > 0
        ? Math.round((completedAssessments.length / assessments.length) * 100)
        : 0;

    return {
      successRate: Math.min(successRate, 100),
      averageScore: Math.min(averageScore, 100),
      completionRate: Math.min(completionRate, 100),
    };
  };

  const getFilteredAssessments = () => {
    return assessments.filter((assessment) => {
      const status = getAssessmentStatus(assessment);
      return status.status.toLowerCase() === assessmentFilter;
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return <ChatSection />;
      case "assessments":
        return <AssessmentSection />;
      case "tasks":
        return <TaskManagementSection />;
      case "ai-roadmap":
        return <AIRoadmapSection />;
      case "ai-practice":
        return <AIPracticeSection />;
      case "document-analysis":
        return (
          <main className="flex-1 p-3 lg:p-4">
            <DocumentAnalysis />
          </main>
        );
      default:
        return (
          <main className="flex-1 p-3 lg:p-4">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-blue-900">
                  Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-600 text-xs">
                  Check your progress and see what's next.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user?.username}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                    Student
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Content Area */}
              <div className="lg:col-span-3 flex flex-col space-y-4">
                {/* Assessments Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Assessments
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full">
                      <button
                        onClick={() => setAssessmentFilter("ongoing")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                          assessmentFilter === "ongoing"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        Ongoing
                      </button>
                      <button
                        onClick={() => setAssessmentFilter("past")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                          assessmentFilter === "past"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        Past
                      </button>
                      <button
                        onClick={() => setAssessmentFilter("future")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                          assessmentFilter === "future"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        Future
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {loading ? (
                      <div className="col-span-2 text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">
                          Loading assessments...
                        </p>
                      </div>
                    ) : (
                      <>
                        {getFilteredAssessments().map((assessment) => {
                          const status = getAssessmentStatus(assessment);
                          return (
                            <div
                              key={assessment.id}
                              className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-gray-700 transition-colors">
                                  {assessment.title}
                                </h4>
                                <span
                                  className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${
                                    status.status === "ONGOING"
                                      ? "text-blue-600 bg-blue-100"
                                      : status.status === "PAST"
                                      ? "text-gray-600 bg-gray-100"
                                      : "text-orange-600 bg-orange-100"
                                  }`}
                                >
                                  {status.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-3">
                                {status.status === "ONGOING" ||
                                status.status === "FUTURE"
                                  ? `${
                                      status.status === "ONGOING"
                                        ? "Due"
                                        : "Starts"
                                    }: ${formatDate(
                                      status.status === "ONGOING"
                                        ? assessment.endTime
                                        : assessment.startTime
                                    )}`
                                  : `Completed: ${formatDate(
                                      assessment.endTime
                                    )}`}
                              </p>
                              <button
                                onClick={() => setActiveSection("assessments")}
                                disabled={status.status === "FUTURE"}
                                className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                                  status.status === "FUTURE"
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : status.status === "ONGOING"
                                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                                    : "bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
                                }`}
                              >
                                {status.status === "FUTURE"
                                  ? "Not Started"
                                  : status.status === "ONGOING"
                                  ? "Take Assessment"
                                  : "View Results"}
                              </button>
                            </div>
                          );
                        })}

                        {/* Show message if no assessments in current filter */}
                        {getFilteredAssessments().length === 0 && !loading && (
                          <div className="col-span-2 text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              No {assessmentFilter} assessments available.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* AI Tools Section */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* AI Roadmap */}
                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-xl relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                      <Star className="absolute -top-2 -right-2 w-10 h-10 text-white/20 transform rotate-12 group-hover:rotate-45 transition-transform duration-300" />
                      <Brain className="absolute bottom-2 left-2 w-6 h-6 text-white/30 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                      <h3 className="text-lg font-bold mb-1 relative z-10">
                        AI Roadmap Generator
                      </h3>
                      <p className="text-white/80 mb-4 text-sm flex-grow relative z-10">
                        Chart your learning path with AI-driven plan.
                      </p>
                      <button
                        onClick={() => setActiveSection("ai-roadmap")}
                        className="w-full bg-white text-purple-600 py-2 px-4 rounded-lg font-bold text-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 relative z-10"
                      >
                        Generate Plan
                      </button>
                    </div>

                    {/* AI Practice */}
                    <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-xl relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                      <Target className="absolute -top-2 -right-2 w-10 h-10 text-white/20 transform rotate-12 group-hover:rotate-45 transition-transform duration-300" />
                      <Brain className="absolute bottom-2 left-2 w-6 h-6 text-white/30 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                      <h3 className="text-lg font-bold mb-1 relative z-10">
                        Practice & Learn
                      </h3>
                      <p className="text-white/80 mb-4 text-sm flex-grow relative z-10">
                        Hone your skills with AI assessments.
                      </p>
                      <button
                        onClick={() => setActiveSection("ai-practice")}
                        className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-bold text-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 relative z-10"
                      >
                        Start Practicing
                      </button>
                    </div>
                  </div>

                  {/* Community Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          P
                        </div>
                        <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                          A
                        </div>
                        <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                          P
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Connect with professors and alumni for guidance.
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection("chat")}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 w-full md:w-auto whitespace-nowrap"
                    >
                      Start Chat
                    </button>
                  </div>

                  {/* Performance Overview - Horizontal Layout */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Performance Overview
                    </h3>
                    {resultsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2 text-sm">
                          Loading performance data...
                        </p>
                      </div>
                    ) : assessmentResults.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📊</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          No Performance Data Yet
                        </h4>
                        <p className="text-xs text-gray-600">
                          Complete some assessments to see your performance
                          metrics here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(() => {
                          const metrics = calculatePerformanceMetrics();
                          return (
                            <>
                              <div className="text-center">
                                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                                  <span className="text-2xl font-bold text-green-600">
                                    {metrics.successRate}%
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                  Success Rate
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Assessments passed (≥70%)
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${metrics.successRate}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                  <span className="text-2xl font-bold text-blue-600">
                                    {metrics.averageScore}%
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                  Average Score
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Overall performance
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${metrics.averageScore}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
                                  <span className="text-2xl font-bold text-purple-600">
                                    {metrics.completionRate}%
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                  Completion Rate
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Tasks completed
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${metrics.completionRate}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col space-y-4">
                {/* Activity Tracker */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Activity Tracker
                  </h3>
                  <div className="space-y-1 mb-3">
                    {generateActivityData().map((week, weekIndex) => (
                      <div key={weekIndex} className="flex gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`w-2.5 h-2.5 rounded-sm ${getActivityColor(
                              day.level
                            )} hover:ring-1 hover:ring-gray-400 transition-all cursor-pointer`}
                            title={`${new Date(
                              day.date
                            ).toLocaleDateString()}: ${day.activities}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 border border-gray-200"></div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-200 border border-green-300"></div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-300 border border-green-400"></div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-500 border border-green-600"></div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-700 border border-green-800"></div>
                    </div>
                    <span>More</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                      Quick Stats
                    </h4>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Completed</span>
                        <span className="text-xs font-semibold text-green-600">
                          {getPastAssessments().length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Ongoing</span>
                        <span className="text-xs font-semibold text-blue-600">
                          {getOngoingAssessments().length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Upcoming</span>
                        <span className="text-xs font-semibold text-orange-600">
                          {getFutureAssessments().length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Study Streaks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Study Streaks
                  </h3>
                  <div className="space-y-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          Current Streak
                        </p>
                        <p className="text-xs text-gray-600">Days in a row</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {calculateStreaks().currentStreak}
                        </p>
                        <p className="text-xs text-gray-600">days</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          Best Streak
                        </p>
                        <p className="text-xs text-gray-600">Personal record</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {calculateStreaks().bestStreak}
                        </p>
                        <p className="text-xs text-gray-600">days</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini Activity Visualization */}
                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                      Last 7 Days
                    </h4>
                    <div className="flex gap-1 justify-between">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (6 - i));
                        const dateStr = date.toISOString().split("T")[0];

                        // Check for real assessment results on this date
                        const resultsOnDate = assessmentResults.filter(
                          (result) => {
                            const resultDate = new Date(result.completedAt)
                              .toISOString()
                              .split("T")[0];
                            return resultDate === dateStr;
                          }
                        );
                        const hasActivity = resultsOnDate.length > 0;

                        return (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                hasActivity
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                              title={
                                hasActivity
                                  ? `${resultsOnDate.length} assessment${
                                      resultsOnDate.length > 1 ? "s" : ""
                                    } completed`
                                  : "No activity"
                              }
                            >
                              {date.getDate()}
                            </div>
                            <span className="text-xs text-gray-600 mt-1">
                              {
                                date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })[0]
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-full lg:w-56 bg-white flex flex-col justify-between p-3 lg:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 px-2">
            <BookOpen className="text-blue-600 h-6 w-6" />
            <span className="text-xl font-bold text-blue-900">Smarteval</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-gray-200">
          {/* User Profile */}
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-900">
                {user?.username}
              </p>
              <p className="text-xs text-gray-600">Student</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 hover:translate-x-1 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      {activeSection === "dashboard" ? (
        renderContent()
      ) : (
        <div className="flex-1">{renderContent()}</div>
      )}
    </div>
  );
};

export default StudentDashboard;
