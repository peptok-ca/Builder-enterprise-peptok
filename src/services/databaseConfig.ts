// Backend Database Configuration Service
// Ensures proper database connections and operations for invitations

import { toast } from "sonner";

export interface DatabaseConfig {
  baseUrl: string;
  endpoints: {
    invitations: string[];
    users: string[];
    validation: string[];
  };
  headers: Record<string, string>;
  timeout: number;
  retryAttempts: number;
}

export interface DatabaseStatus {
  isConnected: boolean;
  lastCheck: string;
  responseTime: number;
  activeEndpoints: string[];
  failedEndpoints: string[];
}

class DatabaseConfigService {
  private config: DatabaseConfig;
  private status: DatabaseStatus;

  constructor() {
    this.config = this.initializeConfig();
    this.status = {
      isConnected: false,
      lastCheck: "",
      responseTime: 0,
      activeEndpoints: [],
      failedEndpoints: [],
    };

    this.testDatabaseConnection();
  }

  private initializeConfig(): DatabaseConfig {
    const baseUrl = window.location.origin;

    return {
      baseUrl,
      endpoints: {
        invitations: [
          "/api/team/invitations",
          "/api/invitations",
          "/team/invitations",
        ],
        users: ["/api/users", "/api/team-members", "/users"],
        validation: ["/api/validate", "/api/health/database", "/health/db"],
      },
      headers: {
        "Content-Type": "application/json",
        "X-Database-Required": "true",
        "X-No-Cache": "true",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      timeout: 10000, // 10 seconds
      retryAttempts: 3,
    };
  }

  /**
   * Test database connection and identify working endpoints
   */
  async testDatabaseConnection(): Promise<DatabaseStatus> {
    console.log("🗃️ Testing backend database connection...");

    const startTime = performance.now();
    const activeEndpoints: string[] = [];
    const failedEndpoints: string[] = [];

    // Test validation endpoints first
    for (const endpoint of this.config.endpoints.validation) {
      try {
        const response = await this.makeRequest(endpoint, "GET");
        if (response.ok) {
          activeEndpoints.push(endpoint);
          console.log(`✅ Database validation endpoint working: ${endpoint}`);
        } else {
          failedEndpoints.push(endpoint);
        }
      } catch (error) {
        failedEndpoints.push(endpoint);
        console.warn(`❌ Database validation endpoint failed: ${endpoint}`);
      }
    }

    // Test invitation endpoints
    for (const endpoint of this.config.endpoints.invitations) {
      try {
        const response = await this.makeRequest(endpoint, "GET");
        if (response.ok) {
          activeEndpoints.push(endpoint);
          console.log(`✅ Database invitation endpoint working: ${endpoint}`);
        } else {
          failedEndpoints.push(endpoint);
        }
      } catch (error) {
        failedEndpoints.push(endpoint);
        console.warn(`❌ Database invitation endpoint failed: ${endpoint}`);
      }
    }

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    this.status = {
      isConnected: activeEndpoints.length > 0,
      lastCheck: new Date().toISOString(),
      responseTime: Math.round(responseTime),
      activeEndpoints,
      failedEndpoints,
    };

    if (this.status.isConnected) {
      console.log(
        `✅ Backend database connected (${activeEndpoints.length} endpoints active)`,
      );
      toast.success("🗃️ Backend database connected", {
        description: `${activeEndpoints.length} endpoints active`,
        duration: 3000,
      });
    } else {
      console.error("❌ Backend database connection failed");
      toast.error("❌ Backend database connection failed", {
        description: "All database endpoints are unavailable",
        duration: 5000,
      });
    }

    return this.status;
  }

  /**
   * Get optimal endpoint for a specific operation
   */
  getOptimalEndpoint(type: keyof DatabaseConfig["endpoints"]): string | null {
    const endpoints = this.config.endpoints[type];

    // Return first active endpoint
    for (const endpoint of endpoints) {
      if (this.status.activeEndpoints.includes(endpoint)) {
        return endpoint;
      }
    }

    // If no active endpoints, return first available for retry
    return endpoints[0] || null;
  }

  /**
   * Make database request with proper headers and error handling
   */
  async makeDatabaseRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any,
  ): Promise<any> {
    console.log(`🗃️ Making database request: ${method} ${endpoint}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...this.config.headers,
          "X-Database-Write": method !== "GET" ? "required" : "optional",
        },
        signal: controller.signal,
      };

      if (data && method !== "GET") {
        requestOptions.body = JSON.stringify(data);
      }

      const response = await fetch(endpoint, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Verify database response
      if (this.isDatabaseResponse(responseData)) {
        console.log(`✅ Database request successful: ${method} ${endpoint}`);
        return responseData;
      } else {
        throw new Error("Response does not appear to be from database");
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ Database request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Verify response is from actual database (not cache/mock)
   */
  private isDatabaseResponse(data: any): boolean {
    // Check for database-specific indicators
    if (data.data && data.data.id && data.data.id.includes("temp_")) {
      return false; // Temporary/mock data
    }

    if (data.error && data.error.includes("localStorage")) {
      return false; // localStorage fallback
    }

    if (data.source === "cache" || data.source === "mock") {
      return false; // Cached or mock data
    }

    // Look for database timestamp formats
    if (data.data?.createdAt || data.data?.updatedAt) {
      const timestamp = data.data.createdAt || data.data.updatedAt;
      try {
        const date = new Date(timestamp);
        // Database timestamps should be recent and valid
        return date.getTime() > 0;
      } catch {
        return false;
      }
    }

    return true; // Assume valid if no negative indicators
  }

  /**
   * Batch operation with database guarantee
   */
  async batchDatabaseOperation(
    operations: Array<{
      endpoint: string;
      method: "GET" | "POST" | "PUT" | "DELETE";
      data?: any;
    }>,
  ): Promise<any[]> {
    console.log(
      `🗃️ Executing batch database operations (${operations.length} ops)`,
    );

    const results: any[] = [];

    for (const op of operations) {
      try {
        const result = await this.makeDatabaseRequest(
          op.endpoint,
          op.method,
          op.data,
        );
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    console.log(
      `✅ Batch operations completed: ${successCount}/${operations.length} successful`,
    );

    return results;
  }

  /**
   * Get current database status
   */
  getDatabaseStatus(): DatabaseStatus {
    return { ...this.status };
  }

  /**
   * Force database connection test
   */
  async refreshDatabaseConnection(): Promise<DatabaseStatus> {
    return await this.testDatabaseConnection();
  }

  /**
   * Check if database is ready for operations
   */
  isDatabaseReady(): boolean {
    return this.status.isConnected && this.status.activeEndpoints.length > 0;
  }

  /**
   * Get database configuration
   */
  getConfig(): DatabaseConfig {
    return { ...this.config };
  }

  /**
   * Update database configuration
   */
  updateConfig(updates: Partial<DatabaseConfig>): void {
    this.config = { ...this.config, ...updates };
    this.testDatabaseConnection(); // Re-test with new config
  }

  // Private helper methods

  private async makeRequest(
    endpoint: string,
    method: string,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for tests

    try {
      const response = await fetch(endpoint, {
        method,
        headers: this.config.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseConfig = new DatabaseConfigService();
export default databaseConfig;
