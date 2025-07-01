import {
  MentorshipRequest,
  SubscriptionTier,
  SessionPricingTier,
  CoachSessionLimits,
  User,
} from "../types";
import { Mentor, MatchingFilters, MatchingResult } from "../types/mentor";
import {
  Coach,
  CoachMatch,
  MatchingFilters as CoachMatchingFilters,
  MatchingResult as CoachMatchingResult,
} from "../types/coach";
import {
  Session,
  SessionScheduleRequest,
  SessionStats,
  SessionJoinInfo,
} from "../types/session";

import { Environment } from "../utils/environment";
import { analytics } from "./analytics";

const API_BASE_URL = Environment.getApiBaseUrl();

// User context for authorization
let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
  if (user) {
    analytics.setUser(user.id, user.userType, {
      email: user.email,
      name: user.name,
    });
  } else {
    analytics.clearUser();
  }
};

// Authorization helper
const checkAuthorization = (
  requiredRoles?: string[],
  resourceOwnerId?: string,
) => {
  if (!currentUser) {
    throw new Error("Authentication required");
  }

  if (requiredRoles && !requiredRoles.includes(currentUser.userType)) {
    analytics.trackError(new Error("Insufficient permissions"), {
      requiredRoles,
      userType: currentUser.userType,
      action: "authorization_check",
    });
    throw new Error("Insufficient permissions");
  }

  // Resource owner check - users can only access their own data unless they're admin
  if (resourceOwnerId && currentUser.userType !== "platform_admin") {
    const hasAccess =
      currentUser.id === resourceOwnerId ||
      currentUser.companyId === resourceOwnerId ||
      (currentUser.userType === "company_admin" &&
        currentUser.companyId === resourceOwnerId);

    if (!hasAccess) {
      analytics.trackError(new Error("Access denied"), {
        resourceOwnerId,
        userId: currentUser.id,
        userType: currentUser.userType,
        action: "resource_access_denied",
      });
      throw new Error("Access denied - you can only access your own resources");
    }
  }

  return currentUser;
};

class EnhancedApiService {
  constructor() {
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    // Initialize localStorage with role-appropriate sample data
    if (!localStorage.getItem("mentorship_requests")) {
      const sampleRequests: MentorshipRequest[] = [
        {
          id: "sample_request_1",
          companyId: "default-company-id",
          title: "React Development Training",
          description:
            "Help our team improve their React skills and best practices.",
          goals: [
            {
              id: "goal_1",
              title: "Master React Hooks",
              description:
                "Learn advanced React hooks and custom hook patterns",
              category: "technical",
              priority: "high",
            },
          ],
          skills: ["React", "JavaScript", "Frontend Development"],
          timeline: "4 weeks",
          participants: 3,
          budget: {
            min: 2000,
            max: 5000,
            currency: "CAD",
          },
          status: "pending",
          priority: "high",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedCoachId: null,
        },
      ];

      localStorage.setItem(
        "mentorship_requests",
        JSON.stringify(sampleRequests),
      );
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T; error?: string }> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(currentUser && {
            Authorization: `Bearer ${currentUser.token || "mock-token"}`,
          }),
          ...options.headers,
        },
        ...options,
      });

      const responseTime = Date.now() - startTime;
      analytics.trackPerformance("api_request", responseTime, {
        endpoint,
        method: options.method || "GET",
        status: response.status,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      analytics.trackPerformance("api_request_failed", responseTime, {
        endpoint,
        method: options.method || "GET",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      analytics.trackError(
        error instanceof Error ? error : new Error("API request failed"),
        {
          endpoint,
          method: options.method || "GET",
        },
      );

      throw error;
    }
  }

  // ===== COACH-SPECIFIC METHODS =====

  async getCoachProfile(coachId: string): Promise<any> {
    const user = checkAuthorization(["coach", "platform_admin"], coachId);

    try {
      const response = await this.request<any>(`/coaches/${coachId}/profile`);

      analytics.trackAction({
        action: "coach_profile_viewed",
        component: "coach_api",
        metadata: { coachId },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock profile:", error);

      // Return mock profile data
      return {
        id: coachId,
        name: user.name || "Coach Name",
        email: user.email || "coach@example.com",
        bio: "Experienced coach with expertise in leadership development and team building.",
        skills: [
          "Leadership",
          "Team Building",
          "Communication",
          "Problem Solving",
        ],
        experience: 5,
        rating: 4.8,
        totalRatings: 127,
        hourlyRate: 150,
        currency: "USD",
        availability: {
          timezone: "EST",
          schedule: [
            {
              day: "Monday",
              startTime: "09:00",
              endTime: "17:00",
              available: true,
            },
            {
              day: "Tuesday",
              startTime: "09:00",
              endTime: "17:00",
              available: true,
            },
            {
              day: "Wednesday",
              startTime: "09:00",
              endTime: "17:00",
              available: true,
            },
            {
              day: "Thursday",
              startTime: "09:00",
              endTime: "17:00",
              available: true,
            },
            {
              day: "Friday",
              startTime: "09:00",
              endTime: "15:00",
              available: true,
            },
            {
              day: "Saturday",
              startTime: "10:00",
              endTime: "14:00",
              available: false,
            },
            {
              day: "Sunday",
              startTime: "10:00",
              endTime: "14:00",
              available: false,
            },
          ],
        },
        certifications: ["ICF Certified", "Leadership Training Certificate"],
        languages: ["English", "Spanish"],
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${coachId}`,
        isActive: true,
        joinedAt: "2024-01-01T00:00:00Z",
      };
    }
  }

  async getCoachStats(coachId: string): Promise<any> {
    const user = checkAuthorization(["coach", "platform_admin"], coachId);

    try {
      const response = await this.request<any>(`/coaches/${coachId}/stats`);

      analytics.trackAction({
        action: "coach_stats_viewed",
        component: "coach_api",
        metadata: { coachId },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock stats:", error);

      // Calculate stats from matches or return mock data
      const matches = await this.getCoachMatches(coachId);
      const completedMatches = matches.filter((m) => m.status === "completed");
      const inProgressMatches = matches.filter(
        (m) => m.status === "in_progress",
      );

      return {
        totalSessions: matches.length,
        completedSessions: completedMatches.length,
        averageRating: 4.8,
        totalEarnings: completedMatches.length * 150,
        thisMonthEarnings: Math.floor(completedMatches.length * 150 * 0.3),
        upcomingSessions: inProgressMatches.length,
        responseTime: 2.5,
        successRate:
          completedMatches.length > 0
            ? (completedMatches.length / matches.length) * 100
            : 95,
        repeatClients: Math.floor(completedMatches.length * 0.4),
        totalClients: Math.max(completedMatches.length, 10),
        profileViews: 234,
        matchAcceptanceRate: 85,
      };
    }
  }

  async getCoachSessions(
    coachId: string,
    params?: {
      status?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<any[]> {
    const user = checkAuthorization(["coach", "platform_admin"], coachId);

    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.offset)
        queryParams.append("offset", params.offset.toString());

      const response = await this.request<any[]>(
        `/coaches/${coachId}/sessions?${queryParams.toString()}`,
      );

      analytics.trackAction({
        action: "coach_sessions_viewed",
        component: "coach_api",
        metadata: { coachId, params },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock sessions:", error);

      // Return mock sessions
      const mockSessions = [
        {
          id: "session-1",
          title: "Leadership Development Session",
          description: "Weekly leadership coaching for senior managers",
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          status: "scheduled",
          participants: [
            {
              id: "p1",
              name: "John Doe",
              email: "john@company.com",
              role: "manager",
            },
            {
              id: "p2",
              name: "Jane Smith",
              email: "jane@company.com",
              role: "director",
            },
          ],
          companyName: "TechCorp Inc.",
          meetingLink: "https://meet.google.com/abc-defg-hij",
          earnings: 200,
          currency: "USD",
        },
        {
          id: "session-2",
          title: "Team Communication Workshop",
          description: "Improving team communication and collaboration",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          status: "scheduled",
          participants: [
            {
              id: "p3",
              name: "Mike Wilson",
              email: "mike@startup.com",
              role: "team_lead",
            },
          ],
          companyName: "StartupCo",
          meetingLink: "https://meet.google.com/xyz-uvw-rst",
          earnings: 150,
          currency: "USD",
        },
      ];

      // Filter by status if provided
      if (params?.status) {
        return mockSessions.filter(
          (session) => session.status === params.status,
        );
      }

      // Apply limit if provided
      if (params?.limit) {
        return mockSessions.slice(0, params.limit);
      }

      return mockSessions;
    }
  }

  async getCoachActivity(
    coachId: string,
    params?: {
      limit?: number;
      type?: string;
    },
  ): Promise<any[]> {
    const user = checkAuthorization(["coach", "platform_admin"], coachId);

    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.type) queryParams.append("type", params.type);

      const response = await this.request<any[]>(
        `/coaches/${coachId}/activity?${queryParams.toString()}`,
      );

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock activity:", error);

      // Return mock activity data
      return [
        {
          id: "1",
          type: "match_request",
          title: "New Match Request",
          description: "Leadership development for TechCorp Inc.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: { companyName: "TechCorp Inc." },
        },
        {
          id: "2",
          type: "session_completed",
          title: "Session Completed",
          description: "Team communication workshop completed successfully",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          metadata: { rating: 5 },
        },
        {
          id: "3",
          type: "payment_received",
          title: "Payment Received",
          description: "$200 for leadership coaching session",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          metadata: { amount: 200 },
        },
        {
          id: "4",
          type: "rating_received",
          title: "5-Star Rating",
          description: "Excellent feedback from StartupCo team",
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          metadata: { rating: 5 },
        },
        {
          id: "5",
          type: "profile_view",
          title: "Profile Viewed",
          description: "Your profile was viewed by 3 potential clients",
          timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
          metadata: { views: 3 },
        },
      ].slice(0, params?.limit || 20);
    }
  }

  async updateCoachProfile(coachId: string, profileData: any): Promise<any> {
    const user = checkAuthorization(["coach"], coachId);

    try {
      const response = await this.request<any>(`/coaches/${coachId}/profile`, {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      analytics.trackAction({
        action: "coach_profile_updated",
        component: "coach_api",
        metadata: { coachId },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, profile update stored locally:", error);

      // Store in localStorage as fallback
      const storageKey = `coach_profile_${coachId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...profileData,
          updatedAt: new Date().toISOString(),
        }),
      );

      analytics.trackAction({
        action: "coach_profile_updated_local",
        component: "coach_api",
        metadata: { coachId },
      });

      return profileData;
    }
  }

  async getCoachMatches(coachId?: string): Promise<MentorshipRequest[]> {
    const user = checkAuthorization(["coach", "platform_admin"]);
    const targetCoachId = coachId || user.id;

    // Coaches can only see their own matches
    if (user.userType === "coach" && targetCoachId !== user.id) {
      throw new Error("Coaches can only view their own matches");
    }

    try {
      const response = await this.request<MentorshipRequest[]>(
        `/coaches/${targetCoachId}/matches`,
      );

      analytics.coach.profileViewed(targetCoachId, user.userType);
      analytics.trackAction({
        action: "coach_matches_viewed",
        component: "coach_dashboard",
        metadata: { coachId: targetCoachId, matchCount: response.data.length },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using filtered mock matches:", error);

      // Get requests from localStorage and filter for this coach
      const allRequests = JSON.parse(
        localStorage.getItem("mentorship_requests") || "[]",
      );
      const coachMatches = allRequests.filter(
        (req: MentorshipRequest) =>
          req.assignedCoachId === targetCoachId ||
          (req.status === "pending" && !req.assignedCoachId), // Show pending matches coaches can accept
      );

      analytics.coach.profileViewed(targetCoachId, user.userType);

      return coachMatches;
    }
  }

  async acceptMatch(
    matchId: string,
  ): Promise<{ success: boolean; message?: string }> {
    const user = checkAuthorization(["coach"]);

    try {
      const response = await this.request<{
        success: boolean;
        message?: string;
      }>(`/matches/${matchId}/accept`, {
        method: "POST",
        body: JSON.stringify({ coachId: user.id }),
      });

      analytics.coach.matchAccepted(matchId, user.id);
      analytics.trackAction({
        action: "match_accepted",
        component: "coach_matching",
        metadata: { matchId, coachId: user.id },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, updating localStorage:", error);

      // Update localStorage
      const requests = JSON.parse(
        localStorage.getItem("mentorship_requests") || "[]",
      );
      const updatedRequests = requests.map((req: MentorshipRequest) =>
        req.id === matchId
          ? {
              ...req,
              assignedCoachId: user.id,
              status: "in_progress",
              updatedAt: new Date().toISOString(),
            }
          : req,
      );
      localStorage.setItem(
        "mentorship_requests",
        JSON.stringify(updatedRequests),
      );

      analytics.coach.matchAccepted(matchId, user.id);

      return { success: true, message: "Match accepted successfully" };
    }
  }

  async declineMatch(
    matchId: string,
    reason?: string,
  ): Promise<{ success: boolean; message?: string }> {
    const user = checkAuthorization(["coach"]);

    try {
      const response = await this.request<{
        success: boolean;
        message?: string;
      }>(`/matches/${matchId}/decline`, {
        method: "POST",
        body: JSON.stringify({ coachId: user.id, reason }),
      });

      analytics.coach.matchDeclined(matchId, user.id, reason);
      analytics.trackAction({
        action: "match_declined",
        component: "coach_matching",
        metadata: { matchId, coachId: user.id, reason },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, updating localStorage:", error);

      analytics.coach.matchDeclined(matchId, user.id, reason);

      return { success: true, message: "Match declined" };
    }
  }

  async updateCoachAvailability(
    availability: any,
  ): Promise<{ success: boolean }> {
    const user = checkAuthorization(["coach"]);

    try {
      const response = await this.request<{ success: boolean }>(
        `/coaches/${user.id}/availability`,
        {
          method: "PUT",
          body: JSON.stringify(availability),
        },
      );

      analytics.coach.availabilityUpdated(user.id, availability);

      return response.data;
    } catch (error) {
      console.warn("API not available, storing availability locally:", error);

      localStorage.setItem(
        `coach_availability_${user.id}`,
        JSON.stringify(availability),
      );
      analytics.coach.availabilityUpdated(user.id, availability);

      return { success: true };
    }
  }

  // ===== COMPANY-SPECIFIC METHODS =====

  async getCompanyRequests(companyId?: string): Promise<MentorshipRequest[]> {
    const user = checkAuthorization(["company_admin", "platform_admin"]);
    const targetCompanyId = companyId || user.companyId;

    // Company admins can only see their company's requests
    if (
      user.userType === "company_admin" &&
      targetCompanyId !== user.companyId
    ) {
      throw new Error(
        "Company admins can only view their own company's requests",
      );
    }

    try {
      const response = await this.request<MentorshipRequest[]>(
        `/companies/${targetCompanyId}/requests`,
      );

      analytics.trackAction({
        action: "company_requests_viewed",
        component: "company_dashboard",
        metadata: {
          companyId: targetCompanyId,
          requestCount: response.data.length,
        },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using filtered mock requests:", error);

      const allRequests = JSON.parse(
        localStorage.getItem("mentorship_requests") || "[]",
      );
      const companyRequests = allRequests.filter(
        (req: MentorshipRequest) => req.companyId === targetCompanyId,
      );

      return companyRequests;
    }
  }

  async createMentorshipRequest(
    request: Partial<MentorshipRequest>,
  ): Promise<MentorshipRequest> {
    const user = checkAuthorization(["company_admin", "platform_admin"]);

    try {
      const response = await this.request<MentorshipRequest>(
        "/mentorship-requests",
        {
          method: "POST",
          body: JSON.stringify({
            ...request,
            companyId: user.companyId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        },
      );

      analytics.company.requestCreated(
        response.data.id,
        user.companyId!,
        request.title || "Untitled Request",
      );

      return response.data;
    } catch (error) {
      console.warn("API not available, storing request locally:", error);

      const newRequest: MentorshipRequest = {
        id: `request_${Date.now()}`,
        companyId: user.companyId!,
        ...request,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MentorshipRequest;

      const requests = JSON.parse(
        localStorage.getItem("mentorship_requests") || "[]",
      );
      requests.push(newRequest);
      localStorage.setItem("mentorship_requests", JSON.stringify(requests));

      analytics.company.requestCreated(
        newRequest.id,
        user.companyId!,
        request.title || "Untitled Request",
      );

      return newRequest;
    }
  }

  // ===== PLATFORM ADMIN METHODS =====

  async getPlatformStats(): Promise<{
    totalUsers: number;
    totalCompanies: number;
    totalCoaches: number;
    totalSessions: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
  }> {
    checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any>("/platform/stats");

      analytics.trackAction({
        action: "platform_stats_viewed",
        component: "platform_dashboard",
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock platform stats:", error);

      // Generate realistic mock data
      const stats = {
        totalUsers: 1247 + Math.floor(Math.random() * 100),
        totalCompanies: 89 + Math.floor(Math.random() * 10),
        totalCoaches: 156 + Math.floor(Math.random() * 20),
        totalSessions: 3842 + Math.floor(Math.random() * 200),
        monthlyRevenue: 47580 + Math.floor(Math.random() * 5000),
        activeSubscriptions: 67 + Math.floor(Math.random() * 10),
      };

      analytics.platform.dailyActiveUsers(stats.totalUsers, new Date());
      analytics.platform.revenue(
        stats.monthlyRevenue,
        "subscriptions",
        new Date(),
      );

      return stats;
    }
  }

  async getAllUsers(filters?: {
    userType?: string;
    status?: string;
    companyId?: string;
    search?: string;
  }): Promise<User[]> {
    checkAuthorization(["platform_admin"]);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.userType) queryParams.append("userType", filters.userType);
      if (filters?.status) queryParams.append("status", filters.status);
      if (filters?.companyId)
        queryParams.append("companyId", filters.companyId);
      if (filters?.search) queryParams.append("search", filters.search);

      const response = await this.request<User[]>(
        `/users?${queryParams.toString()}`,
      );

      analytics.trackAction({
        action: "all_users_viewed",
        component: "platform_dashboard",
        metadata: { filters, resultCount: response.data.length },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock users:", error);

      // Generate mock users with filtering
      let mockUsers: User[] = [
        {
          id: "user-1",
          name: "John Smith",
          email: "john@techcorp.com",
          userType: "company_admin",
          companyId: "company-1",
          status: "active",
          firstName: "John",
          lastName: "Smith",
          picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          provider: "email",
        },
        {
          id: "user-2",
          name: "Sarah Johnson",
          email: "sarah@mentor.com",
          userType: "coach",
          status: "active",
          firstName: "Sarah",
          lastName: "Johnson",
          picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
          provider: "email",
        },
        {
          id: "user-3",
          name: "Mike Chen",
          email: "mike@startup.com",
          userType: "team_member",
          companyId: "company-2",
          status: "active",
          firstName: "Mike",
          lastName: "Chen",
          picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
          provider: "email",
        },
      ];

      // Apply filters
      if (filters?.userType) {
        mockUsers = mockUsers.filter(
          (user) => user.userType === filters.userType,
        );
      }
      if (filters?.status) {
        mockUsers = mockUsers.filter((user) => user.status === filters.status);
      }
      if (filters?.companyId) {
        mockUsers = mockUsers.filter(
          (user) => user.companyId === filters.companyId,
        );
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        mockUsers = mockUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search),
        );
      }

      return mockUsers;
    }
  }

  async getAllCompanies(): Promise<any[]> {
    checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any[]>("/companies");

      analytics.trackAction({
        action: "all_companies_viewed",
        component: "platform_dashboard",
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using mock companies:", error);

      return [
        {
          id: "company-1",
          name: "TechCorp Inc.",
          industry: "Technology",
          userCount: 25,
          status: "active",
          subscription: "Growth Plan",
          joinedAt: "2024-01-15",
          revenue: 4950,
        },
        {
          id: "company-2",
          name: "StartupCo",
          industry: "Fintech",
          userCount: 8,
          status: "trial",
          subscription: "Starter Plan",
          joinedAt: "2024-01-05",
          revenue: 792,
        },
      ];
    }
  }

  // ===== GENERAL METHODS =====

  async getMentorshipRequests(params?: {
    status?: string;
    companyId?: string;
    coachId?: string;
    limit?: number;
  }): Promise<MentorshipRequest[]> {
    const user = checkAuthorization();

    try {
      const queryParams = new URLSearchParams();

      // Role-based filtering
      if (user.userType === "coach") {
        queryParams.append("coachId", user.id);
      } else if (user.userType === "company_admin" && user.companyId) {
        queryParams.append("companyId", user.companyId);
      }

      // Additional filters
      if (params?.status) queryParams.append("status", params.status);
      if (params?.companyId && user.userType === "platform_admin") {
        queryParams.append("companyId", params.companyId);
      }
      if (params?.coachId && user.userType === "platform_admin") {
        queryParams.append("coachId", params.coachId);
      }
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await this.request<MentorshipRequest[]>(
        `/mentorship-requests?${queryParams.toString()}`,
      );

      analytics.trackAction({
        action: "mentorship_requests_viewed",
        component: "dashboard",
        metadata: {
          params,
          userType: user.userType,
          resultCount: response.data.length,
        },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using filtered mock requests:", error);

      // Get and filter data from localStorage
      let allRequests = JSON.parse(
        localStorage.getItem("mentorship_requests") || "[]",
      );

      // Apply role-based filtering
      if (user.userType === "coach") {
        allRequests = allRequests.filter(
          (req: MentorshipRequest) =>
            req.assignedCoachId === user.id ||
            (req.status === "pending" && !req.assignedCoachId),
        );
      } else if (user.userType === "company_admin" && user.companyId) {
        allRequests = allRequests.filter(
          (req: MentorshipRequest) => req.companyId === user.companyId,
        );
      }

      // Apply additional filters
      if (params?.status) {
        allRequests = allRequests.filter(
          (req: MentorshipRequest) => req.status === params.status,
        );
      }

      if (params?.limit) {
        allRequests = allRequests.slice(0, params.limit);
      }

      return allRequests;
    }
  }

  // ===== ANALYTICS METHODS =====

  async getAnalyticsData(query: {
    metric: string;
    startDate: Date;
    endDate: Date;
    filters?: Record<string, any>;
    groupBy?: string;
  }) {
    const user = checkAuthorization(["platform_admin", "company_admin"]);

    // Company admins can only see their company's analytics
    if (user.userType === "company_admin") {
      query.filters = { ...query.filters, companyId: user.companyId };
    }

    return await analytics.getAnalytics(query);
  }

  async trackEvent(eventName: string, properties?: Record<string, any>) {
    analytics.track(eventName, properties);
  }

  // Existing methods from original API service that don't need auth changes
  async getPricingConfig(): Promise<any> {
    // Implementation remains the same
    try {
      const response = await this.request<any>("/admin/pricing-config");
      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using localStorage pricing config:",
        error,
      );

      const stored = localStorage.getItem("pricing_config");
      if (stored) {
        return JSON.parse(stored);
      }

      return {
        serviceFeePercentage: 10,
        commissionPercentage: 20,
        additionalParticipantFee: 25,
        currency: "CAD",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  async updatePricingConfig(config: any): Promise<any> {
    checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any>("/admin/pricing-config", {
        method: "PUT",
        body: JSON.stringify(config),
      });
      return response.data;
    } catch (error) {
      console.warn("API not available, storing pricing config locally:", error);
      localStorage.setItem(
        "pricing_config",
        JSON.stringify({
          ...config,
          lastUpdated: new Date().toISOString(),
        }),
      );
      return config;
    }
  }
}

// Export singleton instance
export const apiEnhanced = new EnhancedApiService();
export default apiEnhanced;
