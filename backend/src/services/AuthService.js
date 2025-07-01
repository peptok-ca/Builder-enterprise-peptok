// Simple mock AuthService for development
// This is a JavaScript version for the development environment

const mockUsers = [
  {
    id: "platform-admin-1",
    email: "platform@peptok.com",
    name: "Platform Admin",
    firstName: "Platform",
    lastName: "Admin",
    userType: "platform_admin",
    status: "active",
    password: "hashed_password", // In real app, this would be bcrypt hashed
  },
  {
    id: "demo-platform-admin",
    email: "demo@platform.com",
    name: "Demo Platform Admin",
    firstName: "Demo",
    lastName: "Platform Admin",
    userType: "platform_admin",
    status: "active",
    password: "hashed_password",
  },
  {
    id: "company-admin-1",
    email: "admin@company.com",
    name: "Company Admin",
    firstName: "Company",
    lastName: "Admin",
    userType: "company_admin",
    status: "active",
    password: "hashed_password",
  },
  {
    id: "demo-company-admin",
    email: "demo@company.com",
    name: "Demo Company Admin",
    firstName: "Demo",
    lastName: "Company Admin",
    userType: "company_admin",
    status: "active",
    password: "hashed_password",
  },
  {
    id: "coach-1",
    email: "coach@mentor.com",
    name: "Sarah Coach",
    firstName: "Sarah",
    lastName: "Coach",
    userType: "coach",
    status: "active",
    password: "hashed_password",
  },
  {
    id: "demo-coach",
    email: "demo@coach.com",
    name: "Demo Coach",
    firstName: "Demo",
    lastName: "Coach",
    userType: "coach",
    status: "active",
    password: "hashed_password",
  },
];

class AuthService {
  async login(email, password) {
    console.log(`🔐 Mock login attempt for: ${email}`);

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "active") {
      throw new Error("Account is not active");
    }

    // In development, accept any password
    // In production, this would check bcrypt hash

    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
        provider: "email",
      },
      token,
      refreshToken: `mock_refresh_token_${user.id}_${Date.now()}`,
    };
  }

  async register(userData) {
    console.log(`📝 Mock registration for: ${userData.email}`);

    const existingUser = mockUsers.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase(),
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      userType: userData.userType || "team_member",
      status: "active",
      password: "hashed_password", // Would be bcrypt in production
    };

    mockUsers.push(newUser);

    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.firstName}`,
        provider: "email",
      },
      token,
      refreshToken: `mock_refresh_token_${newUser.id}_${Date.now()}`,
    };
  }

  async loginWithGoogle(token) {
    console.log(
      `🔐 Mock Google OAuth login with token: ${token.substring(0, 20)}...`,
    );

    // Mock Google user data
    const mockGoogleUser = {
      id: "google_user_" + Date.now(),
      email: "google@example.com",
      name: "Google User",
      firstName: "Google",
      lastName: "User",
      userType: "team_member",
      status: "active",
    };

    const jwtToken = `mock_jwt_token_${mockGoogleUser.id}_${Date.now()}`;

    return {
      user: {
        ...mockGoogleUser,
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
        provider: "google",
      },
      token: jwtToken,
      refreshToken: `mock_refresh_token_${mockGoogleUser.id}_${Date.now()}`,
    };
  }

  async loginWithMicrosoft(token) {
    console.log(
      `🔐 Mock Microsoft OAuth login with token: ${token.substring(0, 20)}...`,
    );

    // Mock Microsoft user data
    const mockMicrosoftUser = {
      id: "microsoft_user_" + Date.now(),
      email: "microsoft@example.com",
      name: "Microsoft User",
      firstName: "Microsoft",
      lastName: "User",
      userType: "team_member",
      status: "active",
    };

    const jwtToken = `mock_jwt_token_${mockMicrosoftUser.id}_${Date.now()}`;

    return {
      user: {
        ...mockMicrosoftUser,
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft",
        provider: "microsoft",
      },
      token: jwtToken,
      refreshToken: `mock_refresh_token_${mockMicrosoftUser.id}_${Date.now()}`,
    };
  }

  async forgotPassword(email) {
    console.log(`📧 Mock forgot password for: ${email}`);

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: "If the email exists, a reset link has been sent" };
    }

    // In real app, would send email with reset token
    return { message: "Password reset email sent (mock)" };
  }

  async resetPassword(token, newPassword) {
    console.log(
      `🔒 Mock password reset with token: ${token.substring(0, 20)}...`,
    );

    // In real app, would validate token and update password
    return { message: "Password reset successfully (mock)" };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default AuthService;
