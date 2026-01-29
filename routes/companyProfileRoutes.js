const express = require("express");
const multer = require("multer");
const {
  createCompanyProfile,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  getCompanyProfileByUserId,
  getAllCompanies,
  getCompanyProfileById,
} = require("../src/controllers/companyProfileController");
const { protectUser } = require("../src/middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

router.get("/", getAllCompanies);
router.get("/:id", getCompanyProfileById);

router.post(
  "/me",
  protectUser,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createCompanyProfile
);

router.get("/me", protectUser, getMyCompanyProfile);

router.put(
  "/me",
  protectUser,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateMyCompanyProfile
);

router.get("/user/:userId", getCompanyProfileByUserId);

module.exports = router;

