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
import { ArrowLeft, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import {
  SubscriptionTier,
  MentorshipRequest,
  SessionPricingTier,
} from "@/types";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { BackendStatus } from "@/components/ui/BackendStatus";

export default function CreateMentorshipRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionPricingTier, setSessionPricingTier] =
    useState<SessionPricingTier | null>(null);
  const [loadingTier, setLoadingTier] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load session pricing tier
  useEffect(() => {
    const loadSessionPricingTier = async () => {
      try {
        setLoadingTier(true);
        // Load session pricing tiers
        const tiers = await api.getSessionPricingTiers();
        // For demo purposes, use Premium plan as default
        const defaultTier = tiers.find((t) => t.id === "premium") || tiers[1];
        setSessionPricingTier(defaultTier);
      } catch (error) {
        console.error("Failed to load session pricing:", error);
        toast.error("Failed to load session pricing information");
      } finally {
        setLoadingTier(false);
      }
    };

    loadSessionPricingTier();
  }, []);
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
      // Note: With session-based pricing, team size validation is less restrictive
      // Pricing is calculated per session with additional participant fees
      const teamSize = data.teamMembers.length;
      console.log(
        `Creating program for ${teamSize} team members with session-based pricing`,
      );

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
        user?.userType === "platform_admin" ? "/platform-admin" : "/dashboard";
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
    // With session-based pricing, direct users to pricing page for more information
    navigate("/pricing");
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
              onClick={() => {
                const dashboardPath =
                  user?.userType === "platform_admin"
                    ? "/platform-admin"
                    : "/dashboard";
                navigate(dashboardPath);
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="space-y-6">
            {/* Page Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Program</h1>
                <BackendStatus />
              </div>
              <p className="text-muted-foreground">
                Create a comprehensive mentorship program for your team. We'll
                help you find the right mentors and structure your program for
                maximum impact.
              </p>
            </div>

            {/* Session Pricing Info */}
            {!loadingTier && sessionPricingTier && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="default">{sessionPricingTier.name}</Badge>
                    <span className="text-sm text-muted-foreground">
                      ${sessionPricingTier.baseSessionPrice} per session
                      {sessionPricingTier.participantFee > 0 && (
                        <>
                          , +${sessionPricingTier.participantFee} per additional
                          participant
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pay-per-session pricing with{" "}
                    {sessionPricingTier.platformServiceCharge}% platform fee
                  </p>
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
            {loadingTier ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-4">
                      <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground">
                        Loading session pricing information...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <MentorshipRequestForm
                onSubmit={handleSubmitRequest}
                onSaveDraft={handleSaveDraft}
                sessionPricingTier={sessionPricingTier}
                onUpgradePrompt={handleUpgradePrompt}
                initialData={savedDraft || undefined}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
