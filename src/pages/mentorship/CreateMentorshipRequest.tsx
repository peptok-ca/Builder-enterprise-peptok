import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MentorshipRequestForm,
  MentorshipRequestFormData,
} from "@/components/mentorship/MentorshipRequestForm";
import Header from "@/components/layout/Header";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { SubscriptionTier, MentorshipRequest } from "@/types";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateMentorshipRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptionTier, setSubscriptionTier] =
    useState<SubscriptionTier | null>(null);
  const [loadingTier, setLoadingTier] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user's subscription tier
  useEffect(() => {
    const loadSubscriptionTier = async () => {
      try {
        setLoadingTier(true);
        // In a real app, this would load the user's current subscription tier
        const tiers = await api.getSubscriptionTiers();
        // For demo purposes, use Growth plan as default
        const defaultTier = tiers.find((t) => t.id === "growth") || tiers[1];
        setSubscriptionTier(defaultTier);
      } catch (error) {
        console.error("Failed to load subscription tier:", error);
        toast.error("Failed to load subscription information");
      } finally {
        setLoadingTier(false);
      }
    };

    loadSubscriptionTier();
  }, []);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [savedDraft, setSavedDraft] =
    useState<MentorshipRequestFormData | null>(null);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const draft = localStorage.getItem("mentorship-request-draft");
    if (draft) {
      try {
        setSavedDraft(JSON.parse(draft));
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const handleSubmitRequest = async (data: MentorshipRequestFormData) => {
    setIsSubmitting(true);

    try {
      // Validate team size against subscription tier
      if (
        subscriptionTier &&
        data.teamMembers.length > subscriptionTier.userCap
      ) {
        setShowUpgradeModal(true);
        setIsSubmitting(false);
        return;
      }

      // Create the request object
      const requestData = {
        companyId: user?.companyId || "default-company-id", // Use actual user company ID
        title: data.title,
        description: data.description,
        goals: data.goals,
        metricsToTrack: data.metricsToTrack,
        teamMembers: data.teamMembers,
        preferredExpertise: data.preferredExpertise,
        budget: data.budget,
        timeline: data.timeline,
        status: "submitted" as const,
      };

      // Submit to API
      const request = await api.createMentorshipRequest(requestData);

      // Clear saved draft
      localStorage.removeItem("mentorship-request-draft");

      toast.success("Mentorship request submitted successfully!");

      // Navigate to appropriate dashboard based on user type
      const dashboardPath =
        user?.userType === "admin" ? "/admin" : "/dashboard";
      navigate(dashboardPath, {
        state: {
          newRequest: request,
          refresh: true,
          message:
            "Your mentorship request has been submitted and is being reviewed.",
        },
      });
    } catch (error) {
      console.error("Failed to submit mentorship request:", error);

      // More specific error message
      let errorMessage = "Failed to submit request. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (data: MentorshipRequestFormData) => {
    try {
      localStorage.setItem("mentorship-request-draft", JSON.stringify(data));
      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to create mentorship program. Please try again.");
    }
  };

  const handleUpgradePrompt = () => {
    setShowUpgradeModal(true);
  };

  const loadDraft = () => {
    if (savedDraft) {
      // This would trigger a form reset with draft data
      // For now, we'll just show a success message
      toast.success("Draft loaded successfully!");
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("mentorship-request-draft");
    setSavedDraft(null);
    toast.success("Draft cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-100/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="space-y-6">
            {/* Page Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Create New Program</h1>
              <p className="text-muted-foreground">
                Create a comprehensive mentorship program for your team. We'll
                help you find the right mentors and structure your program for
                maximum impact.
              </p>
            </div>

            {/* Subscription Info */}
            {!loadingTier && subscriptionTier && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="default">
                        {subscriptionTier.name} Plan
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Up to{" "}
                        {subscriptionTier.userCap === 999999
                          ? "unlimited"
                          : subscriptionTier.userCap}{" "}
                        team members
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Draft Notice */}
            {savedDraft && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>You have a saved draft from a previous session.</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadDraft}>
                      Load Draft
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearDraft}>
                      Clear
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Main Form */}
            <MentorshipRequestForm
              onSubmit={handleSubmitRequest}
              onSaveDraft={handleSaveDraft}
              subscriptionTier={subscriptionTier}
              onUpgradePrompt={handleUpgradePrompt}
              initialData={savedDraft || undefined}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}

interface UpgradeModalProps {
  onClose: () => void;
}

function UpgradeModal({ onClose }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = (tier: string) => {
    // Navigate to subscription management or upgrade page
    navigate("/admin", {
      state: { upgradeModalOpen: true, selectedTier: tier },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Upgrade Required
          </CardTitle>
          <CardDescription>
            You've reached the limits of your current plan. Upgrade to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Growth Plan - $99/month</h4>
              <p className="text-sm text-muted-foreground">
                Up to 50 team members
              </p>
              <Button
                className="w-full mt-2"
                onClick={() => handleUpgrade("growth")}
              >
                Upgrade to Growth
              </Button>
            </div>

            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Enterprise Plan - Custom</h4>
              <p className="text-sm text-muted-foreground">
                Unlimited team members
              </p>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => handleUpgrade("enterprise")}
              >
                Contact Sales
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Continue with Current Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
