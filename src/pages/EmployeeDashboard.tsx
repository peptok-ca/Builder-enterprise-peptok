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
import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Video,
  Plus,
} from "lucide-react";
import { mockConnections, mockEmployees } from "@/data/mockData";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  const employee = mockEmployees[0]; // Mock current user
  const userConnections = mockConnections.filter(
    (conn) => conn.employee.id === employee.id,
  );

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: "1",
      expertName: "Sarah Chen",
      date: "Today, 2:00 PM",
      topic: "Leadership Development",
      type: "video",
    },
    {
      id: "2",
      expertName: "Michael Rodriguez",
      date: "Tomorrow, 10:00 AM",
      topic: "Data Analysis Best Practices",
      type: "in-person",
    },
  ];

  // Mock recent achievements
  const achievements = [
    {
      id: "1",
      title: "Completed Leadership Fundamentals",
      date: "2 days ago",
      type: "milestone",
    },
    {
      id: "2",
      title: "Scheduled 5th session with Sarah",
      date: "1 week ago",
      type: "session",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userType="employee" />

      <main className="container py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {employee.name}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your mentorship journey at a glance.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userConnections.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Mentors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userConnections.reduce(
                        (sum, conn) => sum + conn.sessionsCompleted,
                        0,
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sessions Completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {employee.goals.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Goals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-sm text-muted-foreground">
                      Goal Progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Connections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Your Mentors</h2>
                  <Button asChild>
                    <Link to="/experts">
                      <Plus className="h-4 w-4 mr-2" />
                      Find Mentor
                    </Link>
                  </Button>
                </div>

                {userConnections.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No active mentors yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start your mentorship journey by connecting with an
                        expert.
                      </p>
                      <Button asChild>
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

              {/* Goals Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Your Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employee.goals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal}</span>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                      <Progress value={65 + index * 10} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {65 + index * 10}% complete
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border"
                    >
                      <div className="p-2 bg-primary/10 rounded">
                        {session.type === "video" ? (
                          <Video className="h-4 w-4 text-primary" />
                        ) : (
                          <Users className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {session.expertName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.topic}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Session
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-1.5 bg-green-100 rounded">
                        <BookOpen className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Resources
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmployeeDashboard;
