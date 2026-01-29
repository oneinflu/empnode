const mongoose = require("mongoose");
const slugify = require("slugify");

const stages = ["Beginner", "Intermediate", "Advanced", "Beginner to Advanced"];

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "reading", "quiz"], default: "video" },
  duration: { type: String }, // e.g., "10 min"
  videoUrl: { type: String },
  isFreePreview: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
}, { _id: true }); // Keep _id for specific lesson addressing

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  estimatedTime: { type: String }, // e.g., "2 weeks"
  isCompleted: { type: Boolean, default: false },
  lessons: [lessonSchema]
}, { _id: true });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    // Company/Provider Info
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile", // Linking to CompanyProfile as requested
      // required: true  <-- Removed required: true to allow creation without company
    },
    // Also keeping companyName/Logo as cache or for aggregators without profile? 
    // User insisted on ObjectIDs. We will populate from CompanyProfile.
    // But course.md has "Udemy" which might not be a "CompanyProfile" in our system if it's an aggregator.
    // However, I'll stick to Ref as primary.
    
    // Basic Details
    level: {
      type: String,
      enum: stages,
      default: "Beginner",
    },
    duration: {
      type: String, // "6 Weeks, 40 Hours"
    },
    format: {
      type: String, // "Self-paced"
      default: "Self-paced"
    },
    salary: { // Price in course.md context
      type: String, // "₹1,999"
    },
    originalPrice: {
      type: String, // "₹3,999"
    },
    rating: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    
    // Overview
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
    },
    highlights: [String],
    prerequisites: [String],
    
    // Media
    bannerUrl: {
      type: String,
    },
    
    // Instructor
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
    },

    // Curriculum
    modules: [moduleSchema],

    // Audience
    targetAudience: [String],

    // Outcomes
    outcomes: {
      careerPath: [{
        title: String,
        timeframe: String,
        salary: String,
        description: String,
        icon: String
      }],
      salaryInsights: [{
        role: String,
        timeframe: String,
        salaryRange: String,
        growth: String
      }],
      successStories: [{
        name: String,
        previousRole: String,
        currentRole: String,
        achievement: String,
        salary: String,
        avatar: String // URL
      }]
    },

    // FAQs
    faqs: [faqSchema],

    // Growth / Recommendations
    growth: {
      relatedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }],
      relatedInternships: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }],
      nextLevelCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }],
      recommendedMentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorProfile"
      }]
    },

    // Metadata
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SystemUser",
      // required: true, // Made optional for now as it might be created by company
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

courseSchema.pre("save", async function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
