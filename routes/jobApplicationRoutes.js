const express = require("express");
const {
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
} = require("../src/controllers/jobApplicationController");
const { protectUser, protectJobPoster } = require("../src/middleware/authMiddleware");

const router = express.Router();

// Apply for a job
router.post("/apply/:jobId", protectUser, applyForJob);

// Get applications for a specific job (Company/Admin)
router.get("/job/:jobId", protectJobPoster, getJobApplications);

// Get my applications (Student/Professional)
router.get("/my", protectUser, getMyApplications);

// Update application status (Company/Admin)
router.patch("/:applicationId/status", protectJobPoster, updateApplicationStatus);

module.exports = router;
