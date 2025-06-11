export interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  experience: number;
  avatar: string;
  bio: string;
  rating: number;
  totalSessions: number;
  availableSlots: string[];
  skills: Skill[];
}

export interface Coach {
  id: string;
  name: string;
  title: string;
  company: string;
  coaching: string[];
  rating: number;
  experience: number;
  totalSessions: number;
  avatar?: string;
  availableSlots: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  enterpriseCount: number;
  activeConnections: number;
  successMetrics: MetricDefinition[];
}

export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: "engagement" | "skill_development" | "performance" | "retention";
}

export interface SubscriptionTier {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  priceAnnual?: number;
  billingPeriod: "monthly" | "annual";
  features: string[];
  userCap: number;
  metricsIncluded: string[];
  supportLevel: "basic" | "premium" | "enterprise";
  customizations: boolean;
  analytics: "basic" | "advanced" | "enterprise";
  minimumUsers?: number;
  extraSeatPrice?: number;
  customPricing?: boolean;
  badge?: string;
  currency?: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name?: string;
  role: "participant" | "observer" | "admin";
  status: "invited" | "accepted" | "declined";
  invitedAt: string;
  acceptedAt?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: "startup" | "small" | "medium" | "large" | "enterprise";
  website?: string;
  description?: string;
  adminUser: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subscription?: {
    tierId: string;
    status: "trial" | "active" | "suspended" | "cancelled";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    teamSize: number;
  };
}

export interface MentorshipRequest {
  id: string;
  companyId: string;
  title: string;
  description: string;
  goals: MentorshipGoal[];
  metricsToTrack: string[];
  teamMembers: TeamMember[];
  preferredCoaching: string[];
  budget?: {
    min: number;
    max: number;
  };
  timeline: {
    startDate: string;
    endDate: string;
    sessionFrequency: "weekly" | "bi-weekly" | "monthly";
  };
  status: "draft" | "submitted" | "matched" | "active" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipGoal {
  id: string;
  title: string;
  description: string;
  category: "leadership" | "technical" | "business" | "personal";
  priority: "low" | "medium" | "high";
  targetMetrics?: {
    name: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  }[];
}

export interface Connection {
  id: string;
  coach: Coach;
  enterprise: Enterprise;
  startDate: string;
  status: "active" | "completed" | "paused";
  sessionsCompleted: number;
  totalSessions: number;
  progress: number;
  nextSessionDate?: string;
  goals: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "coach";
}

export interface Session {
  id: string;
  connectionId: string;
  date: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  rating?: number;
  feedback?: string;
}

export interface DashboardStats {
  totalCoaches: number;
  activeConnections: number;
  completedSessions: number;
  averageRating: number;
  enterpriseEngagement: number;
  skillsImproved: number;
}
