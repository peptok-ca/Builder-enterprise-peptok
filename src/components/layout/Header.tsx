import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/logo";
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  userType?: "platform_admin" | "company_admin" | "coach";
}

const Header = ({ userType: propUserType }: HeaderProps) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Use auth context user type if available, otherwise fall back to prop
  const userType = user?.userType || propUserType || "company_admin";

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = (userType: string) => {
    switch (userType) {
      case "platform_admin":
        return "/platform-admin";
      case "coach":
        return "/coach/dashboard";
      case "company_admin":
      default:
        return "/dashboard";
    }
  };

  const navigationItems = [
    {
      label: userType === "platform_admin" ? "Platform Dashboard" : "Dashboard",
      path: getDashboardPath(userType),
      roles: ["company_admin", "coach", "platform_admin"],
    },
    {
      label: "Mentors",
      path: "/coaches",
      roles: ["company_admin", "platform_admin"],
    },
    {
      label: "Connections",
      path: "/connections",
      roles: ["company_admin", "coach"],
    },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userType),
  );

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.name) {
      const nameParts = user.name.split(" ");
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase();
    }
    return user?.email ? user.email.substring(0, 2).toUpperCase() : "U";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <Logo size="md" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.path) ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          user?.picture ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || user?.email}`
                        }
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  {/* User Info */}
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user?.name || "User"}</p>
                        {userType === "platform_admin" ? (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Platform Admin
                          </Badge>
                        ) : userType === "company_admin" ? (
                          <Badge variant="default" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            Company Admin
                          </Badge>
                        ) : userType === "coach" ? (
                          <Badge variant="outline" className="text-xs">
                            Coach
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Enterprise
                          </Badge>
                        )}
                      </div>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      {user?.provider && user.provider !== "email" && (
                        <p className="text-xs text-muted-foreground">
                          via{" "}
                          {user.provider === "google" ? "Google" : "Microsoft"}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Not authenticated - show public navigation and auth buttons */
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/pricing"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/pricing")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  Pricing
                </Link>
                <Link
                  to="/coaches"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/coaches")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  Find Coaches
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
