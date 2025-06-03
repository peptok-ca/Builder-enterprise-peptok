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

export interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  goals: string[];
  currentMentors: Expert[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
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

export interface Connection {
  id: string;
  expert: Expert;
  employee: Employee;
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
  level: "beginner" | "intermediate" | "advanced" | "expert";
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
  totalExperts: number;
  activeConnections: number;
  completedSessions: number;
  averageRating: number;
  employeeEngagement: number;
  skillsImproved: number;
}
