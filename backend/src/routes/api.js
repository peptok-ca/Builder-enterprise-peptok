import express from "express";
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

// Helper function to simulate API delay
const simulateDelay = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
    const {
      search,
      expertise,
      experience,
      rating,
      minRate,
      maxRate,
      availability,
      location,
      limit = 10,
      offset = 0,
    } = req.query;

    let filteredExperts = [...mockExperts];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredExperts = filteredExperts.filter(
        (expert) =>
          expert.name.toLowerCase().includes(searchLower) ||
          expert.title.toLowerCase().includes(searchLower) ||
          expert.company.toLowerCase().includes(searchLower) ||
          expert.bio.toLowerCase().includes(searchLower),
      );
    }

    if (expertise) {
      filteredExperts = filteredExperts.filter((expert) =>
        expert.expertise.some((exp) =>
          exp.toLowerCase().includes(expertise.toLowerCase()),
        ),
      );
    }

    if (experience) {
      const minExp = parseInt(experience);
      filteredExperts = filteredExperts.filter(
        (expert) => expert.experience >= minExp,
      );
    }

    if (rating) {
      const minRating = parseFloat(rating);
      filteredExperts = filteredExperts.filter(
        (expert) => expert.rating >= minRating,
      );
    }

    if (minRate && maxRate) {
      const min = parseInt(minRate);
      const max = parseInt(maxRate);
      filteredExperts = filteredExperts.filter(
        (expert) => expert.hourlyRate >= min && expert.hourlyRate <= max,
      );
    }

    if (availability) {
      filteredExperts = filteredExperts.filter((expert) =>
        expert.availability.some(
          (day) => day.toLowerCase() === availability.toLowerCase(),
        ),
      );
    }

    if (location) {
      filteredExperts = filteredExperts.filter((expert) =>
        expert.location.toLowerCase().includes(location.toLowerCase()),
      );
    }

    // Pagination
    const total = filteredExperts.length;
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedExperts = filteredExperts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedExperts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < total,
      },
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
    const { department, company, search } = req.query;
    let filteredEmployees = [...mockEmployees];

    if (department) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.department.toLowerCase() === department.toLowerCase(),
      );
    }

    if (company) {
      filteredEmployees = filteredEmployees.filter((emp) =>
        emp.company.toLowerCase().includes(company.toLowerCase()),
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchLower) ||
          emp.title.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower),
      );
    }

    res.json({
      success: true,
      data: filteredEmployees,
      total: filteredEmployees.length,
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
    const { expertId, employeeId, status } = req.query;
    let filteredConnections = [...mockConnections];

    if (expertId) {
      filteredConnections = filteredConnections.filter(
        (conn) => conn.expertId === expertId,
      );
    }

    if (employeeId) {
      filteredConnections = filteredConnections.filter(
        (conn) => conn.employeeId === employeeId,
      );
    }

    if (status) {
      filteredConnections = filteredConnections.filter(
        (conn) => conn.status === status,
      );
    }

    // Populate with expert and employee data
    const populatedConnections = filteredConnections.map((connection) => ({
      ...connection,
      expert: mockExperts.find((e) => e.id === connection.expertId),
      employee: mockEmployees.find((e) => e.id === connection.employeeId),
    }));

    res.json({
      success: true,
      data: populatedConnections,
      total: populatedConnections.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/connections/:id", async (req, res) => {
  try {
    await simulateDelay();
    const connection = mockConnections.find((c) => c.id === req.params.id);
    if (!connection) {
      return res
        .status(404)
        .json({ success: false, error: "Connection not found" });
    }

    const populatedConnection = {
      ...connection,
      expert: mockExperts.find((e) => e.id === connection.expertId),
      employee: mockEmployees.find((e) => e.id === connection.employeeId),
    };

    res.json({ success: true, data: populatedConnection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new connection
router.post("/connections", async (req, res) => {
  try {
    await simulateDelay();
    const { expertId, employeeId, goals } = req.body;

    if (!expertId || !employeeId) {
      return res.status(400).json({
        success: false,
        error: "Expert ID and Employee ID are required",
      });
    }

    const newConnection = {
      id: String(mockConnections.length + 1),
      expertId,
      employeeId,
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      nextSessionDate: null,
      totalSessions: 0,
      goals: goals || [],
      progress: 0,
      rating: null,
      notes: "",
    };

    mockConnections.push(newConnection);

    res.status(201).json({
      success: true,
      data: newConnection,
      message: "Connection created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Metrics endpoints
router.get("/metrics", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockMetrics,
      total: mockMetrics.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard stats
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

// Department metrics
router.get("/dashboard/departments", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockDepartmentMetrics,
      total: mockDepartmentMetrics.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Recent activities
router.get("/dashboard/activities", async (req, res) => {
  try {
    await simulateDelay();
    const { limit = 10 } = req.query;
    const limitedActivities = mockRecentActivities.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedActivities,
      total: mockRecentActivities.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search endpoint
router.get("/search", async (req, res) => {
  try {
    await simulateDelay();
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const searchLower = q.toLowerCase();
    let results = {};

    if (!type || type === "experts") {
      results.experts = mockExperts.filter(
        (expert) =>
          expert.name.toLowerCase().includes(searchLower) ||
          expert.title.toLowerCase().includes(searchLower) ||
          expert.expertise.some((exp) =>
            exp.toLowerCase().includes(searchLower),
          ),
      );
    }

    if (!type || type === "employees") {
      results.employees = mockEmployees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchLower) ||
          employee.title.toLowerCase().includes(searchLower) ||
          employee.skills.some((skill) =>
            skill.toLowerCase().includes(searchLower),
          ),
      );
    }

    if (!type || type === "skills") {
      results.skills = mockSkills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(searchLower) ||
          skill.category.toLowerCase().includes(searchLower),
      );
    }

    res.json({
      success: true,
      data: results,
      query: q,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Subscription Tiers endpoints
router.get("/subscription-tiers", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockSubscriptionTiers,
      total: mockSubscriptionTiers.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/subscription-tiers/:id", async (req, res) => {
  try {
    await simulateDelay();
    const tier = mockSubscriptionTiers.find((t) => t.id === req.params.id);
    if (!tier) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription tier not found" });
    }
    res.json({ success: true, data: tier });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Company Profile endpoints
router.get("/companies", async (req, res) => {
  try {
    await simulateDelay();
    res.json({
      success: true,
      data: mockCompanyProfiles,
      total: mockCompanyProfiles.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/companies/:id", async (req, res) => {
  try {
    await simulateDelay();
    const company = mockCompanyProfiles.find((c) => c.id === req.params.id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create company profile
router.post("/companies", async (req, res) => {
  try {
    await simulateDelay();
    const companyData = req.body;

    const newCompany = {
      id: `company-${Date.now()}`,
      ...companyData,
      subscription: {
        ...companyData.subscription,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 14 days trial
        teamSize: 0,
      },
    };

    mockCompanyProfiles.push(newCompany);

    res.status(201).json({
      success: true,
      data: newCompany,
      message: "Company profile created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mentorship Requests endpoints
router.get("/mentorship-requests", async (req, res) => {
  try {
    await simulateDelay();
    const { companyId, status } = req.query;
    let filteredRequests = [...mockMentorshipRequests];

    if (companyId) {
      filteredRequests = filteredRequests.filter(
        (req) => req.companyId === companyId,
      );
    }

    if (status) {
      filteredRequests = filteredRequests.filter(
        (req) => req.status === status,
      );
    }

    res.json({
      success: true,
      data: filteredRequests,
      total: filteredRequests.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/mentorship-requests/:id", async (req, res) => {
  try {
    await simulateDelay();
    const request = mockMentorshipRequests.find((r) => r.id === req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, error: "Mentorship request not found" });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create mentorship request
router.post("/mentorship-requests", async (req, res) => {
  try {
    await simulateDelay();
    const requestData = req.body;

    const newRequest = {
      id: `request-${Date.now()}`,
      ...requestData,
      status: "submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockMentorshipRequests.push(newRequest);

    res.status(201).json({
      success: true,
      data: newRequest,
      message: "Mentorship request created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update mentorship request
router.put("/mentorship-requests/:id", async (req, res) => {
  try {
    await simulateDelay();
    const requestIndex = mockMentorshipRequests.findIndex(
      (r) => r.id === req.params.id,
    );

    if (requestIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Mentorship request not found" });
    }

    const updatedRequest = {
      ...mockMentorshipRequests[requestIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    mockMentorshipRequests[requestIndex] = updatedRequest;

    res.json({
      success: true,
      data: updatedRequest,
      message: "Mentorship request updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Team Members endpoints
router.get("/team-members", async (req, res) => {
  try {
    await simulateDelay();
    const { companyId, requestId, status } = req.query;
    let filteredMembers = [...mockTeamMembers];

    if (status) {
      filteredMembers = filteredMembers.filter(
        (member) => member.status === status,
      );
    }

    // In a real app, you'd filter by companyId or requestId

    res.json({
      success: true,
      data: filteredMembers,
      total: filteredMembers.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Invite team member
router.post("/team-members/invite", async (req, res) => {
  try {
    await simulateDelay();
    const { email, role, requestId } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        error: "Email and role are required",
      });
    }

    // Check if already invited
    const existingMember = mockTeamMembers.find(
      (m) => m.email.toLowerCase() === email.toLowerCase(),
    );
    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: "This email is already invited",
      });
    }

    const newMember = {
      id: `member-${Date.now()}`,
      email: email.toLowerCase(),
      role,
      status: "invited",
      invitedAt: new Date().toISOString(),
    };

    mockTeamMembers.push(newMember);

    // Simulate sending invitation email
    console.log(`Invitation email sent to ${email}`);

    res.status(201).json({
      success: true,
      data: newMember,
      message: `Invitation sent to ${email}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update team member
router.put("/team-members/:id", async (req, res) => {
  try {
    await simulateDelay();
    const memberIndex = mockTeamMembers.findIndex(
      (m) => m.id === req.params.id,
    );

    if (memberIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Team member not found" });
    }

    const updatedMember = {
      ...mockTeamMembers[memberIndex],
      ...req.body,
    };

    if (req.body.status === "accepted" && !updatedMember.acceptedAt) {
      updatedMember.acceptedAt = new Date().toISOString();
    }

    mockTeamMembers[memberIndex] = updatedMember;

    res.json({
      success: true,
      data: updatedMember,
      message: "Team member updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove team member
router.delete("/team-members/:id", async (req, res) => {
  try {
    await simulateDelay();
    const memberIndex = mockTeamMembers.findIndex(
      (m) => m.id === req.params.id,
    );

    if (memberIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Team member not found" });
    }

    const removedMember = mockTeamMembers.splice(memberIndex, 1)[0];

    res.json({
      success: true,
      data: removedMember,
      message: "Team member removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
