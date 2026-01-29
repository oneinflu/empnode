const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

async function enrollCourse(req, res) {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
    });

    await enrollment.save();

    res.status(201).json({ message: "Successfully enrolled", enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Failed to enroll in course" });
  }
}

async function getMyEnrollments(req, res) {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: "course",
        populate: {
          path: "skills",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
}

module.exports = {
  enrollCourse,
  getMyEnrollments,
};
