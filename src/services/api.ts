import { MentorshipRequest, SubscriptionTier } from "../types";
import { Mentor, MatchingFilters, MatchingResult } from "../types/mentor";
import {
  Session,
  SessionScheduleRequest,
  SessionStats,
  SessionJoinInfo,
} from "../types/session";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

class ApiService {
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

  // Mentor-related methods
  async getAllMentors(): Promise<Mentor[]> {
    const response = await this.request<Mentor[]>("/mentors");
    return response.data;
  }

  async getMentorById(id: string): Promise<Mentor> {
    const response = await this.request<Mentor>(`/mentors/${id}`);
    return response.data;
  }

  async findMentorMatches(
    mentorshipRequestId: string,
    filters: MatchingFilters = {},
    limit: number = 10,
  ): Promise<MatchingResult> {
    const response = await this.request<MatchingResult>("/mentors/matches", {
      method: "POST",
      body: JSON.stringify({ mentorshipRequestId, filters, limit }),
    });
    return response.data;
  }

  async searchMentors(
    query: string,
    filters: MatchingFilters = {},
  ): Promise<Mentor[]> {
    const searchParams = new URLSearchParams(filters as any);
    const response = await this.request<Mentor[]>(
      `/mentors/search/${encodeURIComponent(query)}?${searchParams}`,
    );
    return response.data;
  }

  async getTopMentors(limit: number = 5): Promise<Mentor[]> {
    const response = await this.request<Mentor[]>(
      `/mentors/featured/top?limit=${limit}`,
    );
    return response.data;
  }

  async sendMentorshipRequest(
    mentorshipRequestId: string,
    mentorId: string,
    message?: string,
  ): Promise<any> {
    const response = await this.request(`/mentors/${mentorId}/request`, {
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
    const response = await this.request<SubscriptionTier[]>("/payments/tiers");
    return response.data;
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
    const searchParams = new URLSearchParams();
    if (filters.companyId) searchParams.append("companyId", filters.companyId);
    if (filters.status) searchParams.append("status", filters.status);

    const response = await this.request<MentorshipRequest[]>(
      `/mentorship-requests?${searchParams}`,
    );
    return response.data;
  }

  async createMentorshipRequest(
    request: Omit<MentorshipRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<MentorshipRequest> {
    const response = await this.request<MentorshipRequest>(
      "/mentorship-requests",
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
    return response.data;
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
