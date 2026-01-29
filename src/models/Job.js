const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["job", "internship"],
      default: "job",
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" },
      isStipend: { type: Boolean, default: false }, // true for internships usually
      period: { type: String, enum: ["monthly", "yearly", "weekly", "lump-sum"], default: "monthly" }
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    minExperience: {
      type: Number, // in years
      default: 0,
    },
    workMode: {
      type: String,
      enum: ["Work From Home", "Work From Office", "Hybrid"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDeadline: {
      type: Date,
    },
    
    // New fields for Job Detail Page components
    shortDescription: {
      type: String,
      trim: true
    },
    overview: {
      summary: String,
      responsibilities: [String], // Can override root responsibilities
      requiredSkills: [String], // Text version
      preferredQualifications: [String],
      techStack: [{ 
        name: String, 
        logo: String 
      }]
    },
    growth: {
      careerPath: [{
        title: String,
        timeframe: String,
        salary: String,
        type: { type: String } // 'job', 'promotion', etc.
      }],
      recommendedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }],
      recommendedMentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile" // Assuming MentorProfile is the model
      }]
    },
    companyDetails: {
      // Optional overrides for CompanyProfile data
      description: String,
      founded: String,
      headquarters: String,
      employees: String,
      industry: String,
      website: String,
      culture: [String],
      benefits: [String],
      reviews: [{
        author: String,
        rating: Number,
        comment: String
      }]
    },
    applicationProcess: {
      steps: [{
        title: String,
        description: String,
        icon: String,
        color: String
      }],
      timeline: {
        applicationClose: String,
        processDuration: String,
        joiningDate: String
      },
      faqs: [{
        question: String,
        answer: String
      }]
    },
    socialProof: {
      metrics: {
        applicantsCount: { type: Number, default: 0 },
        viewedCount: { type: Number, default: 0 },
        interviewedCount: { type: Number, default: 0 },
        averageResponseTime: String
      },
      successStories: [{
        name: String,
        role: String,
        story: String,
        avatar: String
      }],
      testimonials: [{
        name: String,
        role: String,
        quote: String,
        avatar: String
      }]
    },
    related: {
      similarJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }],
      relatedInternships: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }]
    },
    externalApply: {
      type: Boolean,
      default: false
    },
    applyLink: {
      type: String
    },

    // Dynamic reference to either SystemUser (admin) or User (company)
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "posterModel",
    },
    posterModel: {
      type: String,
      required: true,
      enum: ["SystemUser", "User"],
    },
    // The Company this job belongs to (User of type 'company')
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional display fields (useful if admin posts on behalf of someone, or to cache company info)
    companyName: {
      type: String,
      trim: true,
    },
    companyLogoUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
