const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  // Component exports
  getJobHero,
  updateJobHero,
  getJobOverview,
  updateJobOverview,
  getJobGrowth,
  updateJobGrowth,
  getJobCompany,
  updateJobCompany,
  getJobProcess,
  updateJobProcess,
  getJobSocialProof,
  updateJobSocialProof,
  getJobRelated,
  updateJobRelated,
  getJobActions,
  updateJobActions
} = require("../src/controllers/jobController");
const { protectJobPoster } = require("../src/middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getJobs);

// Component-specific endpoints
router.get("/:id/hero", getJobHero);
router.put("/:id/hero", protectJobPoster, updateJobHero);

router.get("/:id/overview", getJobOverview);
router.put("/:id/overview", protectJobPoster, updateJobOverview);

router.get("/:id/growth", getJobGrowth);
router.put("/:id/growth", protectJobPoster, updateJobGrowth);

router.get("/:id/company", getJobCompany);
router.put("/:id/company", protectJobPoster, updateJobCompany);

router.get("/:id/process", getJobProcess);
router.put("/:id/process", protectJobPoster, updateJobProcess);

router.get("/:id/social-proof", getJobSocialProof);
router.put("/:id/social-proof", protectJobPoster, updateJobSocialProof);

router.get("/:id/related", getJobRelated);
router.put("/:id/related", protectJobPoster, updateJobRelated);

router.get("/:id/actions", getJobActions);
router.put("/:id/actions", protectJobPoster, updateJobActions);

// Standard endpoints
router.get("/:id", getJobById);

// Protected routes (Company or Admin)
router.post("/", protectJobPoster, createJob);
router.put("/:id", protectJobPoster, updateJob);
router.delete("/:id", protectJobPoster, deleteJob);

module.exports = router;
