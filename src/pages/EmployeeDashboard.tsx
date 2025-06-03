import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConnectionCard from "@/components/connection/ConnectionCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Video,
  Plus,
  Award,
  Clock,
  Star,
  BarChart3,
  CheckCircle,
  Activity,
  Bell,
  Filter,
  ArrowRight,
} from "lucide-react";
import { mockConnections, mockEmployees } from "@/data/mockData";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  const employee = mockEmployees[0]; // Mock current user
  const userConnections = mockConnections.filter(
    (conn) => conn.employee.id === employee.id,
  );

  // Mock data for enhanced dashboard
  const upcomingSessions = [
    {
      id: "1",
      expertName: "Sarah Chen",
      expertAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9d3cc57?w=400&h=400&fit=crop&crop=face",
      date: "Today, 2:00 PM",
      topic: "Leadership Development",
      type: "video",
      duration: "60 min",
      status: "confirmed",
    },
    {
      id: "2",
      expertName: "Michael Rodriguez",
      expertAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      date: "Tomorrow, 10:00 AM",
      topic: "Data Analysis Best Practices",
      type: "in-person",
      duration: "45 min",
      status: "pending",
    },
    {
      id: "3",
      expertName: "Jennifer Park",
      expertAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      date: "Friday, 3:00 PM",
      topic: "Marketing Strategy Review",
      type: "video",
      duration: "30 min",
      status: "confirmed",
    },
  ];

  const recentAchievements = [
    {
      id: "1",
      title: "Completed Leadership Fundamentals",
      description: "Finished 8-week leadership development program",
      date: "2 days ago",
      type: "milestone",
      points: 250,
      icon: Award,
    },
    {
      id: "2",
      title: "Perfect Session Attendance",
      description: "Attended all scheduled sessions this month",
      date: "1 week ago",
      type: "streak",
      points: 100,
      icon: CheckCircle,
    },
    {
      id: "3",
      title: "Skill Assessment Completed",
      description: "Scored 85% on advanced data analysis assessment",
      date: "2 weeks ago",
      type: "assessment",
      points: 150,
      icon: BarChart3,
    },
  ];

  const learningPaths = [
    {
      id: "1",
      title: "Advanced Leadership",
      description: "Develop executive leadership skills",
      progress: 75,
      totalModules: 12,
      completedModules: 9,
      estimatedTime: "3 weeks",
      difficulty: "Advanced",
      mentor: "Sarah Chen",
    },
    {
      id: "2",
      title: "Data Science Mastery",
      description: "Master data analysis and visualization",
      progress: 45,
      totalModules: 15,
      completedModules: 7,
      estimatedTime: "6 weeks",
      difficulty: "Intermediate",
      mentor: "Michael Rodriguez",
    },
  ];

  const skillProgress = [
    { skill: "Leadership", current: 78, target: 85, trend: "+8%" },
    { skill: "Data Analysis", current: 65, target: 80, trend: "+12%" },
    { skill: "Communication", current: 82, target: 90, trend: "+5%" },
    { skill: "Project Management", current: 70, target: 85, trend: "+15%" },
  ];

  const totalPoints = recentAchievements.reduce(
    (sum, achievement) => sum + achievement.points,
    0,
  );
  const totalSessions = userConnections.reduce(
    (sum, conn) => sum + conn.sessionsCompleted,
    0,
  );
  const avgProgress =
    userConnections.length > 0
      ? userConnections.reduce((sum, conn) => sum + conn.progress, 0) /
        userConnections.length
      : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-blue-100/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header userType="employee" />

        <main className="container py-8">
          <div className="space-y-8">
            {/* Enhanced Welcome Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Welcome back, {employee.name}!
                  </h1>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-yellow-600">
                      {totalPoints} pts
                    </span>
                  </div>
                </div>
                <p className="text-xl text-muted-foreground">
                  Here's your mentorship journey at a glance. You're doing
                  great!
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
                <Button asChild>
                  <Link to="/experts">
                    <Plus className="h-4 w-4 mr-2" />
                    Find Mentor
                  </Link>
                </Button>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-700">
                        {userConnections.length}
                      </p>
                      <p className="text-sm text-blue-600">Active Mentors</p>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-full">
                      <Users className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-700">
                        {totalSessions}
                      </p>
                      <p className="text-sm text-green-600">
                        Sessions Completed
                      </p>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <Calendar className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-700">
                        {Math.round(avgProgress)}%
                      </p>
                      <p className="text-sm text-purple-600">Avg Progress</p>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Target className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-700">
                        {totalPoints}
                      </p>
                      <p className="text-sm text-orange-600">Total Points</p>
                    </div>
                    <div className="p-3 bg-orange-200 rounded-full">
                      <Award className="h-6 w-6 text-orange-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mentors">Mentors</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Sessions */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span>Upcoming Sessions</span>
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/schedule">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule New
                          </Link>
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={session.expertAvatar}
                                alt={session.expertName}
                              />
                              <AvatarFallback>
                                {session.expertName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold">
                                  {session.expertName}
                                </p>
                                <Badge
                                  variant={
                                    session.status === "confirmed"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {session.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {session.topic}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{session.date}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{session.duration}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  {session.type === "video" ? (
                                    <Video className="h-3 w-3" />
                                  ) : (
                                    <Users className="h-3 w-3" />
                                  )}
                                  <span>{session.type}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                              {session.type === "video" && (
                                <Button size="sm" variant="default">
                                  <Video className="h-3 w-3 mr-1" />
                                  Join
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Learning Paths */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-green-600" />
                          <span>Learning Paths</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {learningPaths.map((path) => (
                          <div
                            key={path.id}
                            className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{path.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {path.description}
                                </p>
                              </div>
                              <Badge variant="outline">{path.difficulty}</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>
                                  {path.completedModules} of {path.totalModules}{" "}
                                  modules
                                </span>
                                <span>{path.progress}% complete</span>
                              </div>
                              <Progress value={path.progress} className="h-2" />
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>Est. {path.estimatedTime}</span>
                                <span>Mentor: {path.mentor}</span>
                              </div>
                              <Button size="sm" variant="outline">
                                Continue
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Recent Achievements */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-yellow-600" />
                          <span>Recent Achievements</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {recentAchievements.map((achievement) => {
                          const Icon = achievement.icon;
                          return (
                            <div
                              key={achievement.id}
                              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                            >
                              <div className="p-2 bg-yellow-100 rounded-full">
                                <Icon className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {achievement.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {achievement.description}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {achievement.date}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{achievement.points} pts
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message a Mentor
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Session
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Browse Resources
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Update Goals
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mentors" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">Your Mentors</h3>
                    <Button asChild>
                      <Link to="/experts">
                        <Plus className="h-4 w-4 mr-2" />
                        Find New Mentor
                      </Link>
                    </Button>
                  </div>

                  {userConnections.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          No active mentors yet
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Start your mentorship journey by connecting with an
                          expert who can help you achieve your goals.
                        </p>
                        <Button asChild size="lg">
                          <Link to="/experts">Browse Experts</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userConnections.map((connection) => (
                        <ConnectionCard
                          key={connection.id}
                          connection={connection}
                          viewType="employee"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Progress Tracking</h3>

                  {/* Skill Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Development</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {skillProgress.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.skill}</span>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="secondary"
                                className="text-green-700 bg-green-100"
                              >
                                {skill.trend}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {skill.current}% / {skill.target}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Progress value={skill.current} className="h-2" />
                            <div className="w-full bg-muted h-1 rounded-full relative">
                              <div
                                className="absolute top-0 h-1 w-0.5 bg-red-500 rounded-full"
                                style={{ left: `${skill.target}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">
                    Achievements & Rewards
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentAchievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <Card
                          key={achievement.id}
                          className="hover:shadow-lg transition-all duration-300"
                        >
                          <CardContent className="p-6 text-center">
                            <div className="p-4 bg-yellow-100 rounded-full w-fit mx-auto mb-4">
                              <Icon className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h4 className="font-semibold mb-2">
                              {achievement.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {achievement.description}
                            </p>
                            <Badge
                              variant="secondary"
                              className="text-yellow-700 bg-yellow-100"
                            >
                              +{achievement.points} points
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
