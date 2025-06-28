import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/ui/logo";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<
    "google" | "microsoft" | null
  >(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      // Attempt login using AuthContext
      const response = await login(formData.email, formData.password);

      if (response.success) {
        toast.success("Successfully signed in!");

        // Get the current user to determine redirect path
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // Redirect based on user type
          let redirectPath = "/dashboard"; // default for enterprise
          switch (currentUser.userType) {
            case "admin":
              redirectPath = "/admin";
              break;
            case "coach":
              redirectPath = "/coach/dashboard";
              break;
            case "enterprise":
            default:
              redirectPath = "/dashboard";
              break;
          }
          navigate(redirectPath);
        }
      } else {
        setError(response.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleGoogleLogin = async () => {
    setIsOAuthLoading("google");
    try {
      await authService.loginWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to connect with Google. Please try again.");
    } finally {
      setIsOAuthLoading(null);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsOAuthLoading("microsoft");
    try {
      await authService.loginWithMicrosoft();
    } catch (error) {
      console.error("Microsoft login error:", error);
      toast.error("Failed to connect with Microsoft. Please try again.");
    } finally {
      setIsOAuthLoading(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-50 via-white to-blue-100">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-400/10 via-transparent to-blue-600/10 animate-pulse"></div>

        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-20 w-60 h-60 bg-blue-600/8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/6 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-700/7 rounded-full blur-3xl"></div>
        </div>

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Floating elements */}
        <div
          className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-500/20 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 w-6 h-6 bg-blue-400/15 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-600/25 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Link to="/" className="inline-flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-150"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20">
                  <Logo size="lg" />
                </div>
              </div>
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-lg">
                Sign in to your account to continue
              </p>
            </div>
          </div>

          {/* Enhanced Login Form */}
          <Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Sign in
              </CardTitle>
              <CardDescription className="text-base">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials */}
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Demo Accounts:</strong>
                  <br />
                  <strong>Enterprise:</strong> enterprise@company.com /
                  password123
                  <br />
                  <strong>Admin:</strong> admin@company.com / password123
                  <br />
                  <strong>Coach:</strong> coach@mentor.com / password123
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 transition-all duration-200 focus:scale-105 focus:shadow-md bg-white/70 backdrop-blur-sm"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 transition-all duration-200 focus:scale-105 focus:shadow-md bg-white/70 backdrop-blur-sm"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked as boolean)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />

                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full transition-all duration-200 hover:scale-105 hover:shadow-md bg-white/70 backdrop-blur-sm"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading || isOAuthLoading !== null}
                  >
                    {isOAuthLoading === "google" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full transition-all duration-200 hover:scale-105 hover:shadow-md bg-white/70 backdrop-blur-sm"
                    type="button"
                    onClick={handleMicrosoftLogin}
                    disabled={isLoading || isOAuthLoading !== null}
                  >
                    {isOAuthLoading === "microsoft" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                      </svg>
                    )}
                    Continue with Microsoft
                  </Button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {import.meta.env.DEV && (
            <Card className="backdrop-blur-md bg-yellow-50/80 border-yellow-200/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Demo Credentials
                </h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>
                    <strong>Enterprise:</strong> john.doe@company.com /
                    password123
                  </p>
                  <p>
                    <strong>Admin:</strong> admin@company.com / password123
                  </p>
                  <p>
                    <strong>OAuth:</strong> Click Google/Microsoft buttons
                    (simulated)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
              <Link
                to="/terms"
                className="text-primary hover:underline transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
