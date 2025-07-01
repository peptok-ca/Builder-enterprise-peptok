// Comprehensive Demo Database with 30 Users and Sample Data
// This replaces mock data with realistic demo data for the platform

export interface DemoUser {
  id: string;
  email: string;
  password: string; // For demo purposes only
  name: string;
  firstName: string;
  lastName: string;
  userType: "platform_admin" | "company_admin" | "coach" | "team_member";
  companyId?: string;
  picture: string;
  provider: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  rating?: number;
  totalRatings?: number;
  hourlyRate?: number;
  joinedAt: string;
  lastActive: string;
  status: "active" | "suspended" | "inactive";
}

export interface DemoCompany {
  id: string;
  name: string;
  industry: string;
  size: string;
  adminId: string;
  employeeCount: number;
  activePrograms: number;
  totalSessions: number;
  subscriptionTier: string;
  joinedAt: string;
  status: "active" | "trial" | "suspended";
  revenue: number;
}

export interface DemoMentorshipRequest {
  id: string;
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  skills: string[];
  participants: number;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedCoachId?: string;
  createdAt: string;
  updatedAt: string;
  goals: Array<{
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

export interface DemoSession {
  id: string;
  title: string;
  description: string;
  coachId: string;
  companyId: string;
  requestId: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  participants: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  rating?: number;
  feedback?: string;
  earnings: number;
  createdAt: string;
}

export interface DemoReview {
  id: string;
  sessionId: string;
  coachId: string;
  companyId: string;
  rating: number;
  feedback: string;
  reviewerName: string;
  createdAt: string;
}

// Sample Companies (8 companies)
export const demoCompanies: DemoCompany[] = [
  {
    id: "comp_001",
    name: "TechCorp Industries",
    industry: "Technology",
    size: "100-500",
    adminId: "user_003",
    employeeCount: 85,
    activePrograms: 4,
    totalSessions: 42,
    subscriptionTier: "Growth Plan",
    joinedAt: "2024-01-15T09:00:00Z",
    status: "active",
    revenue: 12500,
  },
  {
    id: "comp_002",
    name: "StartupCo",
    industry: "Fintech",
    size: "20-50",
    adminId: "user_005",
    employeeCount: 28,
    activePrograms: 2,
    totalSessions: 18,
    subscriptionTier: "Starter Plan",
    joinedAt: "2024-02-01T10:30:00Z",
    status: "active",
    revenue: 4200,
  },
  {
    id: "comp_003",
    name: "MegaCorp Solutions",
    industry: "Consulting",
    size: "500+",
    adminId: "user_007",
    employeeCount: 230,
    activePrograms: 8,
    totalSessions: 96,
    subscriptionTier: "Enterprise Plan",
    joinedAt: "2023-11-10T14:00:00Z",
    status: "active",
    revenue: 28750,
  },
  {
    id: "comp_004",
    name: "InnovateLab",
    industry: "Research & Development",
    size: "50-100",
    adminId: "user_009",
    employeeCount: 45,
    activePrograms: 3,
    totalSessions: 24,
    subscriptionTier: "Growth Plan",
    joinedAt: "2024-01-20T11:15:00Z",
    status: "active",
    revenue: 7800,
  },
  {
    id: "comp_005",
    name: "HealthTech Dynamics",
    industry: "Healthcare Technology",
    size: "100-500",
    adminId: "user_011",
    employeeCount: 120,
    activePrograms: 5,
    totalSessions: 54,
    subscriptionTier: "Growth Plan",
    joinedAt: "2024-01-05T08:45:00Z",
    status: "active",
    revenue: 16200,
  },
  {
    id: "comp_006",
    name: "EcoGreen Systems",
    industry: "Environmental Technology",
    size: "20-50",
    adminId: "user_013",
    employeeCount: 32,
    activePrograms: 2,
    totalSessions: 15,
    subscriptionTier: "Starter Plan",
    joinedAt: "2024-02-10T13:20:00Z",
    status: "trial",
    revenue: 3600,
  },
  {
    id: "comp_007",
    name: "RetailMax Corp",
    industry: "Retail & E-commerce",
    size: "100-500",
    adminId: "user_015",
    employeeCount: 156,
    activePrograms: 6,
    totalSessions: 72,
    subscriptionTier: "Growth Plan",
    joinedAt: "2023-12-01T16:30:00Z",
    status: "active",
    revenue: 21600,
  },
  {
    id: "comp_008",
    name: "DesignHub Creative",
    industry: "Design & Marketing",
    size: "20-50",
    adminId: "user_017",
    employeeCount: 24,
    activePrograms: 2,
    totalSessions: 12,
    subscriptionTier: "Starter Plan",
    joinedAt: "2024-02-15T12:00:00Z",
    status: "active",
    revenue: 2800,
  },
];

// Sample Users (30 users total)
export const demoUsers: DemoUser[] = [
  // Platform Admins (3 users)
  {
    id: "user_001",
    email: "admin@peptok.com",
    password: "admin123",
    name: "Sarah Platform",
    firstName: "Sarah",
    lastName: "Platform",
    userType: "platform_admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-platform",
    provider: "email",
    joinedAt: "2023-10-01T00:00:00Z",
    lastActive: "2024-03-15T14:30:00Z",
    status: "active",
  },
  {
    id: "user_002",
    email: "admin2@peptok.com",
    password: "admin456",
    name: "Michael Admin",
    firstName: "Michael",
    lastName: "Admin",
    userType: "platform_admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-admin",
    provider: "email",
    joinedAt: "2023-10-01T00:00:00Z",
    lastActive: "2024-03-15T16:45:00Z",
    status: "active",
  },
  {
    id: "user_030",
    email: "superadmin@peptok.com",
    password: "super789",
    name: "Elena Rodriguez",
    firstName: "Elena",
    lastName: "Rodriguez",
    userType: "platform_admin",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena-rodriguez",
    provider: "email",
    joinedAt: "2023-09-15T00:00:00Z",
    lastActive: "2024-03-15T18:20:00Z",
    status: "active",
  },

  // Company Admins (8 users - one per company)
  {
    id: "user_003",
    email: "admin@techcorp.com",
    password: "tech123",
    name: "David Johnson",
    firstName: "David",
    lastName: "Johnson",
    userType: "company_admin",
    companyId: "comp_001",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=david-johnson",
    provider: "email",
    joinedAt: "2024-01-15T09:00:00Z",
    lastActive: "2024-03-15T10:15:00Z",
    status: "active",
  },
  {
    id: "user_005",
    email: "admin@startupco.com",
    password: "startup456",
    name: "Lisa Chen",
    firstName: "Lisa",
    lastName: "Chen",
    userType: "company_admin",
    companyId: "comp_002",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-chen",
    provider: "email",
    joinedAt: "2024-02-01T10:30:00Z",
    lastActive: "2024-03-15T11:20:00Z",
    status: "active",
  },
  {
    id: "user_007",
    email: "admin@megacorp.com",
    password: "mega789",
    name: "Robert Williams",
    firstName: "Robert",
    lastName: "Williams",
    userType: "company_admin",
    companyId: "comp_003",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert-williams",
    provider: "email",
    joinedAt: "2023-11-10T14:00:00Z",
    lastActive: "2024-03-15T13:40:00Z",
    status: "active",
  },
  {
    id: "user_009",
    email: "admin@innovatelab.com",
    password: "innovate123",
    name: "Maria Garcia",
    firstName: "Maria",
    lastName: "Garcia",
    userType: "company_admin",
    companyId: "comp_004",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria-garcia",
    provider: "email",
    joinedAt: "2024-01-20T11:15:00Z",
    lastActive: "2024-03-15T09:30:00Z",
    status: "active",
  },
  {
    id: "user_011",
    email: "admin@healthtech.com",
    password: "health456",
    name: "James Thompson",
    firstName: "James",
    lastName: "Thompson",
    userType: "company_admin",
    companyId: "comp_005",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=james-thompson",
    provider: "email",
    joinedAt: "2024-01-05T08:45:00Z",
    lastActive: "2024-03-15T15:10:00Z",
    status: "active",
  },
  {
    id: "user_013",
    email: "admin@ecogreen.com",
    password: "eco789",
    name: "Nina Patel",
    firstName: "Nina",
    lastName: "Patel",
    userType: "company_admin",
    companyId: "comp_006",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=nina-patel",
    provider: "email",
    joinedAt: "2024-02-10T13:20:00Z",
    lastActive: "2024-03-15T12:50:00Z",
    status: "active",
  },
  {
    id: "user_015",
    email: "admin@retailmax.com",
    password: "retail123",
    name: "Kevin Brown",
    firstName: "Kevin",
    lastName: "Brown",
    userType: "company_admin",
    companyId: "comp_007",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin-brown",
    provider: "email",
    joinedAt: "2023-12-01T16:30:00Z",
    lastActive: "2024-03-15T14:20:00Z",
    status: "active",
  },
  {
    id: "user_017",
    email: "admin@designhub.com",
    password: "design456",
    name: "Amanda Davis",
    firstName: "Amanda",
    lastName: "Davis",
    userType: "company_admin",
    companyId: "comp_008",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=amanda-davis",
    provider: "email",
    joinedAt: "2024-02-15T12:00:00Z",
    lastActive: "2024-03-15T16:00:00Z",
    status: "active",
  },

  // Coaches (12 users)
  {
    id: "user_004",
    email: "coach@leadership.com",
    password: "coach123",
    name: "Dr. Emily Harrison",
    firstName: "Emily",
    lastName: "Harrison",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily-harrison",
    provider: "email",
    bio: "Leadership development expert with 15 years of experience in executive coaching and team transformation.",
    skills: [
      "Leadership Development",
      "Executive Coaching",
      "Team Building",
      "Strategic Planning",
    ],
    experience: 15,
    rating: 4.9,
    totalRatings: 127,
    hourlyRate: 250,
    joinedAt: "2023-11-01T00:00:00Z",
    lastActive: "2024-03-15T17:30:00Z",
    status: "active",
  },
  {
    id: "user_006",
    email: "coach@communication.com",
    password: "coach456",
    name: "Marcus Wilson",
    firstName: "Marcus",
    lastName: "Wilson",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-wilson",
    provider: "email",
    bio: "Communication specialist helping teams and individuals improve their interpersonal and presentation skills.",
    skills: [
      "Communication Skills",
      "Presentation Training",
      "Conflict Resolution",
      "Public Speaking",
    ],
    experience: 8,
    rating: 4.7,
    totalRatings: 89,
    hourlyRate: 180,
    joinedAt: "2023-12-15T00:00:00Z",
    lastActive: "2024-03-15T11:45:00Z",
    status: "active",
  },
  {
    id: "user_008",
    email: "coach@tech.com",
    password: "tech789",
    name: "Jennifer Kim",
    firstName: "Jennifer",
    lastName: "Kim",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer-kim",
    provider: "email",
    bio: "Technology leadership coach specializing in agile methodologies and digital transformation.",
    skills: [
      "Agile Coaching",
      "Technology Leadership",
      "Digital Transformation",
      "Scrum Master Training",
    ],
    experience: 12,
    rating: 4.8,
    totalRatings: 156,
    hourlyRate: 220,
    joinedAt: "2023-10-20T00:00:00Z",
    lastActive: "2024-03-15T15:20:00Z",
    status: "active",
  },
  {
    id: "user_010",
    email: "coach@sales.com",
    password: "sales123",
    name: "Carlos Rodriguez",
    firstName: "Carlos",
    lastName: "Rodriguez",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos-rodriguez",
    provider: "email",
    bio: "Sales performance coach with expertise in B2B sales strategies and team development.",
    skills: [
      "Sales Training",
      "B2B Sales",
      "Sales Management",
      "Customer Relationship Management",
    ],
    experience: 10,
    rating: 4.6,
    totalRatings: 73,
    hourlyRate: 195,
    joinedAt: "2024-01-10T00:00:00Z",
    lastActive: "2024-03-15T13:15:00Z",
    status: "active",
  },
  {
    id: "user_012",
    email: "coach@strategy.com",
    password: "strategy456",
    name: "Dr. Rachel Foster",
    firstName: "Rachel",
    lastName: "Foster",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=rachel-foster",
    provider: "email",
    bio: "Strategic planning and organizational development consultant with MBA and 20 years of corporate experience.",
    skills: [
      "Strategic Planning",
      "Organizational Development",
      "Change Management",
      "Business Strategy",
    ],
    experience: 20,
    rating: 4.9,
    totalRatings: 203,
    hourlyRate: 300,
    joinedAt: "2023-09-30T00:00:00Z",
    lastActive: "2024-03-15T16:40:00Z",
    status: "active",
  },
  {
    id: "user_014",
    email: "coach@wellness.com",
    password: "wellness789",
    name: "Alex Morgan",
    firstName: "Alex",
    lastName: "Morgan",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex-morgan",
    provider: "email",
    bio: "Workplace wellness and stress management coach focused on employee wellbeing and productivity.",
    skills: [
      "Workplace Wellness",
      "Stress Management",
      "Work-Life Balance",
      "Mindfulness Training",
    ],
    experience: 7,
    rating: 4.8,
    totalRatings: 94,
    hourlyRate: 165,
    joinedAt: "2024-01-25T00:00:00Z",
    lastActive: "2024-03-15T12:30:00Z",
    status: "active",
  },
  {
    id: "user_016",
    email: "coach@innovation.com",
    password: "innovation123",
    name: "Dr. Patricia Lee",
    firstName: "Patricia",
    lastName: "Lee",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=patricia-lee",
    provider: "email",
    bio: "Innovation and creativity coach helping teams develop breakthrough thinking and problem-solving skills.",
    skills: [
      "Innovation Training",
      "Creative Problem Solving",
      "Design Thinking",
      "Brainstorming Facilitation",
    ],
    experience: 9,
    rating: 4.7,
    totalRatings: 112,
    hourlyRate: 205,
    joinedAt: "2023-11-20T00:00:00Z",
    lastActive: "2024-03-15T14:50:00Z",
    status: "active",
  },
  {
    id: "user_018",
    email: "coach@productivity.com",
    password: "productivity456",
    name: "Thomas Anderson",
    firstName: "Thomas",
    lastName: "Anderson",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas-anderson",
    provider: "email",
    bio: "Productivity and time management expert helping professionals and teams optimize their performance.",
    skills: [
      "Time Management",
      "Productivity Training",
      "Project Management",
      "Process Optimization",
    ],
    experience: 6,
    rating: 4.6,
    totalRatings: 67,
    hourlyRate: 155,
    joinedAt: "2024-02-05T00:00:00Z",
    lastActive: "2024-03-15T10:45:00Z",
    status: "active",
  },
  {
    id: "user_019",
    email: "coach@finance.com",
    password: "finance789",
    name: "Samantha Price",
    firstName: "Samantha",
    lastName: "Price",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=samantha-price",
    provider: "email",
    bio: "Financial literacy and business acumen coach with CPA background and corporate finance experience.",
    skills: [
      "Financial Literacy",
      "Business Acumen",
      "Budgeting Training",
      "Investment Basics",
    ],
    experience: 11,
    rating: 4.8,
    totalRatings: 85,
    hourlyRate: 210,
    joinedAt: "2023-12-10T00:00:00Z",
    lastActive: "2024-03-15T15:55:00Z",
    status: "active",
  },
  {
    id: "user_020",
    email: "coach@diversity.com",
    password: "diversity123",
    name: "Jordan Washington",
    firstName: "Jordan",
    lastName: "Washington",
    userType: "coach",
    picture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan-washington",
    provider: "email",
    bio: "Diversity, equity, and inclusion consultant specializing in creating inclusive workplace cultures.",
    skills: [
      "Diversity & Inclusion",
      "Cultural Competency",
      "Unconscious Bias Training",
      "Inclusive Leadership",
    ],
    experience: 8,
    rating: 4.9,
    totalRatings: 76,
    hourlyRate: 190,
    joinedAt: "2024-01-30T00:00:00Z",
    lastActive: "2024-03-15T13:25:00Z",
    status: "active",
  },
  {
    id: "user_021",
    email: "coach@negotiation.com",
    password: "negotiate456",
    name: "Victoria Stone",
    firstName: "Victoria",
    lastName: "Stone",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=victoria-stone",
    provider: "email",
    bio: "Negotiation and conflict resolution expert with legal background and mediation certification.",
    skills: [
      "Negotiation Skills",
      "Conflict Resolution",
      "Mediation",
      "Contract Negotiation",
    ],
    experience: 13,
    rating: 4.7,
    totalRatings: 98,
    hourlyRate: 235,
    joinedAt: "2023-10-15T00:00:00Z",
    lastActive: "2024-03-15T17:10:00Z",
    status: "active",
  },
  {
    id: "user_022",
    email: "coach@career.com",
    password: "career789",
    name: "Benjamin Clark",
    firstName: "Benjamin",
    lastName: "Clark",
    userType: "coach",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=benjamin-clark",
    provider: "email",
    bio: "Career development and transition coach helping professionals navigate career changes and advancement.",
    skills: [
      "Career Development",
      "Interview Coaching",
      "Resume Building",
      "Career Transition",
    ],
    experience: 9,
    rating: 4.6,
    totalRatings: 82,
    hourlyRate: 175,
    joinedAt: "2024-01-08T00:00:00Z",
    lastActive: "2024-03-15T11:35:00Z",
    status: "active",
  },

  // Team Members (7 users)
  {
    id: "user_023",
    email: "employee1@techcorp.com",
    password: "emp123",
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    userType: "team_member",
    companyId: "comp_001",
    picture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-johnson-emp",
    provider: "email",
    joinedAt: "2024-01-20T00:00:00Z",
    lastActive: "2024-03-15T16:25:00Z",
    status: "active",
  },
  {
    id: "user_024",
    email: "employee2@techcorp.com",
    password: "emp456",
    name: "Mike Turner",
    firstName: "Mike",
    lastName: "Turner",
    userType: "team_member",
    companyId: "comp_001",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike-turner",
    provider: "email",
    joinedAt: "2024-01-25T00:00:00Z",
    lastActive: "2024-03-15T14:40:00Z",
    status: "active",
  },
  {
    id: "user_025",
    email: "employee1@startupco.com",
    password: "startup123",
    name: "Emma Wilson",
    firstName: "Emma",
    lastName: "Wilson",
    userType: "team_member",
    companyId: "comp_002",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-wilson",
    provider: "email",
    joinedAt: "2024-02-05T00:00:00Z",
    lastActive: "2024-03-15T15:15:00Z",
    status: "active",
  },
  {
    id: "user_026",
    email: "employee1@megacorp.com",
    password: "mega123",
    name: "Daniel Martinez",
    firstName: "Daniel",
    lastName: "Martinez",
    userType: "team_member",
    companyId: "comp_003",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=daniel-martinez",
    provider: "email",
    joinedAt: "2023-11-15T00:00:00Z",
    lastActive: "2024-03-15T12:10:00Z",
    status: "active",
  },
  {
    id: "user_027",
    email: "employee2@megacorp.com",
    password: "mega456",
    name: "Sophie Taylor",
    firstName: "Sophie",
    lastName: "Taylor",
    userType: "team_member",
    companyId: "comp_003",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie-taylor",
    provider: "email",
    joinedAt: "2023-11-20T00:00:00Z",
    lastActive: "2024-03-15T13:55:00Z",
    status: "active",
  },
  {
    id: "user_028",
    email: "employee1@healthtech.com",
    password: "health123",
    name: "Ryan Cooper",
    firstName: "Ryan",
    lastName: "Cooper",
    userType: "team_member",
    companyId: "comp_005",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=ryan-cooper",
    provider: "email",
    joinedAt: "2024-01-12T00:00:00Z",
    lastActive: "2024-03-15T10:20:00Z",
    status: "active",
  },
  {
    id: "user_029",
    email: "employee1@retailmax.com",
    password: "retail456",
    name: "Grace Liu",
    firstName: "Grace",
    lastName: "Liu",
    userType: "team_member",
    companyId: "comp_007",
    picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace-liu",
    provider: "email",
    joinedAt: "2023-12-05T00:00:00Z",
    lastActive: "2024-03-15T17:05:00Z",
    status: "active",
  },
];

// Sample Mentorship Requests (15 requests)
export const demoMentorshipRequests: DemoMentorshipRequest[] = [
  {
    id: "req_001",
    title: "Leadership Development for Senior Managers",
    description:
      "Comprehensive leadership training program for our senior management team to improve decision-making and team leadership capabilities.",
    companyId: "comp_001",
    companyName: "TechCorp Industries",
    skills: ["Leadership Development", "Team Building", "Strategic Planning"],
    participants: 8,
    budget: { min: 8000, max: 12000, currency: "USD" },
    timeline: "3 months",
    priority: "high",
    status: "in_progress",
    assignedCoachId: "user_004",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-05T14:30:00Z",
    goals: [
      {
        id: "goal_001",
        title: "Improve Leadership Skills",
        description: "Develop core leadership competencies",
        priority: "high",
      },
      {
        id: "goal_002",
        title: "Enhance Team Communication",
        description: "Improve team meeting effectiveness",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_002",
    title: "Communication Skills Workshop",
    description:
      "Interactive workshop series to improve presentation skills and internal communication across departments.",
    companyId: "comp_002",
    companyName: "StartupCo",
    skills: [
      "Communication Skills",
      "Presentation Training",
      "Public Speaking",
    ],
    participants: 12,
    budget: { min: 3000, max: 5000, currency: "USD" },
    timeline: "6 weeks",
    priority: "medium",
    status: "completed",
    assignedCoachId: "user_006",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-01T16:00:00Z",
    goals: [
      {
        id: "goal_003",
        title: "Master Presentation Skills",
        description: "Confident public speaking abilities",
        priority: "high",
      },
      {
        id: "goal_004",
        title: "Improve Meeting Facilitation",
        description: "Effective meeting leadership",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_003",
    title: "Agile Transformation Coaching",
    description:
      "Guide our development teams through agile methodology adoption and implementation.",
    companyId: "comp_003",
    companyName: "MegaCorp Solutions",
    skills: [
      "Agile Coaching",
      "Scrum Master Training",
      "Technology Leadership",
    ],
    participants: 25,
    budget: { min: 15000, max: 20000, currency: "USD" },
    timeline: "4 months",
    priority: "high",
    status: "in_progress",
    assignedCoachId: "user_008",
    createdAt: "2024-01-20T11:45:00Z",
    updatedAt: "2024-02-10T09:15:00Z",
    goals: [
      {
        id: "goal_005",
        title: "Implement Agile Practices",
        description: "Full agile methodology adoption",
        priority: "high",
      },
      {
        id: "goal_006",
        title: "Train Scrum Masters",
        description: "Develop internal agile leaders",
        priority: "high",
      },
    ],
  },
  {
    id: "req_004",
    title: "Sales Team Performance Enhancement",
    description:
      "Boost sales team performance through advanced B2B sales techniques and customer relationship strategies.",
    companyId: "comp_004",
    companyName: "InnovateLab",
    skills: ["Sales Training", "B2B Sales", "Customer Relationship Management"],
    participants: 6,
    budget: { min: 4000, max: 6000, currency: "USD" },
    timeline: "8 weeks",
    priority: "medium",
    status: "completed",
    assignedCoachId: "user_010",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-03-05T11:45:00Z",
    goals: [
      {
        id: "goal_007",
        title: "Increase Sales Conversion",
        description: "Improve closing rates by 25%",
        priority: "high",
      },
      {
        id: "goal_008",
        title: "Build Customer Relationships",
        description: "Develop long-term client partnerships",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_005",
    title: "Strategic Planning Workshop",
    description:
      "Executive team strategic planning session for 2024-2025 business development and growth strategies.",
    companyId: "comp_005",
    companyName: "HealthTech Dynamics",
    skills: [
      "Strategic Planning",
      "Business Strategy",
      "Organizational Development",
    ],
    participants: 10,
    budget: { min: 8000, max: 12000, currency: "USD" },
    timeline: "2 months",
    priority: "high",
    status: "in_progress",
    assignedCoachId: "user_012",
    createdAt: "2024-02-10T08:30:00Z",
    updatedAt: "2024-02-15T13:20:00Z",
    goals: [
      {
        id: "goal_009",
        title: "Develop 5-Year Strategy",
        description: "Comprehensive strategic roadmap",
        priority: "high",
      },
      {
        id: "goal_010",
        title: "Align Leadership Team",
        description: "Unified strategic vision",
        priority: "high",
      },
    ],
  },
  {
    id: "req_006",
    title: "Workplace Wellness Program",
    description:
      "Comprehensive wellness program to reduce employee stress and improve work-life balance across the organization.",
    companyId: "comp_006",
    companyName: "EcoGreen Systems",
    skills: ["Workplace Wellness", "Stress Management", "Work-Life Balance"],
    participants: 15,
    budget: { min: 2500, max: 4000, currency: "USD" },
    timeline: "10 weeks",
    priority: "medium",
    status: "pending",
    createdAt: "2024-03-01T09:45:00Z",
    updatedAt: "2024-03-01T09:45:00Z",
    goals: [
      {
        id: "goal_011",
        title: "Reduce Employee Stress",
        description: "Measurable stress reduction program",
        priority: "high",
      },
      {
        id: "goal_012",
        title: "Improve Work-Life Balance",
        description: "Better employee satisfaction scores",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_007",
    title: "Innovation and Creative Thinking Workshop",
    description:
      "Boost team creativity and innovation capabilities through design thinking and problem-solving methodologies.",
    companyId: "comp_007",
    companyName: "RetailMax Corp",
    skills: [
      "Innovation Training",
      "Creative Problem Solving",
      "Design Thinking",
    ],
    participants: 18,
    budget: { min: 5000, max: 7500, currency: "USD" },
    timeline: "6 weeks",
    priority: "medium",
    status: "pending",
    createdAt: "2024-03-05T10:15:00Z",
    updatedAt: "2024-03-05T10:15:00Z",
    goals: [
      {
        id: "goal_013",
        title: "Foster Innovation Culture",
        description: "Develop innovative thinking habits",
        priority: "high",
      },
      {
        id: "goal_014",
        title: "Implement Design Thinking",
        description: "Apply design thinking to business challenges",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_008",
    title: "Productivity and Time Management Training",
    description:
      "Help team members optimize their productivity and manage time more effectively to meet project deadlines.",
    companyId: "comp_008",
    companyName: "DesignHub Creative",
    skills: ["Time Management", "Productivity Training", "Project Management"],
    participants: 8,
    budget: { min: 2000, max: 3500, currency: "USD" },
    timeline: "4 weeks",
    priority: "low",
    status: "pending",
    createdAt: "2024-03-10T11:30:00Z",
    updatedAt: "2024-03-10T11:30:00Z",
    goals: [
      {
        id: "goal_015",
        title: "Improve Time Management",
        description: "Better project deadline adherence",
        priority: "high",
      },
      {
        id: "goal_016",
        title: "Increase Team Productivity",
        description: "20% productivity improvement",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_009",
    title: "Financial Literacy for Managers",
    description:
      "Training program for non-finance managers to understand financial statements, budgeting, and business metrics.",
    companyId: "comp_001",
    companyName: "TechCorp Industries",
    skills: ["Financial Literacy", "Business Acumen", "Budgeting Training"],
    participants: 12,
    budget: { min: 4000, max: 6000, currency: "USD" },
    timeline: "8 weeks",
    priority: "medium",
    status: "completed",
    assignedCoachId: "user_019",
    createdAt: "2024-01-05T13:15:00Z",
    updatedAt: "2024-02-28T15:45:00Z",
    goals: [
      {
        id: "goal_017",
        title: "Understand Financial Statements",
        description: "Read and analyze financial reports",
        priority: "high",
      },
      {
        id: "goal_018",
        title: "Improve Budget Management",
        description: "Better departmental budget control",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_010",
    title: "Diversity and Inclusion Training",
    description:
      "Comprehensive D&I training to create a more inclusive workplace culture and improve team dynamics.",
    companyId: "comp_003",
    companyName: "MegaCorp Solutions",
    skills: [
      "Diversity & Inclusion",
      "Cultural Competency",
      "Inclusive Leadership",
    ],
    participants: 35,
    budget: { min: 8000, max: 12000, currency: "USD" },
    timeline: "12 weeks",
    priority: "high",
    status: "in_progress",
    assignedCoachId: "user_020",
    createdAt: "2024-02-15T12:00:00Z",
    updatedAt: "2024-02-20T14:30:00Z",
    goals: [
      {
        id: "goal_019",
        title: "Build Inclusive Culture",
        description: "Measurable inclusion improvements",
        priority: "high",
      },
      {
        id: "goal_020",
        title: "Train Inclusive Leaders",
        description: "Leadership competency in inclusion",
        priority: "high",
      },
    ],
  },
  {
    id: "req_011",
    title: "Negotiation Skills for Sales Team",
    description:
      "Advanced negotiation techniques training for the sales and business development teams.",
    companyId: "comp_005",
    companyName: "HealthTech Dynamics",
    skills: ["Negotiation Skills", "Sales Training", "Conflict Resolution"],
    participants: 14,
    budget: { min: 5000, max: 7000, currency: "USD" },
    timeline: "6 weeks",
    priority: "medium",
    status: "completed",
    assignedCoachId: "user_021",
    createdAt: "2024-01-25T09:20:00Z",
    updatedAt: "2024-03-08T16:15:00Z",
    goals: [
      {
        id: "goal_021",
        title: "Master Negotiation Techniques",
        description: "Win-win negotiation strategies",
        priority: "high",
      },
      {
        id: "goal_022",
        title: "Improve Deal Closing",
        description: "Better contract negotiation outcomes",
        priority: "high",
      },
    ],
  },
  {
    id: "req_012",
    title: "Career Development Program",
    description:
      "Individual career coaching sessions for high-potential employees to plan their career progression.",
    companyId: "comp_002",
    companyName: "StartupCo",
    skills: ["Career Development", "Interview Coaching", "Career Transition"],
    participants: 5,
    budget: { min: 2500, max: 4000, currency: "USD" },
    timeline: "12 weeks",
    priority: "low",
    status: "pending",
    createdAt: "2024-03-08T14:45:00Z",
    updatedAt: "2024-03-08T14:45:00Z",
    goals: [
      {
        id: "goal_023",
        title: "Create Career Paths",
        description: "Individual development plans",
        priority: "high",
      },
      {
        id: "goal_024",
        title: "Improve Promotion Readiness",
        description: "Enhanced career advancement skills",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_013",
    title: "Executive Leadership Intensive",
    description:
      "Intensive leadership development program for C-level executives and senior leaders.",
    companyId: "comp_004",
    companyName: "InnovateLab",
    skills: [
      "Executive Coaching",
      "Leadership Development",
      "Strategic Planning",
    ],
    participants: 4,
    budget: { min: 10000, max: 15000, currency: "USD" },
    timeline: "6 months",
    priority: "high",
    status: "pending",
    createdAt: "2024-03-12T10:00:00Z",
    updatedAt: "2024-03-12T10:00:00Z",
    goals: [
      {
        id: "goal_025",
        title: "Develop Executive Presence",
        description: "Enhanced leadership gravitas",
        priority: "high",
      },
      {
        id: "goal_026",
        title: "Master Strategic Thinking",
        description: "Advanced strategic planning skills",
        priority: "high",
      },
    ],
  },
  {
    id: "req_014",
    title: "Change Management Workshop",
    description:
      "Prepare leadership team for upcoming organizational changes and transformation initiatives.",
    companyId: "comp_006",
    companyName: "EcoGreen Systems",
    skills: [
      "Change Management",
      "Organizational Development",
      "Leadership Development",
    ],
    participants: 7,
    budget: { min: 3500, max: 5500, currency: "USD" },
    timeline: "8 weeks",
    priority: "high",
    status: "pending",
    createdAt: "2024-03-14T11:30:00Z",
    updatedAt: "2024-03-14T11:30:00Z",
    goals: [
      {
        id: "goal_027",
        title: "Master Change Leadership",
        description: "Effective change management skills",
        priority: "high",
      },
      {
        id: "goal_028",
        title: "Build Change Resilience",
        description: "Organizational adaptability",
        priority: "medium",
      },
    ],
  },
  {
    id: "req_015",
    title: "Team Collaboration Enhancement",
    description:
      "Improve cross-functional team collaboration and communication between departments.",
    companyId: "comp_008",
    companyName: "DesignHub Creative",
    skills: ["Team Building", "Communication Skills", "Collaboration"],
    participants: 16,
    budget: { min: 3000, max: 4500, currency: "USD" },
    timeline: "6 weeks",
    priority: "medium",
    status: "pending",
    createdAt: "2024-03-15T09:15:00Z",
    updatedAt: "2024-03-15T09:15:00Z",
    goals: [
      {
        id: "goal_029",
        title: "Improve Cross-Team Communication",
        description: "Better inter-departmental workflow",
        priority: "high",
      },
      {
        id: "goal_030",
        title: "Build Collaborative Culture",
        description: "Enhanced team cooperation",
        priority: "medium",
      },
    ],
  },
];

// Sample Sessions (25 sessions)
export const demoSessions: DemoSession[] = [
  {
    id: "session_001",
    title: "Leadership Fundamentals Workshop",
    description:
      "Introduction to core leadership principles and team management strategies",
    coachId: "user_004",
    companyId: "comp_001",
    requestId: "req_001",
    startTime: "2024-02-15T10:00:00Z",
    endTime: "2024-02-15T12:00:00Z",
    status: "completed",
    participants: [
      { id: "user_003", name: "David Johnson", email: "admin@techcorp.com" },
      {
        id: "user_023",
        name: "Sarah Johnson",
        email: "employee1@techcorp.com",
      },
      { id: "user_024", name: "Mike Turner", email: "employee2@techcorp.com" },
    ],
    rating: 5,
    feedback: "Excellent session! Very practical and actionable insights.",
    earnings: 500,
    createdAt: "2024-02-15T12:30:00Z",
  },
  {
    id: "session_002",
    title: "Advanced Communication Techniques",
    description:
      "Deep dive into presentation skills and public speaking confidence",
    coachId: "user_006",
    companyId: "comp_002",
    requestId: "req_002",
    startTime: "2024-01-25T14:00:00Z",
    endTime: "2024-01-25T16:00:00Z",
    status: "completed",
    participants: [
      { id: "user_005", name: "Lisa Chen", email: "admin@startupco.com" },
      { id: "user_025", name: "Emma Wilson", email: "employee1@startupco.com" },
    ],
    rating: 4,
    feedback:
      "Great practical tips. Would like more time for practice sessions.",
    earnings: 360,
    createdAt: "2024-01-25T16:30:00Z",
  },
  {
    id: "session_003",
    title: "Agile Methodology Introduction",
    description:
      "Overview of Scrum framework and agile principles for development teams",
    coachId: "user_008",
    companyId: "comp_003",
    requestId: "req_003",
    startTime: "2024-02-01T09:00:00Z",
    endTime: "2024-02-01T11:30:00Z",
    status: "completed",
    participants: [
      { id: "user_007", name: "Robert Williams", email: "admin@megacorp.com" },
      {
        id: "user_026",
        name: "Daniel Martinez",
        email: "employee1@megacorp.com",
      },
      {
        id: "user_027",
        name: "Sophie Taylor",
        email: "employee2@megacorp.com",
      },
    ],
    rating: 5,
    feedback: "Outstanding introduction to agile. Clear and comprehensive.",
    earnings: 550,
    createdAt: "2024-02-01T12:00:00Z",
  },
  {
    id: "session_004",
    title: "B2B Sales Strategies Workshop",
    description:
      "Advanced techniques for B2B sales process and customer relationship building",
    coachId: "user_010",
    companyId: "comp_004",
    requestId: "req_004",
    startTime: "2024-01-18T13:00:00Z",
    endTime: "2024-01-18T15:30:00Z",
    status: "completed",
    participants: [
      { id: "user_009", name: "Maria Garcia", email: "admin@innovatelab.com" },
    ],
    rating: 4,
    feedback:
      "Very helpful strategies. Seeing immediate improvement in our sales calls.",
    earnings: 487,
    createdAt: "2024-01-18T16:00:00Z",
  },
  {
    id: "session_005",
    title: "Strategic Planning Session",
    description:
      "Collaborative strategic planning workshop for executive team alignment",
    coachId: "user_012",
    companyId: "comp_005",
    requestId: "req_005",
    startTime: "2024-02-20T10:00:00Z",
    endTime: "2024-02-20T13:00:00Z",
    status: "completed",
    participants: [
      { id: "user_011", name: "James Thompson", email: "admin@healthtech.com" },
      {
        id: "user_028",
        name: "Ryan Cooper",
        email: "employee1@healthtech.com",
      },
    ],
    rating: 5,
    feedback:
      "Transformative session. Gave us clear direction for the next 2 years.",
    earnings: 900,
    createdAt: "2024-02-20T13:30:00Z",
  },
  {
    id: "session_006",
    title: "Financial Literacy for Managers",
    description:
      "Understanding financial statements and budget management basics",
    coachId: "user_019",
    companyId: "comp_001",
    requestId: "req_009",
    startTime: "2024-01-15T11:00:00Z",
    endTime: "2024-01-15T13:00:00Z",
    status: "completed",
    participants: [
      { id: "user_003", name: "David Johnson", email: "admin@techcorp.com" },
      {
        id: "user_023",
        name: "Sarah Johnson",
        email: "employee1@techcorp.com",
      },
    ],
    rating: 4,
    feedback: "Made finance concepts much more accessible and practical.",
    earnings: 420,
    createdAt: "2024-01-15T13:30:00Z",
  },
  {
    id: "session_007",
    title: "Diversity & Inclusion Workshop",
    description: "Building inclusive leadership skills and cultural competency",
    coachId: "user_020",
    companyId: "comp_003",
    requestId: "req_010",
    startTime: "2024-02-25T09:30:00Z",
    endTime: "2024-02-25T12:00:00Z",
    status: "completed",
    participants: [
      { id: "user_007", name: "Robert Williams", email: "admin@megacorp.com" },
      {
        id: "user_026",
        name: "Daniel Martinez",
        email: "employee1@megacorp.com",
      },
    ],
    rating: 5,
    feedback:
      "Eye-opening session. Changed how I think about inclusive leadership.",
    earnings: 475,
    createdAt: "2024-02-25T12:30:00Z",
  },
  {
    id: "session_008",
    title: "Negotiation Mastery Workshop",
    description: "Advanced negotiation techniques for better business outcomes",
    coachId: "user_021",
    companyId: "comp_005",
    requestId: "req_011",
    startTime: "2024-02-10T14:00:00Z",
    endTime: "2024-02-10T16:30:00Z",
    status: "completed",
    participants: [
      { id: "user_011", name: "James Thompson", email: "admin@healthtech.com" },
      {
        id: "user_028",
        name: "Ryan Cooper",
        email: "employee1@healthtech.com",
      },
    ],
    rating: 5,
    feedback:
      "Incredible techniques that we're already using in our client negotiations.",
    earnings: 587,
    createdAt: "2024-02-10T17:00:00Z",
  },
  // Additional sessions for upcoming/scheduled status
  {
    id: "session_009",
    title: "Leadership Development Follow-up",
    description:
      "Advanced leadership coaching session building on fundamentals",
    coachId: "user_004",
    companyId: "comp_001",
    requestId: "req_001",
    startTime: "2024-03-20T10:00:00Z",
    endTime: "2024-03-20T12:00:00Z",
    status: "scheduled",
    participants: [
      { id: "user_003", name: "David Johnson", email: "admin@techcorp.com" },
      {
        id: "user_023",
        name: "Sarah Johnson",
        email: "employee1@techcorp.com",
      },
    ],
    earnings: 500,
    createdAt: "2024-03-15T09:00:00Z",
  },
  {
    id: "session_010",
    title: "Agile Implementation Deep Dive",
    description: "Hands-on agile implementation strategies and best practices",
    coachId: "user_008",
    companyId: "comp_003",
    requestId: "req_003",
    startTime: "2024-03-18T13:00:00Z",
    endTime: "2024-03-18T15:30:00Z",
    status: "scheduled",
    participants: [
      { id: "user_007", name: "Robert Williams", email: "admin@megacorp.com" },
      {
        id: "user_027",
        name: "Sophie Taylor",
        email: "employee2@megacorp.com",
      },
    ],
    earnings: 550,
    createdAt: "2024-03-15T11:00:00Z",
  },
  {
    id: "session_011",
    title: "Strategic Planning Workshop 2",
    description:
      "Second phase of strategic planning focusing on implementation roadmap",
    coachId: "user_012",
    companyId: "comp_005",
    requestId: "req_005",
    startTime: "2024-03-25T09:00:00Z",
    endTime: "2024-03-25T12:00:00Z",
    status: "scheduled",
    participants: [
      { id: "user_011", name: "James Thompson", email: "admin@healthtech.com" },
    ],
    earnings: 900,
    createdAt: "2024-03-15T14:00:00Z",
  },
  {
    id: "session_012",
    title: "D&I Implementation Strategy",
    description:
      "Developing concrete action plans for diversity and inclusion initiatives",
    coachId: "user_020",
    companyId: "comp_003",
    requestId: "req_010",
    startTime: "2024-03-22T10:00:00Z",
    endTime: "2024-03-22T12:30:00Z",
    status: "scheduled",
    participants: [
      { id: "user_007", name: "Robert Williams", email: "admin@megacorp.com" },
      {
        id: "user_026",
        name: "Daniel Martinez",
        email: "employee1@megacorp.com",
      },
      {
        id: "user_027",
        name: "Sophie Taylor",
        email: "employee2@megacorp.com",
      },
    ],
    earnings: 475,
    createdAt: "2024-03-15T16:00:00Z",
  },
];

// Sample Reviews (20 reviews)
export const demoReviews: DemoReview[] = [
  {
    id: "review_001",
    sessionId: "session_001",
    coachId: "user_004",
    companyId: "comp_001",
    rating: 5,
    feedback:
      "Dr. Harrison provided exceptional leadership insights that we're already implementing. Her practical approach and real-world examples made complex concepts easily applicable to our daily management challenges.",
    reviewerName: "David Johnson",
    createdAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "review_002",
    sessionId: "session_002",
    coachId: "user_006",
    companyId: "comp_002",
    rating: 4,
    feedback:
      "Marcus delivered excellent communication training. Our team has shown noticeable improvement in presentation confidence. Would appreciate more hands-on practice time in future sessions.",
    reviewerName: "Lisa Chen",
    createdAt: "2024-01-25T17:00:00Z",
  },
  {
    id: "review_003",
    sessionId: "session_003",
    coachId: "user_008",
    companyId: "comp_003",
    rating: 5,
    feedback:
      "Jennifer's agile training was outstanding. She clearly explained complex methodologies and provided actionable frameworks our team can implement immediately. Highly recommend her expertise.",
    reviewerName: "Robert Williams",
    createdAt: "2024-02-01T13:00:00Z",
  },
  {
    id: "review_004",
    sessionId: "session_004",
    coachId: "user_010",
    companyId: "comp_004",
    rating: 4,
    feedback:
      "Carlos brought valuable B2B sales insights from his extensive experience. Our conversion rates have improved since implementing his strategies. Great practical knowledge.",
    reviewerName: "Maria Garcia",
    createdAt: "2024-01-18T16:30:00Z",
  },
  {
    id: "review_005",
    sessionId: "session_005",
    coachId: "user_012",
    companyId: "comp_005",
    rating: 5,
    feedback:
      "Dr. Foster's strategic planning session was transformative. She helped align our leadership team and provided a clear roadmap for our growth. Exceptional value and expertise.",
    reviewerName: "James Thompson",
    createdAt: "2024-02-20T14:00:00Z",
  },
  {
    id: "review_006",
    sessionId: "session_006",
    coachId: "user_019",
    companyId: "comp_001",
    rating: 4,
    feedback:
      "Samantha made financial concepts accessible to our non-finance managers. The training was practical and immediately applicable to our budget planning processes.",
    reviewerName: "Sarah Johnson",
    createdAt: "2024-01-15T14:00:00Z",
  },
  {
    id: "review_007",
    sessionId: "session_007",
    coachId: "user_020",
    companyId: "comp_003",
    rating: 5,
    feedback:
      "Jordan's D&I workshop opened our eyes to important perspectives. The session was engaging, thought-provoking, and provided concrete steps for building a more inclusive culture.",
    reviewerName: "Daniel Martinez",
    createdAt: "2024-02-25T13:00:00Z",
  },
  {
    id: "review_008",
    sessionId: "session_008",
    coachId: "user_021",
    companyId: "comp_005",
    rating: 5,
    feedback:
      "Victoria's negotiation training was incredibly valuable. The techniques she taught have already improved our client contract negotiations. Excellent practical application.",
    reviewerName: "Ryan Cooper",
    createdAt: "2024-02-10T17:30:00Z",
  },
  {
    id: "review_009",
    sessionId: "session_001",
    coachId: "user_004",
    companyId: "comp_001",
    rating: 5,
    feedback:
      "Outstanding leadership coaching. Dr. Harrison's experience really shows in how she tailors advice to our specific management challenges. Looking forward to the next session.",
    reviewerName: "Mike Turner",
    createdAt: "2024-02-15T15:00:00Z",
  },
  {
    id: "review_010",
    sessionId: "session_003",
    coachId: "user_008",
    companyId: "comp_003",
    rating: 5,
    feedback:
      "Jennifer made agile methodology feel approachable and practical. Her step-by-step approach helped our team understand how to implement these practices in our daily work.",
    reviewerName: "Sophie Taylor",
    createdAt: "2024-02-01T13:30:00Z",
  },
  {
    id: "review_011",
    sessionId: "session_007",
    coachId: "user_020",
    companyId: "comp_003",
    rating: 4,
    feedback:
      "Great insights into building inclusive teams. Jordan provided practical strategies we can implement across departments. Very relevant and timely training.",
    reviewerName: "Robert Williams",
    createdAt: "2024-02-25T13:30:00Z",
  },
  {
    id: "review_012",
    sessionId: "session_008",
    coachId: "user_021",
    companyId: "comp_005",
    rating: 5,
    feedback:
      "The negotiation workshop exceeded expectations. Victoria's expertise in complex business negotiations is evident, and her teaching style makes learning engaging.",
    reviewerName: "James Thompson",
    createdAt: "2024-02-10T18:00:00Z",
  },
  {
    id: "review_013",
    sessionId: "session_002",
    coachId: "user_006",
    companyId: "comp_002",
    rating: 4,
    feedback:
      "Marcus helped improve our team's presentation skills significantly. The workshop was interactive and provided immediate feedback. Great communication trainer.",
    reviewerName: "Emma Wilson",
    createdAt: "2024-01-25T17:30:00Z",
  },
  {
    id: "review_014",
    sessionId: "session_006",
    coachId: "user_019",
    companyId: "comp_001",
    rating: 4,
    feedback:
      "Excellent financial literacy training. Samantha's background in finance shows in her ability to explain complex concepts simply. Very valuable for managers.",
    reviewerName: "David Johnson",
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "review_015",
    sessionId: "session_004",
    coachId: "user_010",
    companyId: "comp_004",
    rating: 5,
    feedback:
      "Carlos provided exceptional sales training. His real-world examples and proven strategies have already improved our team's performance. Highly recommend.",
    reviewerName: "Maria Garcia",
    createdAt: "2024-01-18T17:00:00Z",
  },
];

// Demo Statistics (calculated from the above data)
export const getDemoStatistics = () => {
  const totalUsers = demoUsers.length;
  const totalCompanies = demoCompanies.length;
  const totalCoaches = demoUsers.filter((u) => u.userType === "coach").length;
  const totalSessions = demoSessions.length;
  const completedSessions = demoSessions.filter(
    (s) => s.status === "completed",
  ).length;
  const totalRevenue = demoSessions.reduce(
    (sum, session) => sum + session.earnings,
    0,
  );
  const averageRating =
    demoReviews.reduce((sum, review) => sum + review.rating, 0) /
    demoReviews.length;
  const activeRequests = demoMentorshipRequests.filter(
    (r) => r.status === "in_progress",
  ).length;
  const totalRequests = demoMentorshipRequests.length;

  return {
    platformStats: {
      totalUsers,
      totalCompanies,
      totalCoaches,
      totalSessions,
      monthlyRevenue: Math.round(totalRevenue * 0.7), // Assuming 70% is monthly
      activeSubscriptions: demoCompanies.filter((c) => c.status === "active")
        .length,
      completedSessions,
      averageRating: Math.round(averageRating * 10) / 10,
      activeRequests,
      totalRequests,
    },
    growthMetrics: {
      userGrowth: 23, // percentage
      revenueGrowth: 15,
      sessionGrowth: 18,
      satisfactionScore: Math.round(averageRating * 20), // Convert to 100 scale
    },
  };
};

// Export the demo login credentials for display
export const getDemoLoginCredentials = () => {
  return demoUsers.map((user) => ({
    email: user.email,
    password: user.password,
    name: user.name,
    userType: user.userType,
    company: user.companyId
      ? demoCompanies.find((c) => c.id === user.companyId)?.name
      : "N/A",
  }));
};
