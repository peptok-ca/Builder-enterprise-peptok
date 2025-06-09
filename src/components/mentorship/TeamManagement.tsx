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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  Mail,
  Trash2,
  Crown,
  Eye,
  UserCheck,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { TeamMember, SubscriptionTier } from "@/types";
import { toast } from "sonner";

interface TeamManagementProps {
  teamMembers: TeamMember[];
  onUpdateTeamMembers: (members: TeamMember[]) => void;
  subscriptionTier: SubscriptionTier;
  onUpgradePrompt: () => void;
  maxMembers?: number;
}

export function TeamManagement({
  teamMembers,
  onUpdateTeamMembers,
  subscriptionTier,
  onUpgradePrompt,
  maxMembers,
}: TeamManagementProps) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<
    "participant" | "observer"
  >("participant");
  const [isInviting, setIsInviting] = useState(false);

  const userCap = maxMembers || subscriptionTier.userCap;
  const currentMemberCount = teamMembers.length;
  const isAtCapacity = currentMemberCount >= userCap;
  const canAddMore = currentMemberCount < userCap;

  const addTeamMember = async () => {
    if (!newMemberEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check for duplicates
    if (
      teamMembers.some(
        (member) => member.email.toLowerCase() === newMemberEmail.toLowerCase(),
      )
    ) {
      toast.error("This email is already invited");
      return;
    }

    // Check capacity
    if (!canAddMore) {
      onUpgradePrompt();
      return;
    }

    setIsInviting(true);

    try {
      // Simulate API call to send invitation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        email: newMemberEmail.toLowerCase(),
        role: newMemberRole,
        status: "invited",
        invitedAt: new Date().toISOString(),
      };

      onUpdateTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail("");
      setNewMemberRole("participant");

      toast.success(`Invitation sent to ${newMemberEmail}`);
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const removeMember = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      onUpdateTeamMembers(teamMembers.filter((m) => m.id !== memberId));
      toast.success(`Removed ${member.email} from the team`);
    }
  };

  const updateMemberRole = (
    memberId: string,
    newRole: "participant" | "observer",
  ) => {
    const updatedMembers = teamMembers.map((member) =>
      member.id === memberId ? { ...member, role: newRole } : member,
    );
    onUpdateTeamMembers(updatedMembers);
    toast.success("Member role updated successfully");
  };

  const resendInvitation = async (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`Invitation resent to ${member.email}`);
    } catch (error) {
      toast.error("Failed to resend invitation");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4" />;
      case "participant":
        return <UserCheck className="w-4 h-4" />;
      case "observer":
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default" as const;
      case "participant":
        return "secondary" as const;
      case "observer":
        return "outline" as const;
      default:
        return "secondary" as const;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Management
          <Badge variant="outline" className="ml-auto">
            {currentMemberCount}/{userCap === 999999 ? "∞" : userCap} members
          </Badge>
        </CardTitle>
        <CardDescription>
          Add team members to participate in mentorship sessions. Members will
          receive invitations via email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capacity Warning */}
        {isAtCapacity && userCap !== 999999 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You've reached your team member limit ({userCap} members).
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary ml-1"
                onClick={onUpgradePrompt}
              >
                Upgrade your plan
              </Button>
              or purchase additional seats to add more members.
            </AlertDescription>
          </Alert>
        )}

        {/* Add New Member */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <h3 className="font-semibold">Invite Team Member</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="memberEmail">Email Address</Label>
              <Input
                id="memberEmail"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="colleague@company.com"
                onKeyPress={(e) => e.key === "Enter" && addTeamMember()}
                disabled={isAtCapacity}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberRole">Role</Label>
              <Select
                value={newMemberRole}
                onValueChange={(value: "participant" | "observer") =>
                  setNewMemberRole(value)
                }
                disabled={isAtCapacity}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participant">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Participant
                    </div>
                  </SelectItem>
                  <SelectItem value="observer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Observer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <strong>Participant:</strong> Can actively participate in
              mentorship sessions
              <br />
              <strong>Observer:</strong> Can view sessions and materials but not
              participate actively
            </div>

            <Button
              onClick={addTeamMember}
              disabled={isInviting || !newMemberEmail.trim() || isAtCapacity}
              className="shrink-0"
            >
              {isInviting ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </div>

        {/* Current Team Members */}
        {teamMembers.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Current Team Members</h3>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${member.email}`}
                      />
                      <AvatarFallback>
                        {member.name
                          ? member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : member.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-medium">
                        {member.name || member.email}
                      </div>
                      {member.name && (
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      )}
                      {member.status === "invited" && (
                        <div className="text-xs text-muted-foreground">
                          Invited{" "}
                          {new Date(member.invitedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </div>
                    </Badge>

                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>

                    <div className="flex items-center gap-1">
                      {member.status === "invited" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resendInvitation(member.id)}
                          title="Resend invitation"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}

                      {member.role !== "admin" && (
                        <Select
                          value={member.role}
                          onValueChange={(value: "participant" | "observer") =>
                            updateMemberRole(member.id, value)
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
                      )}

                      {member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="text-destructive hover:text-destructive"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Prompt */}
        {currentMemberCount >= userCap * 0.8 && userCap !== 999999 && (
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              You're using {Math.round((currentMemberCount / userCap) * 100)}%
              of your team member allowance. Consider upgrading your plan for
              more capacity and advanced features.
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary ml-1"
                onClick={onUpgradePrompt}
              >
                View upgrade options
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Info */}
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Additional Seats</span>
          </div>
          <p>
            Need more team members? Additional seats are available for
            $5/user/month. You can add them during checkout or upgrade your plan
            for better value.
          </p>
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No team members added yet.</p>
            <p className="text-sm">
              Invite colleagues to start collaborating on mentorship goals.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
