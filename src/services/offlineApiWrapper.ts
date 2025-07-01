// Offline API Wrapper
// Provides offline-enabled versions of API operations with automatic queuing

import { offlineSync, SyncOperation } from "./offlineSync";
import { apiEnhanced } from "./apiEnhanced";
import { databaseValidation } from "./databaseValidation";

interface OfflineApiOptions {
  priority?: "high" | "medium" | "low";
  maxRetries?: number;
  cacheKey?: string;
  conflictStrategy?: "server-wins" | "client-wins" | "merge";
}

class OfflineApiWrapper {
  /**
   * Create mentorship request with offline support
   */
  async createMentorshipRequest(
    requestData: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "CREATE",
      endpoint: "/api/mentorship-requests",
      method: "POST",
      data: requestData,
      priority: options.priority || "high",
      maxRetries: options.maxRetries || 5,
      entityType: "mentorship_request",
    };

    return offlineSync.executeWithOfflineSupport(
      () => apiEnhanced.createMentorshipRequest(requestData),
      { ...requestData, id: `temp_${Date.now()}`, status: "pending" },
      syncOperation,
    );
  }

  /**
   * Update mentorship request with offline support
   */
  async updateMentorshipRequest(
    requestId: string,
    updates: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "UPDATE",
      endpoint: `/api/mentorship-requests/${requestId}`,
      method: "PUT",
      data: updates,
      priority: options.priority || "medium",
      maxRetries: options.maxRetries || 5,
      entityType: "mentorship_request",
      entityId: requestId,
    };

    return offlineSync.executeWithOfflineSupport(
      () => apiEnhanced.updateMentorshipRequest(requestId, updates),
      { id: requestId, ...updates, updatedAt: new Date().toISOString() },
      syncOperation,
    );
  }

  /**
   * Create team invitation with offline support
   */
  async createTeamInvitation(
    invitationData: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "CREATE",
      endpoint: "/api/team/invitations",
      method: "POST",
      data: invitationData,
      priority: options.priority || "high",
      maxRetries: options.maxRetries || 5,
      entityType: "team_invitation",
    };

    const fallbackInvitation = {
      id: `temp_inv_${Date.now()}`,
      ...invitationData,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      // Execute with database validation
      const result = await offlineSync.executeWithOfflineSupport(
        () => apiEnhanced.createTeamInvitation(invitationData),
        fallbackInvitation,
        syncOperation,
      );

      // Validate that the invitation was actually saved to the backend database
      if (result.id && !result.id.includes("temp_")) {
        setTimeout(async () => {
          const validation = await databaseValidation.validateInvitationStorage(
            result.id,
            invitationData,
          );
          databaseValidation.showValidationResults(
            "Team invitation",
            validation,
          );
        }, 2000); // Validate after 2 seconds to allow for database write
      }

      return result;
    } catch (error) {
      console.error("Team invitation creation failed:", error);
      throw error;
    }
  }

  /**
   * Resend team invitation with offline support
   */
  async resendTeamInvitation(
    invitationId: string,
    options: OfflineApiOptions = {},
  ): Promise<boolean> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "UPDATE",
      endpoint: `/api/team/invitations/${invitationId}/resend`,
      method: "POST",
      data: {},
      priority: options.priority || "medium",
      maxRetries: options.maxRetries || 3,
      entityType: "team_invitation",
      entityId: invitationId,
    };

    try {
      // Execute with database validation
      const result = await offlineSync.executeWithOfflineSupport(
        () => apiEnhanced.resendTeamInvitation(invitationId),
        true, // Optimistically return success
        syncOperation,
      );

      // Validate that the resend was actually saved to the backend database
      if (result) {
        // Store the resend timestamp before the operation
        const resendTimestamp = new Date().toISOString();

        setTimeout(async () => {
          try {
            const validation = await databaseValidation.validateResendStorage(
              invitationId,
              resendTimestamp,
            );

            // Only show validation results if there are actual errors (not warnings)
            if (validation.errors.length > 0) {
              databaseValidation.showValidationResults(
                "Invitation resend",
                validation,
              );
            } else if (validation.isValid) {
              console.log(
                `✅ Resend validation passed for invitation ${invitationId}`,
              );
            } else if (validation.warnings.length > 0) {
              console.warn(
                `⚠️ Resend validation warnings for invitation ${invitationId}:`,
                validation.warnings,
              );
            }
          } catch (error) {
            console.warn(
              `Resend validation failed for ${invitationId}:`,
              error.message,
            );
            // Don't show error to user as the resend operation itself succeeded
          }
        }, 3000); // Increased to 3 seconds to allow for database write
      }

      return result;
    } catch (error) {
      console.error("Team invitation resend failed:", error);
      throw error;
    }
  }

  /**
   * Accept team invitation with offline support
   */
  async acceptTeamInvitation(
    token: string,
    acceptanceData: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "UPDATE",
      endpoint: "/api/team/invitations/accept",
      method: "POST",
      data: { token, ...acceptanceData },
      priority: options.priority || "high",
      maxRetries: options.maxRetries || 5,
      entityType: "team_invitation",
    };

    try {
      // Execute with database validation
      const result = await offlineSync.executeWithOfflineSupport(
        () => apiEnhanced.acceptTeamInvitation(token, acceptanceData),
        { success: false, error: "Offline - will process when reconnected" },
        syncOperation,
      );

      // Validate that the acceptance was actually saved to the backend database
      if (result.success && result.user?.email) {
        setTimeout(async () => {
          const validation = await databaseValidation.validateAcceptanceStorage(
            token,
            result.user.email,
          );
          databaseValidation.showValidationResults(
            "Invitation acceptance",
            validation,
          );
        }, 2000); // Validate after 2 seconds to allow for database write
      }

      return result;
    } catch (error) {
      console.error("Team invitation acceptance failed:", error);
      throw error;
    }
  }

  /**
   * Create session with offline support
   */
  async createSession(
    sessionData: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "CREATE",
      endpoint: "/api/sessions",
      method: "POST",
      data: sessionData,
      priority: options.priority || "high",
      maxRetries: options.maxRetries || 5,
      entityType: "session",
    };

    const fallbackSession = {
      id: `temp_session_${Date.now()}`,
      ...sessionData,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    return offlineSync.executeWithOfflineSupport(
      () => apiEnhanced.createSession(sessionData),
      fallbackSession,
      syncOperation,
    );
  }

  /**
   * Update session with offline support
   */
  async updateSession(
    sessionId: string,
    updates: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "UPDATE",
      endpoint: `/api/sessions/${sessionId}`,
      method: "PUT",
      data: updates,
      priority: options.priority || "medium",
      maxRetries: options.maxRetries || 5,
      entityType: "session",
      entityId: sessionId,
    };

    return offlineSync.executeWithOfflineSupport(
      () => apiEnhanced.updateSession(sessionId, updates),
      { id: sessionId, ...updates, updatedAt: new Date().toISOString() },
      syncOperation,
    );
  }

  /**
   * Update user profile with offline support
   */
  async updateUserProfile(
    userId: string,
    profileData: any,
    options: OfflineApiOptions = {},
  ): Promise<any> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "UPDATE",
      endpoint: `/api/users/${userId}/profile`,
      method: "PUT",
      data: profileData,
      priority: options.priority || "low",
      maxRetries: options.maxRetries || 3,
      entityType: "user_profile",
      entityId: userId,
    };

    return offlineSync.executeWithOfflineSupport(
      () => apiEnhanced.updateUserProfile(userId, profileData),
      { id: userId, ...profileData, updatedAt: new Date().toISOString() },
      syncOperation,
    );
  }

  /**
   * Delete operation with offline support
   */
  async deleteEntity(
    entityType: string,
    entityId: string,
    endpoint: string,
    options: OfflineApiOptions = {},
  ): Promise<boolean> {
    const syncOperation: Omit<
      SyncOperation,
      "id" | "timestamp" | "retryCount"
    > = {
      type: "DELETE",
      endpoint,
      method: "DELETE",
      data: {},
      priority: options.priority || "medium",
      maxRetries: options.maxRetries || 3,
      entityType,
      entityId,
    };

    return offlineSync.executeWithOfflineSupport(
      () => fetch(endpoint, { method: "DELETE" }).then((r) => r.ok),
      true, // Optimistically return success
      syncOperation,
    );
  }

  /**
   * Batch operation with offline support
   */
  async batchOperation(
    operations: Array<{
      type: "CREATE" | "UPDATE" | "DELETE";
      endpoint: string;
      method: string;
      data?: any;
      entityType: string;
      entityId?: string;
    }>,
    options: OfflineApiOptions = {},
  ): Promise<any[]> {
    const results: any[] = [];

    for (const op of operations) {
      const syncOperation: Omit<
        SyncOperation,
        "id" | "timestamp" | "retryCount"
      > = {
        ...op,
        priority: options.priority || "medium",
        maxRetries: options.maxRetries || 3,
      };

      try {
        const result = await offlineSync.executeWithOfflineSupport(
          () => {
            const requestOptions: RequestInit = {
              method: op.method,
              headers: { "Content-Type": "application/json" },
            };

            if (op.data && op.method !== "DELETE") {
              requestOptions.body = JSON.stringify(op.data);
            }

            return fetch(op.endpoint, requestOptions).then((r) => r.json());
          },
          { success: true, offline: true },
          syncOperation,
        );

        results.push(result);
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get cached data for offline usage
   */
  getCachedData(key: string): any {
    return offlineSync.getOfflineData(key);
  }

  /**
   * Save data for offline usage
   */
  saveForOffline(key: string, data: any): void {
    offlineSync.saveOfflineData(key, data);
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return offlineSync.getStatus();
  }

  /**
   * Trigger manual sync
   */
  async triggerSync(): Promise<void> {
    return offlineSync.triggerSync();
  }

  /**
   * Subscribe to sync status changes
   */
  onSyncStatusChange(callback: (status: any) => void): () => void {
    return offlineSync.onStatusChange(callback);
  }

  /**
   * Create optimistic update
   */
  createOptimisticUpdate<T>(
    originalData: T,
    updates: Partial<T>,
    operation: Omit<SyncOperation, "id" | "timestamp" | "retryCount">,
  ): T {
    // Apply updates optimistically
    const optimisticData = { ...originalData, ...updates };

    // Queue for sync
    offlineSync.queueOperation(operation);

    return optimisticData;
  }

  /**
   * Revert optimistic update
   */
  revertOptimisticUpdate(operationId: string): void {
    // This would be implemented based on your specific undo/redo logic
    console.log("Reverting optimistic update:", operationId);
  }
}

// Export singleton instance
export const offlineApi = new OfflineApiWrapper();
export default offlineApi;
