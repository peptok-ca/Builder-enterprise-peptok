import express from "express";
import { mentorMatchingService } from "../services/MentorMatchingService.ts";
import { authMiddleware } from "../middleware/auth.js";
import { validateMentorFilters } from "../middleware/validation.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// Get all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await mentorMatchingService.getAllMentors();
    res.json({
      success: true,
      data: mentors.map((mentor) => mentor.toJSON()),
    });
  } catch (error) {
    logger.error("Error fetching mentors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
    });
  }
});

// Get mentor by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await mentorMatchingService.getMentorById(id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.json({
      success: true,
      data: mentor.toJSON(),
    });
  } catch (error) {
    logger.error("Error fetching mentor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor",
    });
  }
});

// Find mentor matches for a mentorship request
router.post(
  "/matches",
  authMiddleware(),
  validateMentorFilters,
  async (req, res) => {
    try {
      const { mentorshipRequestId, filters = {}, limit = 10 } = req.body;

      // TODO: Get actual mentorship request from database
      const mockMentorshipRequest = {
        id: mentorshipRequestId,
        goals: [
          { description: "Learn React best practices" },
          { description: "Improve code architecture" },
          { description: "Master state management" },
        ],
      };

      const matchingResult = await mentorMatchingService.findMatches(
        mockMentorshipRequest,
        filters,
        limit,
      );

      res.json({
        success: true,
        data: matchingResult,
      });
    } catch (error) {
      logger.error("Error finding mentor matches:", error);
      res.status(500).json({
        success: false,
        message: "Failed to find mentor matches",
      });
    }
  },
);

// Search mentors
router.get("/search/:query", validateMentorFilters, async (req, res) => {
  try {
    const { query } = req.params;
    const filters = req.query;

    const mentors = await mentorMatchingService.searchMentors(query, filters);

    res.json({
      success: true,
      data: mentors.map((mentor) => mentor.toJSON()),
    });
  } catch (error) {
    logger.error("Error searching mentors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search mentors",
    });
  }
});

// Get top mentors
router.get("/featured/top", async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const mentors = await mentorMatchingService.getTopMentors(parseInt(limit));

    res.json({
      success: true,
      data: mentors.map((mentor) => mentor.toJSON()),
    });
  } catch (error) {
    logger.error("Error fetching top mentors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top mentors",
    });
  }
});

// Send mentorship request to mentor
router.post("/:id/request", authMiddleware(), async (req, res) => {
  try {
    const { id: mentorId } = req.params;
    const { mentorshipRequestId, message } = req.body;
    const userId = req.user.id;

    // TODO: Implement actual mentorship request sending logic
    // For now, simulate the process

    const mentor = await mentorMatchingService.getMentorById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    if (!mentor.canAcceptNewStudents()) {
      return res.status(400).json({
        success: false,
        message: "Mentor is currently unavailable for new students",
      });
    }

    // Simulate request creation
    const requestId = `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info(`Mentorship request sent`, {
      requestId,
      mentorId,
      mentorshipRequestId,
      userId,
    });

    res.json({
      success: true,
      data: {
        id: requestId,
        mentorId,
        mentorshipRequestId,
        status: "pending",
        message,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    logger.error("Error sending mentorship request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send mentorship request",
    });
  }
});

// Update mentor metrics (internal use)
router.patch("/:id/metrics", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const metrics = req.body;

    mentorMatchingService.updateMentorMetrics(id, metrics);

    res.json({
      success: true,
      message: "Mentor metrics updated successfully",
    });
  } catch (error) {
    logger.error("Error updating mentor metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update mentor metrics",
    });
  }
});

export default router;
