import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "employee" | "expert" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredUserType,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(redirectTo);
        return;
      }

      if (requiredUserType && user?.userType !== requiredUserType) {
        // Redirect to appropriate dashboard based on user type
        const userDashboard =
          user?.userType === "admin" ? "/admin" : "/dashboard";
        navigate(userDashboard);
        return;
      }
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    navigate,
    requiredUserType,
    redirectTo,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

export default ProtectedRoute;
