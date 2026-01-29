const express = require("express");
const {
  createMentorProfile,
  getMyMentorProfile,
  updateMyMentorProfile,
  getMentorProfileByUserId,
  getAllMentors,
} = require("../src/controllers/mentorProfileController");
const { protectUser } = require("../src/middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllMentors);
router.post("/me", protectUser, createMentorProfile);
router.get("/me", protectUser, getMyMentorProfile);
router.put("/me", protectUser, updateMyMentorProfile);
router.get("/user/:userId", getMentorProfileByUserId);

module.exports = router;
