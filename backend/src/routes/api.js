import express from "express";
import { authService } from "../services/AuthService.js";
import { logger } from "../config/logger.js";
import mentorRoutes from "./mentors.js";
import sessionRoutes from "./sessions.js";
import paymentRoutes from "./payments.js";
import {
  mockSkills,
  mockExperts,
  mockEmployees,
  mockConnections,
  mockMetrics,
  mockDashboardStats,
  mockDepartmentMetrics,
  mockRecentActivities,
  mockSubscriptionTiers,
  mockCompanyProfiles,
  mockMentorshipRequests,
  mockTeamMembers,
} from "../data/mockData.js";

const router = express.Router();

// Use sub-routers for new functionality
router.use("/mentors", mentorRoutes);
router.use("/sessions", sessionRoutes);
router.use("/payments", paymentRoutes);

// Helper function to simulate API delay
const simulateDelay = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock data for existing functionality
const mockUsers = [
  {
    id: "user_1",
    email: "admin@peptok.com",
    firstName: "Admin",
    lastName: "User",
    userType: "admin",
    companyId: "company_1",
  },
  {
    id: "user_2",
    email: "employee@techcorp.com",
    firstName: "John",
    lastName: "Doe",
    userType: "employee",
    companyId: "company_1",
  },
];

const mockCompanies = [
  {
    id: "company_1",
    name: "TechCorp",
    industry: "Technology",
    size: "100-500",
    subscriptionTier: "growth",
  },
];

// Authentication routes
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const userData = req.body;

    const result = await authService.register(userData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

router.post("/auth/oauth/:provider", async (req, res) => {
  try {
    const { provider } = req.params;
    const { token } = req.body;

    let result;
    if (provider === "google") {
      result = await authService.loginWithGoogle(token);
    } else if (provider === "microsoft") {
      result = await authService.loginWithMicrosoft(token);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported OAuth provider",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("OAuth error:", error);
    res.status(401).json({
      success: false,
      message: error.message || "OAuth authentication failed",
    });
  }
});

router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to send password reset email",
    });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
});

// Skills endpoints
router.get("/skills", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockSkills,
      total: mockSkills.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/skills/:id", async (req, res) => {
  try {
    await simulateDelay();
    const skill = mockSkills.find((s) => s.id === req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Experts endpoints
router.get("/experts", async (req, res) => {
  try {
    await simulateDelay();
    const { skill, availability, rating } = req.query;
    let filtered = mockExperts;

    if (skill) {
      filtered = filtered.filter((expert) =>
        expert.skills.some((s) =>
          s.toLowerCase().includes(skill.toLowerCase()),
        ),
      );
    }

    if (availability) {
      filtered = filtered.filter(
        (expert) => expert.availability === availability,
      );
    }

    if (rating) {
      filtered = filtered.filter(
        (expert) => expert.rating >= parseFloat(rating),
      );
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/experts/:id", async (req, res) => {
  try {
    await simulateDelay();
    const expert = mockExperts.find((e) => e.id === req.params.id);
    if (!expert) {
      return res
        .status(404)
        .json({ success: false, error: "Expert not found" });
    }
    res.json({ success: true, data: expert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Employees endpoints
router.get("/employees", async (req, res) => {
  try {
    await simulateDelay();
    const { department, level } = req.query;
    let filtered = mockEmployees;

    if (department) {
      filtered = filtered.filter((emp) =>
        emp.department.toLowerCase().includes(department.toLowerCase()),
      );
    }

    if (level) {
      filtered = filtered.filter((emp) => emp.level === level);
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/employees/:id", async (req, res) => {
  try {
    await simulateDelay();
    const employee = mockEmployees.find((e) => e.id === req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Connections endpoints
router.get("/connections", async (req, res) => {
  try {
    await simulateDelay();
    const { status, employeeId, expertId } = req.query;
    let filtered = mockConnections;

    if (status) {
      filtered = filtered.filter((conn) => conn.status === status);
    }

    if (employeeId) {
      filtered = filtered.filter((conn) => conn.employeeId === employeeId);
    }

    if (expertId) {
      filtered = filtered.filter((conn) => conn.expertId === expertId);
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/connections", async (req, res) => {
  try {
    await simulateDelay();
    const newConnection = {
      id: `conn_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockConnections.push(newConnection);
    res.status(201).json({ success: true, data: newConnection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/connections/:id", async (req, res) => {
  try {
    await simulateDelay();
    const connectionIndex = mockConnections.findIndex(
      (c) => c.id === req.params.id,
    );
    if (connectionIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Connection not found" });
    }

    mockConnections[connectionIndex] = {
      ...mockConnections[connectionIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json({ success: true, data: mockConnections[connectionIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Metrics endpoints
router.get("/metrics", async (req, res) => {
  try {
    await simulateDelay();
    const { type, period } = req.query;
    let filtered = mockMetrics;

    if (type) {
      filtered = filtered.filter((metric) => metric.type === type);
    }

    if (period) {
      // Filter by period if needed
      // This would need more sophisticated date filtering in a real app
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard endpoints
router.get("/dashboard/stats", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockDashboardStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/dashboard/department-metrics", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockDepartmentMetrics,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/dashboard/recent-activities", async (req, res) => {
  try {
    await simulateDelay();
    const { limit = 10 } = req.query;
    const activities = mockRecentActivities.slice(0, parseInt(limit));
    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User routes
router.get("/users", (req, res) => {
  res.json({
    success: true,
    data: mockUsers,
  });
});

router.get("/users/:id", (req, res) => {
  const user = mockUsers.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.json({
    success: true,
    data: user,
  });
});

// Company routes
router.get("/companies", (req, res) => {
  res.json({
    success: true,
    data: mockCompanies,
  });
});

router.post("/companies", (req, res) => {
  const newCompany = {
    id: `company_${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
  };
  mockCompanies.push(newCompany);
  res.status(201).json({
    success: true,
    data: newCompany,
  });
});

// Mentorship request routes (existing ones from mockData)
router.get("/mentorship-requests", (req, res) => {
  const { companyId, status } = req.query;
  let filtered = mockMentorshipRequests;

  if (companyId) {
    filtered = filtered.filter((r) => r.companyId === companyId);
  }

  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }

  res.json({
    success: true,
    data: filtered,
  });
});

router.post("/mentorship-requests", (req, res) => {
  const newRequest = {
    id: `request_${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockMentorshipRequests.push(newRequest);
  res.status(201).json({
    success: true,
    data: newRequest,
  });
});

router.put("/mentorship-requests/:id", (req, res) => {
  const index = mockMentorshipRequests.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Mentorship request not found",
    });
  }

  mockMentorshipRequests[index] = {
    ...mockMentorshipRequests[index],
    ...req.body,
    updatedAt: new Date(),
  };

  res.json({
    success: true,
    data: mockMentorshipRequests[index],
  });
});

router.delete("/mentorship-requests/:id", (req, res) => {
  const index = mockMentorshipRequests.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Mentorship request not found",
    });
  }

  mockMentorshipRequests.splice(index, 1);
  res.json({
    success: true,
    message: "Mentorship request deleted successfully",
  });
});

// Subscription tiers
router.get("/subscription-tiers", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockSubscriptionTiers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Company profiles
router.get("/company-profiles", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockCompanyProfiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Team members
router.get("/team-members", async (req, res) => {
  try {
    await simulateDelay();
    const { companyId } = req.query;
    let filtered = mockTeamMembers;

    if (companyId) {
      filtered = filtered.filter((m) => m.companyId === companyId);
    }

    res.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
