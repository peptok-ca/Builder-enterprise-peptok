import jwt from "jsonwebtoken";
import { logger } from "../config/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

/**
 * Authentication middleware
 * @param {string[]} roles - Optional array of required roles
 * @returns {Function} Express middleware function
 */
export function authMiddleware(roles = []) {
  return (req, res, next) => {
    try {
      const token = extractToken(req);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication token required",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Check roles if specified
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      logger.error("Authentication error:", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid authentication token",
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Authentication token expired",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
  };
}

/**
 * Extract token from request headers or cookies
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null
 */
function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @returns {Function} Express middleware function
 */
export function optionalAuth() {
  return (req, res, next) => {
    try {
      const token = extractToken(req);

      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      }

      next();
    } catch (error) {
      // Ignore auth errors for optional auth
      next();
    }
  };
}

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Token expiration (default: 24h)
 * @returns {string} JWT token
 */
export function generateToken(payload, expiresIn = "24h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
