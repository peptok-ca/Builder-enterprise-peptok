import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, UserPlus, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface InvitationData {
  email: string;
  companyName: string;
  inviterName: string;
  role: "participant" | "observer";
  expiresAt: Date;
  isValid: boolean;
}

export default function InvitationAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Decode the invitation token (in a real app, this would be validated server-side)
    try {
      const decoded = atob(token);
      const [email, timestamp] = decoded.split(":");
      const invitedAt = new Date(parseInt(timestamp));
      const expiresAt = new Date(invitedAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const isValid = new Date() < expiresAt;

      setInvitation({
        email,
        companyName: "Your Company", // In real app, get from server
        inviterName: "Team Admin", // In real app, get from server
        role: "participant", // In real app, get from server
        expiresAt,
        isValid,
      });
    } catch (error) {
      console.error("Invalid invitation token:", error);
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    // Validate form
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Please enter your first and last name");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsAccepting(true);

    try {
      // In a real app, this would call the API to create the user account
      // and accept the invitation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Welcome to the team! Your account has been created.");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to accept invitation. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      // In a real app, this would mark the invitation as declined
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Invitation declined");
      navigate("/");
    } catch (error) {
      toast.error("Failed to decline invitation");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Invitation Expired</CardTitle>
            <CardDescription>
              This invitation expired on{" "}
              {invitation.expiresAt.toLocaleDateString()}. Please contact your
              team admin for a new invitation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>You're Invited!</CardTitle>
            <CardDescription>
              Join {invitation.companyName} on Peptok
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{invitation.inviterName}</strong> has invited you to
                join as a <strong>{invitation.role}</strong> at{" "}
                {invitation.companyName}.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Create a password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleDeclineInvitation}
                className="flex-1"
              >
                Decline
              </Button>
              <Button
                onClick={handleAcceptInvitation}
                disabled={isAccepting}
                className="flex-1"
              >
                {isAccepting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Joining...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Accept & Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Expires on {invitation.expiresAt.toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
