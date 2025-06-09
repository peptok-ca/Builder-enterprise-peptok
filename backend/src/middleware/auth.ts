import { Request, Response, NextFunction } from "express";
import { IAuthService } from "@/services/interfaces/IAuthService.js";
import { UserType } from "@/models/User.js";
import { logger } from "@/config/logger.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AuthMiddleware {
  constructor(private readonly authService: IAuthService) {}

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          error: "Authorization token required",
        });
        return;
      }

      const token = authHeader.replace("Bearer ", "");
      const user = await this.authService.verifyToken(token);

      req.user = user;
      next();
    } catch (error) {
      logger.error("Authentication middleware error:", error);
      res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  };

  requireRole = (allowedRoles: UserType[]) => {
    return (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction,
    ): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Authentication required",
        });
        return;
      }

      if (!allowedRoles.includes(req.user.userType)) {
        res.status(403).json({
          success: false,
          error: "Insufficient permissions",
        });
        return;
      }

      next();
    };
  };

  requireAdmin = this.requireRole([UserType.ADMIN]);
  requireExpert = this.requireRole([UserType.EXPERT]);
  requireEmployee = this.requireRole([UserType.EMPLOYEE]);
  requireAdminOrExpert = this.requireRole([UserType.ADMIN, UserType.EXPERT]);

  optional = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        try {
          const user = await this.authService.verifyToken(token);
          req.user = user;
        } catch (error) {
          // Token is invalid, but that's okay for optional auth
          logger.debug("Optional auth failed:", error.message);
        }
      }
      next();
    } catch (error) {
      logger.error("Optional auth middleware error:", error);
      next();
    }
  };
}
