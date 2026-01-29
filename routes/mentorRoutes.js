const express = require("express");
const router = express.Router();
const {
  getMentorHero,
  getMentorOverview,
  getMentorValue,
  getMentorSuccessStories,
  getMentorGrowth,
  getMentorRelated,
  getMentorTrust,
  getMentorActions,
  getMentorById,
  bookMentorship,
  createMentor
} = require("../src/controllers/mentorController");

// Component-specific endpoints
router.get("/:id/hero", getMentorHero);
router.get("/:id/overview", getMentorOverview);
router.get("/:id/value", getMentorValue);
router.get("/:id/success-stories", getMentorSuccessStories);
router.get("/:id/growth", getMentorGrowth);
router.get("/:id/related", getMentorRelated);
router.get("/:id/trust", getMentorTrust);
router.get("/:id/actions", getMentorActions);

// Action endpoints
router.post("/:id/book", bookMentorship);

// Combined endpoint
router.get("/:id", getMentorById);

// Create endpoint (optional/admin)
router.post("/", createMentor);

module.exports = router;
