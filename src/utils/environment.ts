/**
 * Environment detection utilities
 */

export const Environment = {
  // Check if running in local development
  isLocalDevelopment(): boolean {
    return (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0" ||
      window.location.port === "3000" ||
      window.location.port === "5173" // Vite default port
    );
  },

  // Check if running in production/deployed environment
  isProduction(): boolean {
    return !this.isLocalDevelopment();
  },

  // Get the appropriate API base URL
  getApiBaseUrl(): string {
    const envApiUrl = import.meta.env.VITE_API_URL;

    if (envApiUrl) {
      return envApiUrl;
    }

    // Default to localhost in development
    if (this.isLocalDevelopment()) {
      return "http://localhost:3001/api";
    }

    // In production, assume backend is at same domain
    return `${window.location.origin}/api`;
  },

  // Check if backend should be attempted
  shouldTryBackend(): boolean {
    return this.isLocalDevelopment() || !!import.meta.env.VITE_API_URL;
  },

  // Get environment name for logging
  getEnvironmentName(): string {
    if (this.isLocalDevelopment()) {
      return "development";
    }
    return "production";
  },
};
