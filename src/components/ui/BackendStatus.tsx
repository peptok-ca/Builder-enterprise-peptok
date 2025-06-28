import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react";

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
        const response = await fetch("http://localhost:3001/health", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsBackendConnected(data.status === "OK");
        } else {
          setIsBackendConnected(false);
        }
      } catch (error) {
        setIsBackendConnected(false);
      }
      setLastChecked(new Date());
    };

    // Check on mount
    checkBackendConnection();

    // Check every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);

    return () => clearInterval(interval);
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
