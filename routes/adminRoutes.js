const express = require("express");
const multer = require("multer");
const { addInstructor, initMentor, updateMentor, addMentor, addCompany } = require("../src/controllers/adminController");
const { protectSystemUser } = require("../src/middleware/authMiddleware"); // Assuming protectSystemUser is for admins

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

// POST /api/admin/companies/add
router.post(
  "/companies/add",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  addCompany
);

// Students
router.post(
  "/students/add",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  addStudent
);

router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);

// POST /api/admin/instructors/add
router.post(
  "/instructors/add", 
  // protectSystemUser, // Uncomment to protect
  upload.single("avatar"), 
  addInstructor
);

// POST /api/admin/mentors/add
router.post(
  "/mentors/add",
  upload.single("avatar"),
  addMentor
);

// POST /api/admin/mentors/init - Step 1
router.post(
  "/mentors/init",
  upload.single("avatar"),
  initMentor
);

// PUT /api/admin/mentors/:id - Steps 2-5
router.put(
  "/mentors/:id",
  upload.none(), // Use none() if only text fields, or single() if file upload needed later
  updateMentor
);

module.exports = router;
