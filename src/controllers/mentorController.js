const MentorProfile = require("../models/MentorProfile");
const Job = require("../models/Job");
const Course = require("../models/Course");
const User = require("../models/User");

// Helper to find mentor and populate basic fields
async function findMentor(id) {
  // Try to find by MentorProfile ID first
  let mentor = await MentorProfile.findById(id)
    .populate("user", "name email avatarUrl")
    .populate("skills", "name")
    .populate("relatedMentors")
    .populate("recommendedJobs")
    .populate("recommendedCourses")
    .populate("recommendedInternships");

  // If not found, try to find by User ID
  if (!mentor) {
    mentor = await MentorProfile.findOne({ user: id })
      .populate("user", "name email avatarUrl")
      .populate("skills", "name")
      .populate("relatedMentors")
      .populate("recommendedJobs")
      .populate("recommendedCourses")
      .populate("recommendedInternships");
  }

  return mentor;
}

// 1. MentorHero
async function getMentorHero(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const heroData = {
      mentor: {
        id: mentor._id,
        name: mentor.user?.name,
        role: mentor.currentRole,
        company: mentor.currentCompany,
        avatar: mentor.user?.avatarUrl,
        rating: mentor.rating,
        reviewCount: 0, // Need a Review model to count real reviews
        experience: `${mentor.experienceYears}+ years`,
        price: `₹${mentor.quickCallPrice}`,
        priceType: mentor.priceType
      }
    };
    res.json(heroData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 2. MentorOverview
async function getMentorOverview(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const overviewData = {
      mentor: {
        bio: mentor.about,
        skills: mentor.skills.map(s => ({ name: s.name, link: `/skills/${s.name.toLowerCase()}` })), // Assuming simple link mapping
        languages: mentor.languages,
        availability: mentor.availability
      }
    };
    res.json(overviewData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 3. MentorValueSection
async function getMentorValue(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const valueData = {
      mentorName: mentor.user?.name,
      values: mentor.values
    };
    res.json(valueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 4. MentorSuccessStories
async function getMentorSuccessStories(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const storiesData = {
      mentorName: mentor.user?.name,
      stories: mentor.stories
    };
    res.json(storiesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 5. MentorGrowthLink
async function getMentorGrowth(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const growthData = {
      mentor: {
        id: mentor._id,
        name: mentor.user?.name,
        role: mentor.currentRole,
        domain: mentor.domain,
        experience: `${mentor.experienceYears}+ years`
      },
      recommendedJobs: mentor.recommendedJobs,
      recommendedCourses: mentor.recommendedCourses,
      recommendedInternships: mentor.recommendedInternships
    };
    res.json(growthData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 6. MentorRelated
async function getMentorRelated(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // If relatedMentors is empty, maybe fetch some by domain?
    let related = mentor.relatedMentors;
    if (!related || related.length === 0) {
       // Logic to find random mentors in same domain could go here
       // For now returning empty or what's in DB
    }

    // Need to format related mentors to match expected UI structure
    // The model populate returns full objects, we might need to map them if strict shape required
    // But usually frontend can handle the populated object if it matches props
    
    // We need to ensure we return `mentorDomain` as well
    const relatedData = {
      mentorDomain: mentor.domain || mentor.industry,
      relatedMentors: related
    };
    res.json(relatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 7. MentorTrustSafety
async function getMentorTrust(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const trustData = {
      mentorName: mentor.user?.name,
      isVerified: mentor.isVerified,
      stats: {
        sessionsCompleted: mentor.studentsCount, // mapping studentsCount to sessionsCompleted
        rating: mentor.rating
      }
    };
    res.json(trustData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 8. MentorActionBar
async function getMentorActions(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const actionData = {
      mentor: {
        name: mentor.user?.name,
        price: `₹${mentor.quickCallPrice}`,
        priceType: mentor.priceType,
        isAvailable: mentor.availability && mentor.availability.length > 0,
        bookingLink: `/book/${mentor._id}`
      }
    };
    res.json(actionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Combined Response
async function getMentorById(req, res) {
  try {
    const mentor = await findMentor(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Construct the full object
    const fullData = {
      _id: mentor._id,
      name: mentor.user?.name,
      role: mentor.currentRole,
      company: mentor.currentCompany,
      avatar: mentor.user?.avatarUrl,
      bio: mentor.about,
      domain: mentor.domain || mentor.industry,
      experience: `${mentor.experienceYears}+ years`,
      rating: mentor.rating,
      reviewCount: 0, 
      price: `₹${mentor.quickCallPrice}`,
      priceType: mentor.priceType,
      isVerified: mentor.isVerified,
      isAvailable: mentor.availability && mentor.availability.length > 0,
      skills: mentor.skills.map(s => ({ name: s.name, link: `/skills/${s.name.toLowerCase()}` })),
      languages: mentor.languages,
      availability: mentor.availability,
      values: mentor.values,
      stories: mentor.stories,
      relatedMentors: mentor.relatedMentors,
      recommendedJobs: mentor.recommendedJobs,
      recommendedCourses: mentor.recommendedCourses,
      recommendedInternships: mentor.recommendedInternships
    };

    res.json(fullData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 9. Book Mentorship
async function bookMentorship(req, res) {
  try {
    const { userId, slotId, date, time, note } = req.body;
    // Logic to create a Booking/Session record would go here
    // For now, mock response
    res.json({
      success: true,
      bookingId: `booking_${Date.now()}`,
      message: "Session booked successfully",
      meetingLink: "https://meet.google.com/mock-link"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create Mentor (for seeding/admin)
async function createMentor(req, res) {
  try {
    const mentor = await MentorProfile.create(req.body);
    res.status(201).json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
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
};
