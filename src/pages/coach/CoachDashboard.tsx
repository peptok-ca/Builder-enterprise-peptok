import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  X,
  Clock,
  Calendar,
  Users,
  Star,
  TrendingUp,
  MessageCircle,
  Video,
  DollarSign,
  Award,
  Bell,
} from "lucide-react";
import Header from "../../components/layout/Header";
import { useAuth } from "../../contexts/AuthContext";
import { MentorshipRequest } from "../../types";
import { Session } from "../../types/session";
import { CoachSessionSettings } from "../../components/coach/CoachSessionSettings";
import { SessionManagement } from "../../components/sessions/SessionManagement";
import { toast } from "sonner";

interface PendingRequest {
  id: string;
  title: string;
  company: string;
  description: string;
  goals: string[];
  teamSize: number;
  urgency: "low" | "medium" | "high";
  budget?: number;
  preferredSchedule: string;
  submittedAt: Date;
}

interface CoachStats {
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalEarnings: number;
  upcomingSessions: number;
  responseTime: number;
  successRate: number;
}

export const CoachDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<CoachStats>({
    totalSessions: 0,
    completedSessions: 0,
    averageRating: 0,
    totalEarnings: 0,
    upcomingSessions: 0,
    responseTime: 0,
    successRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Mock data for demonstration
      const mockRequests: PendingRequest[] = [
        {
          id: "req-1",
          title: "React Development Coaching",
          company: "TechStart Inc.",
          description:
            "Looking for guidance on React best practices and modern development workflows for our engineering team.",
          goals: [
            "Learn React hooks and state management",
            "Implement testing strategies",
            "Code review processes",
          ],
          teamSize: 5,
          urgency: "medium",
          budget: 2500,
          preferredSchedule: "Weekdays 2-4 PM PST",
          submittedAt: new Date("2024-01-15"),
        },
        {
          id: "req-2",
          title: "Leadership Development Program",
          company: "Growth Corp",
          description:
            "Need coaching advice on migrating to cloud infrastructure.",
          goals: [
            "Team leadership skills",
            "Communication strategies",
            "Performance management",
          ],
          teamSize: 8,
          urgency: "high",
          budget: 4000,
          preferredSchedule: "Flexible",
          submittedAt: new Date("2024-01-12"),
        },
      ];

      const mockStats: CoachStats = {
        totalSessions: 156,
        completedSessions: 142,
        averageRating: 4.8,
        totalEarnings: 45600,
        upcomingSessions: 8,
        responseTime: 2.4,
        successRate: 94,
      };

      const mockActivity = [
        {
          id: "1",
          type: "session_completed",
          title: "Completed session with Alex Chen",
          message: "New coaching request from TechStart Inc.",
          timestamp: new Date("2024-01-16T10:30:00"),
        },
        {
          id: "2",
          type: "request_received",
          title: "New request received",
          message: "Leadership coaching for Growth Corp team",
          timestamp: new Date("2024-01-15T14:22:00"),
        },
      ];

      setPendingRequests(mockRequests);
      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // TODO: Implement actual API call
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast.success("Coaching request accepted!");
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // TODO: Implement actual API call
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast.success("Request declined");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="coach" />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "Coach"}!
          </h1>
          <p className="text-gray-600">
            Manage your coaching requests and sessions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating}
                  </p>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.successRate}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Pending Coaching Requests
                </h2>
                <p className="text-gray-600 mt-1">
                  Review and respond to new coaching opportunities
                </p>
              </div>
              <div className="p-6">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No pending requests
                    </h3>
                    <p className="text-gray-500">
                      New coaching requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {request.title}
                            </h3>
                            <p className="text-gray-600">{request.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                                request.urgency,
                              )}`}
                            >
                              {request.urgency} priority
                            </span>
                            {request.budget && (
                              <span className="text-sm font-medium text-green-600">
                                {formatCurrency(request.budget)}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {request.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Goals:
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {request.goals.map((goal, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {goal}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-gray-400 mr-2" />
                              <span>Team size: {request.teamSize} people</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              <span>
                                Preferred: {request.preferredSchedule}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <span>
                                Submitted:{" "}
                                {request.submittedAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </button>
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/coach/profile")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Coach Profile</p>
                      <p className="text-sm text-gray-500">
                        Update your profile
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/coach/calendar")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Calendar</p>
                      <p className="text-sm text-gray-500">
                        Manage availability
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/coach/earnings")}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Earnings</p>
                      <p className="text-sm text-gray-500">
                        View payment history
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Session Settings */}
            <CoachSessionSettings
              onSettingsUpdated={(settings) => {
                toast.success("Session settings updated successfully!");
                console.log("Updated settings:", settings);
              }}
            />

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
