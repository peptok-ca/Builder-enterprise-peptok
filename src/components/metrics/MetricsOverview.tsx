import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Star,
  Calendar,
} from "lucide-react";
import { MetricDefinition, DashboardStats } from "@/types";

interface MetricsOverviewProps {
  metrics: MetricDefinition[];
  stats: DashboardStats;
}

const MetricsOverview = ({ metrics, stats }: MetricsOverviewProps) => {
  const getMetricIcon = (category: MetricDefinition["category"]) => {
    switch (category) {
      case "engagement":
        return Users;
      case "skill_development":
        return Target;
      case "performance":
        return Star;
      case "retention":
        return Calendar;
      default:
        return TrendingUp;
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const isOnTrack = (current: number, target: number) => {
    return current >= target * 0.9;
  };

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Experts</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalExperts}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Active Connections
              </p>
              <p className="text-2xl font-bold text-primary">
                {stats.activeConnections}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Sessions Completed
              </p>
              <p className="text-2xl font-bold text-primary">
                {stats.completedSessions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-primary">
                  {stats.averageRating}
                </p>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Engagement</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-primary">
                  {stats.employeeEngagement}%
                </p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Skills Improved</p>
              <p className="text-2xl font-bold text-primary">
                {stats.skillsImproved}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => {
          const Icon = getMetricIcon(metric.category);
          const progress = (metric.currentValue / metric.targetValue) * 100;
          const onTrack = isOnTrack(metric.currentValue, metric.targetValue);

          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{metric.name}</span>
                </CardTitle>
                <Badge
                  variant={onTrack ? "default" : "destructive"}
                  className="text-xs"
                >
                  {onTrack ? "On Track" : "Needs Attention"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">
                      {metric.currentValue}
                      {metric.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">
                      {metric.targetValue}
                      {metric.unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsOverview;
