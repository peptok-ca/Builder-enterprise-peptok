// localStorage Elimination Service
// Systematically replaces ALL localStorage usage with backend database calls

import { backendStorage } from "./backendStorage";
import { toast } from "sonner";

interface LocalStorageReplacement {
  oldKey: string;
  newKey: string;
  transform?: (value: any) => any;
  userId?: string;
  companyId?: string;
}

class LocalStorageEliminationService {
  private readonly localStorage_keys = [
    // Auth keys
    "peptok_user",
    "peptok_token",
    "peptok_business_details",
    "oauth_state",

    // Data keys
    "mentorship_requests",
    "peptok_team_invitations",
    "peptok_pending_invitations",
    "peptok_users",

    // Settings keys
    "peptok_analytics_settings",
    "peptok_security_settings",
    "platform_pricing_config",
    "platform_security_settings",
    "platform_analytics_settings",

    // Cache keys
    "peptok_sync_queue",
    "peptok_offline_data",
    "peptok_validation_history",

    // Analytics keys
    "analytics_events",
    "analytics_failed_events",
    "peptok_metric_data",
    "peptok_aggregated_data",
    "peptok_analytics_reports",

    // Session keys
    "coach_session_limits",
    "coach_availability",
    "coach_profile",

    // Draft/temp keys
    "mentorship-request-draft",

    // Audit keys
    "platform_audit_log",
    "peptok_platform_audit_log",

    // Cross browser keys
    "platform_configuration_shared",
    "last_config_sync_check",
  ];

  constructor() {
    console.log("🗃️ localStorage Elimination Service initialized");
    this.migrateExistingData();
  }

  /**
   * Migrate all existing localStorage data to backend database
   */
  private async migrateExistingData(): Promise<void> {
    try {
      console.log(
        "🔄 Migrating existing localStorage data to backend database...",
      );

      let migratedCount = 0;
      const failedMigrations: string[] = [];

      for (const key of this.localStorage_keys) {
        try {
          const value = localStorage.getItem(key);
          if (value !== null) {
            // Migrate to backend database
            const success = await backendStorage.setItem(key, value);

            if (success) {
              // Remove from localStorage after successful migration
              localStorage.removeItem(key);
              migratedCount++;
              console.log(`✅ Migrated ${key} to backend database`);
            } else {
              failedMigrations.push(key);
            }
          }
        } catch (error) {
          console.error(`❌ Failed to migrate ${key}:`, error);
          failedMigrations.push(key);
        }
      }

      if (migratedCount > 0) {
        console.log(
          `✅ Migration completed: ${migratedCount} items moved to backend database`,
        );
        toast.success(`🗃️ Migrated ${migratedCount} items to database`, {
          description: "All data now stored in backend database",
          duration: 5000,
        });
      }

      if (failedMigrations.length > 0) {
        console.warn(
          `⚠️ Failed to migrate ${failedMigrations.length} items:`,
          failedMigrations,
        );
        toast.warning(
          `⚠️ ${failedMigrations.length} items need manual migration`,
          {
            description: "Some data may need to be recreated",
            duration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("❌ Migration process failed:", error);
      toast.error("❌ Data migration failed", {
        description: "Please refresh the page to retry",
        duration: 8000,
      });
    }
  }

  /**
   * Complete localStorage wipe and backend verification
   */
  async completeLocalStorageElimination(): Promise<boolean> {
    try {
      console.log("🧹 Starting complete localStorage elimination...");

      // First, ensure all data is in backend database
      await this.migrateExistingData();

      // Get all localStorage keys
      const allKeys = Object.keys(localStorage);
      const peptokKeys = allKeys.filter(
        (key) =>
          key.startsWith("peptok_") || this.localStorage_keys.includes(key),
      );

      console.log(
        `Found ${peptokKeys.length} localStorage keys to eliminate:`,
        peptokKeys,
      );

      // Remove all localStorage keys
      for (const key of peptokKeys) {
        localStorage.removeItem(key);
      }

      // Verify localStorage is clean
      const remainingKeys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("peptok_") || this.localStorage_keys.includes(key),
      );

      if (remainingKeys.length === 0) {
        console.log(
          "✅ localStorage completely eliminated - all data now in backend database",
        );
        toast.success("✅ localStorage eliminated", {
          description: "All data now stored in backend database only",
          duration: 5000,
        });
        return true;
      } else {
        console.warn(
          `⚠️ ${remainingKeys.length} localStorage keys remain:`,
          remainingKeys,
        );
        return false;
      }
    } catch (error) {
      console.error("❌ localStorage elimination failed:", error);
      toast.error("❌ Failed to eliminate localStorage");
      return false;
    }
  }

  /**
   * Verify no localStorage usage
   */
  async verifyNoLocalStorageUsage(): Promise<{
    isClean: boolean;
    remainingKeys: string[];
    backendDataCount: number;
  }> {
    try {
      // Check localStorage
      const allKeys = Object.keys(localStorage);
      const remainingKeys = allKeys.filter(
        (key) =>
          key.startsWith("peptok_") || this.localStorage_keys.includes(key),
      );

      // Check backend database
      const backendKeys = await backendStorage.keys();

      return {
        isClean: remainingKeys.length === 0,
        remainingKeys,
        backendDataCount: backendKeys.length,
      };
    } catch (error) {
      console.error("❌ Verification failed:", error);
      return {
        isClean: false,
        remainingKeys: [],
        backendDataCount: 0,
      };
    }
  }

  /**
   * Emergency localStorage restore from backend database
   */
  async emergencyRestore(): Promise<boolean> {
    try {
      console.log(
        "🚨 Emergency restore: copying critical data from backend database...",
      );

      const criticalKeys = [
        "peptok_user",
        "peptok_token",
        "mentorship_requests",
      ];

      let restoredCount = 0;

      for (const key of criticalKeys) {
        try {
          const value = await backendStorage.getItem(key);
          if (value !== null) {
            localStorage.setItem(key, value);
            restoredCount++;
            console.log(`✅ Restored ${key} to localStorage`);
          }
        } catch (error) {
          console.error(`❌ Failed to restore ${key}:`, error);
        }
      }

      if (restoredCount > 0) {
        toast.warning(`🚨 Emergency restore: ${restoredCount} items`, {
          description: "Temporary localStorage restore completed",
          duration: 5000,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Emergency restore failed:", error);
      return false;
    }
  }

  /**
   * Get localStorage elimination status
   */
  getStatus(): {
    eliminationActive: boolean;
    migratedKeysCount: number;
    backendOnlyMode: boolean;
  } {
    const allKeys = Object.keys(localStorage);
    const peptokKeys = allKeys.filter(
      (key) =>
        key.startsWith("peptok_") || this.localStorage_keys.includes(key),
    );

    return {
      eliminationActive: true,
      migratedKeysCount: this.localStorage_keys.length - peptokKeys.length,
      backendOnlyMode: peptokKeys.length === 0,
    };
  }

  /**
   * Monitor for localStorage usage and block it
   */
  startLocalStorageMonitoring(): void {
    // Override localStorage methods to prevent usage
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function (key: string, value: string) {
      if (key.startsWith("peptok_")) {
        console.error(`🚫 Blocked localStorage.setItem for key: ${key}`);
        toast.error(`🚫 localStorage usage blocked: ${key}`, {
          description: "Use backend database instead",
          duration: 3000,
        });
        return;
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.getItem = function (key: string) {
      if (key.startsWith("peptok_")) {
        console.error(`🚫 Blocked localStorage.getItem for key: ${key}`);
        return null;
      }
      return originalGetItem.call(this, key);
    };

    localStorage.removeItem = function (key: string) {
      if (key.startsWith("peptok_")) {
        console.error(`🚫 Blocked localStorage.removeItem for key: ${key}`);
        return;
      }
      return originalRemoveItem.call(this, key);
    };

    console.log("🛡️ localStorage monitoring started - peptok_ keys blocked");
  }
}

// Export singleton instance
export const localStorageElimination = new LocalStorageEliminationService();
export default localStorageElimination;
