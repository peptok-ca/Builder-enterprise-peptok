import { toast } from "sonner";
import { User } from "../types";

// OAuth Configuration
const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-google-client-id",
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: "openid email profile",
    responseType: "code",
    authUrl: "https://accounts.google.com/oauth/authorize",
  },
  microsoft: {
    clientId:
      import.meta.env.VITE_MICROSOFT_CLIENT_ID || "demo-microsoft-client-id",
    redirectUri: `${window.location.origin}/auth/callback/microsoft`,
    scope: "openid email profile",
    responseType: "code",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  },
};

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  isNewUser?: boolean;
}

// Simulated user database for demo purposes
const mockUsers: User[] = [
  // Platform Admin - Manages entire platform
  {
    id: "platform-admin-1",
    email: "platform@peptok.com",
    name: "Platform Admin",
    firstName: "Platform",
    lastName: "Admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=platform",
    provider: "email",
    userType: "platform_admin",
  },
  {
    id: "demo-platform-admin",
    email: "demo@platform.com",
    name: "Demo Platform Admin",
    firstName: "Demo",
    lastName: "Platform Admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=demoplatform",
    provider: "email",
    userType: "platform_admin",
  },

  // Company/SME Admin - Manages their company
  {
    id: "company-admin-1",
    email: "admin@company.com",
    name: "Company Admin",
    firstName: "Company",
    lastName: "Admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=company",
    provider: "email",
    userType: "company_admin",
  },
  {
    id: "demo-company-admin",
    email: "demo@company.com",
    name: "Demo Company Admin",
    firstName: "Demo",
    lastName: "Company Admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=democompany",
    provider: "email",
    userType: "company_admin",
  },

  // Coaches - Individual mentors/coaches
  {
    id: "coach-1",
    email: "coach@mentor.com",
    name: "Sarah Coach",
    firstName: "Sarah",
    lastName: "Coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    provider: "email",
    userType: "coach",
  },
  {
    id: "demo-coach",
    email: "demo@coach.com",
    name: "Demo Coach",
    firstName: "Demo",
    lastName: "Coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=democoach",
    provider: "email",
    userType: "coach",
  },
];

class AuthService {
  private currentUser: User | null = null;

  // Initialize auth service
  constructor() {
    this.loadUserFromStorage();
  }

  // Load user from localStorage
  private loadUserFromStorage() {
    try {
      console.log("🔄 Loading user from localStorage...");
      const userData = localStorage.getItem("peptok_user");
      const token = localStorage.getItem("peptok_token");

      console.log("📦 Storage data found:", {
        hasUserData: !!userData,
        hasToken: !!token,
        userDataLength: userData?.length || 0,
      });

      if (userData && token) {
        this.currentUser = JSON.parse(userData);
        console.log(
          `✅ User loaded from storage: ${this.currentUser.email} (${this.currentUser.userType})`,
        );
      } else {
        console.log("ℹ️ No valid auth data found in localStorage");
      }
    } catch (error) {
      console.error("❌ Failed to load user from storage:", error);
      this.clearAuth();
    }
  }

  // Save user to localStorage
  private saveUserToStorage(user: User, token: string) {
    try {
      console.log(
        `💾 Saving user to storage: ${user.email} (${user.userType})`,
      );
      localStorage.setItem("peptok_user", JSON.stringify(user));
      localStorage.setItem("peptok_token", token);
      this.currentUser = user;
      console.log(`✅ User saved successfully to localStorage`);
    } catch (error) {
      console.error("❌ Failed to save user to storage:", error);
      throw error;
    }
  }

  // Clear authentication data
  private clearAuth() {
    localStorage.removeItem("peptok_user");
    localStorage.removeItem("peptok_token");
    this.currentUser = null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Debug utility to check available demo accounts
  getAvailableDemoAccounts(): Array<{ email: string; userType: string }> {
    return mockUsers.map((user) => ({
      email: user.email,
      userType: user.userType,
    }));
  }

  // Test specific demo account
  async testDemoLogin(email: string = "demo@platform.com"): Promise<void> {
    console.log("🧪 Testing demo login...");
    console.log("📋 Available accounts:", this.getAvailableDemoAccounts());

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    console.log(`🔍 Account lookup for ${email}:`, user);

    if (user) {
      console.log("✅ Demo account found:", {
        id: user.id,
        email: user.email,
        userType: user.userType,
        name: user.name,
      });
    } else {
      console.error(`❌ Demo account ${email} not found!`);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return (
      this.currentUser !== null && localStorage.getItem("peptok_token") !== null
    );
  }

  // Email/Password Login
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log(`🔐 Login attempt for email: ${email}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials (in real app, this would be an API call)
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      console.log(
        `🔍 User lookup result for ${email}:`,
        user ? "Found" : "Not found",
      );

      if (!user) {
        console.error(`❌ No user found for email: ${email}`);
        console.log(
          "📋 Available demo emails:",
          mockUsers.map((u) => u.email),
        );
        return {
          success: false,
          error:
            "No account found with this email address. Please sign up first.",
        };
      }

      // Simulate password validation (in real app, password would be hashed and verified)
      if (password.length < 6) {
        console.error(
          `❌ Password too short for ${email}: ${password.length} characters`,
        );
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      // Generate mock token
      const token = `mock_token_${Date.now()}_${user.id}`;
      console.log(
        `✅ Login successful for ${email}, user type: ${user.userType}`,
      );

      // Save authentication
      this.saveUserToStorage(user, token);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      console.error(`💥 Login error for ${email}:`, error);
      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    }
  }

  // Email/Password Signup
  async signupWithEmail(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company?: string;
    role?: string;
    userType: "company_admin" | "coach";
    businessDetails?: {
      companyName: string;
      industry: string;
      employeeCount: number;
      website?: string;
      phone?: string;
    };
  }): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if user already exists
      const existingUser = mockUsers.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase(),
      );

      if (existingUser) {
        return {
          success: false,
          error:
            "An account with this email already exists. Please sign in instead.",
        };
      }

      // Validate password
      if (userData.password.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters long.",
        };
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        provider: "email",
        userType: userData.userType,
        isNewUser: true,
        businessDetails: userData.businessDetails,
      };

      // Save business details to localStorage for onboarding reuse
      if (userData.businessDetails) {
        localStorage.setItem(
          "peptok_business_details",
          JSON.stringify(userData.businessDetails),
        );
      }

      // Save to mock database
      mockUsers.push(newUser);

      // Generate token
      const token = `mock_token_${Date.now()}_${newUser.id}`;

      // Save authentication
      this.saveUserToStorage(newUser, token);

      return {
        success: true,
        user: newUser,
        token,
        isNewUser: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "Signup failed. Please try again.",
      };
    }
  }

  // Google OAuth Login
  async loginWithGoogle(): Promise<void> {
    try {
      // In a real implementation, you would use Google's OAuth library
      // For demo purposes, we'll simulate the OAuth flow

      const params = new URLSearchParams({
        client_id: OAUTH_CONFIG.google.clientId,
        redirect_uri: OAUTH_CONFIG.google.redirectUri,
        scope: OAUTH_CONFIG.google.scope,
        response_type: OAUTH_CONFIG.google.responseType,
        state: this.generateState(),
      });

      // Store state for validation
      localStorage.setItem("oauth_state", params.get("state") || "");

      // In development, simulate OAuth response
      if (import.meta.env.DEV) {
        this.simulateOAuthResponse("google");
        return;
      }

      // In production, redirect to Google OAuth
      window.location.href = `${OAUTH_CONFIG.google.authUrl}?${params.toString()}`;
    } catch (error) {
      console.error("Google OAuth error:", error);
      toast.error("Failed to connect with Google. Please try again.");
    }
  }

  // Microsoft OAuth Login
  async loginWithMicrosoft(): Promise<void> {
    try {
      const params = new URLSearchParams({
        client_id: OAUTH_CONFIG.microsoft.clientId,
        redirect_uri: OAUTH_CONFIG.microsoft.redirectUri,
        scope: OAUTH_CONFIG.microsoft.scope,
        response_type: OAUTH_CONFIG.microsoft.responseType,
        state: this.generateState(),
      });

      localStorage.setItem("oauth_state", params.get("state") || "");

      // In development, simulate OAuth response
      if (import.meta.env.DEV) {
        this.simulateOAuthResponse("microsoft");
        return;
      }

      // In production, redirect to Microsoft OAuth
      window.location.href = `${OAUTH_CONFIG.microsoft.authUrl}?${params.toString()}`;
    } catch (error) {
      console.error("Microsoft OAuth error:", error);
      toast.error("Failed to connect with Microsoft. Please try again.");
    }
  }

  // Simulate OAuth response for development
  private async simulateOAuthResponse(provider: "google" | "microsoft") {
    try {
      // Show loading state
      toast.loading(
        `Connecting with ${provider === "google" ? "Google" : "Microsoft"}...`,
      );

      // Simulate OAuth flow delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock OAuth user data
      const oauthUser = {
        google: {
          id: "google_123456",
          email: "user@gmail.com",
          name: "Google User",
          firstName: "Google",
          lastName: "User",
          picture: "https://lh3.googleusercontent.com/a/default-user",
          provider: "google" as const,
        },
        microsoft: {
          id: "microsoft_789012",
          email: "user@outlook.com",
          name: "Microsoft User",
          firstName: "Microsoft",
          lastName: "User",
          picture: "https://graph.microsoft.com/v1.0/me/photo/$value",
          provider: "microsoft" as const,
        },
      };

      const userData = oauthUser[provider];

      // Check if user exists or create new one
      let user = mockUsers.find((u) => u.email === userData.email);
      let isNewUser = false;

      if (!user) {
        // Create new user from OAuth data
        user = {
          ...userData,
          userType: "company_admin", // Default to company admin, can be changed later
          isNewUser: true,
        };
        mockUsers.push(user);
        isNewUser = true;
      }

      // Generate token
      const token = `mock_token_${Date.now()}_${user.id}`;

      // Save authentication
      this.saveUserToStorage(user, token);

      // Clear loading toast
      toast.dismiss();

      // Success message
      toast.success(
        `Successfully signed in with ${provider === "google" ? "Google" : "Microsoft"}!`,
      );

      // Trigger page reload to update UI
      setTimeout(() => {
        if (isNewUser) {
          window.location.href = "/onboarding";
        } else {
          // Route to appropriate dashboard based on user type
          switch (user?.userType) {
            case "platform_admin":
              window.location.href = "/platform-admin";
              break;
            case "coach":
              window.location.href = "/coach/dashboard";
              break;
            case "company_admin":
            default:
              window.location.href = "/dashboard";
              break;
          }
        }
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error(
        `Failed to connect with ${provider === "google" ? "Google" : "Microsoft"}. Please try again.`,
      );
    }
  }

  // Handle OAuth callback (for production)
  async handleOAuthCallback(
    provider: string,
    code: string,
    state: string,
  ): Promise<AuthResponse> {
    try {
      // Validate state parameter
      const storedState = localStorage.getItem("oauth_state");
      if (state !== storedState) {
        throw new Error("Invalid state parameter");
      }

      // In a real app, exchange code for token with your backend
      // const response = await fetch('/api/auth/oauth/callback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ provider, code, state })
      // });

      // For demo, return mock success
      return {
        success: true,
        user: {
          id: `oauth_${Date.now()}`,
          email: "oauth@example.com",
          name: "OAuth User",
          provider: provider as "google" | "microsoft",
          userType: "enterprise",
        },
        token: `oauth_token_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error: "OAuth callback failed",
      };
    }
  }

  // Generate random state for OAuth
  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // In a real app, you might want to invalidate the token on the server
      // await fetch('/api/auth/logout', { method: 'POST' });

      this.clearAuth();
      toast.success("Successfully signed out");

      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local auth even if server call fails
      this.clearAuth();
      window.location.href = "/";
    }
  }

  // Get saved business details for onboarding
  getSavedBusinessDetails() {
    try {
      const businessDetails = localStorage.getItem("peptok_business_details");
      return businessDetails ? JSON.parse(businessDetails) : null;
    } catch (error) {
      console.error("Failed to load business details:", error);
      return null;
    }
  }

  // Clear saved business details after onboarding
  clearSavedBusinessDetails() {
    localStorage.removeItem("peptok_business_details");
  }

  // Password reset (email)
  async resetPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        return {
          success: false,
          message: "No account found with this email address.",
        };
      }

      // In a real app, send password reset email
      return {
        success: true,
        message: "Password reset instructions sent to your email.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send password reset email. Please try again.",
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export utility functions
export const isAuthenticated = () => authService.isAuthenticated();
export const getCurrentUser = () => authService.getCurrentUser();
export const logout = () => authService.logout();
