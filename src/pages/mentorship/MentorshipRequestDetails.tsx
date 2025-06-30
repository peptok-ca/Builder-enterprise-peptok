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
import { MentorshipRequest } from "@/types";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;

      try {
        // First try to fetch from API
        const allRequests = await api.getMentorshipRequests();
        const foundRequest = allRequests.find((req) => req.id === id);

        if (foundRequest) {
          setRequest(foundRequest);
        } else {
          // Fallback: match the data from the sample request in localStorage
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

  const calculateTotalCost = (hourlyRate: number) => {
    if (!request) return 0;

    const startDate = new Date(request.timeline.startDate);
    const endDate = new Date(request.timeline.endDate);
    const totalWeeks = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );

    // Assume 2 hours per session based on typical coaching sessions
    const hoursPerSession = 2;
    const sessionsPerWeek =
      request.timeline.sessionFrequency === "weekly"
        ? 1
        : request.timeline.sessionFrequency === "bi-weekly"
          ? 0.5
          : 1;

    return hourlyRate * hoursPerSession * sessionsPerWeek * totalWeeks;
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
                          <div className="text-sm font-semibold text-blue-600">
                            Total: $
                            {calculateTotalCost(
                              coach.hourlyRate,
                            ).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Match: {coach.matchScore}%
                          </div>
                          <Badge
                            className={getAvailabilityColor(coach.availability)}
                          >
                            {coach.availability}
                          </Badge>
                        </div>
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
                  ${request.budget.min.toLocaleString()} - $
                  {request.budget.max.toLocaleString()}
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
