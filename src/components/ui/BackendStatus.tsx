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
        // Don't try to connect to backend in deployed environments unless configured
        if (!Environment.shouldTryBackend()) {
          setIsBackendConnected(false);
          setLastChecked(new Date());
          return;
        }

        // Try backend connection
        const backendUrl = Environment.getApiBaseUrl().replace("/api", ""); // Remove /api for health endpoint

        // Create abort controller for timeout (fallback for older browsers)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${backendUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setIsBackendConnected(data.status === "OK");
        } else {
          setIsBackendConnected(false);
        }
      } catch (error) {
        // Silently handle fetch errors in deployed environment
        if (Environment.isProduction()) {
          console.log(
            "Backend connection check failed (expected in deployed environment)",
          );
        } else {
          console.warn("Backend connection failed:", error);
        }
        setIsBackendConnected(false);
      }
      setLastChecked(new Date());
    };

    // Check on mount
    checkBackendConnection();

    // Only set interval for environments where backend is expected
    let interval: NodeJS.Timeout | null = null;
    if (Environment.shouldTryBackend()) {
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

  // Show appropriate messaging based on environment
  const isProduction = Environment.isProduction();

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
          {isProduction ? "Production Data" : "Using Local Data"}
        </>
      )}
    </Badge>
  );
}
