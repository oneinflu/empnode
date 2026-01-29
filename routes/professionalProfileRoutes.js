const express = require("express");
const multer = require("multer");
const {
  createProfessionalProfile,
  getMyProfessionalProfile,
  updateMyProfessionalProfile,
  getProfessionalProfileByUserId,
} = require("../src/controllers/professionalProfileController");
const { protectUser } = require("../src/middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

router.post("/me", protectUser, upload.single("resume"), createProfessionalProfile);
router.get("/me", protectUser, getMyProfessionalProfile);
router.put("/me", protectUser, upload.single("resume"), updateMyProfessionalProfile);
router.get("/user/:userId", getProfessionalProfileByUserId);

module.exports = router;

