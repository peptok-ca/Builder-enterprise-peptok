import { MentorshipRequest, SubscriptionTier } from "../types";
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
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    // Initialize localStorage with sample data if empty
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T; success: boolean; message?: string }> {
    const token = localStorage.getItem("auth_token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

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
  }

  // Coach-related methods
  async getAllCoaches(): Promise<Coach[]> {
    const response = await this.request<Coach[]>("/coaches");
    return response.data;
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
    const response = await this.request<Session[]>(
      `/sessions/user/${userId}/upcoming?limit=${limit}`,
    );
    return response.data;
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
      // Only try backend if environment supports it
      if (!Environment.shouldTryBackend()) {
        throw new Error("Backend not configured for deployed environment");
      }

      // Try to fetch from backend first
      const response = await fetch(`${API_BASE_URL}/subscriptions/tiers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000),
      });

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
      console.warn("API not available, using localStorage fallback:", error);
      return this.getMentorshipRequestsFromStorage(filters);
    }
  }

  async createMentorshipRequest(
    request: Omit<MentorshipRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<MentorshipRequest> {
    try {
      const response = await this.request<MentorshipRequest>(
        "/mentorship-requests",
        {
          method: "POST",
          body: JSON.stringify(request),
        },
      );
      return response.data;
    } catch (error) {
      // Fallback to localStorage if API is not available
      console.warn("API not available, using localStorage fallback:", error);
      return this.createMentorshipRequestInStorage(request);
    }
  }

  // localStorage fallback methods
  private getMentorshipRequestsFromStorage(
    filters: {
      companyId?: string;
      status?: string;
    } = {},
  ): MentorshipRequest[] {
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

  async deleteMentorshipRequest(id: string): Promise<void> {
    await this.request(`/mentorship-requests/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
