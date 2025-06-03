import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetricsOverview from "@/components/metrics/MetricsOverview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  TrendingUp,
  Calendar,
  Target,
  Download,
  Settings,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  mockMetrics,
  mockDashboardStats,
  mockConnections,
  mockExperts,
} from "@/data/mockData";

const CompanyDashboard = () => {
  // Mock recent activities
  const recentActivities = [
    {
      id: "1",
      type: "new_connection",
      message: "Alex Johnson connected with Sarah Chen",
      timestamp: "2 hours ago",
      status: "success",
    },
    {
      id: "2",
      type: "session_completed",
      message: "Emily Davis completed session with Michael Rodriguez",
      timestamp: "4 hours ago",
      status: "success",
    },
    {
      id: "3",
      type: "goal_achieved",
      message: "Leadership Development goal achieved by Alex Johnson",
      timestamp: "1 day ago",
      status: "success",
    },
    {
      id: "4",
      type: "session_missed",
      message: "Scheduled session missed - requires follow-up",
      timestamp: "2 days ago",
      status: "warning",
    },
  ];

  // Mock top performers
  const topPerformers = [
    {
      name: "Alex Johnson",
      department: "Engineering",
      progress: 85,
      sessions: 8,
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Emily Davis",
      department: "Analytics",
      progress: 78,
      sessions: 6,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9d3cc57?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Michael Park",
      department: "Product",
      progress: 72,
      sessions: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
  ];

  const getActivityIcon = (type: string, status: string) => {
    if (status === "warning")
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (status === "success")
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userType="admin" />

      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                Company Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Monitor and optimize your organization's mentorship program
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <MetricsOverview metrics={mockMetrics} stats={mockDashboardStats} />

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="experts">Experts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Recent Activity</span>
                      </CardTitle>
                      <CardDescription>
                        Latest updates across your mentorship program
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border"
                        >
                          {getActivityIcon(activity.type, activity.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {activity.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" size="sm">
                        View All Activity
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Top Performers</span>
                    </CardTitle>
                    <CardDescription>
                      Employees with highest engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div
                        key={performer.name}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <span className="text-sm font-medium text-muted-foreground w-4">
                            {index + 1}
                          </span>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={performer.avatar}
                              alt={performer.name}
                            />
                            <AvatarFallback>
                              {performer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {performer.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {performer.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {performer.progress}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {performer.sessions} sessions
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Employee Management</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Employee Overview</CardTitle>
                  <CardDescription>
                    Manage employee participation and track progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockConnections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={connection.employee.avatar} />
                            <AvatarFallback>
                              {connection.employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {connection.employee.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {connection.employee.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {connection.progress}% complete
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {connection.sessionsCompleted}/
                              {connection.totalSessions} sessions
                            </p>
                          </div>
                          <Badge
                            variant={
                              connection.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {connection.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Expert Network</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Expert
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Expert Overview</CardTitle>
                  <CardDescription>
                    Monitor expert availability and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockExperts.slice(0, 6).map((expert) => (
                      <div
                        key={expert.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={expert.avatar} />
                            <AvatarFallback>
                              {expert.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{expert.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {expert.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="font-medium">
                            {expert.rating} ⭐
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Sessions
                          </span>
                          <span className="font-medium">
                            {expert.totalSessions}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {expert.expertise[0]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Trends</CardTitle>
                    <CardDescription>
                      Employee participation over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Chart visualization would go here
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skill Development</CardTitle>
                    <CardDescription>
                      Progress across different skill areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Chart visualization would go here
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;
