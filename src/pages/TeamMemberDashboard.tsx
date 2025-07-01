import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Video,
  BookOpen,
  TrendingUp,
  Award,
  Bell,
  User,
  CheckCircle,
  PlayCircle,
  Mail,
  UserPlus,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SessionRatingModal } from "@/components/sessions/SessionRatingModal";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
  invitationService,
  TeamInvitation,
} from "@/services/invitationService";

interface TeamMemberSession {
  id: string;
  title: string;
  coach: {
    name: string;
    avatar?: string;
    title: string;
  };
  date: string;
  duration: number;
  status: "upcoming" | "completed" | "cancelled";
  type: "video" | "phone" | "in-person";
  description: string;
  programTitle: string;
  role: "participant" | "observer";
  rating?: number;
  feedback?: string;
  hasRated: boolean;
  meetingLink?: string;
}

interface TeamMemberProgram {
  id: string;
  title: string;
  description: string;
  coach: {
    name: string;
    avatar?: string;
    title: string;
  };
  role: "participant" | "observer";
  status: "active" | "completed" | "paused";
  progress: number;
  totalSessions: number;
  completedSessions: number;
  nextSession?: TeamMemberSession;
}

const TeamMemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TeamMemberSession[]>([]);
  const [programs, setPrograms] = useState<TeamMemberProgram[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<
    TeamInvitation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<TeamMemberSession | null>(null);
  const [acceptingInvitation, setAcceptingInvitation] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log("Loading team member dashboard data from API...");

        // Fetch user's sessions from backend
        const sessionsData = await api.getUserSessions(
          user?.id || "current-user",
          undefined,
        );
        console.log("Fetched sessions:", sessionsData);

        // Transform API data to match TeamMemberSession interface
        const transformedSessions: TeamMemberSession[] = sessionsData.map(
          (session) => ({
            id: session.id,
            title: session.title,
            coach: {
              name: session.coach?.name || "Coach",
              avatar: session.coach?.avatar,
              title: session.coach?.title || "Professional Coach",
            },
            date: session.startTime,
            duration: session.duration || 60,
            status: session.status as "upcoming" | "completed" | "cancelled",
            type: session.type as "video" | "phone" | "in-person",
            description: session.description || "",
            programTitle: session.programId || "Coaching Program",
            role: "participant" as const,
            hasRated: false,
            meetingLink: session.meetingLink,
          }),
        );

        // If no API sessions, fallback to sample data for demo
        const mockSessions: TeamMemberSession[] =
          transformedSessions.length > 0
            ? transformedSessions
            : [
                {
                  id: "session-1",
                  title: "Leadership Fundamentals",
                  coach: {
                    name: "Sarah Johnson",
                    title: "Senior Leadership Coach",
                    avatar: "https://avatar.vercel.sh/sarah@example.com",
                  },
                  date: "2024-02-15T14:00:00Z",
                  duration: 60,
                  status: "upcoming",
                  type: "video",
                  description:
                    "Introduction to leadership principles and goal setting",
                  programTitle: "Leadership Development Program",
                  role:
                    (user?.role as "participant" | "observer") || "participant",
                  hasRated: false,
                  meetingLink: "https://meet.google.com/abc-defg-hij",
                },
                {
                  id: "session-2",
                  title: "Communication Skills",
                  coach: {
                    name: "Sarah Johnson",
                    title: "Senior Leadership Coach",
                    avatar: "https://avatar.vercel.sh/sarah@example.com",
                  },
                  date: "2024-02-08T14:00:00Z",
                  duration: 60,
                  status: "completed",
                  type: "video",
                  description: "Effective communication strategies for leaders",
                  programTitle: "Leadership Development Program",
                  role:
                    (user?.role as "participant" | "observer") || "participant",
                  hasRated: false,
                },
                {
                  id: "session-3",
                  title: "Team Management",
                  coach: {
                    name: "Sarah Johnson",
                    title: "Senior Leadership Coach",
                    avatar: "https://avatar.vercel.sh/sarah@example.com",
                  },
                  date: "2024-02-01T14:00:00Z",
                  duration: 60,
                  status: "completed",
                  type: "video",
                  description: "Building and managing high-performing teams",
                  programTitle: "Leadership Development Program",
                  role:
                    (user?.role as "participant" | "observer") || "participant",
                  rating: 5,
                  feedback: "Excellent session with practical insights!",
                  hasRated: true,
                },
              ];

        // Load program information from accepted invitations
        let programsFromInvitations: TeamMemberProgram[] = [];
        if (user?.email) {
          const acceptedInvitations = invitationService
            .getInvitations({
              companyId: user.companyId,
            })
            .filter(
              (inv) => inv.email === user.email && inv.status === "accepted",
            );

          programsFromInvitations = acceptedInvitations.map((inv) => ({
            id: inv.programId,
            title: inv.programTitle,
            description:
              inv.metadata?.programDescription ||
              `Join the ${inv.programTitle} mentorship program`,
            coach: {
              name: "Assigned Coach", // This would come from API in real app
              title: "Professional Coach",
              avatar: "https://avatar.vercel.sh/coach@example.com",
            },
            role: inv.role,
            status: "active" as const,
            progress: 0, // This would be calculated from actual sessions
            totalSessions: inv.metadata?.sessionCount || 8,
            completedSessions: 0,
            nextSession: mockSessions.find((s) => s.status === "upcoming"),
          }));
        }

        const mockPrograms: TeamMemberProgram[] =
          programsFromInvitations.length > 0
            ? programsFromInvitations
            : [
                {
                  id: "program-1",
                  title: user?.programTitle || "Leadership Development Program",
                  description:
                    "A comprehensive program focused on building leadership skills and strategic thinking",
                  coach: {
                    name: "Sarah Johnson",
                    title: "Senior Leadership Coach",
                    avatar: "https://avatar.vercel.sh/sarah@example.com",
                  },
                  role:
                    (user?.role as "participant" | "observer") || "participant",
                  status: "active",
                  progress: 60,
                  totalSessions: 10,
                  completedSessions: 6,
                  nextSession: mockSessions.find(
                    (s) => s.status === "upcoming",
                  ),
                },
              ];

        setSessions(mockSessions);
        setPrograms(mockPrograms);

        // Load pending invitations
        if (user?.email) {
          const userPendingInvitations =
            invitationService.getPendingInvitations(user.email);
          setPendingInvitations(userPendingInvitations);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleRateSession = (session: TeamMemberSession) => {
    setSelectedSession(session);
    setRatingModalOpen(true);
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    if (!selectedSession) return;

    // Update session with rating
    setSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSession.id
          ? { ...session, rating, feedback, hasRated: true }
          : session,
      ),
    );

    toast.success("Thank you for your feedback!");
    setRatingModalOpen(false);
    setSelectedSession(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const unratedSessions = completedSessions.filter((s) => !s.hasRated);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "Team Member"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your learning progress and upcoming sessions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Upcoming Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {upcomingSessions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Completed Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedSessions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Ratings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unratedSessions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Programs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {programs.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Ratings Alert */}
        {unratedSessions.length > 0 && (
          <Alert className="mb-6">
            <Star className="h-4 w-4" />
            <AlertDescription>
              You have {unratedSessions.length} completed session
              {unratedSessions.length > 1 ? "s" : ""} waiting for your feedback.
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary ml-1"
                onClick={() => handleRateSession(unratedSessions[0])}
              >
                Rate now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="programs">My Programs</TabsTrigger>
            <TabsTrigger value="feedback">Feedback History</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6">
            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={session.coach.avatar} />
                                <AvatarFallback>
                                  {session.coach.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  {session.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {session.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span>with {session.coach.name}</span>
                                  <span>
                                    {new Date(
                                      session.date,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span>
                                    {new Date(
                                      session.date,
                                    ).toLocaleTimeString()}
                                  </span>
                                  <span>{session.duration} min</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleColor(session.role)}>
                              {session.role}
                            </Badge>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            {session.status === "live" ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  toast.success("Joining live session...");
                                  navigate(
                                    `/session/video?sessionId=${session.id}&programId=${session.programTitle}`,
                                  );
                                }}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join Live
                              </Button>
                            ) : session.meetingLink ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  toast.success("Accessing session...");
                                  navigate(
                                    `/session/video?sessionId=${session.id}&programId=${session.programTitle}`,
                                  );
                                }}
                                variant="outline"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join Session
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                <Clock className="w-4 h-4 mr-1" />
                                Waiting for Host
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Completed Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={session.coach.avatar} />
                              <AvatarFallback>
                                {session.coach.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{session.title}</h4>
                              <p className="text-sm text-gray-600">
                                {session.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>with {session.coach.name}</span>
                                <span>
                                  {new Date(session.date).toLocaleDateString()}
                                </span>
                              </div>
                              {session.hasRated && session.rating && (
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= session.rating!
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    Your rating
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleColor(session.role)}>
                            {session.role}
                          </Badge>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                          {!session.hasRated && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRateSession(session)}
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Rate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{program.title}</CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                    </div>
                    <Badge className={getRoleColor(program.role)}>
                      {program.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={program.coach.avatar} />
                        <AvatarFallback>
                          {program.coach.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{program.coach.name}</h4>
                        <p className="text-sm text-gray-600">
                          {program.coach.title}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {program.completedSessions}
                        </p>
                        <p className="text-sm text-gray-600">
                          Sessions Completed
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {program.totalSessions - program.completedSessions}
                        </p>
                        <p className="text-sm text-gray-600">
                          Sessions Remaining
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          {program.progress}%
                        </p>
                        <p className="text-sm text-gray-600">Progress</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Your Feedback History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedSessions
                    .filter((s) => s.hasRated)
                    .map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{session.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(session.date).toLocaleDateString()} with{" "}
                              {session.coach.name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= (session.rating || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({session.rating}/5)
                              </span>
                            </div>
                            {session.feedback && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                "{session.feedback}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Modal */}
      {selectedSession && (
        <SessionRatingModal
          isOpen={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          onSubmit={handleRatingSubmit}
          session={{
            title: selectedSession.title,
            coach: selectedSession.coach.name,
            date: selectedSession.date,
          }}
        />
      )}
    </div>
  );
};

export default TeamMemberDashboard;
