import { body, param, query } from "express-validator";
import { UserType } from "@/models/User.js";

export const authValidation = {
  login: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("rememberMe")
      .optional()
      .isBoolean()
      .withMessage("Remember me must be a boolean"),
  ],

  register: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      )
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      ),
    body("firstName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("userType")
      .isIn(Object.values(UserType))
      .withMessage("User type must be employee, expert, or admin"),
    body("phone")
      .optional()
      .isMobilePhone("any")
      .withMessage("Please provide a valid phone number"),
    body("companyName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters"),
    body("role")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Role must be between 2 and 100 characters"),
  ],

  oauth: [
    body("provider")
      .isIn(["google", "microsoft"])
      .withMessage("Provider must be google or microsoft"),
    body("oauthId")
      .isString()
      .isLength({ min: 1 })
      .withMessage("OAuth ID is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("firstName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("avatarUrl")
      .optional()
      .isURL()
      .withMessage("Avatar URL must be a valid URL"),
  ],

  requestPasswordReset: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
  ],

  resetPassword: [
    body("token")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 8 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      )
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      ),
  ],

  verifyEmail: [
    param("token")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Verification token is required"),
  ],
};

export const userValidation = {
  getUserById: [
    param("id").isUUID().withMessage("User ID must be a valid UUID"),
  ],

  updateProfile: [
    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("phone")
      .optional()
      .isMobilePhone("any")
      .withMessage("Please provide a valid phone number"),
    body("timezone")
      .optional()
      .isString()
      .withMessage("Timezone must be a string"),
    body("avatarUrl")
      .optional()
      .isURL()
      .withMessage("Avatar URL must be a valid URL"),
  ],

  listUsers: [
    query("userType")
      .optional()
      .isIn(Object.values(UserType))
      .withMessage("User type must be employee, expert, or admin"),
    query("status")
      .optional()
      .isIn(["active", "inactive", "suspended", "pending_verification"])
      .withMessage("Invalid user status"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search term must be less than 100 characters"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset must be a non-negative integer"),
    query("sortBy")
      .optional()
      .isIn(["created_at", "updated_at", "last_login_at", "email"])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["ASC", "DESC"])
      .withMessage("Sort order must be ASC or DESC"),
  ],
};

export const mentorshipValidation = {
  createRequest: [
    body("title")
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Title must be between 5 and 255 characters"),
    body("description")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be between 10 and 2000 characters"),
    body("preferredExpertise")
      .optional()
      .isArray()
      .withMessage("Preferred expertise must be an array"),
    body("budgetMin")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum budget must be a positive number"),
    body("budgetMax")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum budget must be a positive number"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
    body("sessionFrequency")
      .optional()
      .isIn(["weekly", "bi-weekly", "monthly"])
      .withMessage("Session frequency must be weekly, bi-weekly, or monthly"),
    body("metricsToTrack")
      .optional()
      .isArray()
      .withMessage("Metrics to track must be an array"),
  ],

  updateRequest: [
    param("id").isUUID().withMessage("Request ID must be a valid UUID"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Title must be between 5 and 255 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be between 10 and 2000 characters"),
    body("status")
      .optional()
      .isIn([
        "draft",
        "submitted",
        "matched",
        "active",
        "completed",
        "cancelled",
      ])
      .withMessage("Invalid status"),
  ],

  getRequest: [
    param("id").isUUID().withMessage("Request ID must be a valid UUID"),
  ],

  listRequests: [
    query("status")
      .optional()
      .isIn([
        "draft",
        "submitted",
        "matched",
        "active",
        "completed",
        "cancelled",
      ])
      .withMessage("Invalid status"),
    query("companyId")
      .optional()
      .isUUID()
      .withMessage("Company ID must be a valid UUID"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search term must be less than 100 characters"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset must be a non-negative integer"),
  ],
};
