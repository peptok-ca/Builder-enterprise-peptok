import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ExpertDirectory from "./pages/ExpertDirectory";
import EmployeeDashboard from "./pages/EmployeeDashboard";
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/coaches" element={<CoachDirectory />} />
              <Route path="/coaches/:id" element={<CoachProfile />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredUserType="enterprise">
                    <EnterpriseDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredUserType="admin">
                    <CompanyDashboard />
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
                  <ProtectedRoute allowedRoles={["admin", "enterprise"]}>
                    <CreateMentorshipRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship/matching"
                element={
                  <ProtectedRoute allowedRoles={["admin", "enterprise"]}>
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
