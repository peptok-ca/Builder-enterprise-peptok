import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { Environment } from "@/utils/environment";

interface BackendStatusProps {
  className?: string;
}

export function BackendStatus({ className }: BackendStatusProps) {
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(
    null,
  );
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        // Don't try to connect to localhost in deployed environments
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (!isLocalhost) {
          // In deployed environment, assume using local data
          setIsBackendConnected(false);
          setLastChecked(new Date());
          return;
        }

        // Only try backend connection in local development
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3001";
        const response = await fetch(`${backendUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          setIsBackendConnected(data.status === "OK");
        } else {
          setIsBackendConnected(false);
        }
      } catch (error) {
        // Silently handle fetch errors in deployed environment
        console.log(
          "Backend connection check failed (expected in deployed environment)",
        );
        setIsBackendConnected(false);
      }
      setLastChecked(new Date());
    };

    // Check on mount
    checkBackendConnection();

    // Only set interval for local development
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    let interval: NodeJS.Timeout | null = null;
    if (isLocalhost) {
      interval = setInterval(checkBackendConnection, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (isBackendConnected === null) {
    return (
      <Badge variant="outline" className={className}>
        <Wifi className="w-3 h-3 mr-1" />
        Checking...
      </Badge>
    );
  }

  return (
    <Badge
      variant={isBackendConnected ? "default" : "secondary"}
      className={className}
    >
      {isBackendConnected ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Backend Connected
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 mr-1" />
          Using Local Data
        </>
      )}
    </Badge>
  );
}
