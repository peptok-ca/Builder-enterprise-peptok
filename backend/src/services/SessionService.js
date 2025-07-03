import { logger } from "../config/logger.js";

// Mock Agora token generation (replace with actual Agora implementation)
const generateAgoraToken = (channelName, userId) => {
  // In production, use proper Agora token generation
  return `agora_token_${channelName}_${userId}_${Date.now()}`;
};

// Mock Session class for JavaScript compatibility
class Session {
  constructor(
    id,
    mentorshipRequestId,
    mentorId,
    participantIds,
    title,
    description,
    scheduledStartTime,
    scheduledEndTime,
    type,
    status,
    actualStartTime = null,
    actualEndTime = null,
    agoraChannelName = null,
    recordingUrl = null,
    transcriptUrl = null,
    feedback = null,
    rating = null,
    notes = null,
  ) {
    this.id = id;
    this.mentorshipRequestId = mentorshipRequestId;
    this.mentorId = mentorId;
    this.participantIds = participantIds || [];
    this.title = title;
    this.description = description;
    this.scheduledStartTime = scheduledStartTime;
    this.scheduledEndTime = scheduledEndTime;
    this.type = type;
    this.status = status;
    this.actualStartTime = actualStartTime;
    this.actualEndTime = actualEndTime;
    this.agoraChannelName = agoraChannelName;
    this.recordingUrl = recordingUrl;
    this.transcriptUrl = transcriptUrl;
    this.feedback = feedback;
    this.rating = rating;
    this.notes = notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      mentorshipRequestId: this.mentorshipRequestId,
      mentorId: this.mentorId,
      participantIds: this.participantIds,
      title: this.title,
      description: this.description,
      scheduledStartTime: this.scheduledStartTime,
      scheduledEndTime: this.scheduledEndTime,
      type: this.type,
      status: this.status,
      actualStartTime: this.actualStartTime,
      actualEndTime: this.actualEndTime,
      agoraChannelName: this.agoraChannelName,
      recordingUrl: this.recordingUrl,
      transcriptUrl: this.transcriptUrl,
      feedback: this.feedback,
      rating: this.rating,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  canStart() {
    const now = new Date();
    const startTime = new Date(this.scheduledStartTime);
    const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60 * 1000);

    return (
      this.status === "SCHEDULED" &&
      now >= fiveMinutesBefore &&
      now <= new Date(this.scheduledEndTime)
    );
  }

  canJoin(userId) {
    return (
      (this.status === "IN_PROGRESS" || this.status === "SCHEDULED") &&
      (this.mentorId === userId || this.participantIds.includes(userId))
    );
  }

  isOverdue() {
    const now = new Date();
    return this.status === "SCHEDULED" && now > new Date(this.scheduledEndTime);
  }

  getDurationMinutes() {
    if (this.actualStartTime && this.actualEndTime) {
      return Math.round(
        (new Date(this.actualEndTime) - new Date(this.actualStartTime)) /
          (1000 * 60),
      );
    }

    if (this.scheduledStartTime && this.scheduledEndTime) {
      return Math.round(
        (new Date(this.scheduledEndTime) - new Date(this.scheduledStartTime)) /
          (1000 * 60),
      );
    }

    return 0;
  }
}

export class SessionService {
  constructor() {
    this.sessions = new Map();
    this.activeChannels = new Map(); // channelName -> userIds
    this.initializeMockSessions();
  }

  initializeMockSessions() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const mockSessions = [
      new Session(
        "session_1",
        "request_1",
        "mentor_1",
        ["user_1", "user_2"],
        "React Fundamentals Deep Dive",
        "Comprehensive session covering React hooks, state management, and best practices",
        tomorrow,
        new Date(tomorrow.getTime() + 60 * 60 * 1000), // 1 hour later
        "MENTORING",
        "SCHEDULED",
      ),
      new Session(
        "session_2",
        "request_2",
        "mentor_2",
        ["user_3"],
        "Product Strategy Workshop",
        "Strategic planning and roadmap development session",
        nextWeek,
        new Date(nextWeek.getTime() + 90 * 60 * 1000), // 1.5 hours later
        "WORKSHOP",
        "SCHEDULED",
      ),
      new Session(
        "session_3",
        "request_1",
        "mentor_1",
        ["user_1"],
        "Code Review Session",
        "Review recent project implementations and provide feedback",
        new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
        new Date(now.getTime() - 23 * 60 * 60 * 1000), // 1 hour later
        "CODE_REVIEW",
        "COMPLETED",
        new Date(now.getTime() - 24 * 60 * 60 * 1000),
        new Date(now.getTime() - 23 * 60 * 60 * 1000),
        "channel_session_3",
        "https://recordings.example.com/session_3.mp4",
        null,
        { rating: 5, comments: "Excellent feedback and very helpful" },
        5,
        "Covered component architecture and performance optimization",
      ),
    ];

    mockSessions.forEach((session) => {
      this.sessions.set(session.id, session);
    });

    logger.info(`Initialized ${mockSessions.length} mock sessions`);
  }

  async scheduleSession(sessionRequest) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = new Session(
      sessionId,
      sessionRequest.mentorshipRequestId,
      sessionRequest.mentorId,
      sessionRequest.participants,
      sessionRequest.title,
      sessionRequest.description,
      new Date(sessionRequest.scheduledStartTime),
      new Date(sessionRequest.scheduledEndTime),
      sessionRequest.type || "MENTORING",
      "SCHEDULED",
    );

    this.sessions.set(sessionId, session);

    logger.info(`Session scheduled: ${sessionId}`, {
      mentorId: session.mentorId,
      participants: session.participantIds,
      scheduledTime: session.scheduledStartTime,
    });

    return session;
  }

  async getSessionById(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  async getSessionsByUser(userId, filters = {}) {
    const userSessions = Array.from(this.sessions.values()).filter(
      (session) =>
        session.mentorId === userId || session.participantIds.includes(userId),
    );

    // Apply filters
    if (filters.status) {
      return userSessions.filter(
        (session) => session.status === filters.status,
      );
    }

    if (filters.upcoming) {
      const now = new Date();
      return userSessions.filter(
        (session) =>
          session.status === "SCHEDULED" &&
          new Date(session.scheduledStartTime) > now,
      );
    }

    return userSessions.sort(
      (a, b) => new Date(b.scheduledStartTime) - new Date(a.scheduledStartTime),
    );
  }

  async startSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (!session.canStart()) {
      throw new Error("Session cannot be started at this time");
    }

    if (!session.canJoin(userId)) {
      throw new Error("User not authorized to start this session");
    }

    // Generate Agora channel and token
    const channelName = `session_${sessionId}_${Date.now()}`;
    const agoraToken = generateAgoraToken(channelName, userId);

    // Update session
    session.status = "IN_PROGRESS";
    session.actualStartTime = new Date();
    session.agoraChannelName = channelName;

    // Initialize active channel tracking
    this.activeChannels.set(channelName, new Set([userId]));

    logger.info(`Session started: ${sessionId}`, {
      channelName,
      startedBy: userId,
    });

    return {
      sessionId,
      agoraChannelName: channelName,
      agoraToken,
      meetingUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/session/${sessionId}`,
      canRecord: true,
      canTranscribe: true,
    };
  }

  async joinSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (!session.canJoin(userId)) {
      throw new Error("User not authorized to join this session");
    }

    if (session.status === "SCHEDULED") {
      // Auto-start if user can start
      if (session.canStart()) {
        return await this.startSession(sessionId, userId);
      } else {
        throw new Error("Session has not started yet");
      }
    }

    if (session.status !== "IN_PROGRESS") {
      throw new Error("Session is not currently active");
    }

    // Generate token for existing channel
    const agoraToken = generateAgoraToken(session.agoraChannelName, userId);

    // Add user to active channel
    if (this.activeChannels.has(session.agoraChannelName)) {
      this.activeChannels.get(session.agoraChannelName).add(userId);
    }

    logger.info(`User joined session: ${sessionId}`, {
      userId,
      channelName: session.agoraChannelName,
    });

    return {
      sessionId,
      agoraChannelName: session.agoraChannelName,
      agoraToken,
      meetingUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/session/${sessionId}`,
      canRecord: true,
      canTranscribe: true,
    };
  }

  async endSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "IN_PROGRESS") {
      throw new Error("Session is not currently active");
    }

    // Only mentor or session creator can end session
    if (session.mentorId !== userId) {
      throw new Error("Only the mentor can end the session");
    }

    // Update session
    session.status = "COMPLETED";
    session.actualEndTime = new Date();

    // Clean up active channel
    if (session.agoraChannelName) {
      this.activeChannels.delete(session.agoraChannelName);
    }

    logger.info(`Session ended: ${sessionId}`, {
      duration: session.getDurationMinutes(),
      endedBy: userId,
    });

    return session;
  }

  async updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "description",
      "scheduledStartTime",
      "scheduledEndTime",
      "notes",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        session[field] = updates[field];
      }
    });

    session.updatedAt = new Date();

    logger.info(`Session updated: ${sessionId}`, updates);

    return session;
  }

  async submitFeedback(sessionId, userId, feedback) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "COMPLETED") {
      throw new Error("Can only submit feedback for completed sessions");
    }

    if (!session.canJoin(userId)) {
      throw new Error(
        "User not authorized to submit feedback for this session",
      );
    }

    // Update session with feedback
    session.feedback = {
      ...session.feedback,
      [userId]: {
        rating: feedback.rating,
        comments: feedback.comments,
        submittedAt: new Date(),
      },
    };

    // Calculate average rating
    const feedbackEntries = Object.values(session.feedback);
    const avgRating =
      feedbackEntries.reduce((sum, fb) => sum + fb.rating, 0) /
      feedbackEntries.length;
    session.rating = Math.round(avgRating * 10) / 10;

    logger.info(`Feedback submitted for session: ${sessionId}`, {
      userId,
      rating: feedback.rating,
      averageRating: session.rating,
    });

    return session;
  }

  async getSessionStats(userId) {
    const userSessions = await this.getSessionsByUser(userId);

    const completedSessions = userSessions.filter(
      (s) => s.status === "COMPLETED",
    );
    const upcomingSessions = userSessions.filter(
      (s) =>
        s.status === "SCHEDULED" && new Date(s.scheduledStartTime) > new Date(),
    );

    const totalDuration = completedSessions.reduce(
      (sum, session) => sum + session.getDurationMinutes(),
      0,
    );

    const ratingsSum = completedSessions
      .filter((s) => s.rating)
      .reduce((sum, session) => sum + session.rating, 0);
    const ratedSessionsCount = completedSessions.filter((s) => s.rating).length;
    const averageRating =
      ratedSessionsCount > 0 ? ratingsSum / ratedSessionsCount : 0;

    return {
      totalSessions: userSessions.length,
      completedSessions: completedSessions.length,
      totalDuration,
      averageRating: Math.round(averageRating * 10) / 10,
      upcomingSessions: upcomingSessions.length,
    };
  }

  async cancelSession(sessionId, userId, reason) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "SCHEDULED") {
      throw new Error("Can only cancel scheduled sessions");
    }

    // Allow mentor or participants to cancel
    if (
      session.mentorId !== userId &&
      !session.participantIds.includes(userId)
    ) {
      throw new Error("User not authorized to cancel this session");
    }

    session.status = "CANCELLED";
    session.notes = `Cancelled by user ${userId}. Reason: ${reason || "No reason provided"}`;
    session.updatedAt = new Date();

    logger.info(`Session cancelled: ${sessionId}`, {
      cancelledBy: userId,
      reason,
    });

    return session;
  }

  async rescheduleSession(sessionId, userId, newStartTime, newEndTime) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "SCHEDULED") {
      throw new Error("Can only reschedule scheduled sessions");
    }

    // Only mentor can reschedule
    if (session.mentorId !== userId) {
      throw new Error("Only the mentor can reschedule the session");
    }

    const oldStartTime = session.scheduledStartTime;
    session.scheduledStartTime = new Date(newStartTime);
    session.scheduledEndTime = new Date(newEndTime);
    session.updatedAt = new Date();

    logger.info(`Session rescheduled: ${sessionId}`, {
      oldStartTime,
      newStartTime: session.scheduledStartTime,
      rescheduledBy: userId,
    });

    return session;
  }
}

// Export singleton instance
export const sessionService = new SessionService();
