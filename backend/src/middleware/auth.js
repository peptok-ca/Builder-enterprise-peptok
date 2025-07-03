import { logger } from "../config/logger.js";

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

      // Mock token verification
      const decoded = {
        id: "user_1",
        email: "user@example.com",
        role: "company_admin",
      };

      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      logger.error("Authentication error:", error);
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
  };
}

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

export function optionalAuth() {
  return (req, res, next) => {
    try {
      const token = extractToken(req);
      if (token) {
        req.user = {
          id: "user_1",
          email: "user@example.com",
          role: "company_admin",
        };
      }
      next();
    } catch (error) {
      next();
    }
  };
}
