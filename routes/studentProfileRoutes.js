const express = require("express");
const multer = require("multer");
const { 
  createStudentProfile, 
  getMyStudentProfile, 
  updateMyStudentProfile, 
  getStudentProfileByUserId 
} = require("../src/controllers/studentProfileController");
const { protectUser } = require("../src/middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

router.post("/me", protectUser, upload.single("resume"), createStudentProfile);
router.get("/me", protectUser, getMyStudentProfile);
router.put("/me", protectUser, upload.single("resume"), updateMyStudentProfile);
router.get("/user/:userId", getStudentProfileByUserId);

module.exports = router;

