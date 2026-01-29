const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const cloudinary = require("../cloudinary");

async function createStudentProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "student") {
      return res.status(403).json({ message: "Only students can have a student profile" });
    }

    const existing = await StudentProfile.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({ message: "Student profile already exists" });
    }

    let resumeUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "resumes",
      });
      resumeUrl = result.secure_url;
    }

    const { educations, internships, skills } = req.body;

    const profile = await StudentProfile.create({
      user: userId,
      educations,
      internships,
      skills,
      resumeUrl,
    });

    const populated = await profile
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create student profile" });
  }
}

async function getMyStudentProfile(req, res) {
  try {
    const userId = req.user._id;
    const profile = await StudentProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");
    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get student profile" });
  }
}

async function updateMyStudentProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "student") {
      return res.status(403).json({ message: "Only students can have a student profile" });
    }

    const { educations, internships, skills } = req.body;

    const updateData = {
      educations,
      internships,
      skills,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "resumes",
      });
      updateData.resumeUrl = result.secure_url;
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to update student profile" });
  }
}

async function getStudentProfileByUserId(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name email avatarUrl type");
    if (!user || user.type !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const profile = await StudentProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get student profile" });
  }
}

module.exports = {
  createStudentProfile,
  getMyStudentProfile,
  updateMyStudentProfile,
  getStudentProfileByUserId,
};
