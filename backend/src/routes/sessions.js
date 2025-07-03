import express from "express";
import { sessionService } from "../services/SessionService.ts";
import { authMiddleware } from "../middleware/auth.ts";
import {
  validateSessionSchedule,
  validateSessionFeedback,
} from "../middleware/validation.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// Schedule a new session
router.post(
  "/schedule",
  authMiddleware(),
  validateSessionSchedule,
  async (req, res) => {
    try {
      const sessionRequest = req.body;
      const userId = req.user.id;

      // Add current user as a participant if not already included
      if (!sessionRequest.participants.includes(userId)) {
        sessionRequest.participants.push(userId);
      }

      const session = await sessionService.scheduleSession(sessionRequest);

      res.json({
        success: true,
        data: session.toJSON(),
      });
    } catch (error) {
      logger.error("Error scheduling session:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to schedule session",
      });
    }
  },
);

// Get session by ID
router.get("/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = sessionService.getSession(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check if user is a participant
    const isParticipant = session.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: session.toJSON(),
    });
  } catch (error) {
    logger.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch session",
    });
  }
});

// Get join information for a session
router.get("/:id/join", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const joinInfo = await sessionService.getSessionJoinInfo(id, userId);

    res.json({
      success: true,
      data: joinInfo,
    });
  } catch (error) {
    logger.error("Error getting session join info:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to get session join information",
    });
  }
});

// Join a session
router.post("/:id/join", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await sessionService.joinSession(id, userId);

    res.json({
      success: true,
      message: "Successfully joined session",
    });
  } catch (error) {
    logger.error("Error joining session:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to join session",
    });
  }
});

// Leave a session
router.post("/:id/leave", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await sessionService.leaveSession(id, userId);

    res.json({
      success: true,
      message: "Successfully left session",
    });
  } catch (error) {
    logger.error("Error leaving session:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to leave session",
    });
  }
});

// Start session recording
router.post("/:id/recording/start", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;

    await sessionService.startRecording(id);

    res.json({
      success: true,
      message: "Recording started",
    });
  } catch (error) {
    logger.error("Error starting recording:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to start recording",
    });
  }
});

// Stop session recording
router.post("/:id/recording/stop", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;

    await sessionService.stopRecording(id);

    res.json({
      success: true,
      message: "Recording stopped",
    });
  } catch (error) {
    logger.error("Error stopping recording:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to stop recording",
    });
  }
});

// End a session
router.post("/:id/end", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await sessionService.endSession(id, userId);

    res.json({
      success: true,
      message: "Session ended successfully",
    });
  } catch (error) {
    logger.error("Error ending session:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to end session",
    });
  }
});

// Cancel a session
router.post("/:id/cancel", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    await sessionService.cancelSession(id, reason, userId);

    res.json({
      success: true,
      message: "Session cancelled successfully",
    });
  } catch (error) {
    logger.error("Error cancelling session:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel session",
    });
  }
});

// Reschedule a session
router.post("/:id/reschedule", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const { newStartTime, newEndTime } = req.body;
    const userId = req.user.id;

    await sessionService.rescheduleSession(
      id,
      new Date(newStartTime),
      new Date(newEndTime),
      userId,
    );

    res.json({
      success: true,
      message: "Session rescheduled successfully",
    });
  } catch (error) {
    logger.error("Error rescheduling session:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to reschedule session",
    });
  }
});

// Add session note
router.post("/:id/notes", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isShared = false } = req.body;
    const userId = req.user.id;

    await sessionService.addSessionNote(id, content, userId, isShared);

    res.json({
      success: true,
      message: "Note added successfully",
    });
  } catch (error) {
    logger.error("Error adding session note:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add note",
    });
  }
});

// Add session feedback
router.post(
  "/:id/feedback",
  authMiddleware(),
  validateSessionFeedback,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { toUserId, rating, feedback, isAnonymous = false } = req.body;
      const fromUserId = req.user.id;

      await sessionService.addSessionFeedback(
        id,
        fromUserId,
        toUserId,
        rating,
        feedback,
        isAnonymous,
      );

      res.json({
        success: true,
        message: "Feedback submitted successfully",
      });
    } catch (error) {
      logger.error("Error adding session feedback:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to submit feedback",
      });
    }
  },
);

// Get user's sessions
router.get("/user/:userId", authMiddleware(), async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const requestingUserId = req.user.id;

    // Users can only access their own sessions unless they're admin
    if (userId !== requestingUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const sessions = await sessionService.getSessionsByUser(userId, status);

    res.json({
      success: true,
      data: sessions.map((session) => session.toJSON()),
    });
  } catch (error) {
    logger.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });
  }
});

// Get upcoming sessions for user
router.get("/user/:userId/upcoming", authMiddleware(), async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 5 } = req.query;
    const requestingUserId = req.user.id;

    // Users can only access their own sessions unless they're admin
    if (userId !== requestingUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const sessions = await sessionService.getUpcomingSessions(
      userId,
      parseInt(limit),
    );

    res.json({
      success: true,
      data: sessions.map((session) => session.toJSON()),
    });
  } catch (error) {
    logger.error("Error fetching upcoming sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming sessions",
    });
  }
});

// Get session statistics for user
router.get("/user/:userId/stats", authMiddleware(), async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Users can only access their own stats unless they're admin
    if (userId !== requestingUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const stats = await sessionService.getSessionStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Error fetching session stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch session statistics",
    });
  }
});

// Get session history with pagination
router.get("/user/:userId/history", authMiddleware(), async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const requestingUserId = req.user.id;

    // Users can only access their own history unless they're admin
    if (userId !== requestingUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const result = await sessionService.getSessionHistory(
      userId,
      parseInt(page),
      parseInt(limit),
    );

    res.json({
      success: true,
      data: {
        ...result,
        sessions: result.sessions.map((session) => session.toJSON()),
      },
    });
  } catch (error) {
    logger.error("Error fetching session history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch session history",
    });
  }
});

export default router;
