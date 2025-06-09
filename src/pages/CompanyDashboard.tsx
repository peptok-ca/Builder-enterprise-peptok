import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetricsOverview from "@/components/metrics/MetricsOverview";
import { useNavigate } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  BarChart3,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  MessageSquare,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import {
  mockMetrics,
  mockDashboardStats,
  mockConnections,
  mockExperts,
} from "@/data/mockData";

const CompanyDashboard = () => {
  const navigate = useNavigate();

  // Enhanced mock data
  const recentActivities = [
    {
      id: "1",
      type: "new_connection",
      user: "Alex Johnson",
      expert: "Sarah Chen",
      message: "New mentorship connection established",
      timestamp: "2 hours ago",
      status: "success",
      impact: "high",
    },
    {
      id: "2",
      type: "session_completed",
      user: "Emily Davis",
      expert: "Michael Rodriguez",
      message: "Completed advanced data analysis session",
      timestamp: "4 hours ago",
      status: "success",
      impact: "medium",
    },
    {
      id: "3",
      type: "goal_achieved",
      user: "Alex Johnson",
      expert: "Sarah Chen",
      message: "Leadership Development milestone reached",
      timestamp: "1 day ago",
      status: "success",
      impact: "high",
    },
    {
      id: "4",
      type: "session_missed",
      user: "Michael Park",
      expert: "Jennifer Park",
      message: "Scheduled session missed - follow-up required",
      timestamp: "2 days ago",
      status: "warning",
      impact: "medium",
    },
    {
      id: "5",
      type: "new_expert",
      expert: "David Kim",
      message: "New expert joined the platform",
      timestamp: "3 days ago",
      status: "success",
      impact: "low",
    },
  ];

  const topPerformers = [
    {
      name: "Alex Johnson",
      department: "Engineering",
      progress: 92,
      sessions: 12,
      goals: 8,
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face",
      trend: "up",
      points: 1850,
    },
    {
      name: "Emily Davis",
      department: "Analytics",
      progress: 88,
      sessions: 10,
      goals: 6,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9d3cc57?w=400&h=400&fit=crop&crop=face",
      trend: "up",
      points: 1650,
    },
    {
      name: "Michael Park",
      department: "Product",
      progress: 75,
      sessions: 8,
      goals: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      trend: "down",
      points: 1200,
    },
    {
      name: "Sarah Williams",
      department: "Design",
      progress: 85,
      sessions: 9,
      goals: 7,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      trend: "up",
      points: 1400,
    },
  ];

  const departmentStats = [
    {
      department: "Engineering",
      employees: 45,
      engagement: 89,
      avgProgress: 78,
      color: "from-blue-500 to-blue-600",
    },
    {
      department: "Product",
      employees: 23,
      engagement: 92,
      avgProgress: 82,
      color: "from-green-500 to-green-600",
    },
    {
      department: "Design",
      employees: 18,
      engagement: 87,
      avgProgress: 75,
      color: "from-purple-500 to-purple-600",
    },
    {
      department: "Marketing",
      employees: 32,
      engagement: 85,
      avgProgress: 71,
      color: "from-pink-500 to-pink-600",
    },
    {
      department: "Sales",
      employees: 28,
      engagement: 90,
      avgProgress: 79,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const expertPerformance = [
    {
      name: "Sarah Chen",
      specialty: "Leadership",
      rating: 4.9,
      sessions: 35,
      students: 12,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b9d3cc57?w=400&h=400&fit=crop&crop=face",
      satisfaction: 98,
      revenue: 12500,
    },
    {
      name: "Michael Rodriguez",
      specialty: "Data Science",
      rating: 4.8,
      sessions: 28,
      students: 9,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      satisfaction: 96,
      revenue: 9800,
    },
    {
      name: "Jennifer Park",
      specialty: "Marketing",
      rating: 4.9,
      sessions: 42,
      students: 15,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      satisfaction: 97,
      revenue: 15200,
    },
  ];

  const getActivityIcon = (type: string, status: string) => {
    if (status === "warning")
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (status === "success") {
      switch (type) {
        case "new_connection":
          return <Users className="h-4 w-4 text-blue-500" />;
        case "session_completed":
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "goal_achieved":
          return <Award className="h-4 w-4 text-purple-500" />;
        case "new_expert":
          return <Plus className="h-4 w-4 text-teal-500" />;
        default:
          return <CheckCircle className="h-4 w-4 text-green-500" />;
      }
    }
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-blue-100/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header userType="admin" />

        <main className="container py-8">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Company Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  Monitor and optimize your organization's mentorship program
                  performance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => navigate("/mentorship/new")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Mentorship Request
                </Button>
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

            {/* Enhanced Metrics Overview */}
            <MetricsOverview metrics={mockMetrics} stats={mockDashboardStats} />

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="experts">Experts</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span>Recent Activity</span>
                        </CardTitle>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                          >
                            <div className="p-2 rounded-full bg-muted">
                              {getActivityIcon(activity.type, activity.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  {activity.message}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={getImpactBadge(activity.impact)}
                                >
                                  {activity.impact}
                                </Badge>
                              </div>
                              {activity.user && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {activity.user}{" "}
                                  {activity.expert && `• ${activity.expert}`}
                                </p>
                              )}
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
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span>Top Performers</span>
                      </CardTitle>
                      <CardDescription>
                        Employees with highest engagement this month
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topPerformers.slice(0, 5).map((performer, index) => (
                        <div
                          key={performer.name}
                          className="flex items-center space-x-3"
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="text-sm font-medium text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <Avatar className="h-10 w-10">
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
                              <p className="text-sm font-medium truncate">
                                {performer.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {performer.department}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <p className="text-sm font-medium">
                                {performer.progress}%
                              </p>
                              {performer.trend === "up" ? (
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {performer.points} pts
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Department Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span>Department Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {departmentStats.map((dept) => (
                        <Card
                          key={dept.department}
                          className="hover:shadow-md transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">
                                  {dept.department}
                                </h4>
                                <Badge variant="secondary">
                                  {dept.employees}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Engagement</span>
                                  <span>{dept.engagement}%</span>
                                </div>
                                <Progress
                                  value={dept.engagement}
                                  className="h-1"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Avg Progress</span>
                                  <span>{dept.avgProgress}%</span>
                                </div>
                                <Progress
                                  value={dept.avgProgress}
                                  className="h-1"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employees" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">
                    Employee Management
                  </h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Employee Overview</CardTitle>
                    <CardDescription>
                      Manage employee participation and track individual
                      progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformers.map((employee) => (
                        <div
                          key={employee.name}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={employee.avatar}
                                alt={employee.name}
                              />
                              <AvatarFallback>
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {employee.department}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                <span>{employee.sessions} sessions</span>
                                <span>{employee.goals} goals</span>
                                <span>{employee.points} points</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {employee.progress}% complete
                              </p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Progress
                                  value={employee.progress}
                                  className="w-20 h-2"
                                />
                                {employee.trend === "up" ? (
                                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experts" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">Expert Network</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Expert
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Expert Performance</CardTitle>
                    <CardDescription>
                      Monitor expert availability, performance, and student
                      satisfaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {expertPerformance.map((expert) => (
                        <Card
                          key={expert.name}
                          className="hover:shadow-lg transition-all duration-200"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage
                                  src={expert.avatar}
                                  alt={expert.name}
                                />
                                <AvatarFallback>
                                  {expert.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{expert.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {expert.specialty}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <div className="flex space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className={`h-2 w-2 rounded-full ${i < Math.floor(expert.rating) ? "bg-yellow-400" : "bg-gray-200"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs font-medium">
                                    {expert.rating}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Sessions
                                </span>
                                <span className="font-medium">
                                  {expert.sessions}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Students
                                </span>
                                <span className="font-medium">
                                  {expert.students}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Satisfaction
                                </span>
                                <span className="font-medium">
                                  {expert.satisfaction}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Revenue
                                </span>
                                <span className="font-medium">
                                  ${expert.revenue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
                    <CardContent className="h-64">
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <TrendingUp className="h-12 w-12 mx-auto" />
                          <p>Analytics chart would be rendered here</p>
                          <p className="text-sm">
                            Integration with charting library needed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Development</CardTitle>
                      <CardDescription>
                        Progress across different skill areas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <BarChart3 className="h-12 w-12 mx-auto" />
                          <p>Skill development chart would be rendered here</p>
                          <p className="text-sm">
                            Integration with charting library needed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>ROI Analysis</CardTitle>
                      <CardDescription>
                        Return on investment metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <Target className="h-12 w-12 mx-auto" />
                          <p>ROI analysis chart would be rendered here</p>
                          <p className="text-sm">
                            Financial impact visualization
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Global Reach</CardTitle>
                      <CardDescription>
                        Geographic distribution of users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <Globe className="h-12 w-12 mx-auto" />
                          <p>World map visualization would be rendered here</p>
                          <p className="text-sm">Geographic analytics</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-200 rounded-full">
                          <Zap className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">
                            AI Insight
                          </h4>
                          <p className="text-sm text-blue-800">
                            Engineering department shows 23% higher engagement
                            when paired with technical experts vs. general
                            leadership mentors.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-green-200 rounded-full">
                          <TrendingUp className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-900 mb-2">
                            Growth Opportunity
                          </h4>
                          <p className="text-sm text-green-800">
                            Adding 3 more marketing experts could improve
                            marketing team engagement by an estimated 15%.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-purple-200 rounded-full">
                          <Award className="h-6 w-6 text-purple-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-2">
                            Success Pattern
                          </h4>
                          <p className="text-sm text-purple-800">
                            Employees with 2+ mentors show 40% better goal
                            completion rates compared to single-mentor
                            relationships.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

export default CompanyDashboard;
