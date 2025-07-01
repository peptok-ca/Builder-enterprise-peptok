// Enhanced Team Invitation Management Service
// Handles invitation creation, tracking, and acceptance

import { toast } from "sonner";
import { emailService } from "./email";
import { apiEnhanced } from "./apiEnhanced";
import { databaseConfig } from "./databaseConfig";

export interface TeamInvitation {
  id: string;
  token: string;
  email: string;
  name?: string;
  programId: string;
  programTitle: string;
  companyId: string;
  companyName: string;
  inviterName: string;
  inviterEmail: string;
  role: "participant" | "observer";
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  lastReminderSent?: string;
  metadata?: {
    programDescription?: string;
    sessionCount?: number;
    duration?: string;
    startDate?: string;
    endDate?: string;
  };
}

export interface AcceptInvitationData {
  firstName: string;
  lastName: string;
  password: string;
  acceptTerms: boolean;
}

class InvitationService {
  constructor() {
    // Ensure database connection on service initialization
    this.verifyDatabaseConnection();
  }

  /**
   * Verify database connection before operations
   */
  private async verifyDatabaseConnection(): Promise<void> {
    if (!databaseConfig.isDatabaseReady()) {
      console.log("🗃️ Database not ready, testing connection...");
      await databaseConfig.refreshDatabaseConnection();

      if (!databaseConfig.isDatabaseReady()) {
        toast.error("❌ Backend database unavailable", {
          description: "All invitation operations require database connection",
          duration: 8000,
        });
        throw new Error(
          "Backend database connection required for invitation operations",
        );
      }
    }
  }

  /**
   * Create a new team member invitation - Backend Database Only
   */
  async createInvitation(data: {
    email: string;
    name?: string;
    programId: string;
    programTitle: string;
    companyId: string;
    companyName: string;
    inviterName: string;
    inviterEmail: string;
    role: "participant" | "observer";
    metadata?: TeamInvitation["metadata"];
  }): Promise<TeamInvitation> {
    try {
      console.log("🗃️ Creating invitation in backend database only");

      // Use backend API for invitation creation - NO localStorage fallback
      const invitation = await apiEnhanced.createTeamInvitation({
        email: data.email.toLowerCase(),
        name: data.name,
        programId: data.programId,
        programTitle: data.programTitle,
        companyId: data.companyId,
        companyName: data.companyName,
        inviterName: data.inviterName,
        inviterEmail: data.inviterEmail,
        role: data.role,
        metadata: data.metadata,
      });

      // Verify invitation was saved to database
      if (!invitation.id || invitation.id.includes("temp_")) {
        throw new Error("Invitation not properly saved to backend database");
      }

      console.log(`✅ Invitation ${invitation.id} saved to backend database`);

      // Send invitation email
      const invitationLink = `${window.location.origin}/invitation/accept?token=${invitation.token}`;

      const emailData = {
        inviterName: data.inviterName,
        companyName: data.companyName,
        role: data.role,
        invitationLink,
        expiresAt: new Date(invitation.expiresAt),
        programTitle: data.programTitle,
        programDescription: data.metadata?.programDescription,
      };

      await emailService.sendTeamInvitation(data.email, emailData);

      return invitation;
    } catch (error) {
      console.error(
        "❌ Failed to create invitation in backend database:",
        error,
      );
      throw new Error(
        `Failed to create team invitation in backend database: ${error.message}`,
      );
    }
  }

  /**
   * Get invitation by token - Backend Database Only
   */
  async getInvitationByToken(token: string): Promise<TeamInvitation | null> {
    try {
      console.log("🗃️ Looking up invitation by token in backend database");

      // Use backend API to get invitation by token - NO localStorage
      const backendEndpoints = [
        `/api/team/invitations/token/${encodeURIComponent(token)}`,
        `/api/invitations/token/${encodeURIComponent(token)}`,
        `/team/invitations/by-token?token=${encodeURIComponent(token)}`,
      ];

      let invitation: TeamInvitation | null = null;

      for (const endpoint of backendEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Database-Read": "required",
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.id && !data.data.id.includes("temp_")) {
              invitation = data.data;
              console.log(
                `✅ Found invitation ${invitation.id} in backend database`,
              );
              break;
            }
          }
        } catch (error) {
          console.warn(`Backend endpoint ${endpoint} failed:`, error);
          continue;
        }
      }

      if (!invitation) {
        console.log("❌ Invitation not found in backend database");
        return null;
      }

      // Check if expired and update in database
      if (new Date() > new Date(invitation.expiresAt)) {
        console.log("⏰ Invitation expired, updating status in database");
        invitation.status = "expired";
        await this.updateInvitationStatusInDatabase(invitation.id, "expired");
      }

      return invitation;
    } catch (error) {
      console.error(
        "❌ Failed to get invitation from backend database:",
        error,
      );
      return null;
    }
  }

  /**
   * Update invitation status in backend database
   */
  private async updateInvitationStatusInDatabase(
    invitationId: string,
    status: TeamInvitation["status"],
    updates?: Partial<TeamInvitation>,
  ): Promise<void> {
    const backendEndpoints = [
      `/api/team/invitations/${invitationId}`,
      `/api/invitations/${invitationId}`,
      `/team/invitations/${invitationId}`,
    ];

    for (const endpoint of backendEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Database-Write": "required",
          },
          body: JSON.stringify({
            status,
            ...updates,
            updatedAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          console.log(
            `✅ Updated invitation ${invitationId} status to ${status} in database`,
          );
          return;
        }
      } catch (error) {
        console.warn(`Failed to update status via ${endpoint}:`, error);
        continue;
      }
    }

    throw new Error(`Failed to update invitation status in backend database`);
  }

  /**
   * Accept an invitation
   */
  async acceptInvitation(
    token: string,
    acceptanceData: AcceptInvitationData,
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Use backend API for invitation acceptance
      const result = await apiEnhanced.acceptTeamInvitation(
        token,
        acceptanceData,
      );

      if (result.success && result.user) {
        // Store user in localStorage for frontend state management
        this.storeNewUser(result.user);
      }

      return result;
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      return {
        success: false,
        error: "Failed to process invitation acceptance",
      };
    }
  }

  /**
   * Decline an invitation
   */
  async declineInvitation(token: string): Promise<boolean> {
    try {
      const invitation = await this.getInvitationByToken(token);

      if (!invitation) return false;

      await this.updateInvitationStatus(invitation.id, "declined", {
        declinedAt: new Date().toISOString(),
      });

      // Remove from pending invitations
      this.removePendingInvitation(invitation.email, invitation.id);

      return true;
    } catch (error) {
      console.error("Failed to decline invitation:", error);
      return false;
    }
  }

  /**
   * Get pending invitations for a user by email
   */
  async getPendingInvitations(email: string): Promise<TeamInvitation[]> {
    try {
      // Use backend API for pending invitations
      const invitations = await apiEnhanced.getPendingInvitations(email);
      return invitations;
    } catch (error) {
      console.error("Failed to get pending invitations:", error);
      return [];
    }
  }

  /**
   * Resend invitation - Backend Database Only
   */
  async resendInvitation(invitationId: string): Promise<boolean> {
    try {
      console.log(
        `🗃️ Resending invitation ${invitationId} via backend database`,
      );

      // Use backend API for resending invitations - NO localStorage
      const success = await apiEnhanced.resendTeamInvitation(invitationId);

      if (success) {
        // Get updated invitation from backend database to send email
        const invitation = await this.getInvitationFromDatabase(invitationId);

        if (invitation) {
          const invitationLink = `${window.location.origin}/invitation/accept?token=${invitation.token}`;

          const emailData = {
            inviterName: invitation.inviterName,
            companyName: invitation.companyName,
            role: invitation.role,
            invitationLink,
            expiresAt: new Date(invitation.expiresAt),
            programTitle: invitation.programTitle,
            programDescription: invitation.metadata?.programDescription,
          };

          await emailService.sendTeamInvitation(invitation.email, emailData);
          console.log(`✅ Resent invitation ${invitationId} and sent email`);
        } else {
          console.warn(
            `⚠️ Could not retrieve invitation ${invitationId} from database for email`,
          );
        }
      }

      return success;
    } catch (error) {
      console.error(
        "❌ Failed to resend invitation via backend database:",
        error,
      );
      return false;
    }
  }

  /**
   * Get invitation from backend database by ID
   */
  private async getInvitationFromDatabase(
    invitationId: string,
  ): Promise<TeamInvitation | null> {
    const backendEndpoints = [
      `/api/team/invitations/${invitationId}`,
      `/api/invitations/${invitationId}`,
      `/team/invitations/${invitationId}`,
    ];

    for (const endpoint of backendEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Database-Read": "required",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.id && !data.data.id.includes("temp_")) {
            return data.data;
          }
        }
      } catch (error) {
        console.warn(`Failed to get invitation from ${endpoint}:`, error);
        continue;
      }
    }

    return null;
  }

  /**
   * Get all invitations for a program or company - Backend Database Only
   */
  async getInvitations(filters?: {
    programId?: string;
    companyId?: string;
    status?: TeamInvitation["status"];
  }): Promise<TeamInvitation[]> {
    try {
      console.log("🗃️ Loading invitations from backend database", filters);

      // Use backend API for getting invitations - NO localStorage fallback
      const invitations = await apiEnhanced.getTeamInvitations(filters);

      // Verify we got database data
      const validInvitations = invitations.filter(
        (inv) => inv.id && !inv.id.includes("temp_"),
      );

      if (validInvitations.length !== invitations.length) {
        console.warn("⚠️ Some invitations appear to be temporary/mock data");
      }

      console.log(
        `✅ Loaded ${validInvitations.length} invitations from backend database`,
      );

      return validInvitations.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      console.error(
        "❌ Failed to get invitations from backend database:",
        error,
      );
      throw new Error(
        `Failed to load invitations from backend database: ${error.message}`,
      );
    }
  }

  // Backend Database Only - No localStorage Methods

  /**
   * Store new user in backend database (called during invitation acceptance)
   */
  private async storeNewUser(user: any): Promise<void> {
    try {
      console.log("🗃️ Storing new user in backend database");

      const backendEndpoints = ["/api/users", "/api/team-members", "/users"];

      for (const endpoint of backendEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Database-Write": "required",
            },
            body: JSON.stringify({
              ...user,
              createdViaInvitation: true,
              requiresDatabaseStorage: true,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data?.id && !data.data.id.includes("temp_")) {
              console.log(`✅ User ${data.data.id} stored in backend database`);
              return;
            }
          }
        } catch (error) {
          console.warn(`Failed to store user via ${endpoint}:`, error);
          continue;
        }
      }

      throw new Error("Failed to store user in backend database");
    } catch (error) {
      console.error("❌ Failed to store new user in backend database:", error);
      throw error;
    }
  }
}

export const invitationService = new InvitationService();
