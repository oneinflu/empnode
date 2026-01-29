const MentorProfile = require("../models/MentorProfile");
const User = require("../models/User");
const { getRecommendations } = require("../utils/recommendationEngine");

async function createMentorProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "mentor") {
      return res
        .status(403)
        .json({ message: "Only mentors can have a mentor profile" });
    }

    const existing = await MentorProfile.findOne({ user: userId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Mentor profile already exists" });
    }

    const {
      about,
      skills,
      experienceYears,
      industry,
      quickCallPrice,
      availability,
      sessionDuration,
    } = req.body;

    const profile = await MentorProfile.create({
      user: userId,
      about,
      skills,
      experienceYears,
      industry,
      quickCallPrice,
      availability,
      sessionDuration,
    });

    const populated = await profile
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create mentor profile" });
  }
}

async function getMyMentorProfile(req, res) {
  try {
    const userId = req.user._id;
    const profile = await MentorProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Mentor profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get mentor profile" });
  }
}

async function updateMyMentorProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "mentor") {
      return res
        .status(403)
        .json({ message: "Only mentors can have a mentor profile" });
    }

    const {
      about,
      skills,
      experienceYears,
      industry,
      quickCallPrice,
      availability,
      sessionDuration,
    } = req.body;

    const updateData = {
      about,
      skills,
      experienceYears,
      industry,
      quickCallPrice,
      availability,
      sessionDuration,
    };

    const profile = await MentorProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Mentor profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to update mentor profile" });
  }
}

async function getMentorProfileByUserId(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "name email avatarUrl type"
    );
    if (!user || user.type !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const profile = await MentorProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skills", "name");

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Mentor profile not found" });
    }

    const recommendations = await getRecommendations(profile.skills, {
      excludeId: profile._id,
      excludeType: "mentor",
    });

    res.json({ ...profile.toObject(), ...recommendations });
  } catch (err) {
    res.status(500).json({ message: "Failed to get mentor profile" });
  }
}

async function getAllMentors(req, res) {
  try {
    const mentors = await MentorProfile.find()
      .populate("user", "name email avatarUrl")
      .select("user currentRole currentCompany industry about studentsCount coursesCount rating certifications quickCallPrice priceType");
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: "Failed to get mentors" });
  }
}

module.exports = {
  createMentorProfile,
  getMyMentorProfile,
  updateMyMentorProfile,
  getMentorProfileByUserId,
  getAllMentors,
};
