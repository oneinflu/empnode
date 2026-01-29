const ProfessionalProfile = require("../models/ProfessionalProfile");
const User = require("../models/User");
const cloudinary = require("../cloudinary");

async function createProfessionalProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "professional") {
      return res
        .status(403)
        .json({ message: "Only professionals can have a professional profile" });
    }

    const existing = await ProfessionalProfile.findOne({ user: userId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Professional profile already exists" });
    }

    let resumeUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "resumes",
      });
      resumeUrl = result.secure_url;
    }

    const {
      educations,
      internships,
      workExperiences,
      certifications,
      skills,
    } = req.body;

    const profile = await ProfessionalProfile.create({
      user: userId,
      educations,
      internships,
      workExperiences,
      certifications,
      skills,
      resumeUrl,
    });

    const populated = await profile
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create professional profile" });
  }
}

async function getMyProfessionalProfile(req, res) {
  try {
    const userId = req.user._id;
    const profile = await ProfessionalProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Professional profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get professional profile" });
  }
}

async function updateMyProfessionalProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "professional") {
      return res
        .status(403)
        .json({ message: "Only professionals can have a professional profile" });
    }

    let resumeUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "resumes",
      });
      resumeUrl = result.secure_url;
    }

    const {
      educations,
      internships,
      workExperiences,
      certifications,
      skills,
    } = req.body;

    const updateData = {
      educations,
      internships,
      workExperiences,
      certifications,
      skills,
    };

    if (resumeUrl) {
      updateData.resumeUrl = resumeUrl;
    }

    const profile = await ProfessionalProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Professional profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to update professional profile" });
  }
}

async function getProfessionalProfileByUserId(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "name email avatarUrl type"
    );
    if (!user || user.type !== "professional") {
      return res.status(404).json({ message: "Professional not found" });
    }

    const profile = await ProfessionalProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Professional profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get professional profile" });
  }
}

module.exports = {
  createProfessionalProfile,
  getMyProfessionalProfile,
  updateMyProfessionalProfile,
  getProfessionalProfileByUserId,
};

