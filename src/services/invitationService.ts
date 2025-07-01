// Enhanced Team Invitation Management Service
// Handles invitation creation, tracking, and acceptance

import { toast } from "sonner";
import { emailService } from "./email";

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
  private readonly STORAGE_KEY = "peptok_team_invitations";
  private readonly PENDING_INVITATIONS_KEY = "peptok_pending_invitations";

  /**
   * Create a new team member invitation
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
      const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const token = this.generateInvitationToken(data.email, invitationId);

      const invitation: TeamInvitation = {
        id: invitationId,
        token,
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

      // Store invitation
      await this.storeInvitation(invitation);

      // Send invitation email
      const invitationLink = `${window.location.origin}/invitation/accept?token=${token}`;

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

      // Track for the invited user
      this.addPendingInvitation(data.email, invitation);

      return invitation;
    } catch (error) {
      console.error("Failed to create invitation:", error);
      throw new Error("Failed to create team invitation");
    }
  }

  /**
   * Get invitation by token
   */
  async getInvitationByToken(token: string): Promise<TeamInvitation | null> {
    try {
      const invitations = this.getAllInvitations();
      const invitation = invitations.find((inv) => inv.token === token);

      if (!invitation) return null;

      // Check if expired
      if (new Date() > new Date(invitation.expiresAt)) {
        invitation.status = "expired";
        await this.updateInvitationStatus(invitation.id, "expired");
      }

      return invitation;
    } catch (error) {
      console.error("Failed to get invitation:", error);
      return null;
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
      const invitation = await this.getInvitationByToken(token);

      if (!invitation) {
        return { success: false, error: "Invalid invitation token" };
      }

      if (invitation.status !== "pending") {
        return { success: false, error: `Invitation is ${invitation.status}` };
      }

      if (new Date() > new Date(invitation.expiresAt)) {
        return { success: false, error: "Invitation has expired" };
      }

      // Create user account (in real app, this would call the backend)
      const user = {
        id: `user_${Date.now()}`,
        email: invitation.email,
        name: `${acceptanceData.firstName} ${acceptanceData.lastName}`,
        firstName: acceptanceData.firstName,
        lastName: acceptanceData.lastName,
        userType: "team_member" as const,
        companyId: invitation.companyId,
        companyName: invitation.companyName,
        role: invitation.role,
        programId: invitation.programId,
        programTitle: invitation.programTitle,
        invitedBy: invitation.inviterName,
        joinedAt: new Date().toISOString(),
        isAuthenticated: true,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${acceptanceData.firstName}`,
        provider: "invitation",
        status: "active",
      };

      // Update invitation status
      await this.updateInvitationStatus(invitation.id, "accepted", {
        acceptedAt: new Date().toISOString(),
      });

      // Remove from pending invitations
      this.removePendingInvitation(invitation.email, invitation.id);

      // Store user in localStorage (simulate account creation)
      this.storeNewUser(user);

      return { success: true, user };
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
  getPendingInvitations(email: string): TeamInvitation[] {
    try {
      const pendingInvitations = localStorage.getItem(
        this.PENDING_INVITATIONS_KEY,
      );
      if (!pendingInvitations) return [];

      const invitations: Record<string, TeamInvitation[]> =
        JSON.parse(pendingInvitations);
      const userInvitations = invitations[email.toLowerCase()] || [];

      // Filter out expired invitations
      const now = new Date();
      return userInvitations.filter((inv) => new Date(inv.expiresAt) > now);
    } catch (error) {
      console.error("Failed to get pending invitations:", error);
      return [];
    }
  }

  /**
   * Resend invitation
   */
  async resendInvitation(invitationId: string): Promise<boolean> {
    try {
      const invitations = this.getAllInvitations();
      const invitation = invitations.find((inv) => inv.id === invitationId);

      if (!invitation || invitation.status !== "pending") {
        return false;
      }

      // Update expiry and resend
      invitation.expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      invitation.lastReminderSent = new Date().toISOString();

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
      await this.storeInvitation(invitation);

      return true;
    } catch (error) {
      console.error("Failed to resend invitation:", error);
      return false;
    }
  }

  /**
   * Get all invitations for a program or company
   */
  getInvitations(filters?: {
    programId?: string;
    companyId?: string;
    status?: TeamInvitation["status"];
  }): TeamInvitation[] {
    try {
      let invitations = this.getAllInvitations();

      if (filters?.programId) {
        invitations = invitations.filter(
          (inv) => inv.programId === filters.programId,
        );
      }
      if (filters?.companyId) {
        invitations = invitations.filter(
          (inv) => inv.companyId === filters.companyId,
        );
      }
      if (filters?.status) {
        invitations = invitations.filter(
          (inv) => inv.status === filters.status,
        );
      }

      return invitations.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      console.error("Failed to get invitations:", error);
      return [];
    }
  }

  // Private helper methods
  private generateInvitationToken(email: string, invitationId: string): string {
    const data = `${email}:${invitationId}:${Date.now()}`;
    return btoa(data);
  }

  private getAllInvitations(): TeamInvitation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private async storeInvitation(invitation: TeamInvitation): Promise<void> {
    try {
      const invitations = this.getAllInvitations();
      const existingIndex = invitations.findIndex(
        (inv) => inv.id === invitation.id,
      );

      if (existingIndex >= 0) {
        invitations[existingIndex] = invitation;
      } else {
        invitations.push(invitation);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(invitations));
    } catch (error) {
      console.error("Failed to store invitation:", error);
      throw error;
    }
  }

  private async updateInvitationStatus(
    invitationId: string,
    status: TeamInvitation["status"],
    updates?: Partial<TeamInvitation>,
  ): Promise<void> {
    try {
      const invitations = this.getAllInvitations();
      const invitationIndex = invitations.findIndex(
        (inv) => inv.id === invitationId,
      );

      if (invitationIndex >= 0) {
        invitations[invitationIndex] = {
          ...invitations[invitationIndex],
          status,
          ...updates,
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(invitations));
      }
    } catch (error) {
      console.error("Failed to update invitation status:", error);
      throw error;
    }
  }

  private addPendingInvitation(
    email: string,
    invitation: TeamInvitation,
  ): void {
    try {
      const pendingInvitations = localStorage.getItem(
        this.PENDING_INVITATIONS_KEY,
      );
      const invitations: Record<string, TeamInvitation[]> = pendingInvitations
        ? JSON.parse(pendingInvitations)
        : {};

      const userEmail = email.toLowerCase();
      if (!invitations[userEmail]) {
        invitations[userEmail] = [];
      }

      // Remove any existing invitation for the same program
      invitations[userEmail] = invitations[userEmail].filter(
        (inv) => inv.programId !== invitation.programId,
      );

      invitations[userEmail].push(invitation);
      localStorage.setItem(
        this.PENDING_INVITATIONS_KEY,
        JSON.stringify(invitations),
      );
    } catch (error) {
      console.error("Failed to add pending invitation:", error);
    }
  }

  private removePendingInvitation(email: string, invitationId: string): void {
    try {
      const pendingInvitations = localStorage.getItem(
        this.PENDING_INVITATIONS_KEY,
      );
      if (!pendingInvitations) return;

      const invitations: Record<string, TeamInvitation[]> =
        JSON.parse(pendingInvitations);
      const userEmail = email.toLowerCase();

      if (invitations[userEmail]) {
        invitations[userEmail] = invitations[userEmail].filter(
          (inv) => inv.id !== invitationId,
        );

        if (invitations[userEmail].length === 0) {
          delete invitations[userEmail];
        }

        localStorage.setItem(
          this.PENDING_INVITATIONS_KEY,
          JSON.stringify(invitations),
        );
      }
    } catch (error) {
      console.error("Failed to remove pending invitation:", error);
    }
  }

  private storeNewUser(user: any): void {
    try {
      // In a real app, this would be handled by the backend
      // For demo purposes, we'll store in localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem("peptok_users") || "[]",
      );
      existingUsers.push(user);
      localStorage.setItem("peptok_users", JSON.stringify(existingUsers));
    } catch (error) {
      console.error("Failed to store new user:", error);
    }
  }
}

export const invitationService = new InvitationService();
