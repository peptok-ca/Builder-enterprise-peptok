import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import { CSVUserUpload } from "@/components/admin/CSVUserUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Users,
  Building2,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Shield,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  userType: "platform_admin" | "company_admin" | "coach";
  status: "active" | "suspended" | "inactive";
  company?: string;
  joinedAt: string;
  lastActive: string;
  sessionsCount: number;
  revenue?: number;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  adminEmail: string;
  userCount: number;
  status: "active" | "suspended" | "trial";
  subscription: string;
  joinedAt: string;
  revenue: number;
}

interface PlatformStats {
  totalUsers: number;
  totalCompanies: number;
  totalCoaches: number;
  totalSessions: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
}

export default function PlatformAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalCoaches: 0,
    totalSessions: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUserType, setFilterUserType] = useState("all");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isCSVUploadOpen, setIsCSVUploadOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "company_admin" as const,
    company: "",
    password: "",
  });

  // New company form state
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    subscription: "starter",
  });

  // Redirect if not platform admin
  useEffect(() => {
    if (user && user.userType !== "platform_admin") {
      navigate("/");
      toast.error("Access denied. Platform admin privileges required.");
    }
  }, [user, navigate]);

  // Load data
  useEffect(() => {
    loadPlatformData();
  }, []);

  const loadPlatformData = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockStats: PlatformStats = {
        totalUsers: 1247,
        totalCompanies: 89,
        totalCoaches: 156,
        totalSessions: 3842,
        monthlyRevenue: 47580,
        activeSubscriptions: 67,
      };

      const mockUsers: User[] = [
        {
          id: "user1",
          name: "Alice Johnson",
          email: "alice@techcorp.com",
          userType: "company_admin",
          status: "active",
          company: "TechCorp Inc.",
          joinedAt: "2024-01-15",
          lastActive: "2024-01-20",
          sessionsCount: 12,
          revenue: 2400,
        },
        {
          id: "user2",
          name: "Bob Smith",
          email: "bob@coaching.com",
          userType: "coach",
          status: "active",
          joinedAt: "2024-01-10",
          lastActive: "2024-01-19",
          sessionsCount: 28,
          revenue: 5600,
        },
        {
          id: "user3",
          name: "Carol Davis",
          email: "carol@startup.com",
          userType: "company_admin",
          status: "suspended",
          company: "StartupCo",
          joinedAt: "2024-01-05",
          lastActive: "2024-01-18",
          sessionsCount: 5,
          revenue: 1000,
        },
      ];

      const mockCompanies: Company[] = [
        {
          id: "comp1",
          name: "TechCorp Inc.",
          industry: "Technology",
          adminEmail: "alice@techcorp.com",
          userCount: 25,
          status: "active",
          subscription: "Growth Plan",
          joinedAt: "2024-01-15",
          revenue: 4950,
        },
        {
          id: "comp2",
          name: "StartupCo",
          industry: "Fintech",
          adminEmail: "carol@startup.com",
          userCount: 8,
          status: "trial",
          subscription: "Starter Plan",
          joinedAt: "2024-01-05",
          revenue: 792,
        },
      ];

      setStats(mockStats);
      setUsers(mockUsers);
      setCompanies(mockCompanies);
    } catch (error) {
      toast.error("Failed to load platform data");
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, status: "suspended" as const } : u,
      );
      setUsers(updatedUsers);
      toast.success("User suspended successfully");
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, status: "active" as const } : u,
      );
      setUsers(updatedUsers);
      toast.success("User activated successfully");
    } catch (error) {
      toast.error("Failed to activate user");
    }
  };

  const handleCreateUser = async () => {
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const user: User = {
        id: `user_${Date.now()}`,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        userType: newUser.userType,
        status: "active",
        company:
          newUser.userType === "company_admin" ? newUser.company : undefined,
        joinedAt: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        sessionsCount: 0,
        revenue: 0,
      };

      setUsers((prev) => [...prev, user]);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        userType: "company_admin",
        company: "",
        password: "",
      });
      setIsCreateUserOpen(false);
      toast.success("User created successfully");
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const handleCreateCompany = async () => {
    if (
      !newCompany.name ||
      !newCompany.industry ||
      !newCompany.adminFirstName ||
      !newCompany.adminLastName ||
      !newCompany.adminEmail
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const company: Company = {
        id: `comp_${Date.now()}`,
        name: newCompany.name,
        industry: newCompany.industry,
        adminEmail: newCompany.adminEmail,
        userCount: 1,
        status: "trial",
        subscription: newCompany.subscription,
        joinedAt: new Date().toISOString().split("T")[0],
        revenue: 0,
      };

      // Also create the admin user
      const adminUser: User = {
        id: `user_${Date.now()}`,
        name: `${newCompany.adminFirstName} ${newCompany.adminLastName}`,
        email: newCompany.adminEmail,
        userType: "company_admin",
        status: "active",
        company: newCompany.name,
        joinedAt: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        sessionsCount: 0,
        revenue: 0,
      };

      setCompanies((prev) => [...prev, company]);
      setUsers((prev) => [...prev, adminUser]);
      setNewCompany({
        name: "",
        industry: "",
        adminFirstName: "",
        adminLastName: "",
        adminEmail: "",
        subscription: "starter",
      });
      setIsCreateCompanyOpen(false);
      toast.success("Company and admin user created successfully");
    } catch (error) {
      toast.error("Failed to create company");
    }
  };

  const handleCSVUpload = (csvUsers: any[]) => {
    // Convert CSV users to User format
    const newUsers: User[] = csvUsers.map((csvUser, index) => ({
      id: `csv-user-${Date.now()}-${index}`,
      name: `${csvUser.firstName} ${csvUser.lastName}`,
      firstName: csvUser.firstName,
      lastName: csvUser.lastName,
      email: csvUser.email,
      userType: csvUser.userType,
      status: "active",
      company: csvUser.company,
      joinedAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      sessionsCount: 0,
      revenue: 0,
    }));

    setUsers((prev) => [...prev, ...newUsers]);
    toast.success(`Successfully imported ${newUsers.length} users from CSV`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company &&
        user.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesType =
      filterUserType === "all" || user.userType === filterUserType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "suspended":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "trial":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "platform_admin":
        return "bg-purple-100 text-purple-800";
      case "company_admin":
        return "bg-blue-100 text-blue-800";
      case "coach":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (user?.userType !== "platform_admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-100/30">
      <Header userType="platform_admin" />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8 text-purple-600" />
                Platform Administration
              </h1>
              <p className="text-muted-foreground">
                Manage users, companies, and platform-wide settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/mentorship/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Program
              </Button>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                    <p className="text-xs text-muted-foreground">Companies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCoaches}</p>
                    <p className="text-xs text-muted-foreground">Coaches</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      ${(stats.monthlyRevenue / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monthly Revenue
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {stats.activeSubscriptions}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Active Subscriptions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <div className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Manage all platform users and their permissions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCSVUploadOpen(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </Button>
                    <Dialog
                      open={isCreateUserOpen}
                      onOpenChange={setIsCreateUserOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Add a new user to the platform
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={newUser.firstName}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  firstName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={newUser.lastName}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="userType">User Type *</Label>
                          <Select
                            value={newUser.userType}
                            onValueChange={(value: any) =>
                              setNewUser({ ...newUser, userType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="platform_admin">
                                Platform Admin
                              </SelectItem>
                              <SelectItem value="company_admin">
                                Company Admin
                              </SelectItem>
                              <SelectItem value="coach">Coach</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newUser.userType === "company_admin" && (
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={newUser.company}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  company: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="password">Temporary Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateUserOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateUser}>
                            Create User
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterUserType}
                    onValueChange={setFilterUserType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="platform_admin">
                        Platform Admin
                      </SelectItem>
                      <SelectItem value="company_admin">
                        Company Admin
                      </SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getUserTypeColor(user.userType)}
                          >
                            {user.userType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.company || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.sessionsCount}</TableCell>
                        <TableCell>
                          {user.revenue
                            ? `$${user.revenue.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        <TableCell>{user.joinedAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsUserDetailsOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="text-red-600"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleActivateUser(user.id)}
                                  className="text-green-600"
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Management
                    </CardTitle>
                    <CardDescription>
                      Manage companies and their subscriptions
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isCreateCompanyOpen}
                    onOpenChange={setIsCreateCompanyOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Company
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Company</DialogTitle>
                        <DialogDescription>
                          Add a new company and create its admin user
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={newCompany.name}
                            onChange={(e) =>
                              setNewCompany({
                                ...newCompany,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry *</Label>
                          <Select
                            value={newCompany.industry}
                            onValueChange={(value) =>
                              setNewCompany({ ...newCompany, industry: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technology">
                                Technology
                              </SelectItem>
                              <SelectItem value="Healthcare">
                                Healthcare
                              </SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Education">
                                Education
                              </SelectItem>
                              <SelectItem value="Manufacturing">
                                Manufacturing
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="adminFirstName">
                              Admin First Name *
                            </Label>
                            <Input
                              id="adminFirstName"
                              value={newCompany.adminFirstName}
                              onChange={(e) =>
                                setNewCompany({
                                  ...newCompany,
                                  adminFirstName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="adminLastName">
                              Admin Last Name *
                            </Label>
                            <Input
                              id="adminLastName"
                              value={newCompany.adminLastName}
                              onChange={(e) =>
                                setNewCompany({
                                  ...newCompany,
                                  adminLastName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="adminEmail">Admin Email *</Label>
                          <Input
                            id="adminEmail"
                            type="email"
                            value={newCompany.adminEmail}
                            onChange={(e) =>
                              setNewCompany({
                                ...newCompany,
                                adminEmail: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="subscription">
                            Initial Subscription
                          </Label>
                          <Select
                            value={newCompany.subscription}
                            onValueChange={(value) =>
                              setNewCompany({
                                ...newCompany,
                                subscription: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">
                                Starter Plan
                              </SelectItem>
                              <SelectItem value="growth">
                                Growth Plan
                              </SelectItem>
                              <SelectItem value="enterprise">
                                Enterprise Plan
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateCompanyOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateCompany}>
                            Create Company
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.name}
                        </TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.adminEmail}</TableCell>
                        <TableCell>{company.userCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(company.status)}
                            <span className="capitalize">{company.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{company.subscription}</TableCell>
                        <TableCell>
                          ${company.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Company
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="w-4 h-4 mr-2" />
                                View Activity
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>User Type</Label>
                  <Badge className={getUserTypeColor(selectedUser.userType)}>
                    {selectedUser.userType.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedUser.status)}
                    <span className="capitalize">{selectedUser.status}</span>
                  </div>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="font-medium">{selectedUser.company || "-"}</p>
                </div>
                <div>
                  <Label>Sessions Count</Label>
                  <p className="font-medium">{selectedUser.sessionsCount}</p>
                </div>
                <div>
                  <Label>Revenue Generated</Label>
                  <p className="font-medium">
                    {selectedUser.revenue
                      ? `$${selectedUser.revenue.toLocaleString()}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label>Last Active</Label>
                  <p className="font-medium">{selectedUser.lastActive}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}