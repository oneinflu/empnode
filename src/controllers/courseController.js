const Course = require("../models/Course");
const cloudinary = require("../cloudinary");
const slugify = require("slugify");
const { getRecommendations } = require("../utils/recommendationEngine");

// Helper to transform course data into the desired response structure
const transformCourseData = (course) => {
  const courseObj = course.toObject ? course.toObject() : course;

  // 1. Instructor Transformation
  let instructorData = null;
  if (courseObj.instructor) {
    instructorData = {
      name: courseObj.instructor.user?.name,
      role: courseObj.instructor.currentRole || "Instructor",
      company: courseObj.instructor.currentCompany || "Empedi",
      avatar: courseObj.instructor.user?.avatarUrl,
      bio: courseObj.instructor.about,
      studentsCount: courseObj.instructor.studentsCount,
      coursesCount: courseObj.instructor.coursesCount,
      rating: courseObj.instructor.rating,
      certifications: courseObj.instructor.certifications
    };
  }

  // 2. Company Transformation
  let companyName = "Unknown";
  let companyLogo = "";
  if (courseObj.company) {
     companyName = courseObj.company.user?.name || "Unknown";
     companyLogo = courseObj.company.logoUrl;
  }

  // 3. Growth / Recommendations Transformation
  const relatedJobs = (courseObj.growth?.relatedJobs || []).map(job => ({
      title: job.title,
      company: job.companyName || job.company?.name || "Unknown",
      location: job.location,
      salary: job.salary ? (typeof job.salary === 'object' ? `${job.salary.min}-${job.salary.max}` : job.salary) : "Competitive",
      logo: job.companyLogoUrl || job.company?.avatarUrl || "https://logo.clearbit.com/unknown.com",
      link: `/jobs/${job._id}`
  }));

  const relatedInternships = (courseObj.growth?.relatedInternships || []).map(job => ({
      title: job.title,
      company: job.companyName || job.company?.name || "Unknown",
      duration: "3 months", 
      stipend: job.salary ? (job.salary.min ? `₹${job.salary.min}/month` : "Unpaid") : "Unpaid",
      logo: job.companyLogoUrl || job.company?.avatarUrl || "https://logo.clearbit.com/unknown.com",
      link: `/internships/${job._id}`
  }));

  const nextLevelCourses = (courseObj.growth?.nextLevelCourses || []).map(c => ({
      title: c.title,
      company: c.company?.user?.name || "Unknown",
      level: c.level,
      duration: c.duration,
      price: c.salary || c.originalPrice || "Free",
      logo: c.company?.logoUrl || "https://logo.clearbit.com/unknown.com",
      link: `/courses/${c.slug || c._id}`
  }));

  const recommendedMentors = (courseObj.growth?.recommendedMentors || []).map(m => ({
      name: m.user?.name,
      role: m.currentRole || "Mentor",
      experience: `${m.experienceYears || 0}+ years`,
      price: m.quickCallPrice ? `₹${m.quickCallPrice}/session` : "Free",
      avatar: m.user?.avatarUrl,
      link: `/mentors/${m._id}`
  }));

  return {
      ...courseObj,
      company: companyName,
      logo: companyLogo,
      instructor: instructorData,
      growth: {
          ...courseObj.growth,
          relatedJobs,
          relatedInternships,
          nextLevelCourses,
          recommendedMentors
      }
  };
};

const parseJSON = (data) => {
  if (!data) return undefined;
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("JSON parse error:", e);
    return undefined;
  }
};

async function createCourse(req, res) {
  try {
    const {
      title,
      subtitle,
      description,
      shortDescription,
      category,
      subCategory,
      skills,
      pricingType,
      price,
      discountedPrice,
      currency,
      level, // stage -> level
      slug,
      duration,
      format,
      targetAudience,
      outcomes,
      modules,
      faqs,
      instructor,
      growth,
      highlights,
      prerequisites
    } = req.body;

    let bannerUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "courses",
      });
      bannerUrl = result.secure_url;
    }

    const courseData = {
      title,
      shortDescription,
      description,
      bannerUrl,
      category,
      subCategory: subCategory || null,
      skills: skills ? (Array.isArray(skills) ? skills : [skills]) : [],
      level,
      duration,
      format,
      salary: price || req.body.salary, 
      originalPrice: discountedPrice || req.body.originalPrice,
      
      highlights: parseJSON(highlights),
      prerequisites: parseJSON(prerequisites),
      
      instructor,
      modules: parseJSON(modules),
      targetAudience: parseJSON(targetAudience),
      outcomes: parseJSON(outcomes),
      faqs: parseJSON(faqs || req.body.faq),
      growth: parseJSON(growth),
      
      createdBy: req.user._id,
      company: req.body.company
    };

    if (slug) {
      courseData.slug = slugify(slug, { lower: true, strict: true });
    }

    const course = await Course.create(courseData);

    res.status(201).json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create course" });
  }
}

async function listCourses(req, res) {
  try {
    const courses = await Course.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("skills", "name")
      .populate("createdBy", "name")
      .populate({
        path: "company",
        select: "logoUrl location",
        populate: { path: "user", select: "name" }
      });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to list courses" });
  }
}

// Reusable populate configuration
const populateCourseConfig = [
  { path: "category", select: "name" },
  { path: "subCategory", select: "name" },
  { path: "skills", select: "name" },
  { path: "createdBy", select: "name" },
  { 
    path: "company",
    populate: { path: "user", select: "name" }
  },
  {
    path: "instructor",
    populate: { path: "user", select: "name avatarUrl" }
  },
  {
    path: "growth.relatedJobs",
    populate: { path: "company", select: "name avatarUrl" }
  },
  {
    path: "growth.relatedInternships",
    populate: { path: "company", select: "name avatarUrl" }
  },
  {
    path: "growth.nextLevelCourses",
    populate: { 
        path: "company", 
        select: "logoUrl",
        populate: { path: "user", select: "name" }
    }
  },
  {
    path: "growth.recommendedMentors",
    populate: { path: "user", select: "name avatarUrl" }
  }
];

async function getCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Populate manually to ensure config consistency or use .populate(populateCourseConfig) if supported as array (Mongoose supports chaining or array)
    // For safety with older Mongoose, let's chain or loop. Mongoose accept array of populate options.
    await Course.populate(course, populateCourseConfig);

    const response = transformCourseData(course);

    if (!response.growth || !response.growth.nextLevelCourses || response.growth.nextLevelCourses.length === 0) {
        const recommendations = await getRecommendations(course.skills, {
            excludeId: course._id,
            excludeType: "course",
        });
        
        const growth = response.growth || {};

        if (!growth.relatedJobs || growth.relatedJobs.length === 0) {
            growth.relatedJobs = recommendations.recommendedJobs.map(job => ({
                title: job.title,
                company: job.companyName || "Unknown",
                location: job.location,
                salary: job.salary ? (typeof job.salary === 'object' ? `${job.salary.min}-${job.salary.max}` : job.salary) : "Competitive",
                logo: job.companyLogoUrl || "https://logo.clearbit.com/unknown.com",
                link: `/jobs/${job._id}`
            }));
        }

        if (!growth.relatedInternships || growth.relatedInternships.length === 0) {
            growth.relatedInternships = recommendations.recommendedInternships.map(job => ({
                title: job.title,
                company: job.companyName || "Unknown",
                duration: "3 months",
                stipend: job.salary ? (job.salary.min ? `₹${job.salary.min}/month` : "Unpaid") : "Unpaid",
                logo: job.companyLogoUrl || "https://logo.clearbit.com/unknown.com",
                link: `/internships/${job._id}`
            }));
        }

        if (!growth.nextLevelCourses || growth.nextLevelCourses.length === 0) {
            growth.nextLevelCourses = recommendations.recommendedCourses.map(c => ({
                title: c.title,
                company: "Empedi",
                level: c.level,
                duration: "Self-paced",
                price: c.salary || c.originalPrice || "Free",
                logo: c.bannerUrl || "https://logo.clearbit.com/unknown.com",
                link: `/courses/${c.slug || c._id}`
            }));
        }

        if (!growth.recommendedMentors || growth.recommendedMentors.length === 0) {
            growth.recommendedMentors = recommendations.recommendedMentors.map(m => ({
                name: m.user?.name,
                role: "Mentor",
                experience: `${m.experienceYears || 0}+ years`,
                price: m.quickCallPrice ? `₹${m.quickCallPrice}/session` : "Free",
                avatar: m.user?.avatarUrl,
                link: `/mentors/${m._id}`
            }));
        }

        response.growth = growth;
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get course" });
  }
}

async function getCourseBySlug(req, res) {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    await Course.populate(course, populateCourseConfig);
    
    const response = transformCourseData(course);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to get course" });
  }
}

// --- Component Endpoints ---

async function getCourseHero(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await Course.populate(course, populateCourseConfig);
    const data = transformCourseData(course);
    
    res.json({
      title: data.title,
      company: data.company,
      logo: data.logo,
      level: data.level,
      duration: data.duration,
      salary: data.salary,
      originalPrice: data.originalPrice,
      rating: data.rating,
      enrolledCount: data.enrolledCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course hero" });
  }
}

async function getCourseOverview(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    // Minimal populate needed, but sticking to config for consistency
    const data = transformCourseData(course); // No deep populate needed for simple fields?
    // Actually description/highlights/prerequisites don't need population.
    
    res.json({
      shortDescription: data.shortDescription,
      description: data.description,
      highlights: data.highlights,
      prerequisites: data.prerequisites
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course overview" });
  }
}

async function getCourseCurriculum(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const data = transformCourseData(course);
    
    res.json({ modules: data.modules });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course curriculum" });
  }
}

async function getCourseAudience(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const data = transformCourseData(course);
    
    res.json({ targetAudience: data.targetAudience });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course audience" });
  }
}

async function getCourseOutcomes(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const data = transformCourseData(course);
    
    res.json({
      careerPath: data.outcomes?.careerPath,
      salaryInsights: data.outcomes?.salaryInsights,
      successStories: data.outcomes?.successStories
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course outcomes" });
  }
}

async function getCourseInstructor(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await Course.populate(course, populateCourseConfig);
    const data = transformCourseData(course);
    
    
    // Fetch other courses by the same instructor
    let otherCourses = [];
    if (course.instructor) {
      const others = await Course.find({
        instructor: course.instructor,
        _id: { $ne: course._id }
      })
      .limit(3)
      .select("title level duration enrolledCount rating salary originalPrice bannerUrl slug");
      
      otherCourses = others.map(c => ({
        title: c.title,
        level: c.level,
        duration: c.duration,
        enrolledCount: c.enrolledCount,
        rating: c.rating,
        price: c.salary || c.originalPrice,
        image: c.bannerUrl,
        link: `/courses/${c.slug || c._id}`
      }));
    }
    
    res.json({
      instructor: data.instructor,
      otherCourses
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course instructor" });
  }
}

async function getCourseFAQ(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const data = transformCourseData(course);
    
    res.json({ faqs: data.faqs });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course faqs" });
  }
}

async function getCourseGrowth(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await Course.populate(course, populateCourseConfig);
    const data = transformCourseData(course);
    
    res.json(data.growth);
  } catch (err) {
    res.status(500).json({ message: "Failed to get course growth" });
  }
}

// --- Granular Update Endpoints ---

async function updateCourseHero(req, res) {
  try {
    const { title, company, level, duration, salary, originalPrice, rating, enrolledCount } = req.body;
    const updateData = { title, company, level, duration, salary, originalPrice, rating, enrolledCount };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course hero" });
  }
}

async function updateCourseOverview(req, res) {
  try {
    const { shortDescription, description, highlights, prerequisites } = req.body;
    const updateData = { 
      shortDescription, 
      description, 
      highlights: parseJSON(highlights), 
      prerequisites: parseJSON(prerequisites) 
    };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course overview" });
  }
}

async function updateCourseCurriculum(req, res) {
  try {
    const { modules, sections } = req.body;
    let modulesData = modules || sections;

    modulesData = parseJSON(modulesData);

    // Transform frontend data to DB schema if needed
    if (modulesData && Array.isArray(modulesData)) {
        modulesData = modulesData.map(section => ({
            ...section,
            lessons: (section.lessons || []).map(lesson => ({
                ...lesson,
                videoUrl: lesson.video || lesson.videoUrl,
                isFreePreview: lesson.isFree !== undefined ? lesson.isFree : lesson.isFreePreview
            }))
        }));
    }

    const updateData = { modules: modulesData };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ modules: course.modules });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course curriculum" });
  }
}

async function updateCourseAudience(req, res) {
  try {
    const { targetAudience, requirements } = req.body;
    const updateData = {};
    
    if (targetAudience) updateData.targetAudience = parseJSON(targetAudience);
    if (requirements) updateData.prerequisites = parseJSON(requirements);
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    
    res.json({ 
      targetAudience: course.targetAudience,
      requirements: course.prerequisites
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course audience" });
  }
}

async function updateCourseOutcomes(req, res) {
  try {
    const { outcomes } = req.body;
    const updateData = { outcomes: parseJSON(outcomes) };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ outcomes: course.outcomes });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course outcomes" });
  }
}

async function updateCourseInstructor(req, res) {
  try {
    const { instructor } = req.body;
    // Assuming body contains { instructor: "instructor_id" }
    const updateData = { instructor };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ instructor: course.instructor });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course instructor" });
  }
}

async function updateCourseFAQ(req, res) {
  try {
    const { faqs, faq } = req.body;
    const updateData = { faqs: parseJSON(faqs || faq) };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ faqs: course.faqs });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course faqs" });
  }
}

async function updateCourseGrowth(req, res) {
  try {
    const { growth } = req.body;
    const updateData = { growth: parseJSON(growth) };
    
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ growth: course.growth });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course growth" });
  }
}

async function updateCourse(req, res) {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      subCategory,
      skills,
      price,
      discountedPrice,
      level,
      slug,
      duration,
      format,
      targetAudience,
      outcomes,
      modules,
      faqs,
      instructor,
      growth,
      highlights,
      prerequisites,
      company
    } = req.body;

    let updateData = {
      title,
      shortDescription,
      description,
      category,
      subCategory: subCategory || null,
      level,
      duration,
      format,
      salary: price,
      originalPrice: discountedPrice,
      company
    };

    if (skills) updateData.skills = Array.isArray(skills) ? skills : [skills];
    if (highlights) updateData.highlights = parseJSON(highlights);
    if (prerequisites) updateData.prerequisites = parseJSON(prerequisites);
    if (instructor) updateData.instructor = instructor;
    if (modules) updateData.modules = parseJSON(modules);
    if (targetAudience) updateData.targetAudience = parseJSON(targetAudience);
    if (outcomes) updateData.outcomes = parseJSON(outcomes);
    if (faqs || req.body.faq) updateData.faqs = parseJSON(faqs || req.body.faq);
    if (growth) updateData.growth = parseJSON(growth);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "courses",
      });
      updateData.bannerUrl = result.secure_url;
    }

    if (slug) {
      updateData.slug = slugify(slug, { lower: true, strict: true });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("skills", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update course" });
  }
}

async function deleteCourse(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course" });
  }
}

module.exports = {
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
  deleteCourse,
};