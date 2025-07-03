import { logger } from "../config/logger.js";

// Mock Mentor class
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
        "Senior Software Engineer with 8+ years experience in full-stack development.",
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
    const allMentors = await this.getAllMentors();
    return {
      totalMatches: allMentors.length,
      matches: allMentors.map((mentor) => ({
        mentor,
        matchScore: 0.8,
        strengths: ["Experienced"],
        matchReasons: ["Great expertise"],
      })),
      filters,
      searchTime: 10,
    };
  }

  async searchMentors(query, filters = {}) {
    return await this.getAllMentors();
  }

  async getTopMentors(limit = 5) {
    const allMentors = await this.getAllMentors();
    return allMentors.slice(0, limit);
  }

  updateMentorMetrics(mentorId, metrics) {
    const mentor = this.mentors.get(mentorId);
    if (mentor) {
      mentor.metrics = { ...mentor.metrics, ...metrics };
      logger.info(`Updated metrics for mentor ${mentorId}`);
    }
  }
}

export const mentorMatchingService = new MentorMatchingService();
