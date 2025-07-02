import {
  MentorshipRequest,
  SubscriptionTier,
  SessionPricingTier,
  CoachSessionLimits,
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

const API_BASE_URL = Environment.getApiBaseUrl();

class ApiService {
  constructor() {
    // Note: localStorage initialization moved to be user-context aware
  }

  private initializeLocalStorageForUser(userCompanyId?: string): void {
    // Initialize localStorage with sample data if empty
    // This method is called with user context to ensure proper company filtering
    if (!localStorage.getItem("mentorship_requests")) {
      const sampleRequests: MentorshipRequest[] = [
        {
          id: "sample_request_1",
          companyId: userCompanyId || "default-company-id",
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
          metricsToTrack: ["Code quality scores", "Development velocity"],
          teamMembers: [
            {
              id: "member_1",
              email: "john.doe@company.com",
              name: "John Doe",
              role: "participant",
              status: "accepted",
              invitedAt: new Date().toISOString(),
            },
          ],
          preferredExpertise: ["React", "JavaScript", "Frontend Development"],
          budget: {
            min: 100,
            max: 200,
          },
          timeline: {
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            sessionFrequency: "weekly",
          },
          status: "active",
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(
        "mentorship_requests",
        JSON.stringify(sampleRequests),
      );
    }
  }

  // Pricing configuration API methods
  async getPricingConfig(): Promise<any> {
    try {
      const response = await this.request<any>("/admin/pricing-config");
      return response.data;
    } catch (error) {
      console.warn("API not available, using default pricing config:", error);

      return {
        companyServiceFee: 0.1, // 10% service charge for companies
        coachCommission: 0.2, // 20% commission from coaches
        additionalParticipantFee: 25, // $25 per additional participant
        currency: "CAD",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  async updatePricingConfig(config: any): Promise<any> {
    try {
      const response = await this.request<any>("/admin/pricing-config", {
        method: "PUT",
        data: config,
      });
      return response.data;
    } catch (error) {
      console.warn("API not available, cannot update pricing config:", error);
      throw new Error("Unable to update pricing configuration");
    }
  }

  // Platform admin API methods
  async getPlatformStats(): Promise<any> {
    try {
      const response = await this.request<any>("/admin/platform-stats");
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock platform stats:", error);

      return {
        totalUsers: 1247,
        totalCoaches: 89,
        totalCompanies: 156,
        activeSessions: 67,
        totalSessions: 5432,
        revenue: 234567,
        growthRate: 12.5,
        newUsersThisMonth: 234,
        activeSubscriptions: 89,
        pendingRequests: 23,
      };
    }
  }

  async getAllUsers(filters?: any): Promise<any[]> {
    try {
      const queryParams = filters
        ? new URLSearchParams(filters).toString()
        : "";
      const response = await this.request<any[]>(`/admin/users?${queryParams}`);
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock users:", error);

      return [
        {
          id: "user-1",
          name: "John Smith",
          email: "john@example.com",
          userType: "company_admin",
          company: "TechCorp Inc.",
          status: "active",
          joinedAt: "2024-01-15",
          lastActive: "2024-01-20",
        },
        {
          id: "user-2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          userType: "coach",
          company: "Independent",
          status: "active",
          joinedAt: "2024-01-10",
          lastActive: "2024-01-20",
        },
        {
          id: "user-3",
          name: "Mike Chen",
          email: "mike@example.com",
          userType: "team_member",
          company: "StartupXYZ",
          status: "active",
          joinedAt: "2024-01-18",
          lastActive: "2024-01-19",
        },
      ];
    }
  }

  async getAllCompanies(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/admin/companies");
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock companies:", error);

      return [
        {
          id: "company-1",
          name: "TechCorp Inc.",
          industry: "Technology",
          employeeCount: 150,
          activeUsers: 45,
          subscriptionTier: "growth",
          monthlySpend: 8500,
          joinedAt: "2024-01-01",
        },
        {
          id: "company-2",
          name: "StartupXYZ",
          industry: "Fintech",
          employeeCount: 25,
          activeUsers: 12,
          subscriptionTier: "starter",
          monthlySpend: 1200,
          joinedAt: "2024-01-15",
        },
      ];
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T; success: boolean; message?: string }> {
    // Skip fetch requests in deployed environments without explicit API configuration
    if (Environment.isProduction() && !import.meta.env.VITE_API_URL) {
      throw new Error("API not configured for deployed environment");
    }

    // Skip fetch requests if in development and API URL is not configured
    if (
      !import.meta.env.VITE_API_URL &&
      API_BASE_URL === "http://localhost:3001/api"
    ) {
      throw new Error("API not configured - using local data");
    }

    const token = localStorage.getItem("auth_token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      // Add timeout
      signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      if (Environment.isProduction()) {
        console.log("API request failed in deployed environment (expected)");
      }
      throw error;
    }
  }

  // Coach-related methods
  async getAllCoaches(): Promise<Coach[]> {
    try {
      const response = await this.request<Coach[]>("/coaches");
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock coaches:", error);
      // Return mock coaches for demo
      return this.getMockCoaches();
    }
  }

  async getCoachById(id: string): Promise<Coach> {
    const response = await this.request<Coach>(`/coaches/${id}`);
    return response.data;
  }

  async findCoachMatches(
    mentorshipRequestId: string,
    filters: CoachMatchingFilters = {},
    limit: number = 10,
  ): Promise<CoachMatchingResult> {
    const response = await this.request<CoachMatchingResult>(
      "/coaches/matches",
      {
        method: "POST",
        body: JSON.stringify({ mentorshipRequestId, filters, limit }),
      },
    );
    return response.data;
  }

  async searchCoaches(
    query: string,
    filters: CoachMatchingFilters = {},
  ): Promise<Coach[]> {
    const searchParams = new URLSearchParams(filters as any);
    const response = await this.request<Coach[]>(
      `/coaches/search/${encodeURIComponent(query)}?${searchParams}`,
    );
    return response.data;
  }

  async getTopCoaches(limit: number = 5): Promise<Coach[]> {
    const response = await this.request<Coach[]>(
      `/coaches/featured/top?limit=${limit}`,
    );
    return response.data;
  }

  // Legacy Mentor-related methods (keeping for backward compatibility)
  async getAllMentors(): Promise<Mentor[]> {
    return this.getAllCoaches() as any;
  }

  async getMentorById(id: string): Promise<Mentor> {
    return this.getCoachById(id) as any;
  }

  async findMentorMatches(
    mentorshipRequestId: string,
    filters: MatchingFilters = {},
    limit: number = 10,
  ): Promise<MatchingResult> {
    return this.findCoachMatches(
      mentorshipRequestId,
      filters as any,
      limit,
    ) as any;
  }

  async searchMentors(
    query: string,
    filters: MatchingFilters = {},
  ): Promise<Mentor[]> {
    return this.searchCoaches(query, filters as any) as any;
  }

  async getTopMentors(limit: number = 5): Promise<Mentor[]> {
    return this.getTopCoaches(limit) as any;
  }

  async sendMentorshipRequest(
    mentorshipRequestId: string,
    coachId: string,
    message?: string,
  ) {
    const response = await this.request(`/coaches/${coachId}/request`, {
      method: "POST",
      body: JSON.stringify({ mentorshipRequestId, message }),
    });
    return response.data;
  }

  // Session-related methods
  async scheduleSession(
    sessionRequest: SessionScheduleRequest,
  ): Promise<Session> {
    const response = await this.request<Session>("/sessions/schedule", {
      method: "POST",
      body: JSON.stringify(sessionRequest),
    });
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await this.request<Session>(`/sessions/${sessionId}`);
    return response.data;
  }

  async getSessionJoinInfo(sessionId: string): Promise<SessionJoinInfo> {
    const response = await this.request<SessionJoinInfo>(
      `/sessions/${sessionId}/join`,
    );
    return response.data;
  }

  async joinSession(sessionId: string): Promise<void> {
    await this.request(`/sessions/${sessionId}/join`, { method: "POST" });
  }

  async leaveSession(sessionId: string): Promise<void> {
    await this.request(`/sessions/${sessionId}/leave`, { method: "POST" });
  }

  async startRecording(sessionId: string): Promise<void> {
    await this.request(`/sessions/${sessionId}/recording/start`, {
      method: "POST",
    });
  }

  async stopRecording(sessionId: string): Promise<void> {
    await this.request(`/sessions/${sessionId}/recording/stop`, {
      method: "POST",
    });
  }

  async endSession(sessionId: string): Promise<void> {
    await this.request(`/sessions/${sessionId}/end`, { method: "POST" });
  }

  async cancelSession(sessionId: string, reason: string): Promise<void> {
    await this.request(`/sessions/${sessionId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async rescheduleSession(
    sessionId: string,
    newStartTime: Date,
    newEndTime: Date,
  ): Promise<void> {
    await this.request(`/sessions/${sessionId}/reschedule`, {
      method: "POST",
      body: JSON.stringify({ newStartTime, newEndTime }),
    });
  }

  async addSessionNote(
    sessionId: string,
    content: string,
    isShared: boolean = false,
  ): Promise<void> {
    await this.request(`/sessions/${sessionId}/notes`, {
      method: "POST",
      body: JSON.stringify({ content, isShared }),
    });
  }

  async addSessionFeedback(
    sessionId: string,
    toUserId: string,
    rating: number,
    feedback: string,
    isAnonymous: boolean = false,
  ): Promise<void> {
    await this.request(`/sessions/${sessionId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ toUserId, rating, feedback, isAnonymous }),
    });
  }

  async getUserSessions(userId: string, status?: string): Promise<Session[]> {
    const statusParam = status ? `?status=${status}` : "";
    const response = await this.request<Session[]>(
      `/sessions/user/${userId}${statusParam}`,
    );
    return response.data;
  }

  async getUpcomingSessions(
    userId: string,
    limit: number = 5,
  ): Promise<Session[]> {
    try {
      const response = await this.request<Session[]>(
        `/sessions/user/${userId}/upcoming?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock sessions for demo:", error);

      // Return mock upcoming sessions for testing
      const mockSessions: Session[] = [
        {
          id: "session-123",
          title: "Leadership Development Session",
          description: "Weekly coaching session",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          status: "scheduled",
          participants: [
            {
              id: userId,
              name: "Current User",
              email: "user@example.com",
              role: "participant",
              status: "accepted",
            },
          ],
          coach: {
            id: "coach-1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
          },
          programId: "program-1",
          meetingLink: "https://meet.google.com/abc-defg-hij",
          type: "video",
          duration: 60,
          notes: "",
          recording: {
            isRecording: false,
            recordingUrl: null,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return mockSessions.slice(0, limit);
    }
  }

  async getSessionStats(userId: string): Promise<SessionStats> {
    const response = await this.request<SessionStats>(
      `/sessions/user/${userId}/stats`,
    );
    return response.data;
  }

  async getSessionHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    sessions: Session[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await this.request<{
      sessions: Session[];
      total: number;
      page: number;
      limit: number;
    }>(`/sessions/user/${userId}/history?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Payment-related methods
  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    try {
      // Skip backend requests in deployed environments without explicit API URL
      if (Environment.isProduction() && !import.meta.env.VITE_API_URL) {
        throw new Error("Backend not configured for deployed environment");
      }

      // Only try backend if environment supports it
      if (!Environment.shouldTryBackend()) {
        throw new Error("Backend not configured for this environment");
      }

      // Try to fetch from backend first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout

      const response = await fetch(`${API_BASE_URL}/subscriptions/tiers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const tiers = await response.json();
        console.log("✅ Loaded subscription tiers from backend");
        // Ensure currency is set for each tier
        return tiers.map((tier: any) => ({
          ...tier,
          currency: tier.currency || "CAD",
        }));
      } else {
        console.warn("⚠️ Backend returned error, using local data");
        throw new Error("Backend not available");
      }
    } catch (error) {
      // Handle network errors appropriately based on environment
      if (Environment.isProduction()) {
        console.log(
          `Using local subscription data (${Environment.getEnvironmentName()} environment)`,
        );
      } else {
        console.warn(
          "⚠️ Failed to fetch from backend, using local data:",
          error,
        );
      }

      // Fallback to local subscription tiers data if backend is not available
      const subscriptionTiers: SubscriptionTier[] = [
        {
          id: "starter",
          name: "Starter Plan",
          slug: "starter",
          description:
            "Designed for small teams launching their mentorship journey",
          price: 99,
          priceAnnual: 1069.2,
          billingPeriod: "monthly",
          userCap: 20,
          features: [
            "200 minutes of mentor time per month",
            "Minimum commitment: 2 users (add up to 20 extra seats at CA$119/user/month)",
            "Monthly progress reports",
            "Email support",
            "Basic metrics dashboard",
          ],
          metricsIncluded: [
            "Session completion rate",
            "Basic engagement metrics",
            "Monthly progress tracking",
          ],
          supportLevel: "basic",
          customizations: false,
          analytics: "basic",
          minimumUsers: 2,
          extraSeatPrice: 119,
          currency: "CAD",
        },
        {
          id: "growth",
          name: "Growth Plan",
          slug: "growth",
          description: "Ideal for expanding programs and scaling impact",
          price: 199,
          priceAnnual: 2148.4,
          billingPeriod: "monthly",
          userCap: 100,
          features: [
            "1,200 minutes of mentor time per month",
            "Includes all Starter features",
            "Minimum commitment: 5 users (add up to 100 extra seats at CA$219/user/month)",
            "Advanced metrics and analytics",
            "Priority support",
          ],
          metricsIncluded: [
            "All Starter metrics",
            "Advanced progress analytics",
            "Team performance insights",
            "ROI tracking",
            "Department comparisons",
          ],
          supportLevel: "premium",
          customizations: true,
          analytics: "advanced",
          minimumUsers: 5,
          extraSeatPrice: 219,
          badge: "Best Value",
          currency: "CAD",
        },
        {
          id: "enterprise",
          name: "Enterprise Plan",
          slug: "enterprise",
          description:
            "Tailored for large organizations with complex requirements",
          price: 0,
          priceAnnual: 0,
          billingPeriod: "monthly",
          userCap: 999999,
          features: [
            "Unlimited user seats",
            "Dedicated Customer Success Manager",
            "White-labeling and integration options",
            "SLA guarantees and priority SLAs",
            "Custom mentor vetting",
            "API access",
            "SSO integration",
          ],
          metricsIncluded: [
            "All Growth metrics",
            "Custom KPI tracking",
            "Predictive analytics",
            "Executive dashboards",
            "Benchmark comparisons",
            "Multi-department insights",
          ],
          supportLevel: "enterprise",
          customizations: true,
          analytics: "enterprise",
          minimumUsers: 1,
          extraSeatPrice: 0,
          customPricing: true,
          currency: "CAD",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return subscriptionTiers;
    }
  }

  // Session Pricing Methods
  async getSessionPricingTiers(): Promise<SessionPricingTier[]> {
    try {
      // Skip backend requests in deployed environments without explicit API URL
      if (Environment.isProduction() && !import.meta.env.VITE_API_URL) {
        throw new Error("Backend not configured for deployed environment");
      }

      // Only try backend if environment supports it
      if (!Environment.shouldTryBackend()) {
        throw new Error("Backend not configured for this environment");
      }

      // Try to fetch from backend first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout

      const response = await fetch(`${API_BASE_URL}/sessions/pricing-tiers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const tiers = await response.json();
        return tiers.map((tier: any) => ({
          ...tier,
          currency: tier.currency || "CAD",
        }));
      } else {
        console.warn("⚠️ Backend returned error, using local data");
        throw new Error("Backend not available");
      }
    } catch (error) {
      // Handle network errors appropriately based on environment
      if (Environment.isProduction()) {
        console.log(
          `Using local session pricing data (${Environment.getEnvironmentName()} environment)`,
        );
      } else {
        console.warn(
          "⚠️ Failed to fetch from backend, using local data:",
          error,
        );
      }

      // Fallback to local session pricing data
      const sessionPricingTiers: SessionPricingTier[] = [
        {
          id: "standard",
          name: "Standard Sessions",
          slug: "standard",
          description: "Perfect for individual coaching sessions",
          baseSessionPrice: 150, // CAD per session
          participantFee: 25, // CAD per additional participant
          maxParticipantsIncluded: 1, // First participant included
          platformServiceCharge: 15, // 15% platform fee
          features: [
            "1-hour coaching sessions",
            "Professional mentor matching",
            "Session recordings available",
            "Basic progress tracking",
            "Email support",
          ],
          supportLevel: "basic",
          customizations: false,
          analytics: "basic",
          currency: "CAD",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return sessionPricingTiers;
    }
  }

  async getCoachSessionLimits(
    coachId: string,
    programId?: string,
  ): Promise<CoachSessionLimits | null> {
    console.log(
      `API: Fetching session limits for coach ${coachId}${programId ? `, program ${programId}` : ""}`,
    );

    try {
      const queryParams = programId ? `?programId=${programId}` : "";
      const response = await this.request<CoachSessionLimits>(
        `/coaches/${coachId}/session-limits${queryParams}`,
      );
      console.log(
        "API: Successfully fetched session limits from server:",
        response.data,
      );
      return response.data;
    } catch (error) {
      console.warn(
        "API: Failed to fetch coach session limits from server, checking localStorage fallback",
        error,
      );

      // Check localStorage for saved settings
      const storageKey = `coach_session_limits_${coachId}${programId ? `_${programId}` : ""}`;
      console.log("API: Checking localStorage with key:", storageKey);

      const storedLimits = localStorage.getItem(storageKey);

      if (storedLimits) {
        try {
          const parsedLimits = JSON.parse(storedLimits);
          console.log(
            "API: Successfully loaded session limits from localStorage:",
            parsedLimits,
          );
          return parsedLimits;
        } catch (parseError) {
          console.warn(
            "API: Failed to parse stored session limits:",
            parseError,
          );
        }
      } else {
        console.log("API: No stored session limits found in localStorage");
      }

      // Return default limits
      const defaultLimits = {
        id: `default-${coachId}`,
        coachId,
        programId,
        minSessionsPerProgram: 1,
        maxSessionsPerProgram: 10,
        sessionDurationMinutes: 60,
        coachHourlyRate: 150,
        isAvailable: true,
      };

      console.log("API: Returning default session limits:", defaultLimits);
      return defaultLimits;
    }
  }

  async updateCoachSessionLimits(
    limits: CoachSessionLimits,
  ): Promise<CoachSessionLimits> {
    console.log("API: Updating session limits:", limits);

    try {
      const response = await this.request<CoachSessionLimits>(
        `/coaches/${limits.coachId}/session-limits`,
        {
          method: "PUT",
          body: JSON.stringify(limits),
        },
      );
      console.log(
        "API: Successfully updated session limits on server:",
        response.data,
      );
      return response.data;
    } catch (error) {
      console.warn(
        "API: Failed to update coach session limits on server, using localStorage fallback:",
        error,
      );

      // Store in localStorage as fallback
      const storageKey = `coach_session_limits_${limits.coachId}${limits.programId ? `_${limits.programId}` : ""}`;
      const updatedLimits = {
        ...limits,
        id: limits.id || `local-${limits.coachId}-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };

      console.log(
        "API: Saving to localStorage with key:",
        storageKey,
        "data:",
        updatedLimits,
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedLimits));
      console.log("API: Session limits saved to localStorage successfully");

      return updatedLimits;
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = "USD",
    metadata: Record<string, string> = {},
  ): Promise<{
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
  }> {
    const response = await this.request<{
      id: string;
      clientSecret: string;
      amount: number;
      currency: string;
      status: string;
    }>("/payments/intent", {
      method: "POST",
      body: JSON.stringify({ amount, currency, metadata }),
    });
    return response.data;
  }

  async createCustomer(
    email: string,
    name?: string,
  ): Promise<{
    id: string;
    email: string;
    name?: string;
  }> {
    const response = await this.request<{
      id: string;
      email: string;
      name?: string;
    }>("/payments/customer", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
    return response.data;
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    metadata: Record<string, string> = {},
  ): Promise<{
    id: string;
    status: string;
    currentPeriodEnd: number;
    clientSecret?: string;
  }> {
    const response = await this.request<{
      id: string;
      status: string;
      currentPeriodEnd: number;
      clientSecret?: string;
    }>("/payments/subscription", {
      method: "POST",
      body: JSON.stringify({ customerId, priceId, metadata }),
    });
    return response.data;
  }

  async upgradeSubscription(
    subscriptionId: string,
    newPriceId: string,
  ): Promise<{
    currentTier: string;
    newTier: string;
    prorationAmount: number;
    effectiveDate: Date;
  }> {
    const response = await this.request<{
      currentTier: string;
      newTier: string;
      prorationAmount: number;
      effectiveDate: Date;
    }>(`/payments/subscription/${subscriptionId}/upgrade`, {
      method: "POST",
      body: JSON.stringify({ newPriceId }),
    });
    return response.data;
  }

  async purchaseAdditionalSeats(
    quantity: number,
    currentTierId: string,
  ): Promise<{
    quantity: number;
    pricePerSeat: number;
    totalAmount: number;
  }> {
    const response = await this.request<{
      quantity: number;
      pricePerSeat: number;
      totalAmount: number;
    }>("/payments/seats", {
      method: "POST",
      body: JSON.stringify({ quantity, currentTierId }),
    });
    return response.data;
  }

  async calculateUpgradeCost(
    currentTierId: string,
    newTierId: string,
    remainingDays: number = 30,
  ): Promise<number> {
    const response = await this.request<{ cost: number }>(
      "/payments/upgrade-cost",
      {
        method: "POST",
        body: JSON.stringify({ currentTierId, newTierId, remainingDays }),
      },
    );
    return response.data.cost;
  }

  async getUsageStats(customerId: string): Promise<any> {
    const response = await this.request<any>(`/payments/usage/${customerId}`);
    return response.data;
  }

  // Existing mentorship request methods (keeping for compatibility)
  async getMentorshipRequests(
    filters: {
      companyId?: string;
      status?: string;
    } = {},
  ): Promise<MentorshipRequest[]> {
    try {
      const searchParams = new URLSearchParams();
      if (filters.companyId)
        searchParams.append("companyId", filters.companyId);
      if (filters.status) searchParams.append("status", filters.status);

      const response = await this.request<MentorshipRequest[]>(
        `/mentorship-requests?${searchParams}`,
      );
      return response.data;
    } catch (error) {
      // Fallback to localStorage if API is not available
      const isApiConfigured = !!import.meta.env.VITE_API_URL;

      if (isApiConfigured) {
        console.warn(
          "API request failed, using localStorage fallback:",
          error.message,
        );
      } else {
        console.log("📱 API not configured, using local data storage");
      }

      return this.getMentorshipRequestsFromStorage(filters);
    }
  }

  async createMentorshipRequest(
    request: Omit<MentorshipRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<MentorshipRequest> {
    try {
      // Try backend first
      const response = await this.request<MentorshipRequest>(
        "/mentorship-requests",
        {
          method: "POST",
          body: JSON.stringify(request),
        },
      );
      console.log("✅ Mentorship request saved to backend");
      return response.data;
    } catch (error) {
      // Fallback to localStorage if API is not available
      console.warn("⚠️ Backend not available, saving locally:", error);
      return this.createMentorshipRequestInStorage(request);
    }
  }

  // Add coach search functionality
  async searchCoachesForMentorship(
    filters: {
      expertise?: string[];
      hourlyRateMin?: number;
      hourlyRateMax?: number;
      availability?: boolean;
      location?: string;
    } = {},
  ): Promise<Coach[]> {
    try {
      const searchParams = new URLSearchParams();
      if (filters.expertise?.length) {
        searchParams.append("expertise", filters.expertise.join(","));
      }
      if (filters.hourlyRateMin) {
        searchParams.append("hourlyRateMin", filters.hourlyRateMin.toString());
      }
      if (filters.hourlyRateMax) {
        searchParams.append("hourlyRateMax", filters.hourlyRateMax.toString());
      }
      if (filters.availability !== undefined) {
        searchParams.append("availability", filters.availability.toString());
      }
      if (filters.location) {
        searchParams.append("location", filters.location);
      }

      const response = await this.request<Coach[]>(
        `/coaches/search?${searchParams}`,
      );
      console.log("✅ Found coaches from backend:", response.data.length);
      return response.data;
    } catch (error) {
      console.warn("⚠️ Backend search not available, using mock data:", error);
      // Return mock coaches for demo
      return this.getMockCoaches(filters);
    }
  }

  // Mock coaches for fallback
  private getMockCoaches(filters: any = {}): Coach[] {
    const mockCoaches: Coach[] = [
      {
        id: "coach1",
        name: "Sarah Johnson",
        title: "Senior Technical Coach",
        company: "Tech Innovations",
        coaching: ["React", "TypeScript", "Team Leadership", "Agile"],
        rating: 4.9,
        experience: 8,
        totalSessions: 127,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        availableSlots: ["Monday 9-5", "Wednesday 9-5", "Friday 9-5"],
      },
      {
        id: "coach2",
        name: "Michael Chen",
        title: "Product Strategy Expert",
        company: "Innovation Labs",
        coaching: ["Product Management", "Strategy", "Business Development"],
        rating: 4.8,
        experience: 12,
        totalSessions: 203,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        availableSlots: ["Tuesday 10-6", "Thursday 10-6"],
      },
      {
        id: "coach3",
        name: "Emily Rodriguez",
        title: "Leadership Development Coach",
        company: "Executive Coaching Pro",
        coaching: ["Leadership", "Executive Coaching", "Team Building"],
        rating: 4.9,
        experience: 15,
        totalSessions: 312,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        availableSlots: ["Monday 1-7", "Wednesday 1-7", "Friday 1-7"],
      },
    ];

    // Apply basic filtering
    let filteredCoaches = mockCoaches;

    if (filters.expertise?.length) {
      filteredCoaches = filteredCoaches.filter((coach) =>
        coach.coaching.some((skill) =>
          filters.expertise.some((exp: string) =>
            skill.toLowerCase().includes(exp.toLowerCase()),
          ),
        ),
      );
    }

    return filteredCoaches;
  }

  // localStorage fallback methods
  private getMentorshipRequestsFromStorage(
    filters: {
      companyId?: string;
      status?: string;
    } = {},
  ): MentorshipRequest[] {
    // Initialize with user context if empty
    if (!localStorage.getItem("mentorship_requests")) {
      this.initializeLocalStorageForUser(filters.companyId);
    }

    const stored = localStorage.getItem("mentorship_requests");
    let requests: MentorshipRequest[] = stored ? JSON.parse(stored) : [];

    // Apply filters
    if (filters.companyId) {
      requests = requests.filter((r) => r.companyId === filters.companyId);
    }
    if (filters.status) {
      requests = requests.filter((r) => r.status === filters.status);
    }

    return requests;
  }

  private createMentorshipRequestInStorage(
    request: Omit<MentorshipRequest, "id" | "createdAt" | "updatedAt">,
  ): MentorshipRequest {
    const newRequest: MentorshipRequest = {
      ...request,
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem("mentorship_requests");
    const requests: MentorshipRequest[] = stored ? JSON.parse(stored) : [];
    requests.unshift(newRequest); // Add to beginning of array

    localStorage.setItem("mentorship_requests", JSON.stringify(requests));
    return newRequest;
  }

  async updateMentorshipRequest(
    id: string,
    updates: Partial<MentorshipRequest>,
  ): Promise<MentorshipRequest> {
    const response = await this.request<MentorshipRequest>(
      `/mentorship-requests/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      },
    );
    return response.data;
  }

  // Accept mentorship request and assign coach
  async acceptMentorshipRequest(
    requestId: string,
    coachId: string,
    sessionSchedule: {
      date: string;
      time: string;
      duration: string;
    }[],
  ): Promise<{
    request: MentorshipRequest;
    coach: Coach;
    emailsSent: boolean;
  }> {
    try {
      // Update request status and assign coach
      const response = await this.request<{
        request: MentorshipRequest;
        coach: Coach;
      }>(`/mentorship-requests/${requestId}/accept`, {
        method: "POST",
        body: JSON.stringify({ coachId, sessionSchedule }),
      });

      const { request, coach } = response.data;

      // Send coach acceptance emails to all employees
      try {
        const { emailService } = await import("./email");

        const coachAcceptanceData = {
          programTitle: request.title,
          coachName: coach.name,
          coachTitle: coach.title,
          coachExpertise: coach.coaching,
          sessionSchedule,
          companyName: "Your Company", // TODO: Get from request or user data
          employeeName: "", // Will be filled per employee
        };

        // Send email to each employee
        const emailPromises = request.teamMembers.map(async (member) => {
          const personalizedData = {
            ...coachAcceptanceData,
            employeeName: member.name || member.email.split("@")[0],
          };
          return emailService.sendCoachAcceptanceNotification(
            member.email,
            personalizedData,
          );
        });

        await Promise.all(emailPromises);
        console.log(
          `📧 Coach acceptance emails sent to ${request.teamMembers.length} employees`,
        );

        return { request, coach, emailsSent: true };
      } catch (emailError) {
        console.warn("Failed to send coach acceptance emails:", emailError);
        return { request, coach, emailsSent: false };
      }
    } catch (error) {
      console.warn("API not available, using mock response:", error);

      // Mock response for demo
      const mockCoach = this.getMockCoaches()[0];
      const mockRequest = {
        id: requestId,
        title: "Mock Program",
        teamMembers: [
          {
            id: "1",
            email: "employee@company.com",
            name: "Employee",
            role: "participant" as const,
            status: "accepted" as const,
            invitedAt: new Date().toISOString(),
          },
        ],
      } as MentorshipRequest;

      return {
        request: mockRequest,
        coach: mockCoach,
        emailsSent: true,
      };
    }
  }

  async deleteMentorshipRequest(id: string): Promise<void> {
    await this.request(`/mentorship-requests/${id}`, {
      method: "DELETE",
    });
  }

  // Expert/Coach directory methods
  async getAllExperts(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/experts");
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock experts:", error);

      // Return mock experts for demo
      return [
        {
          id: "expert-1",
          name: "Dr. Sarah Chen",
          title: "Senior Software Architect",
          company: "Tech Innovations Inc.",
          expertise: ["React", "Node.js", "System Design", "Leadership"],
          experience: 12,
          avatar: "https://avatar.vercel.sh/sarah-chen",
          bio: "Passionate about building scalable web applications and mentoring the next generation of developers.",
          rating: 4.9,
          totalSessions: 347,
          availableSlots: ["Mon 9-5", "Wed 9-5", "Fri 9-5"],
          hourlyRate: 150,
          location: "San Francisco, CA",
        },
        {
          id: "expert-2",
          name: "Michael Rodriguez",
          title: "Product Strategy Lead",
          company: "Innovation Labs",
          expertise: [
            "Product Management",
            "Strategy",
            "UX Design",
            "Analytics",
          ],
          experience: 8,
          avatar: "https://avatar.vercel.sh/michael-rodriguez",
          bio: "Expert in product strategy and user experience design with a track record of launching successful products.",
          rating: 4.8,
          totalSessions: 289,
          availableSlots: ["Tue 10-6", "Thu 10-6"],
          hourlyRate: 175,
          location: "New York, NY",
        },
        {
          id: "expert-3",
          name: "Emily Johnson",
          title: "Data Science Director",
          company: "Analytics Pro",
          expertise: ["Machine Learning", "Python", "Data Analysis", "AI"],
          experience: 10,
          avatar: "https://avatar.vercel.sh/emily-johnson",
          bio: "Specializing in machine learning and data analytics with extensive experience in AI implementations.",
          rating: 4.9,
          totalSessions: 412,
          availableSlots: ["Mon 1-7", "Wed 1-7", "Fri 1-7"],
          hourlyRate: 200,
          location: "Austin, TX",
        },
      ];
    }
  }

  // Coach-specific API methods
  async getCoachPendingRequests(coachId: string): Promise<any[]> {
    try {
      const response = await this.request<any[]>(
        `/coaches/${coachId}/pending-requests`,
      );
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock pending requests:", error);

      // Return mock pending requests for demo
      return [
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
          status: "pending",
          requesterName: "John Smith",
          requesterEmail: "john@techstart.com",
        },
        {
          id: "req-2",
          title: "Leadership Development Program",
          company: "Growth Corp",
          description:
            "Need coaching for developing leadership skills across our management team.",
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
          status: "pending",
          requesterName: "Sarah Johnson",
          requesterEmail: "sarah@growthcorp.com",
        },
        {
          id: "req-3",
          title: "DevOps and Cloud Migration Coaching",
          company: "StartupXYZ",
          description:
            "Seeking guidance on DevOps practices and cloud migration strategies.",
          goals: [
            "Docker and containerization",
            "CI/CD pipeline setup",
            "AWS cloud migration",
          ],
          teamSize: 3,
          urgency: "low",
          budget: 1800,
          preferredSchedule: "Weekends preferred",
          submittedAt: new Date("2024-01-18"),
          status: "pending",
          requesterName: "Mike Chen",
          requesterEmail: "mike@startupxyz.com",
        },
      ];
    }
  }

  async getCoachStats(coachId: string): Promise<any> {
    try {
      const response = await this.request<any>(`/coaches/${coachId}/stats`);
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock coach stats:", error);

      // Return mock stats for demo
      return {
        totalSessions: 156,
        completedSessions: 142,
        averageRating: 4.8,
        totalEarnings: 45600,
        upcomingSessions: 3,
        responseTime: 2.4, // hours
        successRate: 95,
        monthlyEarnings: 8200,
        newRequestsThisWeek: 5,
        acceptanceRate: 87,
      };
    }
  }

  async acceptCoachingRequest(
    requestId: string,
    coachId: string,
    message?: string,
  ): Promise<any> {
    try {
      const response = await this.request<any>(
        `/coaching-requests/${requestId}/accept`,
        {
          method: "POST",
          body: JSON.stringify({ coachId, message }),
        },
      );
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock acceptance:", error);
      return {
        success: true,
        message: "Request accepted successfully",
        nextSteps: "You will be contacted to schedule the first session.",
      };
    }
  }

  async declineCoachingRequest(
    requestId: string,
    coachId: string,
    reason?: string,
  ): Promise<any> {
    try {
      const response = await this.request<any>(
        `/coaching-requests/${requestId}/decline`,
        {
          method: "POST",
          body: JSON.stringify({ coachId, reason }),
        },
      );
      return response.data;
    } catch (error) {
      console.warn("API not available, using mock decline:", error);
      return {
        success: true,
        message: "Request declined successfully",
      };
    }
  }

  // Validation methods for button functionality
  async validateSessionJoin(requestId: string): Promise<{
    success: boolean;
    sessionId?: string;
    meetingLink?: string;
    message: string;
  }> {
    try {
      // Try to fetch active session for the program
      const response = await this.request<{
        sessionId: string;
        meetingLink: string;
      }>(`/mentorship-requests/${requestId}/active-session`);

      return {
        success: true,
        sessionId: response.data.sessionId,
        meetingLink: response.data.meetingLink,
        message: "Session found and ready to join",
      };
    } catch (error) {
      console.warn("No active session found, using mock data:", error);

      // Mock successful session join for demo
      return {
        success: true,
        sessionId: "mock-session-123",
        meetingLink: "https://meet.google.com/mock-session",
        message:
          "Mock session ready - this would connect to real session in production",
      };
    }
  }

  async trackButtonClick(
    buttonType: "join_session" | "view_details" | "message",
    requestId: string,
    userId: string,
  ): Promise<void> {
    try {
      await this.request("/analytics/button-click", {
        method: "POST",
        body: JSON.stringify({
          buttonType,
          requestId,
          userId,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log(
        `✅ Button click tracked: ${buttonType} for request ${requestId}`,
      );
    } catch (error) {
      console.warn("Analytics tracking failed (expected in dev):", error);
    }
  }

  async validateMessageAccess(
    requestId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    conversationId?: string;
    message: string;
  }> {
    try {
      const response = await this.request<{
        conversationId: string;
      }>(`/mentorship-requests/${requestId}/conversation?userId=${userId}`);

      return {
        success: true,
        conversationId: response.data.conversationId,
        message: "Message access validated",
      };
    } catch (error) {
      console.warn("Message validation using mock data:", error);

      return {
        success: true,
        conversationId: `conv-${requestId}-${userId}`,
        message:
          "Mock conversation created - this would connect to real messaging in production",
      };
    }
  }
}

export const api = new ApiService();
