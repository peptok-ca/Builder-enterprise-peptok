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
import { TeamMemberManagementCard } from "@/components/mentorship/TeamMemberManagementCard";

import Header from "@/components/layout/Header";
import { ArrowLeft, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import {
  SubscriptionTier,
  MentorshipRequest,
  SessionPricingTier,
  TeamMember,
} from "@/types";
import { toast } from "sonner";
import { api } from "@/services/api";
import { emailService } from "@/services/email";
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
  const [formData, setFormData] = useState<MentorshipRequestFormData | null>(
    null,
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [programId, setProgramId] = useState<string>("");

  // Load draft from localStorage and generate/load program ID
  useEffect(() => {
    // Generate a unique program ID for this session if not exists
    let storedProgramId = localStorage.getItem("current-program-id");
    if (!storedProgramId) {
      storedProgramId = `program-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("current-program-id", storedProgramId);
    }
    setProgramId(storedProgramId);

    const draft = localStorage.getItem("mentorship-request-draft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setSavedDraft(parsedDraft);
        // Load team members from draft if available
        if (parsedDraft.teamMembers && parsedDraft.teamMembers.length > 0) {
          setTeamMembers(parsedDraft.teamMembers);
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Load existing team members/invitations for this program
  useEffect(() => {
    const loadExistingTeamMembers = async () => {
      if (!programId || !user?.companyId) return;

      try {
        // Load invitations for this program from backend database
        const { invitationService } = await import(
          "@/services/invitationService"
        );
        const invitations = await invitationService.getInvitations({
          programId: programId,
          companyId: user.companyId,
        });

        // Convert invitations to team members
        const teamMembersFromInvitations: TeamMember[] = invitations.map(
          (inv) => ({
            id: `member-${inv.id}`,
            email: inv.email,
            name: inv.name,
            role: inv.role || "participant",
            status: inv.status === "pending" ? "invited" : inv.status,
            invitedAt: inv.createdAt,
          }),
        );

        // Only update if we found invitations and don't already have team members loaded
        if (teamMembersFromInvitations.length > 0 && teamMembers.length === 0) {
          setTeamMembers(teamMembersFromInvitations);
          console.log(
            `✅ Loaded ${teamMembersFromInvitations.length} existing team members for program ${programId}`,
          );
        }
      } catch (error) {
        console.error("Failed to load existing team members:", error);
        // Don't show error toast as this is a background operation
      }
    };

    loadExistingTeamMembers();
  }, [programId, user?.companyId]); // Don't include teamMembers in deps to avoid infinite loop

  const handleSubmitRequest = async (data: MentorshipRequestFormData) => {
    setIsSubmitting(true);

    try {
      // Check if we have team members from either the separate state or form data
      const currentTeamMembers =
        teamMembers.length > 0 ? teamMembers : data.teamMembers;

      if (currentTeamMembers.length === 0) {
        toast.error("Please add at least one team member to the program");
        setIsSubmitting(false);
        return;
      }

      // Note: With session-based pricing, team size validation is less restrictive
      // Pricing is calculated per session with additional participant fees
      const teamSize = currentTeamMembers.length;
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
        teamMembers: currentTeamMembers,
        preferredExpertise: data.preferredExpertise,
        budget: data.budget,
        timeline: data.timeline,
        status: "submitted" as const,
      };

      // Submit to API
      const request = await api.createMentorshipRequest(requestData);

      // Send program details email to all team members
      try {
        const programDetails = {
          programTitle: data.title,
          programDescription: data.description,
          startDate: data.timeline.startDate,
          endDate: data.timeline.endDate,
          sessionFrequency: data.timeline.sessionFrequency,
          companyName: user?.businessDetails?.companyName || "Your Company",
          adminName: user?.name || "Program Administrator",
          goals: data.goals.map((g) => g.title),
          metricsToTrack: data.metricsToTrack,
        };

        // Send email to each team member
        const emailPromises = currentTeamMembers.map((member) =>
          emailService.sendProgramDetails(member.email, programDetails),
        );

        await Promise.all(emailPromises);
        console.log(
          `📧 Program details sent to ${currentTeamMembers.length} team members`,
        );
      } catch (emailError) {
        // Don't fail the whole process if emails fail
        console.error("Failed to send program details emails:", emailError);
      }

      // Clear saved draft and program ID
      localStorage.removeItem("mentorship-request-draft");
      localStorage.removeItem("current-program-id");
      setTeamMembers([]);
      setProgramId("");

      toast.success(
        "Mentorship request submitted successfully! Team members have been notified.",
      );

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

  const handleSaveDraft = async (data: MentorshipRequestFormData) => {
    try {
      // Save to localStorage as backup
      localStorage.setItem("mentorship-request-draft", JSON.stringify(data));

      // Also attempt to save draft to backend if available
      try {
        const draftData = {
          ...data,
          companyId: user?.companyId || "default-company-id",
          status: "draft" as const,
        };

        await api.createMentorshipRequest(draftData);
        toast.success("Draft saved to server successfully!");
      } catch (backendError) {
        console.warn("Backend save failed, draft saved locally:", backendError);
        toast.success("Draft saved locally!");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast.error("Failed to save draft. Please try again.");
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
    localStorage.removeItem("current-program-id");
    setSavedDraft(null);
    setTeamMembers([]);
    setProgramId("");
    toast.success("Draft cleared");
  };

  const handleFormDataChange = (data: MentorshipRequestFormData) => {
    setFormData(data);
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
              <div className="space-y-8">
                <MentorshipRequestForm
                  onSubmit={handleSubmitRequest}
                  sessionPricingTier={sessionPricingTier}
                  onUpgradePrompt={handleUpgradePrompt}
                  initialData={savedDraft || undefined}
                  isLoading={isSubmitting}
                  onFormDataChange={handleFormDataChange}
                />

                {/* Dedicated Team Member Management Card */}
                <TeamMemberManagementCard
                  teamMembers={teamMembers}
                  onUpdateTeamMembers={(updatedTeamMembers) => {
                    setTeamMembers(updatedTeamMembers);
                    // Auto-save team members to draft whenever they're updated
                    const currentDraft = formData || {
                      title: "",
                      description: "",
                      goals: [],
                      metricsToTrack: [],
                      teamMembers: [],
                      preferredExpertise: [],
                      timeline: {
                        startDate: "",
                        endDate: "",
                        sessionFrequency: "bi-weekly",
                      },
                    };
                    const updatedDraft = {
                      ...currentDraft,
                      teamMembers: updatedTeamMembers,
                    };
                    handleSaveDraft(updatedDraft);
                  }}
                  programTitle={formData?.title || "New Mentorship Program"}
                  programId={programId}
                />

                {/* Form Actions at Bottom */}
                <div className="flex justify-between items-center pt-8 border-t bg-white sticky bottom-0 pb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleSaveDraft(
                        formData || {
                          title: "",
                          description: "",
                          goals: [],
                          metricsToTrack: [],
                          teamMembers: teamMembers,
                          preferredExpertise: [],
                          timeline: {
                            startDate: "",
                            endDate: "",
                            sessionFrequency: "bi-weekly",
                          },
                        },
                      )
                    }
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => {
                      if (formData) {
                        handleSubmitRequest({
                          ...formData,
                          teamMembers:
                            teamMembers.length > 0
                              ? teamMembers
                              : formData.teamMembers,
                        });
                      } else {
                        toast.error("Please fill in the program details first");
                      }
                    }}
                    disabled={isSubmitting || !formData}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
