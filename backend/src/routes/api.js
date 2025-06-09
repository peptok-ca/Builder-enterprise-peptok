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

export default router;
