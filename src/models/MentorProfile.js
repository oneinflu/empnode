const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    slots: [
      {
        startTime: {
          type: String, // e.g., "10:00"
          required: true,
        },
        endTime: {
          type: String, // e.g., "11:00"
          required: true,
        },
      },
    ],
  },
  { _id: false }
);

const mentorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    about: {
      type: String,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    experienceYears: {
      type: Number,
      default: 0,
    },
    industry: {
      type: String,
      trim: true,
    },
    currentRole: {
      type: String,
      trim: true,
    },
    currentCompany: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    coursesCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        icon: String, // e.g., 'award', 'briefcase', 'book'
      }
    ],
    quickCallPrice: {
      type: Number,
      default: 0,
    },
    priceType: {
      type: String,
      enum: ["session", "hour"],
      default: "session",
    },
    availability: [availabilitySchema],
    sessionDuration: {
      type: Number, // in minutes, e.g., 30, 45, 60
      enum: [30, 45, 60],
      default: 30,
    },
    
    // New fields for Mentor Detail Page components
    values: [
      {
        title: String,
        description: String,
      }
    ],
    stories: [
      {
        name: String,
        role: String,
        company: String,
        quote: String,
        avatar: String,
      }
    ],
    relatedMentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile",
      }
    ],
    recommendedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      }
    ],
    recommendedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      }
    ],
    recommendedInternships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      }
    ],
  },
  {
    timestamps: true,
  }
);

const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);

module.exports = MentorProfile;
