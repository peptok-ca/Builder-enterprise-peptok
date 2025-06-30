import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  Share,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SessionParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "coach" | "participant" | "observer" | "admin";
  userType: "coach" | "team_member" | "company_admin";
  isOnline: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  joinedAt?: Date;
}

interface SessionData {
  id: string;
  title: string;
  description: string;
  coach: {
    name: string;
    avatar?: string;
    title: string;
  };
  startTime: string;
  duration: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  participants: SessionParticipant[];
  meetingId: string;
}

export default function VideoConference() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = searchParams.get("sessionId");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [canManageSession, setCanManageSession] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      toast.error("Invalid session link");
      navigate("/");
      return;
    }

    const loadSessionData = async () => {
      try {
        // Try to fetch real session data from API
        const programId = searchParams.get("programId");

        let sessionData: SessionData;

        try {
          // Attempt to get real session data
          const requests = await api.getMentorshipRequests();
          const program = requests.find((r) => r.id === programId);

          if (program) {
            sessionData = {
              id: sessionId,
              title: `${program.title} Session`,
              description: program.description,
              coach: {
                name: "Sarah Johnson", // This would come from assigned coach
                avatar: "https://avatar.vercel.sh/sarah@example.com",
                title: "Senior Leadership Coach",
              },
              startTime: new Date().toISOString(),
              duration: 60,
              status: "upcoming",
              participants: [
                {
                  id: "coach-1",
                  name: "Sarah Johnson",
                  email: "sarah@example.com",
                  role: "coach",
                  userType: "coach",
                  isOnline: true,
                  videoEnabled: true,
                  audioEnabled: true,
                },
                // Add all team members from the program
                ...program.teamMembers.map((member) => ({
                  id: member.id,
                  name: member.name || member.email.split("@")[0],
                  email: member.email,
                  role: member.role,
                  userType: "team_member" as const,
                  isOnline: member.id === user?.id, // Only current user is marked as online initially
                  videoEnabled: true,
                  audioEnabled: true,
                  joinedAt: undefined,
                })),
              ],
            };
          } else {
            throw new Error("Program not found");
          }
        } catch (error) {
          console.warn("Using fallback session data:", error);
          // Fallback to mock data
          sessionData = {
            id: sessionId,
            title: "React Development Training Session",
            description:
              "Help our team improve their React skills and best practices",
            coach: {
              name: "Sarah Johnson",
              avatar: "https://avatar.vercel.sh/sarah@example.com",
              title: "Senior Leadership Coach",
            },
            startTime: new Date().toISOString(),
            duration: 60,
            status: "upcoming",
            participants: [
              {
                id: "coach-1",
                name: "Sarah Johnson",
                email: "sarah@example.com",
                role: "coach",
                userType: "coach",
                isOnline: true,
                videoEnabled: true,
                audioEnabled: true,
              },
              {
                id: "member_1",
                name: "John Doe",
                email: "john.doe@company.com",
                role: "participant",
                userType: "team_member",
                isOnline: user?.id === "member_1",
                videoEnabled: true,
                audioEnabled: true,
              },
              {
                id: user?.id || "current-user",
                name: user?.name || "Current User",
                email: user?.email || "user@example.com",
                role: user?.role || "participant",
                userType: user?.userType || "team_member",
                isOnline: false,
                videoEnabled: true,
                audioEnabled: true,
              },
            ],
          };
        }

        // Add meeting ID to session data
        sessionData.meetingId = `meeting-${sessionId}`;

        setSession(sessionData);

        // Check if user can manage session (coach or admin)
        const userCanManage =
          user?.userType === "coach" ||
          user?.userType === "company_admin" ||
          user?.userType === "platform_admin";
        setCanManageSession(userCanManage);
      } catch (error) {
        toast.error("Failed to load session data");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId, navigate, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasJoined && session?.status === "live") {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasJoined, session?.status]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("Failed to access media devices:", error);
      toast.error("Failed to access camera/microphone");
      throw error;
    }
  };

  const joinSession = async () => {
    if (!session || !user) return;

    setIsJoining(true);

    try {
      // Initialize media
      await initializeMedia();

      // In real app, this would connect to video service (WebRTC, Zoom SDK, etc.)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update session status and participant
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "live",
          participants: prev.participants.map((p) =>
            p.id === user.id
              ? { ...p, isOnline: true, joinedAt: new Date() }
              : p,
          ),
        };
      });

      setHasJoined(true);
      toast.success("Successfully joined the session!");
    } catch (error) {
      toast.error("Failed to join session");
    } finally {
      setIsJoining(false);
    }
  };

  const startSession = async () => {
    if (!session || !canManageSession) return;

    setIsJoining(true);

    try {
      await initializeMedia();

      // Start the session
      setSession((prev) => (prev ? { ...prev, status: "live" } : prev));
      setHasJoined(true);

      toast.success("Session started successfully!");
    } catch (error) {
      toast.error("Failed to start session");
    } finally {
      setIsJoining(false);
    }
  };

  const endSession = async () => {
    if (!session || !canManageSession) return;

    try {
      // End the session
      setSession((prev) => (prev ? { ...prev, status: "completed" } : prev));

      // Clean up media
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      toast.success("Session ended successfully!");

      // Redirect after a short delay
      setTimeout(() => {
        const dashboardPath =
          user?.userType === "coach"
            ? "/coach/dashboard"
            : user?.userType === "team_member"
              ? "/team-member/dashboard"
              : "/dashboard";
        navigate(dashboardPath);
      }, 2000);
    } catch (error) {
      toast.error("Failed to end session");
    }
  };

  const markOfflineComplete = async () => {
    if (!session || !canManageSession) return;

    try {
      setSession((prev) => (prev ? { ...prev, status: "completed" } : prev));
      toast.success("Session marked as completed offline");

      // Redirect after a short delay
      setTimeout(() => {
        const dashboardPath =
          user?.userType === "coach"
            ? "/coach/dashboard"
            : user?.userType === "team_member"
              ? "/team-member/dashboard"
              : "/dashboard";
        navigate(dashboardPath);
      }, 2000);
    } catch (error) {
      toast.error("Failed to mark session as complete");
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const leaveSession = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    const dashboardPath =
      user?.userType === "coach"
        ? "/coach/dashboard"
        : user?.userType === "team_member"
          ? "/team-member/dashboard"
          : "/dashboard";
    navigate(dashboardPath);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Session not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // Pre-session view
  if (!hasJoined && session.status !== "live") {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
              <p className="text-gray-300">{session.description}</p>
              <Badge className="mt-2">
                {session.status === "upcoming"
                  ? "Ready to Start"
                  : session.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Preview */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Camera Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        variant={videoEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleVideo}
                      >
                        {videoEnabled ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <VideoOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant={audioEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleAudio}
                      >
                        {audioEnabled ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <MicOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={session.coach.avatar} />
                      <AvatarFallback>
                        {session.coach.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">
                        {session.coach.name}
                      </p>
                      <p className="text-sm text-gray-300">
                        {session.coach.title}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Duration:</span>
                      <span className="text-white">
                        {session.duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Meeting ID:</span>
                      <span className="text-white font-mono">
                        {session.meetingId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Participants:</span>
                      <span className="text-white">
                        {session.participants.length}
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {canManageSession ? (
                      <>
                        <Button
                          onClick={startSession}
                          disabled={isJoining}
                          className="w-full bg-green-600 hover:bg-green-700"
                          size="lg"
                        >
                          {isJoining ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Starting Session...
                            </>
                          ) : (
                            <>
                              <Video className="w-4 h-4 mr-2" />
                              Start Session
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={markOfflineComplete}
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Done Offline
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={joinSession}
                        disabled={isJoining || session.status !== "live"}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        {isJoining ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Joining Session...
                          </>
                        ) : session.status === "live" ? (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            Join Session
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Waiting for Host
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // In-session view
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Session Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{session.title}</h1>
            <Badge className="bg-red-600">
              LIVE • {formatTime(sessionTimer)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{session.participants.filter((p) => p.isOnline).length}</span>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Main Video */}
          <div className="lg:col-span-3">
            <div className="relative h-96 lg:h-full bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  variant={videoEnabled ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleVideo}
                >
                  {videoEnabled ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={audioEnabled ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleAudio}
                >
                  {audioEnabled ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
                {canManageSession && (
                  <Button onClick={endSession} variant="destructive" size="sm">
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={leaveSession} variant="outline" size="sm">
                  Leave
                </Button>
              </div>
            </div>
          </div>

          {/* Participants Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Participants ({session.participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {session.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {participant.name}
                        {participant.role === "coach" && " (Coach)"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {participant.role}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!participant.videoEnabled && (
                        <VideoOff className="w-3 h-3 text-red-400" />
                      )}
                      {!participant.audioEnabled && (
                        <MicOff className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
