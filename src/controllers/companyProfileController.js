const CompanyProfile = require("../models/CompanyProfile");
const User = require("../models/User");
const cloudinary = require("../cloudinary");

async function createCompanyProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "company") {
      return res
        .status(403)
        .json({ message: "Only companies can have a company profile" });
    }

    const existing = await CompanyProfile.findOne({ user: userId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Company profile already exists" });
    }

    let logoUrl;
    let coverImageUrl;

    if (req.files && req.files.logo && req.files.logo[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.logo[0].path,
        {
          folder: "companies",
        }
      );
      logoUrl = result.secure_url;
    }

    if (req.files && req.files.cover && req.files.cover[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.cover[0].path,
        {
          folder: "companies",
        }
      );
      coverImageUrl = result.secure_url;
    }

    const {
      location,
      about,
      teamSize,
      headquartersLocation,
      companyType,
      website,
      socialLinks,
      skillsLookingFor,
    } = req.body;

    const profile = await CompanyProfile.create({
      user: userId,
      location,
      about,
      teamSize,
      headquartersLocation,
      companyType,
      website,
      socialLinks,
      logoUrl,
      coverImageUrl,
      skillsLookingFor,
    });

    const populated = await profile
      .populate("user", "name email avatarUrl type")
      .populate("skillsLookingFor", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to create company profile" });
  }
}

async function getMyCompanyProfile(req, res) {
  try {
    const userId = req.user._id;
    const profile = await CompanyProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skillsLookingFor", "name");
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Company profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get company profile" });
  }
}

async function updateMyCompanyProfile(req, res) {
  try {
    const userId = req.user._id;

    if (req.user.type !== "company") {
      return res
        .status(403)
        .json({ message: "Only companies can have a company profile" });
    }

    let logoUrl;
    let coverImageUrl;

    if (req.files && req.files.logo && req.files.logo[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.logo[0].path,
        {
          folder: "companies",
        }
      );
      logoUrl = result.secure_url;
    }

    if (req.files && req.files.cover && req.files.cover[0]) {
      const result = await cloudinary.uploader.upload(
        req.files.cover[0].path,
        {
          folder: "companies",
        }
      );
      coverImageUrl = result.secure_url;
    }

    const {
      location,
      about,
      teamSize,
      headquartersLocation,
      companyType,
      website,
      socialLinks,
      skillsLookingFor,
    } = req.body;

    const updateData = {
      location,
      about,
      teamSize,
      headquartersLocation,
      companyType,
      website,
      socialLinks,
      skillsLookingFor,
    };

    if (logoUrl) {
      updateData.logoUrl = logoUrl;
    }

    if (coverImageUrl) {
      updateData.coverImageUrl = coverImageUrl;
    }

    const profile = await CompanyProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "name email avatarUrl type")
      .populate("skillsLookingFor", "name");

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Company profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to update company profile" });
  }
}

async function getCompanyProfileByUserId(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "name email avatarUrl type"
    );
    if (!user || user.type !== "company") {
      return res.status(404).json({ message: "Company not found" });
    }

    const profile = await CompanyProfile.findOne({ user: userId })
      .populate("user", "name email avatarUrl type")
      .populate("skillsLookingFor", "name");

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Company profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get company profile" });
  }
}

module.exports = {
  createCompanyProfile,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  getCompanyProfileByUserId,
};
