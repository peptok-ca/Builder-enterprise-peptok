import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Calendar,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Play,
} from "lucide-react";
import { MentorshipRequest } from "@/types";
import { Link } from "react-router-dom";

interface MentorshipRequestProgressProps {
  requests: MentorshipRequest[];
  showCreateButton?: boolean;
  viewMode?: "employee" | "admin";
}

export function MentorshipRequestProgress({
  requests,
  showCreateButton = false,
  viewMode = "employee",
}: MentorshipRequestProgressProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "submitted":
        return "bg-blue-500";
      case "draft":
        return "bg-gray-500";
      case "completed":
        return "bg-purple-500";
      case "matched":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const;
      case "submitted":
        return "secondary" as const;
      case "draft":
        return "outline" as const;
      case "completed":
        return "default" as const;
      case "matched":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const calculateProgress = (request: MentorshipRequest) => {
    const startDate = new Date(request.timeline.startDate);
    const endDate = new Date(request.timeline.endDate);
    const now = new Date();

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    return Math.round((elapsed / totalDuration) * 100);
  };

  const getNextSession = (request: MentorshipRequest) => {
    // Mock next session calculation
    const frequency = request.timeline.sessionFrequency;
    const now = new Date();
    const nextSession = new Date(now);

    switch (frequency) {
      case "weekly":
        nextSession.setDate(now.getDate() + 7);
        break;
      case "bi-weekly":
        nextSession.setDate(now.getDate() + 14);
        break;
      case "monthly":
        nextSession.setMonth(now.getMonth() + 1);
        break;
    }

    return nextSession.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">No Mentorship Requests Yet</h3>
              <p className="text-sm text-muted-foreground">
                {viewMode === "admin"
                  ? "Create your first mentorship program to start connecting your team with mentors."
                  : "Your company hasn't created any mentorship programs yet. Contact your admin to get started."}
              </p>
            </div>
            {showCreateButton && (
              <Button asChild>
                <Link to="/mentorship/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Program
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const progress = calculateProgress(request);
        const nextSession = getNextSession(request);
        const acceptedMembers = request.teamMembers.filter(
          (m) => m.status === "accepted",
        );
        const pendingMembers = request.teamMembers.filter(
          (m) => m.status === "invited",
        );

        return (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {request.description.length > 100
                      ? `${request.description.substring(0, 100)}...`
                      : request.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Badge>
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(request.status)}`}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Section */}
              {request.status === "active" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Started{" "}
                      {new Date(
                        request.timeline.startDate,
                      ).toLocaleDateString()}
                    </span>
                    <span>
                      Ends{" "}
                      {new Date(request.timeline.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Goals Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="w-4 h-4" />
                  Goals ({request.goals.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {request.goals.slice(0, 3).map((goal) => (
                    <Badge key={goal.id} variant="outline" className="text-xs">
                      {goal.title}
                    </Badge>
                  ))}
                  {request.goals.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{request.goals.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  Team ({acceptedMembers.length} active, {pendingMembers.length}{" "}
                  pending)
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {acceptedMembers.slice(0, 4).map((member) => (
                      <Avatar
                        key={member.id}
                        className="w-6 h-6 border-2 border-background"
                      >
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name || member.email}`}
                        />
                        <AvatarFallback className="text-xs">
                          {member.name
                            ? member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : member.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {acceptedMembers.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">
                          +{acceptedMembers.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                  {pendingMembers.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {pendingMembers.length} pending
                    </Badge>
                  )}
                </div>
              </div>

              {/* Next Session */}
              {request.status === "active" && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Next Session</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {nextSession}
                  </div>
                </div>
              )}

              {/* Metrics Tracking */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Tracking Metrics ({request.metricsToTrack.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {request.metricsToTrack.slice(0, 2).map((metric) => (
                    <Badge key={metric} variant="outline" className="text-xs">
                      {metric
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                  {request.metricsToTrack.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{request.metricsToTrack.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(request.updatedAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  {request.status === "active" && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/mentorship/requests/${request.id}`}>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>

                  {request.status === "active" && (
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Join Session
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default MentorshipRequestProgress;
