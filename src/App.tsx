import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ExpertDirectory from "./pages/ExpertDirectory";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ExpertProfile from "./pages/ExpertProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BusinessOnboarding from "./pages/onboarding/BusinessOnboarding";
import CreateMentorshipRequest from "./pages/mentorship/CreateMentorshipRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/experts" element={<ExpertDirectory />} />
          <Route path="/experts/:id" element={<ExpertProfile />} />
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/admin" element={<CompanyDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<BusinessOnboarding />} />
          <Route path="/mentorship/new" element={<CreateMentorshipRequest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
