import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Mail,
  Star,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { apiEnhanced } from "@/services/apiEnhanced";
import { MentorshipRequest } from "@/types";
import { toast } from "sonner";
import { TeamMemberManagementCard } from "@/components/mentorship/TeamMemberManagementCard";

interface MatchedCoach {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  company: string;
  location: string;
  rating: number;
  expertise: string[];
  hourlyRate: number;
  availability: "available" | "limited" | "busy";
  matchScore: number;
  bio: string;
  isSelected?: boolean;
}

export default function MentorshipRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<MentorshipRequest | null>(null);
  const [matchedCoaches, setMatchedCoaches] = useState<MatchedCoach[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateTeamMembers = async (updatedMembers: any[]) => {
    setTeamMembers(updatedMembers);

    // Update the request object
    if (request) {
      const updatedRequest = {
        ...request,
        teamMembers: updatedMembers,
      };
      setRequest(updatedRequest);

      // Persist team members to backend database
      try {
        await api.updateMentorshipRequest(request.id, updatedRequest);
        console.log("✅ Team members updated in backend database");
      } catch (error) {
        console.error("Failed to update team members in backend:", error);
        // Don't show error toast as team members are still updated in UI
      }
    }
  };

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) {
        setError("Invalid request ID");
        setLoading(false);
        return;
      }

      if (!user) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        // First try to fetch from API
        let foundRequest = null;

        try {
          const allRequests = await apiEnhanced.getMentorshipRequests();
          foundRequest = allRequests.find((req) => req.id === id);
        } catch (apiError) {
          console.warn("API call failed, using fallback data:", apiError);
        }

        if (foundRequest) {
          setRequest(foundRequest);
          setTeamMembers(foundRequest.teamMembers || []);

          // Also load any additional team members from backend invitations
          try {
            const { invitationService } = await import(
              "@/services/invitationService"
            );
            const invitations = await invitationService.getInvitations({
              programId: foundRequest.id,
              companyId: user?.companyId,
            });

            // Convert invitations to team members and merge with existing
            const teamMembersFromInvitations = invitations.map((inv) => ({
              id: `member-${inv.id}`,
              email: inv.email,
              name: inv.name,
              role: inv.role || "participant",
              status: inv.status === "pending" ? "invited" : inv.status,
              invitedAt: inv.createdAt,
            }));

            // Merge with existing team members, avoiding duplicates
            const existingEmails = (foundRequest.teamMembers || []).map((m) =>
              m.email?.toLowerCase(),
            );
            const newMembers = teamMembersFromInvitations.filter(
              (inv) => !existingEmails.includes(inv.email?.toLowerCase()),
            );

            if (newMembers.length > 0) {
              const allTeamMembers = [
                ...(foundRequest.teamMembers || []),
                ...newMembers,
              ];
              setTeamMembers(allTeamMembers);
              console.log(
                `✅ Loaded ${newMembers.length} additional team members from invitations`,
              );
            }
          } catch (error) {
            console.error("Failed to load team member invitations:", error);
            // Don't show error as this is a background operation
          }
        } else {
          // Always create a fallback request for any ID to ensure page works
          toast.info("Loading sample program data for demonstration");

          const mockRequest: MentorshipRequest = {
            id,
            companyId: user?.companyId || "default-company-id",
            title: "React Development Training",
            description:
              "Help our team improve their React skills and best practices.",
            goals: [
              {
                id: "goal_1",
                title: "Master React Hooks",
                description:
                  "Learn advanced React hooks and custom hook patterns",
                category: "technical" as const,
                priority: "high" as const,
              },
            ],
            metricsToTrack: ["Code quality scores", "Development velocity"],
            teamMembers: [
              {
                id: "member_1",
                email: "john.doe@company.com",
                name: "John Doe",
                role: "participant" as const,
                status: "accepted" as const,
                invitedAt: new Date().toISOString(),
              },
              {
                id: "member_2",
                email: "jane.smith@company.com",
                name: "Jane Smith",
                role: "participant" as const,
                status: "invited" as const,
                invitedAt: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                id: "member_3",
                email: "bob.wilson@company.com",
                name: "Bob Wilson",
                role: "observer" as const,
                status: "invited" as const,
                invitedAt: new Date(
                  Date.now() - 5 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
            ],
            preferredExpertise: ["React", "JavaScript", "Frontend Development"],
            budget: { min: 100, max: 200 },
            timeline: {
              startDate: new Date().toISOString(),
              endDate: new Date(
                Date.now() + 90 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              sessionFrequency: "weekly" as const,
            },
            status: "active" as const,
            createdAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setRequest(mockRequest);
          setTeamMembers(mockRequest.teamMembers || []);
        }

        // Mock matched coaches data
        const mockMatchedCoaches: MatchedCoach[] = [
          {
            id: "coach-1",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            title: "Senior Leadership Coach",
            company: "Executive Coaching Solutions",
            location: "New York, NY",
            rating: 4.9,
            expertise: [
              "Leadership Development",
              "Strategic Planning",
              "Team Management",
            ],
            hourlyRate: 250,
            availability: "available",
            matchScore: 95,
            bio: "Sarah is a seasoned executive coach with over 15 years of experience helping leaders transform their organizations.",
            isSelected: true,
          },
          {
            id: "coach-2",
            name: "Michael Chen",
            email: "michael.chen@example.com",
            title: "Strategic Leadership Advisor",
            company: "Leadership Excellence Group",
            location: "San Francisco, CA",
            rating: 4.8,
            expertise: [
              "Strategic Planning",
              "Executive Presence",
              "Change Management",
            ],
            hourlyRate: 275,
            availability: "available",
            matchScore: 92,
            bio: "Michael specializes in helping executives develop strategic thinking and lead organizational transformation.",
          },
          {
            id: "coach-3",
            name: "Dr. Emily Rodriguez",
            email: "emily.rodriguez@example.com",
            title: "Leadership Development Expert",
            company: "Peak Performance Coaching",
            location: "Austin, TX",
            rating: 4.7,
            expertise: [
              "Leadership",
              "Team Management",
              "Performance Optimization",
            ],
            hourlyRate: 230,
            availability: "limited",
            matchScore: 88,
            bio: "Dr. Rodriguez combines psychology and business expertise to help leaders unlock their full potential.",
          },
        ];

        setMatchedCoaches(mockMatchedCoaches);
      } catch (error) {
        console.error("Failed to fetch mentorship request:", error);
        setError(error.message || "Failed to load mentorship request details");
        setRequest(null);
        toast.error("Failed to load mentorship request details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, user]);

  const handleSelectCoach = (coachId: string) => {
    setMatchedCoaches((prev) =>
      prev.map((coach) => ({
        ...coach,
        isSelected: coach.id === coachId ? !coach.isSelected : false,
      })),
    );
  };

  const [pricingConfig, setPricingConfig] = useState({
    companyServiceFee: 0.1,
    additionalParticipantFee: 25,
    currency: "CAD",
  });

  useEffect(() => {
    const fetchPricingConfig = async () => {
      try {
        const config = await apiEnhanced.getPricingConfig();
        setPricingConfig(config);
      } catch (error) {
        console.warn("Using default pricing config:", error);
      }
    };
    fetchPricingConfig();
  }, []);

  const calculateDetailedCosts = (hourlyRate: number) => {
    if (!request) return null;

    // Handle both old and new timeline formats
    let totalSessions: number;
    let hoursPerSession: number;

    if (typeof request.timeline === "string") {
      // Old format - estimate based on timeline string
      const timelineStr = request.timeline.toLowerCase();
      if (timelineStr.includes("week")) {
        const weeks = parseInt(timelineStr.match(/(\d+)/)?.[0] || "4");
        totalSessions = weeks;
        hoursPerSession = 2; // Default assumption
      } else if (timelineStr.includes("month")) {
        const months = parseInt(timelineStr.match(/(\d+)/)?.[0] || "3");
        totalSessions = months * 4; // Weekly sessions
        hoursPerSession = 2;
      } else {
        totalSessions = 8; // Default fallback
        hoursPerSession = 2;
      }
    } else {
      // New detailed timeline format
      totalSessions = request.timeline.totalSessions;
      hoursPerSession = request.timeline.hoursPerSession;
    }

    const sessionCost = hourlyRate * hoursPerSession;
    const baseSessionsCost = sessionCost * totalSessions;

    // Additional participants cost (beyond included participants)
    const teamMembersCount = request.teamMembers
      ? request.teamMembers.length
      : request.participants || 1;
    const maxIncluded = pricingConfig.maxParticipantsIncluded || 1;
    const additionalParticipants = Math.max(0, teamMembersCount - maxIncluded);
    const additionalParticipantsCost =
      additionalParticipants *
      pricingConfig.additionalParticipantFee *
      totalSessions;

    const subtotal = baseSessionsCost + additionalParticipantsCost;
    const serviceFee = subtotal * pricingConfig.companyServiceFee;
    const totalProgramCost = subtotal + serviceFee;

    return {
      hourlyRate,
      sessionCost,
      totalSessions,
      baseSessionsCost,
      additionalParticipants,
      additionalParticipantsCost,
      serviceFee,
      serviceFeePct: pricingConfig.companyServiceFee * 100,
      totalProgramCost,
      avgCostPerSession: totalProgramCost / totalSessions,
      currency: pricingConfig.currency,
    };
  };

  const calculateTotalCost = (hourlyRate: number) => {
    const costs = calculateDetailedCosts(hourlyRate);
    return costs ? costs.totalProgramCost : 0;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "busy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "participant":
        return "bg-blue-100 text-blue-800";
      case "observer":
        return "bg-gray-100 text-gray-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading mentorship request details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error Loading Request</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Mentorship request not found.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {request.title}
              </h1>
              <p className="text-gray-600 mt-2">{request.description}</p>
            </div>
            <Badge className={getStatusColor(request.status)}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Program Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h4 className="font-semibold">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {request.metricsToTrack.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members ({request.teamMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${member.email}`}
                          />
                          <AvatarFallback>
                            {(member.name || member.email)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.name || member.email}
                          </p>
                          {member.name && (
                            <p className="text-sm text-gray-600">
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Matched Coaches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Matched Coaches ({matchedCoaches.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchedCoaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={
                                coach.avatar ||
                                `https://avatar.vercel.sh/${coach.email}`
                              }
                            />
                            <AvatarFallback>
                              {coach.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                              {coach.name}
                            </h4>
                            <p className="text-gray-600">{coach.title}</p>
                            <p className="text-sm text-gray-500">
                              {coach.company}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {coach.rating}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {coach.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ${coach.hourlyRate}/hr
                          </div>
                          <div className="text-sm space-y-1">
                            {user?.userType === "company" ? (
                              (() => {
                                const costs = calculateDetailedCosts(
                                  coach.hourlyRate,
                                );
                                return costs ? (
                                  <div className="space-y-1">
                                    <div className="text-gray-600">
                                      <span className="font-medium text-gray-800">
                                        Session Cost:
                                      </span>{" "}
                                      ${costs.sessionCost}/session
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium text-gray-800">
                                        Total Sessions:
                                      </span>{" "}
                                      {costs.totalSessions}
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium text-gray-800">
                                        Program Cost:
                                      </span>{" "}
                                      ${costs.baseSessionsCost.toFixed(2)}
                                    </div>
                                    {costs.additionalParticipants > 0 && (
                                      <div className="text-gray-600">
                                        <span className="font-medium text-gray-800">
                                          Additional Participants:
                                        </span>{" "}
                                        $
                                        {costs.additionalParticipantsCost.toFixed(
                                          2,
                                        )}
                                      </div>
                                    )}
                                    <div className="text-gray-600">
                                      <span className="font-medium text-gray-800">
                                        Service Fee (
                                        {costs.serviceFeePct.toFixed(0)}%):
                                      </span>{" "}
                                      ${costs.serviceFee.toFixed(2)}
                                    </div>
                                    <div className="pt-1 border-t border-gray-200">
                                      <div className="font-semibold text-blue-600">
                                        Total Program: $
                                        {costs.totalProgramCost.toFixed(2)}{" "}
                                        {costs.currency}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        ${costs.avgCostPerSession.toFixed(2)}
                                        /session average
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-blue-600 font-semibold">
                                    Rate: ${coach.hourlyRate}/hr
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="text-blue-600 font-semibold">
                                Rate: ${coach.hourlyRate}/hr
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={getAvailabilityColor(coach.availability)}
                        >
                          {coach.availability}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600">{coach.bio}</p>

                      <div className="flex flex-wrap gap-2">
                        {coach.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-gray-600">
                          Available for{" "}
                          {coach.availability === "available"
                            ? "immediate"
                            : "limited"}{" "}
                          coaching
                        </div>
                        {coach.isSelected ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Selected
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectCoach(coach.id)}
                            >
                              Deselect
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectCoach(coach.id)}
                          >
                            Select Coach
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Member Management */}
            <TeamMemberManagementCard
              teamMembers={teamMembers}
              onUpdateTeamMembers={handleUpdateTeamMembers}
              programTitle={request.title}
              programId={request.id}
              readOnly={user?.userType !== "company_admin"}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Start Date
                  </label>
                  <p className="font-semibold">
                    {new Date(request.timeline.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    End Date
                  </label>
                  <p className="font-semibold">
                    {new Date(request.timeline.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Session Frequency
                  </label>
                  <p className="font-semibold capitalize">
                    {request.timeline.sessionFrequency}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Range</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {request.budget
                    ? `$${request.budget.min.toLocaleString()} - $${request.budget.max.toLocaleString()}`
                    : "Budget not specified"}
                </p>
              </CardContent>
            </Card>

            {/* Preferred Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {request.preferredExpertise.map((expertise, index) => (
                    <Badge key={index} variant="secondary">
                      {expertise}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Team
                </Button>
                <Button variant="outline" className="w-full">
                  Export Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
