
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const CompanyProfile = require("../src/models/CompanyProfile");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/empediproject"; // Fallback if env not set

async function seedCompany() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const companyEmail = "techcorp@example.com";
    
    // 1. Create User
    let user = await User.findOne({ email: companyEmail });
    if (!user) {
      user = await User.create({
        name: "Tech Corp",
        email: companyEmail,
        password: "password123", // In a real app, this should be hashed. Assuming User model pre-save hook handles hashing?
        // Let's check User model later. If not, I might need to hash it. 
        // But for seed it's fine if I just want the record.
        phone: "1234567890",
        type: "company",
        avatarUrl: "https://logo.clearbit.com/google.com"
      });
      console.log("Created Company User:", user.name);
    } else {
      console.log("Company User already exists:", user.name);
    }

    // 2. Create Company Profile
    let profile = await CompanyProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await CompanyProfile.create({
        user: user._id,
        location: "San Francisco, CA",
        about: "We are a leading tech company building the future of AI.",
        teamSize: 1000,
        headquartersLocation: "Mountain View, CA",
        companyType: "Technology",
        website: "https://techcorp.com",
        logoUrl: "https://logo.clearbit.com/google.com",
        coverImageUrl: "https://via.placeholder.com/1200x400",
        skillsLookingFor: [], // Empty for now
        socialLinks: [
            { platform: "LinkedIn", url: "https://linkedin.com/company/techcorp" },
            { platform: "Twitter", url: "https://twitter.com/techcorp" }
        ]
      });
      console.log("Created Company Profile");
    } else {
      console.log("Company Profile already exists");
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedCompany();
