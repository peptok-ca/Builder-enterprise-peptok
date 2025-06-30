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

export default function MentorshipRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<MentorshipRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;

      try {
        // For now, create mock data since the API endpoint doesn't exist yet
        const mockRequest: MentorshipRequest = {
          id,
          companyId: user?.companyId || "company-1",
          title: "Leadership Development Program",
          description:
            "A comprehensive leadership development program focused on building strategic thinking and team management skills.",
          goals: [
            {
              title: "Develop strategic thinking skills",
              description:
                "Learn to think long-term and make strategic decisions",
            },
            {
              title: "Improve team management",
              description: "Build effective team leadership capabilities",
            },
            {
              title: "Enhance communication skills",
              description: "Develop clear and persuasive communication",
            },
          ],
          metricsToTrack: [
            "Team engagement scores",
            "Leadership assessment results",
            "360-degree feedback",
          ],
          teamMembers: [
            {
              id: "member-1",
              email: "john.doe@company.com",
              name: "John Doe",
              role: "participant" as const,
              status: "active" as const,
              invitedAt: new Date().toISOString(),
            },
            {
              id: "member-2",
              email: "jane.smith@company.com",
              name: "Jane Smith",
              role: "observer" as const,
              status: "active" as const,
              invitedAt: new Date().toISOString(),
            },
          ],
          preferredExpertise: [
            "Leadership",
            "Strategic Planning",
            "Team Management",
          ],
          budget: { min: 5000, max: 10000 },
          timeline: {
            startDate: "2024-02-01",
            endDate: "2024-05-01",
            sessionFrequency: "weekly" as const,
          },
          status: "active" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setRequest(mockRequest);
      } catch (error) {
        console.error("Failed to fetch mentorship request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, user]);

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
