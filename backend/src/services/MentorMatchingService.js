import { logger } from "../config/logger.js";

// Mock Mentor class for JavaScript compatibility
class Mentor {
  constructor(
    id,
    userId,
    firstName,
    lastName,
    email,
    avatar,
    bio,
    title,
    company,
    linkedinUrl,
    expertise,
    availability,
    hourlyRate,
    currency,
    status,
    metrics,
    languages,
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.avatar = avatar;
    this.bio = bio;
    this.title = title;
    this.company = company;
    this.linkedinUrl = linkedinUrl;
    this.expertise = expertise || [];
    this.availability = availability || [];
    this.hourlyRate = hourlyRate;
    this.currency = currency;
    this.status = status;
    this.metrics = metrics || {};
    this.languages = languages || ["English"];
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      avatar: this.avatar,
      bio: this.bio,
      title: this.title,
      company: this.company,
      linkedinUrl: this.linkedinUrl,
      expertise: this.expertise,
      availability: this.availability,
      hourlyRate: this.hourlyRate,
      currency: this.currency,
      status: this.status,
      metrics: this.metrics,
      languages: this.languages,
    };
  }

  canAcceptNewStudents() {
    return this.status === "ACTIVE" && (this.metrics.totalStudents || 0) < 30;
  }
}

export class MentorMatchingService {
  constructor() {
    this.mentors = new Map();
    this.initializeMockMentors();
  }

  initializeMockMentors() {
    const mockMentors = [
      new Mentor(
        "mentor_1",
        "user_mentor_1",
        "Sarah",
        "Johnson",
        "sarah.johnson@email.com",
        "https://images.unsplash.com/photo-1494790108755-2616b19a6af1?w=400",
        "Senior Software Engineer with 8+ years experience in full-stack development, specializing in React, Node.js, and cloud architecture.",
        "Senior Software Engineer",
        "Tech Corp",
        "https://linkedin.com/in/sarahjohnson",
        [
          {
            id: "exp_1",
            category: "Frontend Development",
            subcategory: "React",
            yearsExperience: 6,
            level: "expert",
          },
          {
            id: "exp_2",
            category: "Backend Development",
            subcategory: "Node.js",
            yearsExperience: 5,
            level: "expert",
          },
        ],
        [
          {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "17:00",
            timezone: "UTC-8",
          },
        ],
        150,
        "USD",
        "ACTIVE",
        {
          totalSessions: 127,
          averageRating: 4.8,
          totalStudents: 23,
          successRate: 0.91,
          responseTime: 4,
          completionRate: 0.94,
        },
        ["English", "Spanish"],
      ),
      new Mentor(
        "mentor_2",
        "user_mentor_2",
        "Michael",
        "Chen",
        "michael.chen@email.com",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        "Product Manager with expertise in agile methodologies, user research, and data-driven product decisions.",
        "Senior Product Manager",
        "Innovation Labs",
        "https://linkedin.com/in/michaelchen",
        [
          {
            id: "exp_4",
            category: "Product Management",
            subcategory: "Strategy",
            yearsExperience: 7,
            level: "expert",
          },
        ],
        [
          {
            dayOfWeek: 2,
            startTime: "10:00",
            endTime: "18:00",
            timezone: "UTC-8",
          },
        ],
        120,
        "USD",
        "ACTIVE",
        {
          totalSessions: 89,
          averageRating: 4.9,
          totalStudents: 18,
          successRate: 0.94,
          responseTime: 2,
          completionRate: 0.96,
        },
        ["English", "Mandarin"],
      ),
      new Mentor(
        "mentor_3",
        "user_mentor_3",
        "Emily",
        "Rodriguez",
        "emily.rodriguez@email.com",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        "UX Design lead with 10+ years creating user-centered digital experiences for Fortune 500 companies.",
        "Lead UX Designer",
        "Design Studio",
        "https://linkedin.com/in/emilyrodriguez",
        [
          {
            id: "exp_7",
            category: "UX Design",
            subcategory: "User Research",
            yearsExperience: 8,
            level: "expert",
          },
        ],
        [
          {
            dayOfWeek: 3,
            startTime: "09:00",
            endTime: "17:00",
            timezone: "UTC-5",
          },
        ],
        130,
        "USD",
        "ACTIVE",
        {
          totalSessions: 156,
          averageRating: 4.9,
          totalStudents: 31,
          successRate: 0.95,
          responseTime: 3,
          completionRate: 0.97,
        },
        ["English", "Spanish"],
      ),
    ];

    mockMentors.forEach((mentor) => {
      this.mentors.set(mentor.id, mentor);
    });

    logger.info(`Initialized ${mockMentors.length} mock mentors`);
  }

  async getAllMentors() {
    return Array.from(this.mentors.values()).filter(
      (mentor) => mentor.status === "ACTIVE",
    );
  }

  async getMentorById(id) {
    return this.mentors.get(id) || null;
  }

  async findMatches(mentorshipRequest, filters = {}, limit = 10) {
    const startTime = Date.now();
    const allMentors = await this.getAllMentors();

    // Simple matching logic
    const matches = allMentors
      .map((mentor) => ({
        mentor,
        matchScore: this.calculateMatchScore(
          mentor,
          mentorshipRequest,
          filters,
        ),
        strengths: this.identifyStrengths(mentor, mentorshipRequest),
        matchReasons: this.generateMatchReasons(mentor, mentorshipRequest),
      }))
      .filter((match) => match.matchScore > 0.3)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    const searchTime = Date.now() - startTime;

    return {
      totalMatches: matches.length,
      matches,
      filters,
      searchTime,
    };
  }

  async searchMentors(query, filters = {}) {
    const allMentors = await this.getAllMentors();
    const searchLower = query.toLowerCase();

    return allMentors.filter((mentor) => {
      const searchableText =
        `${mentor.firstName} ${mentor.lastName} ${mentor.bio} ${mentor.title} ${mentor.company}`.toLowerCase();
      return searchableText.includes(searchLower);
    });
  }

  async getTopMentors(limit = 5) {
    const allMentors = await this.getAllMentors();

    return allMentors
      .sort(
        (a, b) =>
          (b.metrics.averageRating || 0) - (a.metrics.averageRating || 0),
      )
      .slice(0, limit);
  }

  calculateMatchScore(mentor, mentorshipRequest, filters) {
    let score = 0.5; // Base score

    // Add scoring logic based on expertise, goals, etc.
    if (mentor.expertise && mentor.expertise.length > 0) {
      score += 0.3;
    }

    if (mentor.metrics.averageRating > 4.5) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  identifyStrengths(mentor, mentorshipRequest) {
    const strengths = [];

    if (mentor.metrics.averageRating > 4.7) {
      strengths.push("Highly Rated");
    }

    if (mentor.metrics.totalSessions > 100) {
      strengths.push("Experienced Mentor");
    }

    if (mentor.metrics.responseTime < 4) {
      strengths.push("Quick Responder");
    }

    return strengths;
  }

  generateMatchReasons(mentor, mentorshipRequest) {
    const reasons = [];

    if (mentor.expertise && mentor.expertise.length > 0) {
      reasons.push(`Expertise in ${mentor.expertise[0].category}`);
    }

    if (mentor.metrics.successRate > 0.9) {
      reasons.push("High success rate with students");
    }

    return reasons;
  }

  updateMentorMetrics(mentorId, metrics) {
    const mentor = this.mentors.get(mentorId);
    if (mentor) {
      mentor.metrics = { ...mentor.metrics, ...metrics };
      logger.info(`Updated metrics for mentor ${mentorId}`);
    }
  }
}

// Export singleton instance
export const mentorMatchingService = new MentorMatchingService();
