const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");
const CompanyProfile = require("../models/CompanyProfile");
const cloudinary = require("../cloudinary"); // Make sure this path is correct

async function addInstructor(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      currentRole,
      currentCompany,
      about,
      studentsCount,
      coursesCount,
      rating,
      certifications
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Handle avatar upload
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "users",
        });
        avatarUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
        // Fallback to default avatar if upload fails
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      type: "mentor",
      avatarUrl
    });

    // 2. Create Mentor Profile
    // Parse certifications if sent as string (from FormData)
    let parsedCertifications = [];
    if (typeof certifications === 'string') {
        try {
            parsedCertifications = JSON.parse(certifications);
        } catch (e) {
            console.error("Failed to parse certifications", e);
        }
    } else {
        parsedCertifications = certifications || [];
    }

    const mentorProfile = await MentorProfile.create({
      user: user._id,
      currentRole,
      currentCompany,
      about,
      studentsCount: parseInt(studentsCount) || 0,
      coursesCount: parseInt(coursesCount) || 0,
      rating: parseFloat(rating) || 0,
      certifications: parsedCertifications
    });

    res.status(201).json({
      message: "Instructor added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      mentorProfile
    });

  } catch (err) {
    console.error("Add Instructor Error:", err);
    res.status(500).json({ message: "Failed to add instructor", error: err.message });
  }
}

async function addMentor(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      currentRole,
      currentCompany,
      about,
      experienceYears,
      domain,
      isVerified,
      languages,
      quickCallPrice,
      priceType,
      studentsCount,
      coursesCount,
      rating,
      values,
      stories
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Handle avatar upload
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "users",
        });
        avatarUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      type: "mentor",
      avatarUrl
    });

    // 2. Create Mentor Profile
    const parseJson = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return [];
        }
      }
      return field || [];
    };

    const mentorProfile = await MentorProfile.create({
      user: user._id,
      currentRole,
      currentCompany,
      about,
      experienceYears: parseInt(experienceYears) || 0,
      domain,
      isVerified: isVerified === 'true' || isVerified === true,
      languages: parseJson(languages),
      quickCallPrice: parseInt(quickCallPrice) || 0,
      priceType: priceType || "session",
      studentsCount: parseInt(studentsCount) || 0,
      coursesCount: parseInt(coursesCount) || 0,
      rating: parseFloat(rating) || 0,
      values: parseJson(values),
      stories: parseJson(stories)
    });

    res.status(201).json({
      message: "Mentor added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      mentorProfile
    });

  } catch (err) {
    console.error("Add Mentor Error:", err);
    res.status(500).json({ message: "Failed to add mentor", error: err.message });
  }
}

async function initMentor(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Handle avatar upload
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "users",
        });
        avatarUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      type: "mentor",
      avatarUrl
    });

    // 2. Create Empty Mentor Profile
    const mentorProfile = await MentorProfile.create({
      user: user._id
    });

    res.status(201).json({
      message: "Mentor account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      mentorProfile: {
        _id: mentorProfile._id
      }
    });

  } catch (err) {
    console.error("Init Mentor Error:", err);
    res.status(500).json({ message: "Failed to create mentor account", error: err.message });
  }
}

async function updateMentor(req, res) {
  try {
    const { id } = req.params; // MentorProfile ID
    const updates = req.body;

    // Helper to parse JSON fields safely
    const parseJson = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return undefined; // Let it be undefined if parse fails, or handle differently
        }
      }
      return field;
    };

    // Process fields that might need parsing
    // We only parse if they are present in updates
    if (updates.languages) updates.languages = parseJson(updates.languages);
    if (updates.values) updates.values = parseJson(updates.values);
    if (updates.stories) updates.stories = parseJson(updates.stories);
    if (updates.relatedMentors) updates.relatedMentors = parseJson(updates.relatedMentors);
    if (updates.recommendedJobs) updates.recommendedJobs = parseJson(updates.recommendedJobs);
    if (updates.recommendedCourses) updates.recommendedCourses = parseJson(updates.recommendedCourses);
    if (updates.recommendedInternships) updates.recommendedInternships = parseJson(updates.recommendedInternships);
    if (updates.availability) updates.availability = parseJson(updates.availability);

    // Boolean conversion
    if (updates.isVerified !== undefined) {
        updates.isVerified = updates.isVerified === 'true' || updates.isVerified === true;
    }

    const mentorProfile = await MentorProfile.findByIdAndUpdate(id, updates, { new: true });

    if (!mentorProfile) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    res.status(200).json({
      message: "Mentor profile updated successfully",
      mentorProfile
    });

  } catch (err) {
    console.error("Update Mentor Error:", err);
    res.status(500).json({ message: "Failed to update mentor", error: err.message });
  }
}

async function addCompany(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      location,
      about,
      teamSize,
      headquartersLocation,
      companyType,
      website,
      socialLinks
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Handle files (avatar/logo and cover)
    let logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    let coverImageUrl = "";

    // req.files is available if using upload.fields
    // Map 'avatar' field to logo
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.avatar[0].path, {
          folder: "companies",
        });
        logoUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Logo upload failed:", uploadError);
      }
    }

    if (req.files && req.files.cover && req.files.cover[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.cover[0].path, {
          folder: "companies",
        });
        coverImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cover upload failed:", uploadError);
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      type: "company",
      avatarUrl: logoUrl
    });

    // Parse JSON fields
    const parseJson = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return [];
        }
      }
      return field || [];
    };

    const companyProfile = await CompanyProfile.create({
      user: user._id,
      location,
      about,
      teamSize: parseInt(teamSize) || 0,
      headquartersLocation,
      companyType,
      website,
      socialLinks: parseJson(socialLinks),
      logoUrl,
      coverImageUrl
    });

    res.status(201).json({
      message: "Company added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      companyProfile
    });

  } catch (err) {
    console.error("Add Company Error:", err);
    res.status(500).json({ message: "Failed to add company", error: err.message });
  }
}

module.exports = {
  addInstructor,
  initMentor,
  updateMentor,
  addMentor,
  addCompany
};
