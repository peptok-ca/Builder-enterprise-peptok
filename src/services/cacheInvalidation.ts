// Cache Invalidation Service
// Handles localStorage invalidation when backend data changes

interface CacheEntry {
  key: string;
  timestamp: number;
  version: number;
  companyId?: string;
  userId?: string;
}

interface InvalidationEvent {
  type:
    | "user_data"
    | "company_data"
    | "platform_data"
    | "pricing_config"
    | "global";
  scope?: string; // companyId or userId for scoped invalidation
  timestamp: number;
  source: string; // which admin/user triggered the change
}

class CacheInvalidationService {
  private readonly CACHE_VERSION_KEY = "peptok_cache_version";
  private readonly INVALIDATION_LOG_KEY = "peptok_invalidation_log";
  private listeners: Set<(event: InvalidationEvent) => void> = new Set();

  /**
   * Initialize cache invalidation service
   */
  init() {
    // Check for version mismatches on startup
    this.checkVersionMismatch();

    // Listen for cross-browser invalidation events
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("peptok_cache_invalidation");
      channel.addEventListener("message", (event) => {
        const invalidationEvent: InvalidationEvent = event.data;
        this.handleInvalidation(invalidationEvent);
      });
    }

    // Listen for storage events (different browser tabs)
    window.addEventListener("storage", (event) => {
      if (event.key === this.INVALIDATION_LOG_KEY) {
        const latestInvalidation = this.getLatestInvalidation();
        if (latestInvalidation) {
          this.handleInvalidation(latestInvalidation);
        }
      }
    });
  }

  /**
   * Invalidate cache entries based on data type and scope
   */
  invalidate(event: InvalidationEvent) {
    console.log("🔄 Cache invalidation triggered:", event);

    // Log the invalidation
    this.logInvalidation(event);

    // Handle local invalidation
    this.handleInvalidation(event);

    // Broadcast to other browser tabs/windows
    this.broadcastInvalidation(event);
  }

  /**
   * Invalidate all company-specific data
   */
  invalidateCompanyData(companyId: string, source: string) {
    this.invalidate({
      type: "company_data",
      scope: companyId,
      timestamp: Date.now(),
      source,
    });
  }

  /**
   * Invalidate all user-specific data
   */
  invalidateUserData(userId: string, source: string) {
    this.invalidate({
      type: "user_data",
      scope: userId,
      timestamp: Date.now(),
      source,
    });
  }

  /**
   * Invalidate platform-wide data (all users affected)
   */
  invalidatePlatformData(source: string) {
    this.invalidate({
      type: "platform_data",
      timestamp: Date.now(),
      source,
    });
  }

  /**
   * Invalidate pricing configuration (affects all users)
   */
  invalidatePricingConfig(source: string) {
    this.invalidate({
      type: "pricing_config",
      timestamp: Date.now(),
      source,
    });
  }

  /**
   * Nuclear option - invalidate everything
   */
  invalidateAll(source: string) {
    this.invalidate({
      type: "global",
      timestamp: Date.now(),
      source,
    });
  }

  /**
   * Subscribe to invalidation events
   */
  onInvalidation(callback: (event: InvalidationEvent) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Check if a cache key should be invalidated
   */
  shouldInvalidateKey(
    key: string,
    companyId?: string,
    userId?: string,
  ): boolean {
    const latestInvalidation = this.getLatestInvalidation();
    if (!latestInvalidation) return false;

    const cacheEntry = this.getCacheEntry(key);
    if (!cacheEntry) return false;

    // Check if cache is older than latest invalidation
    if (cacheEntry.timestamp < latestInvalidation.timestamp) {
      switch (latestInvalidation.type) {
        case "global":
          return true;

        case "platform_data":
          return this.isPlatformDataKey(key);

        case "pricing_config":
          return this.isPricingConfigKey(key);

        case "company_data":
          return (
            latestInvalidation.scope === companyId && this.isCompanyDataKey(key)
          );

        case "user_data":
          return latestInvalidation.scope === userId && this.isUserDataKey(key);

        default:
          return false;
      }
    }

    return false;
  }

  /**
   * Clear invalidated cache entries
   */
  clearInvalidatedCache(companyId?: string, userId?: string) {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("peptok_"),
    );

    keys.forEach((key) => {
      if (this.shouldInvalidateKey(key, companyId, userId)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared invalidated cache: ${key}`);
      }
    });
  }

  /**
   * Store cache entry with metadata
   */
  setCacheEntry(key: string, data: any, companyId?: string, userId?: string) {
    const entry: CacheEntry = {
      key,
      timestamp: Date.now(),
      version: this.getCurrentVersion(),
      companyId,
      userId,
    };

    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_meta`, JSON.stringify(entry));
  }

  /**
   * Get cache entry with metadata check
   */
  getCacheEntry(key: string): CacheEntry | null {
    try {
      const metaData = localStorage.getItem(`${key}_meta`);
      return metaData ? JSON.parse(metaData) : null;
    } catch {
      return null;
    }
  }

  private handleInvalidation(event: InvalidationEvent) {
    // Notify listeners
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.warn("Error in invalidation listener:", error);
      }
    });

    // Show user notification for platform-wide changes
    if (
      event.type === "platform_data" ||
      event.type === "pricing_config" ||
      event.type === "global"
    ) {
      // Dynamic import to avoid circular dependencies
      import("sonner").then(({ toast }) => {
        toast.info(
          `Platform data updated by ${event.source}. Some data has been refreshed.`,
        );
      });
    }
  }

  private broadcastInvalidation(event: InvalidationEvent) {
    try {
      // BroadcastChannel for same-origin communication
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("peptok_cache_invalidation");
        channel.postMessage(event);
      }

      // Also store in localStorage for cross-tab communication
      this.logInvalidation(event);
    } catch (error) {
      console.warn("Error broadcasting invalidation:", error);
    }
  }

  private logInvalidation(event: InvalidationEvent) {
    try {
      const log = this.getInvalidationLog();
      log.unshift(event);

      // Keep only last 50 invalidations
      if (log.length > 50) {
        log.splice(50);
      }

      localStorage.setItem(this.INVALIDATION_LOG_KEY, JSON.stringify(log));
    } catch (error) {
      console.warn("Error logging invalidation:", error);
    }
  }

  private getInvalidationLog(): InvalidationEvent[] {
    try {
      const log = localStorage.getItem(this.INVALIDATION_LOG_KEY);
      return log ? JSON.parse(log) : [];
    } catch {
      return [];
    }
  }

  private getLatestInvalidation(): InvalidationEvent | null {
    const log = this.getInvalidationLog();
    return log.length > 0 ? log[0] : null;
  }

  private getCurrentVersion(): number {
    try {
      const version = localStorage.getItem(this.CACHE_VERSION_KEY);
      return version ? parseInt(version) : 1;
    } catch {
      return 1;
    }
  }

  private checkVersionMismatch() {
    const currentVersion = this.getCurrentVersion();
    const expectedVersion = 1; // This would come from backend in real implementation

    if (currentVersion !== expectedVersion) {
      console.log("🔄 Cache version mismatch detected, clearing all cache");
      this.invalidateAll("version_mismatch");
      localStorage.setItem(this.CACHE_VERSION_KEY, expectedVersion.toString());
    }
  }

  private isPlatformDataKey(key: string): boolean {
    return (
      key.includes("platform") ||
      key.includes("admin") ||
      key.includes("global") ||
      key.includes("security") ||
      key.includes("analytics") ||
      key.includes("audit")
    );
  }

  private isPricingConfigKey(key: string): boolean {
    return key.includes("pricing") || key.includes("config");
  }

  private isCompanyDataKey(key: string): boolean {
    return (
      key.includes("company") ||
      key.includes("requests") ||
      key.includes("sessions")
    );
  }

  private isUserDataKey(key: string): boolean {
    return (
      key.includes("user") ||
      key.includes("profile") ||
      key.includes("settings")
    );
  }
}

// Export singleton instance
export const cacheInvalidation = new CacheInvalidationService();

// Auto-initialize
if (typeof window !== "undefined") {
  cacheInvalidation.init();
}
