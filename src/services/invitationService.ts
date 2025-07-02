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
    // Ensure database connection on service initialization if API is configured
    this.verifyDatabaseConnection().catch(() => {
      console.log(
        "🗃️ Database verification failed - will use fallback methods",
      );
    });
  }

  /**
   * Verify database connection before operations
   */
  private async verifyDatabaseConnection(): Promise<void> {
    if (!this.isApiConfigured()) {
      console.log(
        "🗃️ Database service not configured - using mock/localStorage mode",
      );
      return; // Don't throw error, just log
    }

    if (!databaseConfig.isDatabaseReady()) {
      console.log("🗃️ Database not ready, testing connection...");
      await databaseConfig.refreshDatabaseConnection();

      if (!databaseConfig.isDatabaseReady()) {
        console.warn(
          "❌ Backend database unavailable - falling back to localStorage",
        );
        // Don't throw error in production, just warn
        if (this.isLocalDevelopment()) {
          toast.warning("❌ Backend database unavailable", {
            description: "Using localStorage fallback",
            duration: 3000,
          });
        }
      }
    }
  }

  private isApiConfigured(): boolean {
    const envApiUrl = import.meta.env.VITE_API_URL;
    const isLocalDev = this.isLocalDevelopment();

    // In production, require explicit API URL
    if (!isLocalDev) {
      return !!envApiUrl;
    }

    // In local development, allow if API URL is set
    return !!envApiUrl;
  }

  private isLocalDevelopment(): boolean {
    const hostname = window.location.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0"
    );
  }

  /**
   * Create a new team member invitation - Backend Database with localStorage fallback
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
    // If API is not configured, use localStorage immediately
    if (!this.isApiConfigured()) {
      return this.createInvitationInLocalStorage(data);
    }

    try {
      console.log("🗃️ Creating invitation in backend database");

      // Verify database connection (but don't throw on failure)
      await this.verifyDatabaseConnection();

      // Try backend API first
      if (databaseConfig.isDatabaseReady()) {
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
        if (invitation.id && !invitation.id.includes("temp_")) {
          console.log(
            `✅ Invitation ${invitation.id} saved to backend database`,
          );

          // Send invitation email
          await this.sendInvitationEmail(invitation, data);
          return invitation;
        }
      }

      // Fall back to localStorage if backend failed
      console.log(
        "⚠️ Backend unavailable, creating invitation in localStorage",
      );
      return this.createInvitationInLocalStorage(data);
    } catch (error) {
      console.warn(
        "❌ Failed to create invitation in backend, using localStorage:",
        error,
      );
      return this.createInvitationInLocalStorage(data);
    }
  }

  private async createInvitationInLocalStorage(
    data: any,
  ): Promise<TeamInvitation> {
    const invitation: TeamInvitation = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email.toLowerCase(),
      name: data.name,
      programId: data.programId,
      programTitle: data.programTitle,
      companyId: data.companyId,
      companyName: data.companyName,
      inviterName: data.inviterName,
      inviterEmail: data.inviterEmail,
      role: data.role,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      metadata: data.metadata,
    };

    // Store in localStorage
    const existingInvitations = this.getInvitationsFromLocalStorage();
    existingInvitations.push(invitation);
    localStorage.setItem(
      "team_invitations",
      JSON.stringify(existingInvitations),
    );

    console.log(`✅ Invitation ${invitation.id} saved to localStorage`);

    // Try to send email
    try {
      await this.sendInvitationEmail(invitation, data);
    } catch (error) {
      console.warn("Failed to send invitation email:", error);
    }

    return invitation;
  }

  private async sendInvitationEmail(
    invitation: TeamInvitation,
    data: any,
  ): Promise<void> {
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

    await emailService.sendTeamInvitation(invitation.email, emailData);
  }

  private getInvitationsFromLocalStorage(): TeamInvitation[] {
    try {
      const stored = localStorage.getItem("team_invitations");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get invitation by token - Backend Database with localStorage fallback
   */
  async getInvitationByToken(token: string): Promise<TeamInvitation | null> {
    // If API is not configured, use localStorage immediately
    if (!this.isApiConfigured()) {
      return this.getInvitationByTokenFromLocalStorage(token);
    }

    try {
      console.log("🗃️ Looking up invitation by token in backend database");

      // Try backend first if available
      if (databaseConfig.isDatabaseReady()) {
        const backendEndpoints = [
          `/api/team/invitations/token/${encodeURIComponent(token)}`,
          `/api/invitations/token/${encodeURIComponent(token)}`,
          `/team/invitations/by-token?token=${encodeURIComponent(token)}`,
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
              if (
                data.data &&
                data.data.id &&
                !data.data.id.includes("temp_")
              ) {
                const invitation = data.data;
                console.log(
                  `✅ Found invitation ${invitation.id} in backend database`,
                );

                // Check if expired and update in database
                if (new Date() > new Date(invitation.expiresAt)) {
                  console.log(
                    "⏰ Invitation expired, updating status in database",
                  );
                  invitation.status = "expired";
                  await this.updateInvitationStatusInDatabase(
                    invitation.id,
                    "expired",
                  );
                }

                return invitation;
              }
            }
          } catch (error) {
            console.warn(`Backend endpoint ${endpoint} failed:`, error);
            continue;
          }
        }
      }

      // Fall back to localStorage
      console.log("⚠️ Backend unavailable, checking localStorage");
      return this.getInvitationByTokenFromLocalStorage(token);
    } catch (error) {
      console.warn(
        "❌ Failed to get invitation from backend, using localStorage:",
        error,
      );
      return this.getInvitationByTokenFromLocalStorage(token);
    }
  }

  private getInvitationByTokenFromLocalStorage(
    token: string,
  ): TeamInvitation | null {
    try {
      const invitations = this.getInvitationsFromLocalStorage();
      const invitation = invitations.find((inv) => inv.token === token);

      if (!invitation) {
        console.log("❌ Invitation not found in localStorage");
        return null;
      }

      // Check if expired
      if (new Date() > new Date(invitation.expiresAt)) {
        console.log("⏰ Invitation expired");
        invitation.status = "expired";
        // Update in localStorage
        const updatedInvitations = invitations.map((inv) =>
          inv.id === invitation.id ? invitation : inv,
        );
        localStorage.setItem(
          "team_invitations",
          JSON.stringify(updatedInvitations),
        );
      }

      console.log(`✅ Found invitation ${invitation.id} in localStorage`);
      return invitation;
    } catch (error) {
      console.error("Failed to get invitation from localStorage:", error);
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
   * Update invitation status
   */
  private async updateInvitationStatus(
    invitationId: string,
    status: TeamInvitation["status"],
    updates?: Partial<TeamInvitation>,
  ): Promise<void> {
    // Try backend first if configured
    if (this.isApiConfigured() && databaseConfig.isDatabaseReady()) {
      try {
        await this.updateInvitationStatusInDatabase(
          invitationId,
          status,
          updates,
        );
        return;
      } catch (error) {
        console.warn(
          "Failed to update status in backend, using localStorage:",
          error,
        );
      }
    }

    // Fall back to localStorage
    try {
      const invitations = this.getInvitationsFromLocalStorage();
      const updatedInvitations = invitations.map((inv) =>
        inv.id === invitationId
          ? { ...inv, status, ...updates, updatedAt: new Date().toISOString() }
          : inv,
      );
      localStorage.setItem(
        "team_invitations",
        JSON.stringify(updatedInvitations),
      );
      console.log(
        `✅ Updated invitation ${invitationId} status to ${status} in localStorage`,
      );
    } catch (error) {
      console.error(
        "Failed to update invitation status in localStorage:",
        error,
      );
    }
  }

  /**
   * Accept an invitation
   */
  async acceptInvitation(
    token: string,
    acceptanceData: AcceptInvitationData,
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Try backend API first if available
      if (this.isApiConfigured() && databaseConfig.isDatabaseReady()) {
        const result = await apiEnhanced.acceptTeamInvitation(
          token,
          acceptanceData,
        );

        if (result.success && result.user) {
          // Store user in localStorage for frontend state management
          this.storeNewUser(result.user);
        }

        return result;
      }

      // Fall back to localStorage handling
      return this.acceptInvitationInLocalStorage(token, acceptanceData);
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      return {
        success: false,
        error: "Failed to process invitation acceptance",
      };
    }
  }

  private async acceptInvitationInLocalStorage(
    token: string,
    acceptanceData: AcceptInvitationData,
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const invitation = await this.getInvitationByToken(token);

      if (!invitation) {
        return { success: false, error: "Invitation not found" };
      }

      if (invitation.status !== "pending") {
        return { success: false, error: "Invitation is no longer valid" };
      }

      if (new Date() > new Date(invitation.expiresAt)) {
        return { success: false, error: "Invitation has expired" };
      }

      // Create user object
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: invitation.email,
        firstName: acceptanceData.firstName,
        lastName: acceptanceData.lastName,
        name: `${acceptanceData.firstName} ${acceptanceData.lastName}`,
        role: "team_member",
        companyId: invitation.companyId,
        programId: invitation.programId,
        createdAt: new Date().toISOString(),
        acceptedInvitationId: invitation.id,
      };

      // Update invitation status
      await this.updateInvitationStatus(invitation.id, "accepted", {
        acceptedAt: new Date().toISOString(),
      });

      // Store user
      this.storeUserInLocalStorage(user);

      console.log(`✅ Invitation ${invitation.id} accepted in localStorage`);
      return { success: true, user };
    } catch (error) {
      console.error("Failed to accept invitation in localStorage:", error);
      return {
        success: false,
        error: "Failed to process invitation acceptance",
      };
    }
  }

  private storeUserInLocalStorage(user: any): void {
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      existingUsers.push(user);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      console.log(`✅ User ${user.id} stored in localStorage`);
    } catch (error) {
      console.error("Failed to store user in localStorage:", error);
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
