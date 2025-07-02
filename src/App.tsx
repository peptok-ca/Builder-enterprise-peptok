import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardRouter from "@/components/auth/DashboardRouter";
import OfflineIndicator from "@/components/common/OfflineIndicator";
import DatabaseSyncMonitor from "@/components/common/DatabaseSyncMonitor";
import DatabaseStatusIndicator from "@/components/common/DatabaseStatusIndicator";
import LocalStorageEliminationIndicator from "@/components/common/LocalStorageEliminationIndicator";
import { PageValidator } from "@/components/common/PageValidator";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import CoachDirectory from "./pages/CoachDirectory";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyDashboardEnhanced from "./pages/CompanyDashboardEnhanced";
import CoachProfile from "./pages/CoachProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import BusinessOnboarding from "./pages/onboarding/BusinessOnboarding";
import CoachOnboarding from "./pages/onboarding/CoachOnboarding";
import TeamMemberDashboard from "./pages/TeamMemberDashboard";
import VideoConference from "./components/sessions/VideoConference";
import Messages from "./pages/Messages";
import CreateMentorshipRequest from "./pages/mentorship/CreateMentorshipRequest";
import MentorshipRequestDetails from "./pages/mentorship/MentorshipRequestDetails";
import { CoachMatching } from "./pages/coach/CoachMatching";
import { CoachDashboard } from "./pages/coach/CoachDashboard";
import CoachSettings from "./pages/coach/CoachSettings";
import InvitationAccept from "./pages/InvitationAccept";
import TestPermissions from "./pages/TestPermissions";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PricingConfig from "./pages/admin/PricingConfig";
import SecuritySettings from "./pages/admin/SecuritySettings";
import AnalyticsSettings from "./pages/admin/AnalyticsSettings";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import PendingInvitations from "./pages/PendingInvitations";
import Connections from "./pages/Connections";
import ConnectionDetails from "./pages/ConnectionDetails";
import NotFound from "./pages/NotFound";
import PlatformAdminDashboard from "./pages/PlatformAdminDashboard";

// Debug utilities in development
if (import.meta.env.DEV) {
  import("./utils/debug");
  import("./utils/emailDemo");
}

// Initialize localStorage elimination service
import("./services/localStorageElimination");

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
                    <CompanyDashboardEnhanced />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/dashboard/basic"
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
                path="/coach/onboarding"
                element={
                  <ProtectedRoute allowedRoles={["coach"]}>
                    <CoachOnboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team-member/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["team_member"]}>
                    <TeamMemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/session/video"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "coach",
                      "team_member",
                      "company_admin",
                      "platform_admin",
                    ]}
                  >
                    <VideoConference />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:conversationId?"
                element={
                  <ProtectedRoute>
                    <Messages />
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
                path="/mentorship/requests/:id"
                element={
                  <ProtectedRoute>
                    <MentorshipRequestDetails />
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
              <Route
                path="/coach/settings"
                element={
                  <ProtectedRoute allowedRoles={["coach"]}>
                    <CoachSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="/invitation/accept" element={<InvitationAccept />} />
              <Route path="/invitations" element={<PendingInvitations />} />
              <Route path="/test-permissions" element={<TestPermissions />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin/pricing-config" element={<PricingConfig />} />
              <Route
                path="/admin/security-settings"
                element={
                  <ProtectedRoute requiredUserType="platform_admin">
                    <SecuritySettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics-settings"
                element={
                  <ProtectedRoute requiredUserType="platform_admin">
                    <AnalyticsSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute
                    allowedRoles={["platform_admin", "company_admin", "coach"]}
                  >
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connections"
                element={
                  <ProtectedRoute
                    allowedRoles={["company_admin", "coach", "platform_admin"]}
                  >
                    <Connections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connections/:id"
                element={
                  <ProtectedRoute>
                    <ConnectionDetails />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Offline Sync Indicator */}
            <OfflineIndicator />

            {/* Database Sync Monitor */}
            <DatabaseSyncMonitor />

            {/* Database Status Indicator */}
            <DatabaseStatusIndicator />

            {/* localStorage Elimination Indicator */}
            <LocalStorageEliminationIndicator />

            {/* Page Validator */}
            <PageValidator />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
