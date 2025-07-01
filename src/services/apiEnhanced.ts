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
import {
  demoUsers,
  demoCompanies,
  demoMentorshipRequests,
  demoSessions,
  demoReviews,
  getDemoStatistics,
  type DemoUser,
} from "../data/demoDatabase";
import { crossBrowserSync, SYNC_CONFIGS } from "./crossBrowserSync";
import { cacheInvalidation } from "./cacheInvalidation";

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

      // Use demo database requests and filter for this coach
      const coachMatches = demoMentorshipRequests.filter(
        (req) =>
          req.assignedCoachId === targetCoachId ||
          (req.status === "pending" && !req.assignedCoachId), // Show pending matches coaches can accept
      );

      analytics.coach.profileViewed(targetCoachId, user.userType);

      return coachMatches;
    }
  }

  async getCompanyCoaches(companyId?: string): Promise<any[]> {
    const user = checkAuthorization(["company_admin", "platform_admin"]);
    const targetCompanyId = companyId || user.companyId;

    // Company admins can only see coaches for their company's requests
    if (
      user.userType === "company_admin" &&
      targetCompanyId !== user.companyId
    ) {
      throw new Error(
        "Company admins can only view coaches for their own company",
      );
    }

    try {
      const response = await this.request<any[]>(
        `/companies/${targetCompanyId}/coaches`,
      );

      analytics.trackAction({
        action: "company_coaches_viewed",
        component: "company_dashboard",
        metadata: {
          companyId: targetCompanyId,
          coachCount: response.data.length,
        },
      });

      return response.data;
    } catch (error) {
      console.warn("API not available, using demo coaches:", error);

      // Filter coaches based on company's active requests and assignments
      const companyRequests = demoMentorshipRequests.filter(
        (req) => req.companyId === targetCompanyId,
      );

      const assignedCoachIds = companyRequests
        .filter((req) => req.assignedCoachId)
        .map((req) => req.assignedCoachId);

      const availableCoaches = demoUsers
        .filter((user) => user.userType === "coach")
        .filter(
          (coach) =>
            assignedCoachIds.includes(coach.id) ||
            companyRequests.some((req) => req.status === "pending"),
        )
        .map((coach) => ({
          ...coach,
          assignedRequests: companyRequests.filter(
            (req) => req.assignedCoachId === coach.id,
          ),
          availableForRequests: companyRequests.filter(
            (req) => req.status === "pending" && !req.assignedCoachId,
          ),
        }));

      analytics.trackAction({
        action: "company_coaches_viewed",
        component: "company_dashboard",
        metadata: {
          companyId: targetCompanyId,
          coachCount: availableCoaches.length,
        },
      });

      return availableCoaches;
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

      // Invalidate company data cache
      cacheInvalidation.invalidateCompanyData(user.companyId!, user.name);

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

      // Use real demo database statistics
      const demoStats = getDemoStatistics();
      const stats = demoStats.platformStats;

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

      // Use demo database users
      let mockUsers: User[] = demoUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType as any,
        companyId: user.companyId,
        status: user.status as any,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        provider: user.provider,
      }));

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

      return demoCompanies.map((company) => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        userCount: company.employeeCount,
        status: company.status,
        subscription: company.subscriptionTier,
        joinedAt: company.joinedAt,
        revenue: company.revenue,
        adminId: company.adminId,
        activePrograms: company.activePrograms,
        totalSessions: company.totalSessions,
      }));
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
    try {
      const response = await this.request<any>("/admin/pricing-config");

      analytics.trackAction({
        action: "pricing_config_retrieved",
        component: "api_enhanced",
        metadata: { source: "backend_api" },
      });

      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using cross-browser synchronized storage:",
        error,
      );

      // Use centralized cross-browser sync service
      const config = crossBrowserSync.load(SYNC_CONFIGS.PRICING_CONFIG);

      if (config) {
        return config;
      }

      // Default configuration if no data exists
      const defaultConfig = {
        companyServiceFee: 0.1,
        coachCommission: 0.2,
        minCoachCommissionAmount: 5,
        additionalParticipantFee: 25,
        maxParticipantsIncluded: 1,
        currency: "CAD",
        lastUpdated: new Date().toISOString(),
        version: "1.0",
        createdBy: "system",
      };

      return defaultConfig;
    }
  }

  private getSharedPlatformConfig(): any {
    // Use multiple storage mechanisms to simulate true backend database
    const SHARED_CONFIG_KEY = "peptok_platform_global_config";
    const BROWSER_SYNC_KEY = "peptok_browser_sync";

    let config;

    // Try to get from localStorage first
    const stored = localStorage.getItem(SHARED_CONFIG_KEY);

    // Also check for cross-browser updates via document.cookie (simulates backend polling)
    const crossBrowserData = this.getCrossBrowserConfig();

    if (crossBrowserData && stored) {
      const storedConfig = JSON.parse(stored);
      // Check if cross-browser data is newer
      if (
        new Date(crossBrowserData.lastUpdated) >
        new Date(storedConfig.lastUpdated)
      ) {
        config = crossBrowserData;
        // Update local storage with newer data
        localStorage.setItem(SHARED_CONFIG_KEY, JSON.stringify(config));
        console.log("🔄 Synced newer configuration from cross-browser storage");
      } else {
        config = storedConfig;
      }
    } else if (crossBrowserData) {
      config = crossBrowserData;
      localStorage.setItem(SHARED_CONFIG_KEY, JSON.stringify(config));
    } else if (stored) {
      config = JSON.parse(stored);
    } else {
      // Default configuration - this will be the same for ALL platform admins
      config = {
        companyServiceFee: 0.1,
        coachCommission: 0.2,
        minCoachCommissionAmount: 5,
        additionalParticipantFee: 25,
        maxParticipantsIncluded: 1,
        currency: "CAD",
        lastUpdated: new Date().toISOString(),
        version: "1.0",
        createdBy: "system",
        adminCount: 1,
        syncToken: Date.now().toString(),
      };

      // Store in both local and cross-browser storage
      localStorage.setItem(SHARED_CONFIG_KEY, JSON.stringify(config));
      this.setCrossBrowserConfig(config);
    }

    analytics.trackAction({
      action: "pricing_config_retrieved",
      component: "api_enhanced",
      metadata: {
        source: "simulated_backend",
        version: config.version,
        syncToken: config.syncToken,
      },
    });

    return config;
  }

  private getCrossBrowserConfig(): any | null {
    try {
      // Use document.cookie to simulate cross-browser synchronization
      const cookies = document.cookie.split(";");
      const configCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("peptok_config="),
      );

      if (configCookie) {
        const configData = configCookie.split("=")[1];
        const decodedData = decodeURIComponent(configData);
        return JSON.parse(decodedData);
      }

      return null;
    } catch (error) {
      console.warn("Could not parse cross-browser config:", error);
      return null;
    }
  }

  private setCrossBrowserConfig(config: any): void {
    try {
      // Store in cookie for cross-browser access (simulates backend storage)
      const configData = encodeURIComponent(JSON.stringify(config));
      // Set cookie with 1 year expiration
      document.cookie = `peptok_config=${configData}; max-age=31536000; path=/; SameSite=Lax`;

      // Also try to use BroadcastChannel for same-origin communication
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("peptok_config_sync");
        channel.postMessage({
          type: "config_updated",
          config: config,
          timestamp: new Date().toISOString(),
        });
        channel.close();
      }
    } catch (error) {
      console.warn("Could not set cross-browser config:", error);
    }
  }

  private checkForConfigUpdates(currentConfig: any): void {
    // Simulate checking for updates from other admin sessions
    const SHARED_CONFIG_KEY = "peptok_platform_global_config";
    const LAST_SYNC_KEY = "peptok_last_sync_check";

    const lastSyncCheck = localStorage.getItem(LAST_SYNC_KEY);
    const now = Date.now();

    // Check every 5 seconds for updates
    if (!lastSyncCheck || now - parseInt(lastSyncCheck) > 5000) {
      localStorage.setItem(LAST_SYNC_KEY, now.toString());

      // In a real backend, this would be an API call to check for updates
      // For simulation, we're ensuring all admins see the exact same data
      const latestConfig = localStorage.getItem(SHARED_CONFIG_KEY);
      if (latestConfig) {
        const parsed = JSON.parse(latestConfig);
        if (parsed.syncToken !== currentConfig.syncToken) {
          // Configuration was updated by another admin
          window.dispatchEvent(
            new CustomEvent("globalConfigUpdated", {
              detail: parsed,
            }),
          );
        }
      }
    }
  }

  async updatePricingConfig(config: any): Promise<any> {
    const user = checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any>("/admin/pricing-config", {
        method: "PUT",
        body: JSON.stringify({
          ...config,
          lastUpdated: new Date().toISOString(),
          updatedBy: user.id,
        }),
      });

      analytics.trackAction({
        action: "pricing_config_updated",
        component: "api_enhanced",
        metadata: {
          source: "backend_api",
          adminId: user.id,
          currency: config.currency,
          companyServiceFee: config.companyServiceFee,
          coachCommission: config.coachCommission,
          minCoachCommissionAmount: config.minCoachCommissionAmount,
        },
      });

      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using cross-browser synchronized storage:",
        error,
      );

      // Use centralized cross-browser sync service
      const enhancedConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
        version: "1.0",
      };

      crossBrowserSync.save(SYNC_CONFIGS.PRICING_CONFIG, enhancedConfig, {
        id: user.id,
        name: user.name,
      });

      // Invalidate pricing-related cache for all users
      cacheInvalidation.invalidatePricingConfig(user.name);

      analytics.trackAction({
        action: "pricing_config_updated",
        component: "api_enhanced",
        metadata: {
          source: "cross_browser_sync",
          adminId: user.id,
          currency: config.currency,
          companyServiceFee: config.companyServiceFee,
          coachCommission: config.coachCommission,
          minCoachCommissionAmount: config.minCoachCommissionAmount,
        },
      });

      return enhancedConfig;
    }
  }

  private updateSharedPlatformConfig(config: any, user: any): any {
    const SHARED_CONFIG_KEY = "peptok_platform_global_config";

    const enhancedConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
      updatedBy: user.id,
      updatedByName: user.name,
      version: "1.0",
      syncToken: Date.now().toString(), // Unique token for this update
    };

    // Store in multiple locations for cross-browser synchronization
    localStorage.setItem(SHARED_CONFIG_KEY, JSON.stringify(enhancedConfig));
    this.setCrossBrowserConfig(enhancedConfig);

    // Also store update in audit log
    this.addToAuditLog({
      id: `audit_${Date.now()}`,
      timestamp: enhancedConfig.lastUpdated,
      action: "pricing_config_updated",
      adminId: user.id,
      adminName: user.name,
      details: "Updated platform pricing configuration",
      changes: {
        companyServiceFee: `${config.companyServiceFee * 100}%`,
        coachCommission: `${config.coachCommission * 100}%`,
        minCoachCommissionAmount: `$${config.minCoachCommissionAmount}`,
        additionalParticipantFee: `$${config.additionalParticipantFee}`,
        maxParticipantsIncluded: config.maxParticipantsIncluded,
        currency: config.currency,
      },
    });

    // Broadcast to ALL admin sessions immediately (same browser tabs)
    try {
      window.dispatchEvent(
        new CustomEvent("globalConfigUpdated", {
          detail: enhancedConfig,
        }),
      );

      // Also dispatch the old event for backward compatibility
      window.dispatchEvent(
        new CustomEvent("platformConfigUpdated", {
          detail: enhancedConfig,
        }),
      );

      console.log(
        "✅ Configuration saved and broadcasted to all admin sessions",
      );
    } catch (broadcastError) {
      console.warn("Could not broadcast config update:", broadcastError);
    }

    analytics.trackAction({
      action: "pricing_config_updated",
      component: "api_enhanced",
      metadata: {
        source: "simulated_backend",
        adminId: user.id,
        currency: config.currency,
        companyServiceFee: config.companyServiceFee,
        coachCommission: config.coachCommission,
        minCoachCommissionAmount: config.minCoachCommissionAmount,
        syncToken: enhancedConfig.syncToken,
      },
    });

    return enhancedConfig;
  }

  private addToAuditLog(entry: any): void {
    const AUDIT_LOG_KEY = "peptok_platform_audit_log";
    const auditLog = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || "[]");

    auditLog.unshift(entry); // Add to beginning

    // Keep only last 100 entries
    if (auditLog.length > 100) {
      auditLog.splice(100);
    }

    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(auditLog));
  }

  // ===== PLATFORM SETTINGS MANAGEMENT =====

  async getAllPlatformSettings(): Promise<any> {
    const user = checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any>("/admin/platform-settings");

      analytics.trackAction({
        action: "platform_settings_retrieved",
        component: "api_enhanced",
        metadata: { adminId: user.id, source: "backend_api" },
      });

      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using centralized platform settings:",
        error,
      );

      // Retrieve all platform settings from centralized storage
      const pricingConfig = JSON.parse(
        localStorage.getItem("platform_pricing_config") || "{}",
      );
      const securitySettings = JSON.parse(
        localStorage.getItem("platform_security_settings") || "{}",
      );
      const analyticsSettings = JSON.parse(
        localStorage.getItem("platform_analytics_settings") || "{}",
      );

      const settings = {
        pricing: {
          companyServiceFee: 0.1,
          coachCommission: 0.2,
          minCoachCommissionAmount: 5,
          additionalParticipantFee: 25,
          maxParticipantsIncluded: 1,
          currency: "CAD",
          ...pricingConfig,
        },
        security: {
          requireTwoFactor: false,
          sessionTimeout: 3600, // 1 hour
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          ...securitySettings,
        },
        analytics: {
          enableUserTracking: true,
          enablePerformanceTracking: true,
          dataRetentionDays: 365,
          ...analyticsSettings,
        },
        lastUpdated: new Date().toISOString(),
        version: "1.0",
      };

      analytics.trackAction({
        action: "platform_settings_retrieved",
        component: "api_enhanced",
        metadata: { adminId: user.id, source: "local_storage" },
      });

      return settings;
    }
  }

  async updatePlatformSettings(
    settingsType: string,
    settings: any,
  ): Promise<any> {
    const user = checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any>(
        `/admin/platform-settings/${settingsType}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...settings,
            lastUpdated: new Date().toISOString(),
            updatedBy: user.id,
          }),
        },
      );

      analytics.trackAction({
        action: "platform_settings_updated",
        component: "api_enhanced",
        metadata: {
          adminId: user.id,
          settingsType,
          source: "backend_api",
        },
      });

      return response.data;
    } catch (error) {
      console.warn(
        "API not available, storing platform settings locally:",
        error,
      );

      const enhancedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString(),
        updatedBy: user.id,
        version: "1.0",
      };

      // Store in appropriate centralized storage
      const storageKey = `platform_${settingsType}_settings`;
      localStorage.setItem(storageKey, JSON.stringify(enhancedSettings));

      // Broadcast the change
      try {
        window.dispatchEvent(
          new CustomEvent("platformSettingsUpdated", {
            detail: { type: settingsType, settings: enhancedSettings },
          }),
        );
      } catch (broadcastError) {
        console.warn("Could not broadcast settings update:", broadcastError);
      }

      analytics.trackAction({
        action: "platform_settings_updated",
        component: "api_enhanced",
        metadata: {
          adminId: user.id,
          settingsType,
          source: "local_storage",
        },
      });

      return enhancedSettings;
    }
  }

  async getPlatformAuditLog(): Promise<any[]> {
    const user = checkAuthorization(["platform_admin"]);

    try {
      const response = await this.request<any[]>("/admin/audit-log");
      return response.data;
    } catch (error) {
      console.warn("API not available, using local audit log:", error);

      // Return simulated audit log from localStorage
      const auditLog = JSON.parse(
        localStorage.getItem("platform_audit_log") || "[]",
      );

      // Add some sample entries if empty
      if (auditLog.length === 0) {
        auditLog.push(
          {
            id: "audit_001",
            timestamp: new Date().toISOString(),
            action: "pricing_config_updated",
            adminId: user.id,
            adminName: user.name,
            details: "Updated platform pricing configuration",
            changes: {
              companyServiceFee: "10% → 12%",
              minCoachCommissionAmount: "$5 → $6",
            },
          },
          {
            id: "audit_002",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            action: "platform_settings_viewed",
            adminId: user.id,
            adminName: user.name,
            details: "Viewed platform settings dashboard",
          },
        );

        localStorage.setItem("platform_audit_log", JSON.stringify(auditLog));
      }

      return auditLog.slice(0, 50); // Return last 50 entries
    }
  }
}

// Export singleton instance
export const apiEnhanced = new EnhancedApiService();
export default apiEnhanced;
