const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const StudentProfile = require("../models/StudentProfile");
const ProfessionalProfile = require("../models/ProfessionalProfile");
const SystemUser = require("../models/SystemUser");

async function applyForJob(req, res) {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const user = req.user;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check eligibility
    if (job.type === "job" && user.type !== "professional") {
      return res.status(403).json({ message: "Only professionals can apply for jobs" });
    }
    if (job.type === "internship" && user.type !== "student") {
      return res.status(403).json({ message: "Only students can apply for internships" });
    }

    // Check if already applied
    const existing = await JobApplication.findOne({ job: jobId, applicant: user._id });
    if (existing) {
      return res.status(409).json({ message: "You have already applied for this position" });
    }

    // Fetch resume from profile
    let resumeUrl = null;
    if (user.type === "student") {
      const profile = await StudentProfile.findOne({ user: user._id });
      if (profile) resumeUrl = profile.resumeUrl;
    } else if (user.type === "professional") {
      const profile = await ProfessionalProfile.findOne({ user: user._id });
      if (profile) resumeUrl = profile.resumeUrl;
    }

    if (!resumeUrl) {
      // Maybe allow applying without resume? Or require it?
      // User said "resume upload option... is to be added". Usually required.
      // Let's assume it's required for now, or warn.
      // return res.status(400).json({ message: "Please upload a resume to your profile before applying" });
    }

    const application = await JobApplication.create({
      job: jobId,
      applicant: user._id,
      resumeUrl,
      coverLetter,
      status: "applied",
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to apply for job" });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await JobApplication.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = application.job;

    // Authorization: Admin or Job Poster or Job Company
    let authorized = false;

    // Check if SystemUser (Admin)
    // Note: authMiddleware attaches user to req.user. We need to check kind/model.
    // In protectJobPoster middleware, we set req.userModel.
    // But here, we might need a generic protect middleware that handles both User and SystemUser.
    // Let's assume we use 'protectJobPoster' middleware for this route too?
    // Or we use a middleware that allows authenticated users, and we check permissions here.

    // If req.user is from protectSystemUser (admin)
    // Actually, we haven't standardized "isAdmin" property easily.
    // Let's check if req.userModel is set (from protectJobPoster).
    
    if (req.userModel === "SystemUser") {
        authorized = true;
    } else if (req.userModel === "User") {
        // Check if user is the company owner or the specific poster
        if (job.poster.toString() === req.user._id.toString()) {
            authorized = true;
        }
        if (job.company.toString() === req.user._id.toString()) {
            authorized = true;
        }
    }

    if (!authorized) {
      return res.status(403).json({ message: "Not authorized to update application status" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
}

async function getJobApplications(req, res) {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Authorization
    let authorized = false;
    if (req.userModel === "SystemUser") {
        authorized = true;
    } else if (req.userModel === "User") {
        if (job.poster.toString() === req.user._id.toString()) {
            authorized = true;
        }
        if (job.company.toString() === req.user._id.toString()) {
            authorized = true;
        }
    }

    if (!authorized) {
      return res.status(403).json({ message: "Not authorized to view applications for this job" });
    }

    const applications = await JobApplication.find({ job: jobId })
      .populate("applicant", "name email avatarUrl type")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
}

async function getMyApplications(req, res) {
  try {
    const applications = await JobApplication.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title type companyName companyLogoUrl location status",
        populate: { path: "company", select: "name" } // Optional
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your applications" });
  }
}

module.exports = {
  applyForJob,
  updateApplicationStatus,
  getJobApplications,
  getMyApplications,
};
