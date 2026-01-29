const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["school", "college", "university", "other"],
      default: "college",
    },
    degree: {
      type: String,
      trim: true,
    },
    yearOfPassing: {
      type: Number,
    },
  },
  { _id: false }
);

const internshipSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
  },
  { _id: false }
);

const workExperienceSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const professionalProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    educations: [educationSchema],
    internships: [internshipSchema],
    workExperiences: [workExperienceSchema],
    certifications: [certificationSchema],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    resumeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProfessionalProfile = mongoose.model(
  "ProfessionalProfile",
  professionalProfileSchema
);

module.exports = ProfessionalProfile;

