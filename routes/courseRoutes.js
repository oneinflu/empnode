const express = require("express");
const multer = require("multer");
const { 
  createCourse, 
  listCourses, 
  getCourse, 
  getCourseBySlug, 
  getCourseHero,
  getCourseOverview,
  getCourseCurriculum,
  getCourseAudience,
  getCourseOutcomes,
  getCourseInstructor,
  getCourseFAQ,
  getCourseGrowth,
  updateCourse,
  updateCourseHero,
  updateCourseOverview,
  updateCourseCurriculum,
  updateCourseAudience,
  updateCourseOutcomes,
  updateCourseInstructor,
  updateCourseFAQ,
  updateCourseGrowth,
  deleteCourse 
} = require("../src/controllers/courseController");
const { enrollCourse, getMyEnrollments } = require("../src/controllers/enrollmentController");
const { protectSystemUser, protectUser } = require("../src/middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

router.get("/", listCourses);
router.post("/", protectSystemUser, upload.single("banner"), createCourse);
router.get("/my-enrollments", protectUser, getMyEnrollments); // Must be before /:id

// Component-specific endpoints
router.get("/:id/hero", getCourseHero);
router.put("/:id/hero", protectSystemUser, updateCourseHero);
router.get("/:id/overview", getCourseOverview);
router.put("/:id/overview", protectSystemUser, updateCourseOverview);
router.get("/:id/curriculum", getCourseCurriculum);
router.put("/:id/curriculum", protectSystemUser, updateCourseCurriculum);
router.get("/:id/audience", getCourseAudience);
router.put("/:id/audience", protectSystemUser, updateCourseAudience);
router.get("/:id/outcomes", getCourseOutcomes);
router.put("/:id/outcomes", protectSystemUser, updateCourseOutcomes);
router.get("/:id/instructor", getCourseInstructor);
router.put("/:id/instructor", protectSystemUser, updateCourseInstructor);
router.get("/:id/faq", getCourseFAQ);
router.put("/:id/faq", protectSystemUser, updateCourseFAQ);
router.get("/:id/growth", getCourseGrowth);
router.put("/:id/growth", protectSystemUser, updateCourseGrowth);

router.get("/:id", getCourse);
router.get("/slug/:slug", getCourseBySlug);
router.put("/:id", protectSystemUser, upload.single("banner"), updateCourse);
router.delete("/:id", protectSystemUser, deleteCourse);
router.post("/:id/enroll", protectUser, enrollCourse);

module.exports = router;
