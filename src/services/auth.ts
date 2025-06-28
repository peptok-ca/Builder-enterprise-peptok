import { toast } from "sonner";

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

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  provider: "email" | "google" | "microsoft";
  userType: "enterprise" | "coach" | "admin";
  isNewUser?: boolean;
  businessDetails?: {
    companyName: string;
    industry: string;
    employeeCount: number;
    website?: string;
    phone?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  isNewUser?: boolean;
}

// Simulated user database for demo purposes
const mockUsers: User[] = [
  {
    id: "user-enterprise",
    email: "enterprise@company.com",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    provider: "email",
    userType: "enterprise",
  },
  {
    id: "user-admin",
    email: "admin@company.com",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    provider: "email",
    userType: "admin",
  },
  {
    id: "user-coach",
    email: "coach@mentor.com",
    name: "Sarah Coach",
    firstName: "Sarah",
    lastName: "Coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    provider: "email",
    userType: "coach",
  },
  // Additional demo users for testing
  {
    id: "demo-admin",
    email: "demo@admin.com",
    name: "Demo Admin",
    firstName: "Demo",
    lastName: "Admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=demoadmin",
    provider: "email",
    userType: "admin",
  },
  {
    id: "demo-enterprise",
    email: "demo@enterprise.com",
    name: "Demo Enterprise",
    firstName: "Demo",
    lastName: "Enterprise",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=demoenterprise",
    provider: "email",
    userType: "enterprise",
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
      const userData = localStorage.getItem("peptok_user");
      const token = localStorage.getItem("peptok_token");

      if (userData && token) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
      this.clearAuth();
    }
  }

  // Save user to localStorage
  private saveUserToStorage(user: User, token: string) {
    try {
      localStorage.setItem("peptok_user", JSON.stringify(user));
      localStorage.setItem("peptok_token", token);
      this.currentUser = user;
    } catch (error) {
      console.error("Failed to save user to storage:", error);
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return (
      this.currentUser !== null && localStorage.getItem("peptok_token") !== null
    );
  }

  // Email/Password Login
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials (in real app, this would be an API call)
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        return {
          success: false,
          error:
            "No account found with this email address. Please sign up first.",
        };
      }

      // Simulate password validation (in real app, password would be hashed and verified)
      if (password.length < 6) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      // Generate mock token
      const token = `mock_token_${Date.now()}_${user.id}`;

      // Save authentication
      this.saveUserToStorage(user, token);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
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
    userType: "enterprise" | "coach";
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
          userType: "enterprise", // Default to enterprise, can be changed later
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
            case "admin":
              window.location.href = "/admin";
              break;
            case "coach":
              window.location.href = "/coach/dashboard";
              break;
            case "enterprise":
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
