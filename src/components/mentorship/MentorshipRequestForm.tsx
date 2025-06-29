import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Target,
  TrendingUp,
  Calendar as CalendarIcon,
  DollarSign,
  Plus,
  X,
  Lightbulb,
  Users,
  Clock,
} from "lucide-react";
import { TeamManagement } from "./TeamManagement";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  MentorshipRequest,
  MentorshipGoal,
  TeamMember,
  SubscriptionTier,
  SessionPricingTier,
} from "@/types";

interface MentorshipRequestFormProps {
  onSubmit: (data: MentorshipRequestFormData) => void;
  onSaveDraft: (data: MentorshipRequestFormData) => void;
  subscriptionTier: SubscriptionTier;
  onUpgradePrompt: () => void;
  initialData?: Partial<MentorshipRequestFormData>;
  isLoading?: boolean;
}

export interface MentorshipRequestFormData {
  title: string;
  description: string;
  goals: MentorshipGoal[];
  metricsToTrack: string[];
  teamMembers: TeamMember[];
  preferredExpertise: string[];
  budget?: {
    min: number;
    max: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
    sessionFrequency: "weekly" | "bi-weekly" | "monthly";
  };
}

const availableMetrics = [
  {
    id: "employee_satisfaction",
    name: "Employee Satisfaction",
    description: "Track team morale and satisfaction levels",
  },
  {
    id: "skill_development",
    name: "Skill Development Progress",
    description: "Measure improvement in specific skills",
  },
  {
    id: "productivity",
    name: "Productivity Metrics",
    description: "Monitor output and efficiency improvements",
  },
  {
    id: "leadership_growth",
    name: "Leadership Growth",
    description: "Assess leadership capabilities development",
  },
  {
    id: "engagement",
    name: "Team Engagement",
    description: "Track participation and involvement levels",
  },
  {
    id: "retention",
    name: "Employee Retention",
    description: "Monitor staff turnover and retention rates",
  },
  {
    id: "innovation",
    name: "Innovation Index",
    description: "Measure creative problem-solving and new ideas",
  },
  {
    id: "collaboration",
    name: "Collaboration Score",
    description: "Assess teamwork and cross-functional cooperation",
  },
  {
    id: "performance",
    name: "Performance Reviews",
    description: "Track formal performance evaluation scores",
  },
  {
    id: "goal_achievement",
    name: "Goal Achievement Rate",
    description: "Monitor success in meeting objectives",
  },
];

const expertiseAreas = [
  "Leadership & Management",
  "Technical Skills",
  "Business Strategy",
  "Marketing & Sales",
  "Product Development",
  "Data Analysis",
  "Project Management",
  "Financial Management",
  "Human Resources",
  "Operations",
  "Customer Success",
  "Innovation & R&D",
];

export function MentorshipRequestForm({
  onSubmit,
  onSaveDraft,
  subscriptionTier,
  onUpgradePrompt,
  initialData,
  isLoading,
}: MentorshipRequestFormProps) {
  const [formData, setFormData] = useState<MentorshipRequestFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    goals: initialData?.goals || [],
    metricsToTrack: initialData?.metricsToTrack || [],
    teamMembers: initialData?.teamMembers || [],
    preferredExpertise: initialData?.preferredExpertise || [],
    budget: initialData?.budget,
    timeline: initialData?.timeline || {
      startDate: "",
      endDate: "",
      sessionFrequency: "bi-weekly",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "leadership" as const,
    priority: "medium" as const,
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Get available metrics based on subscription tier
  const getAvailableMetrics = () => {
    switch (subscriptionTier.id) {
      case "starter":
        return availableMetrics.slice(0, 3); // Basic metrics only
      case "growth":
        return availableMetrics.slice(0, 6); // More metrics
      case "enterprise":
        return availableMetrics; // All metrics
      default:
        return availableMetrics.slice(0, 3);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Request title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.goals.length === 0)
      newErrors.goals = "At least one goal is required";
    if (formData.metricsToTrack.length === 0)
      newErrors.metrics = "At least one metric must be selected";
    if (formData.teamMembers.length === 0)
      newErrors.team = "At least one team member is required";
    if (!formData.timeline.startDate)
      newErrors.startDate = "Start date is required";
    if (!formData.timeline.endDate) newErrors.endDate = "End date is required";

    // Validate date range
    if (formData.timeline.startDate && formData.timeline.endDate) {
      const start = new Date(formData.timeline.startDate);
      const end = new Date(formData.timeline.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: MentorshipGoal = {
      id: `goal-${Date.now()}`,
      ...newGoal,
    };

    setFormData((prev) => ({
      ...prev,
      goals: [...prev.goals, goal],
    }));

    setNewGoal({
      title: "",
      description: "",
      category: "leadership",
      priority: "medium",
    });
  };

  const removeGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
  };

  const updateMetrics = (metricId: string, checked: boolean) => {
    const availableMetrics = getAvailableMetrics();
    const maxMetrics = availableMetrics.length;

    if (checked) {
      if (
        formData.metricsToTrack.length >= maxMetrics &&
        subscriptionTier.id !== "enterprise"
      ) {
        onUpgradePrompt();
        return;
      }
      setFormData((prev) => ({
        ...prev,
        metricsToTrack: [...prev.metricsToTrack, metricId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        metricsToTrack: prev.metricsToTrack.filter((m) => m !== metricId),
      }));
    }
  };

  const updateExpertise = (area: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        preferredExpertise: [...prev.preferredExpertise, area],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        preferredExpertise: prev.preferredExpertise.filter((e) => e !== area),
      }));
    }
  };

  const updateBudget = (range: number[]) => {
    setFormData((prev) => ({
      ...prev,
      budget: {
        min: range[0],
        max: range[1],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mentorship Request Details
          </CardTitle>
          <CardDescription>
            Define the core objectives and scope of your mentorship program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Leadership Development for Senior Engineers"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the context, challenges, and what you hope to achieve through this mentorship program..."
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goals Definition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Mentorship Goals
          </CardTitle>
          <CardDescription>
            Set specific, measurable objectives for your mentorship program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Goal */}
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Add New Goal</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Improve team leadership skills"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value: any) =>
                    setNewGoal((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">
                      Personal Development
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newGoal.priority}
                  onValueChange={(value: any) =>
                    setNewGoal((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the goal in detail..."
                  rows={2}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={addGoal}
              disabled={!newGoal.title.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {/* Current Goals */}
          {formData.goals.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Current Goals</h4>
              {formData.goals.map((goal) => (
                <div key={goal.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{goal.title}</h5>
                        <Badge variant="outline">{goal.category}</Badge>
                        <Badge
                          variant={
                            goal.priority === "high"
                              ? "destructive"
                              : goal.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {goal.priority} priority
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(goal.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.goals && (
            <p className="text-sm text-destructive">{errors.goals}</p>
          )}
        </CardContent>
      </Card>

      {/* Metrics Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Success Metrics
            <Badge variant="outline" className="ml-auto">
              {subscriptionTier.name} Plan
            </Badge>
          </CardTitle>
          <CardDescription>
            Choose metrics to track the success of your mentorship program.
            Available metrics depend on your subscription tier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAvailableMetrics().map((metric) => (
              <div
                key={metric.id}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                <Checkbox
                  id={metric.id}
                  checked={formData.metricsToTrack.includes(metric.id)}
                  onCheckedChange={(checked) =>
                    updateMetrics(metric.id, checked as boolean)
                  }
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={metric.id}
                    className="font-medium cursor-pointer"
                  >
                    {metric.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {subscriptionTier.id !== "enterprise" && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              Want more metrics? Upgrade to a higher tier for advanced tracking
              capabilities.
              <Button
                variant="link"
                className="p-0 h-auto ml-1"
                onClick={onUpgradePrompt}
              >
                View upgrade options
              </Button>
            </div>
          )}

          {errors.metrics && (
            <p className="text-sm text-destructive">{errors.metrics}</p>
          )}
        </CardContent>
      </Card>

      {/* Team Management */}
      <TeamManagement
        teamMembers={formData.teamMembers}
        onUpdateTeamMembers={(members) =>
          setFormData((prev) => ({ ...prev, teamMembers: members }))
        }
        subscriptionTier={subscriptionTier}
        onUpgradePrompt={onUpgradePrompt}
      />
      {errors.team && <p className="text-sm text-destructive">{errors.team}</p>}

      {/* Preferred Expertise */}
      <Card>
        <CardHeader>
          <CardTitle>Preferred Expertise Areas</CardTitle>
          <CardDescription>
            Select the areas of expertise you're looking for in a mentor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {expertiseAreas.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={formData.preferredExpertise.includes(area)}
                  onCheckedChange={(checked) =>
                    updateExpertise(area, checked as boolean)
                  }
                />
                <Label htmlFor={area} className="cursor-pointer">
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline and Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.startDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        timeline: {
                          ...prev.timeline,
                          startDate: date ? date.toISOString() : "",
                        },
                      }));
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        timeline: {
                          ...prev.timeline,
                          endDate: date ? date.toISOString() : "",
                        },
                      }));
                    }}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Session Frequency</Label>
              <Select
                value={formData.timeline.sessionFrequency}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeline: { ...prev.timeline, sessionFrequency: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget Range (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="px-2">
                <Slider
                  value={[
                    formData.budget?.min || 100,
                    formData.budget?.max || 300,
                  ]}
                  onValueChange={updateBudget}
                  max={500}
                  min={50}
                  step={25}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between text-sm">
                <span>${formData.budget?.min || 100}/hour</span>
                <span>${formData.budget?.max || 300}/hour</span>
              </div>

              <p className="text-sm text-muted-foreground">
                Set your preferred hourly rate range for mentor selection. This
                helps us match you with experts within your budget.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={handleSaveDraft}>
          Save as Draft
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
