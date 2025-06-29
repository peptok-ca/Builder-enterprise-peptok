import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardRouter from "@/components/auth/DashboardRouter";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import CoachDirectory from "./pages/CoachDirectory";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CoachProfile from "./pages/CoachProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import BusinessOnboarding from "./pages/onboarding/BusinessOnboarding";
import CreateMentorshipRequest from "./pages/mentorship/CreateMentorshipRequest";
import { CoachMatching } from "./pages/coach/CoachMatching";
import { CoachDashboard } from "./pages/coach/CoachDashboard";
import InvitationAccept from "./pages/InvitationAccept";
import Connections from "./pages/Connections";
import NotFound from "./pages/NotFound";
import PlatformAdminDashboard from "./pages/PlatformAdminDashboard";

// Debug utilities in development
if (import.meta.env.DEV) {
  import("./utils/debug");
  import("./utils/emailDemo");
}

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/coaches" element={<CoachDirectory />} />
              <Route path="/coaches/:id" element={<CoachProfile />} />

              {/* Auto-route authenticated users to their dashboard */}
              <Route path="/app" element={<DashboardRouter />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredUserType="company_admin">
                    <EnterpriseDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute requiredUserType="company_admin">
                    <EnterpriseDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/platform-admin"
                element={
                  <ProtectedRoute requiredUserType="platform_admin">
                    <PlatformAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <BusinessOnboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship/new"
                element={
                  <ProtectedRoute
                    allowedRoles={["platform_admin", "company_admin"]}
                  >
                    <CreateMentorshipRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship/matching"
                element={
                  <ProtectedRoute
                    allowedRoles={["platform_admin", "company_admin"]}
                  >
                    <CoachMatching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["coach"]}>
                    <CoachDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/invitation/accept" element={<InvitationAccept />} />
              <Route
                path="/connections"
                element={
                  <ProtectedRoute allowedRoles={["enterprise", "coach"]}>
                    <Connections />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
