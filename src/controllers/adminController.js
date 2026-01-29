const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");
const CompanyProfile = require("../models/CompanyProfile");
const cloudinary = require("../cloudinary"); // Make sure this path is correct

const StudentProfile = require("../models/StudentProfile");
const ProfessionalProfile = require("../models/ProfessionalProfile");
const Job = require("../models/Job");
const CompanyProfile = require("../models/CompanyProfile");

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

async function addStudent(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      educations,
      internships,
      skills
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Handle avatar upload
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.avatar[0].path, {
          folder: "users",
        });
        avatarUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
      }
    }

    let resumeUrl = "";
    if (req.files && req.files.resume && req.files.resume[0]) {
      try {
        // Upload resume (raw resource type for PDF/Docs)
        const result = await cloudinary.uploader.upload(req.files.resume[0].path, {
          folder: "resumes",
          resource_type: "auto"
        });
        resumeUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Resume upload failed:", uploadError);
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      type: "student",
      avatarUrl
    });

    // Helper to parse JSON fields
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

    const studentProfile = await StudentProfile.create({
      user: user._id,
      educations: parseJson(educations),
      internships: parseJson(internships),
      skills: parseJson(skills), // Array of ObjectIds
      resumeUrl
    });

    res.status(201).json({
      message: "Student added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      studentProfile
    });

  } catch (err) {
    console.error("Add Student Error:", err);
    res.status(500).json({ message: "Failed to add student", error: err.message });
  }
}

async function getAllStudents(req, res) {
  try {
    const students = await StudentProfile.find()
      .populate("user", "name email avatarUrl phone type")
      .populate("skills", "name");
    res.json(students);
  } catch (err) {
    console.error("Get All Students Error:", err);
    res.status(500).json({ message: "Failed to get students", error: err.message });
  }
}

async function getStudentById(req, res) {
  try {
    const { id } = req.params;
    const student = await StudentProfile.findById(id)
      .populate("user", "name email avatarUrl phone type")
      .populate("skills", "name");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Get Student By ID Error:", err);
    res.status(500).json({ message: "Failed to get student", error: err.message });
  }
}

async function addProfessional(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      educations,
      internships,
      workExperiences,
      certifications,
      skills
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Handle avatar upload
    let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.avatar[0].path, {
          folder: "users",
        });
        avatarUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
      }
    }

    let resumeUrl = "";
    if (req.files && req.files.resume && req.files.resume[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.resume[0].path, {
          folder: "resumes",
          resource_type: "auto"
        });
        resumeUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Resume upload failed:", uploadError);
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      type: "professional",
      avatarUrl
    });

    // Helper to parse JSON fields
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

    const professionalProfile = await ProfessionalProfile.create({
      user: user._id,
      educations: parseJson(educations),
      internships: parseJson(internships),
      workExperiences: parseJson(workExperiences),
      certifications: parseJson(certifications),
      skills: parseJson(skills),
      resumeUrl
    });

    res.status(201).json({
      message: "Professional added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      },
      professionalProfile
    });

  } catch (err) {
    console.error("Add Professional Error:", err);
    res.status(500).json({ message: "Failed to add professional", error: err.message });
  }
}

async function getAllProfessionals(req, res) {
  try {
    const professionals = await ProfessionalProfile.find()
      .populate("user", "name email avatarUrl phone type")
      .populate("skills", "name");
    res.json(professionals);
  } catch (err) {
    console.error("Get All Professionals Error:", err);
    res.status(500).json({ message: "Failed to get professionals", error: err.message });
  }
}

async function getProfessionalById(req, res) {
  try {
    const { id } = req.params;
    const professional = await ProfessionalProfile.findById(id)
      .populate("user", "name email avatarUrl phone type")
      .populate("skills", "name");

    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    res.json(professional);
  } catch (err) {
    console.error("Get Professional By ID Error:", err);
    res.status(500).json({ message: "Failed to get professional", error: err.message });
  }
}

async function addJob(req, res) {
  try {
    const {
      companyId, // The ID of the User (company) this job is for
      title,
      type,
      salary,
      skills,
      description,
      responsibilities,
      minExperience,
      workMode,
      location,
      applicationDeadline,
      shortDescription,
      overview,
      growth,
      companyDetails,
      applicationProcess,
      socialProof,
      related,
      externalApply,
      applyLink,
      status
    } = req.body;

    // Verify the company exists
    const companyUser = await User.findById(companyId);
    if (!companyUser || companyUser.type !== 'company') {
      return res.status(404).json({ message: "Company not found or invalid user type" });
    }

    // Helper to parse JSON fields
    const parseJson = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (e) {
          return undefined;
        }
      }
      return field;
    };

    const parsedSalary = parseJson(salary);
    const parsedSkills = parseJson(skills) || [];
    const parsedResponsibilities = parseJson(responsibilities) || [];
    const parsedOverview = parseJson(overview);
    const parsedGrowth = parseJson(growth);
    const parsedCompanyDetails = parseJson(companyDetails);
    const parsedApplicationProcess = parseJson(applicationProcess);
    const parsedSocialProof = parseJson(socialProof);
    const parsedRelated = parseJson(related);

    // Get company profile for logo if not provided in companyDetails overrides
    const companyProfile = await CompanyProfile.findOne({ user: companyId });
    const companyLogoUrl = companyProfile ? companyProfile.logoUrl : companyUser.avatarUrl;

    const job = await Job.create({
      title,
      type,
      salary: parsedSalary,
      skills: parsedSkills,
      description,
      responsibilities: parsedResponsibilities,
      minExperience: parseInt(minExperience) || 0,
      workMode,
      location,
      applicationDeadline,
      shortDescription,
      overview: parsedOverview,
      growth: parsedGrowth,
      companyDetails: parsedCompanyDetails,
      applicationProcess: parsedApplicationProcess,
      socialProof: parsedSocialProof,
      related: parsedRelated,
      externalApply: externalApply === 'true' || externalApply === true,
      applyLink,
      status: status || 'active',
      
      // Admin posting on behalf of company
      poster: req.user ? req.user._id : companyId, // If req.user is set (auth middleware), use it. Else fallback (should be protected)
      posterModel: req.user ? "SystemUser" : "User", // Assuming this is an admin route
      company: companyId,
      companyName: companyUser.name,
      companyLogoUrl
    });

    res.status(201).json({
      message: "Job added successfully",
      job
    });

  } catch (err) {
    console.error("Add Job Error:", err);
    res.status(500).json({ message: "Failed to add job", error: err.message });
  }
}

async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find()
      .populate("company", "name email avatarUrl")
      .populate("skills", "name")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Get All Jobs Error:", err);
    res.status(500).json({ message: "Failed to get jobs", error: err.message });
  }
}

async function getJobById(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id)
      .populate("company", "name email avatarUrl")
      .populate("skills", "name")
      .populate("related.similarJobs", "title type location companyName companyLogoUrl")
      .populate("related.relatedInternships", "title type location companyName companyLogoUrl");
      // Add more populations if Course/Mentor models are available and referenced correctly

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error("Get Job By ID Error:", err);
    res.status(500).json({ message: "Failed to get job", error: err.message });
  }
}

module.exports = {
  addInstructor,
  initMentor,
  updateMentor,
  addMentor,
  addCompany,
  addStudent,
  getAllStudents,
  getStudentById,
  addProfessional,
  getAllProfessionals,
  getProfessionalById,
  addJob,
  getAllJobs,
  getJobById
};


