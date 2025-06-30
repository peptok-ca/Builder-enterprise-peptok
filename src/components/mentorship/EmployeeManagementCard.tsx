import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Mail,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { TeamMember } from "@/types";
import { toast } from "sonner";
import { emailService } from "@/services/email";
import { useAuth } from "@/contexts/AuthContext";

interface EmployeeManagementCardProps {
  employees: TeamMember[];
  onUpdateEmployees: (employees: TeamMember[]) => void;
  programTitle?: string;
  className?: string;
}

export function EmployeeManagementCard({
  employees,
  onUpdateEmployees,
  programTitle = "Mentorship Program",
  className,
}: EmployeeManagementCardProps) {
  const { user } = useAuth();
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState<
    "participant" | "observer"
  >("participant");
  const [isInviting, setIsInviting] = useState(false);

  const addEmployee = async () => {
    if (!newEmployeeEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployeeEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check for duplicates
    if (
      employees.some(
        (emp) => emp.email.toLowerCase() === newEmployeeEmail.toLowerCase(),
      )
    ) {
      toast.error("This employee is already added to the program");
      return;
    }

    setIsInviting(true);

    try {
      // Create new employee entry
      const newEmployee: TeamMember = {
        id: `employee-${Date.now()}`,
        email: newEmployeeEmail.toLowerCase(),
        name: newEmployeeName.trim() || undefined,
        role: newEmployeeRole,
        status: "invited",
        invitedAt: new Date().toISOString(),
      };

      // Send invitation email
      const invitationData = {
        inviterName: user
          ? `${user.firstName} ${user.lastName}`
          : "Your program administrator",
        companyName: user?.businessDetails?.companyName || "Your Company",
        role: newEmployeeRole,
        invitationLink: `${window.location.origin}/invitation/accept?token=${btoa(newEmployeeEmail + ":" + Date.now())}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      const emailSent = await emailService.sendTeamInvitation(
        newEmployeeEmail.toLowerCase(),
        invitationData,
      );

      if (!emailSent) {
        throw new Error("Failed to send invitation email");
      }

      // Add to employees list
      onUpdateEmployees([...employees, newEmployee]);

      // Reset form
      setNewEmployeeEmail("");
      setNewEmployeeName("");
      setNewEmployeeRole("participant");

      toast.success(
        `✅ Employee invitation sent to ${newEmployeeEmail}! They will receive an email to join the program.`,
        { duration: 5000 },
      );
    } catch (error) {
      console.error("Failed to add employee:", error);
      toast.error("Failed to send invitation email. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const removeEmployee = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      onUpdateEmployees(employees.filter((emp) => emp.id !== employeeId));
      toast.success(`Removed ${employee.email} from the program`);
    }
  };

  const updateEmployeeRole = (
    employeeId: string,
    newRole: "participant" | "observer",
  ) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === employeeId ? { ...employee, role: newRole } : employee,
    );
    onUpdateEmployees(updatedEmployees);
    toast.success("Employee role updated successfully");
  };

  const resendInvitation = async (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return;

    try {
      const invitationData = {
        inviterName: user
          ? `${user.firstName} ${user.lastName}`
          : "Your program administrator",
        companyName: user?.businessDetails?.companyName || "Your Company",
        role: employee.role,
        invitationLink: `${window.location.origin}/invitation/accept?token=${btoa(employee.email + ":" + Date.now())}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      await emailService.sendTeamInvitation(employee.email, invitationData);
      toast.success(`Invitation resent to ${employee.email}`);
    } catch (error) {
      toast.error("Failed to resend invitation");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "invited":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "declined":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default" as const;
      case "invited":
        return "secondary" as const;
      case "declined":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Program Employees
          <Badge variant="outline" className="ml-auto">
            {employees.length} employees
          </Badge>
        </CardTitle>
        <CardDescription>
          Add employees to participate in "{programTitle}". Each employee will
          receive an invitation email with program details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Employee */}
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50 border-blue-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Add Employee to Program
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeEmail">Email Address *</Label>
              <Input
                id="employeeEmail"
                type="email"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                placeholder="employee@company.com"
                onKeyPress={(e) => e.key === "Enter" && addEmployee()}
                disabled={isInviting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeName">Full Name (Optional)</Label>
              <Input
                id="employeeName"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                placeholder="John Doe"
                disabled={isInviting}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="employeeRole">Role in Program</Label>
              <Select
                value={newEmployeeRole}
                onValueChange={(value: "participant" | "observer") =>
                  setNewEmployeeRole(value)
                }
                disabled={isInviting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participant">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium">Participant</div>
                        <div className="text-xs text-muted-foreground">
                          Actively participate in mentorship sessions
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="observer">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Observer</div>
                        <div className="text-xs text-muted-foreground">
                          View sessions and materials, limited participation
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={addEmployee}
              disabled={isInviting || !newEmployeeEmail.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isInviting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Inviting Employee...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Current Employees */}
        {employees.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Program Employees ({employees.length})
              </h3>
              <div className="text-sm text-muted-foreground">
                {employees.filter((emp) => emp.status === "accepted").length}{" "}
                accepted,{" "}
                {employees.filter((emp) => emp.status === "invited").length}{" "}
                pending
              </div>
            </div>

            <div className="space-y-3">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${employee.email}`}
                      />
                      <AvatarFallback>
                        {employee.name
                          ? employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : employee.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-medium">
                        {employee.name || employee.email}
                      </div>
                      {employee.name && (
                        <div className="text-sm text-muted-foreground">
                          {employee.email}
                        </div>
                      )}
                      {employee.status === "invited" && (
                        <div className="text-xs text-muted-foreground">
                          Invited{" "}
                          {new Date(employee.invitedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        employee.role === "participant"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {employee.role}
                    </Badge>

                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(employee.status)}
                        {employee.status}
                      </div>
                    </Badge>

                    <div className="flex items-center gap-1">
                      {employee.status === "invited" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resendInvitation(employee.id)}
                          title="Resend invitation"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}

                      <Select
                        value={employee.role}
                        onValueChange={(value: "participant" | "observer") =>
                          updateEmployeeRole(employee.id, value)
                        }
                      >
                        <SelectTrigger className="w-auto h-8 px-2 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="participant">
                            Participant
                          </SelectItem>
                          <SelectItem value="observer">Observer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmployee(employee.id)}
                        className="text-destructive hover:text-destructive"
                        title="Remove employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">
              No employees added to this program yet.
            </p>
            <p className="text-sm">
              Add employees by email to include them in the mentorship program.
            </p>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Email Notifications</p>
              <p>
                Employees will receive two emails: one when added to the program
                with details, and another when a coach is assigned with session
                schedules.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
