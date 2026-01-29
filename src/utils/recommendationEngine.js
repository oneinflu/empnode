const Job = require("../models/Job");
const Course = require("../models/Course");
const MentorProfile = require("../models/MentorProfile");

/**
 * Fetch recommended items based on a set of skills.
 * @param {Array} skills - Array of Skill IDs.
 * @param {Object} options - Options to exclude current item or limit results.
 * @param {string} options.excludeId - ID of the current item to exclude from results.
 * @param {string} options.excludeType - Type of current item (job, internship, course, mentor).
 * @param {number} options.limit - Number of items to return per category (default 5).
 */
async function getRecommendations(skills, options = {}) {
  const { excludeId, excludeType, limit = 5 } = options;

  if (!skills || skills.length === 0) {
    return {
      recommendedJobs: [],
      recommendedInternships: [],
      recommendedCourses: [],
      recommendedMentors: [],
    };
  }

  // Helper to build query
  const buildQuery = (baseQuery) => {
    const query = { ...baseQuery, skills: { $in: skills } };
    if (excludeId) {
      // For Job/Course, _id is the excludeId.
      // For MentorProfile, _id is the profile ID, but we might want to exclude based on something else?
      // Usually excludeId is the document _id.
      query._id = { $ne: excludeId };
    }
    return query;
  };

  // 1. Recommended Jobs
  // If current item is a job, exclude it.
  const jobQuery = { status: "active", type: "job", skills: { $in: skills } };
  if (excludeType === "job" && excludeId) jobQuery._id = { $ne: excludeId };
  
  const recommendedJobs = await Job.find(jobQuery)
    .select("title companyName companyLogoUrl location salary type")
    .limit(limit);

  // 2. Recommended Internships
  const internshipQuery = { status: "active", type: "internship", skills: { $in: skills } };
  if (excludeType === "internship" && excludeId) internshipQuery._id = { $ne: excludeId };

  const recommendedInternships = await Job.find(internshipQuery)
    .select("title companyName companyLogoUrl location salary type")
    .limit(limit);

  // 3. Recommended Courses
  const courseQuery = { skills: { $in: skills } };
  if (excludeType === "course" && excludeId) courseQuery._id = { $ne: excludeId };

  const recommendedCourses = await Course.find(courseQuery)
    .select("title slug bannerUrl salary originalPrice level rating")
    .limit(limit);

  // 4. Recommended Mentors
  const mentorQuery = { skills: { $in: skills } };
  if (excludeType === "mentor" && excludeId) mentorQuery._id = { $ne: excludeId };

  const recommendedMentors = await MentorProfile.find(mentorQuery)
    .select("user industry experienceYears quickCallPrice sessionDuration")
    .populate("user", "name avatarUrl")
    .limit(limit);

  return {
    recommendedJobs,
    recommendedInternships,
    recommendedCourses,
    recommendedMentors,
  };
}

module.exports = { getRecommendations };
