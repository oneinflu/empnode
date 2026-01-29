const Job = require("../models/Job");
const CompanyProfile = require("../models/CompanyProfile");
const JobApplication = require("../models/JobApplication");
const { getRecommendations } = require("../utils/recommendationEngine");

// Helper to transform job data into frontend-friendly JSON
async function transformJobData(job) {
  const jobObj = job.toObject();

  // 1. Company Data
  let companyData = {
    name: job.companyName || job.company?.name || "Unknown Company",
    logo: job.companyLogoUrl || job.company?.avatarUrl || "https://logo.clearbit.com/unknown.com",
    id: job.company?._id || job.company,
    description: job.companyDetails?.description,
    founded: job.companyDetails?.founded,
    headquarters: job.companyDetails?.headquarters,
    employees: job.companyDetails?.employees,
    industry: job.companyDetails?.industry,
    website: job.companyDetails?.website,
    culture: job.companyDetails?.culture || [],
    benefits: job.companyDetails?.benefits || [],
    reviews: job.companyDetails?.reviews || []
  };

  // If company details are missing, try to fetch from CompanyProfile
  if (!companyData.description && job.company) {
    const profile = await CompanyProfile.findOne({ user: job.company._id || job.company });
    if (profile) {
      companyData.description = profile.about || companyData.description;
      companyData.headquarters = profile.headquartersLocation || profile.location || companyData.headquarters;
      companyData.employees = profile.teamSize ? `${profile.teamSize}+` : companyData.employees;
      companyData.industry = profile.companyType || companyData.industry;
      companyData.website = profile.website || companyData.website;
      companyData.logo = profile.logoUrl || companyData.logo;
    }
  }

  // 2. Growth Data
  const growthData = {
    careerPath: job.growth?.careerPath || [],
    recommendedCourses: (job.growth?.recommendedCourses || []).map(c => ({
      title: c.title,
      company: c.company?.name || "Empedi",
      level: c.level,
      duration: c.duration,
      price: c.salary || c.originalPrice || "Free",
      logo: c.bannerUrl || "https://logo.clearbit.com/unknown.com",
      link: `/courses/${c.slug || c._id}`
    })),
    recommendedMentors: (job.growth?.recommendedMentors || []).map(m => ({
      name: m.user?.name,
      role: m.currentRole || "Mentor",
      experience: `${m.experienceYears || 0}+ years`,
      price: m.quickCallPrice ? `₹${m.quickCallPrice}/session` : "Free",
      avatar: m.user?.avatarUrl,
      link: `/mentors/${m._id}`
    }))
  };
  
  // If no manual recommendations, we'll populate them dynamically later (in getJob)

  // 3. Construct the full response
  return {
    _id: job._id,
    title: job.title,
    subtitle: job.subtitle,
    company: companyData,
    location: job.location,
    salary: job.salary ? (job.salary.min && job.salary.max ? `₹${job.salary.min}-${job.salary.max} ${job.salary.period}` : "Competitive") : "Competitive",
    experienceLevel: job.minExperience ? `${job.minExperience}-${job.minExperience + 2} years` : "0-2 years",
    jobType: job.type === 'internship' ? 'Internship' : 'Full-time',
    workMode: job.workMode,
    postedAt: job.createdAt,
    isActive: job.status === 'active',
    shortDescription: job.shortDescription || job.description.substring(0, 150) + "...",
    
    overview: {
      summary: job.overview?.summary || job.description,
      responsibilities: job.overview?.responsibilities?.length > 0 ? job.overview.responsibilities : job.responsibilities,
      requiredSkills: job.overview?.requiredSkills?.length > 0 ? job.overview.requiredSkills : (job.skills || []).map(s => s.name || s),
      preferredQualifications: job.overview?.preferredQualifications || [],
      techStack: job.overview?.techStack || []
    },

    growth: growthData,

    companyDetails: companyData, // Alias for component

    applicationProcess: {
      steps: job.applicationProcess?.steps || [
        { title: "Application Review", description: "We review your resume and portfolio.", icon: "ClipboardList", color: "blue" },
        { title: "Technical Screening", description: "A brief call to discuss your background.", icon: "Phone", color: "purple" }
      ],
      timeline: job.applicationProcess?.timeline || {
        applicationClose: "10 days",
        processDuration: "2-3 weeks",
        joiningDate: "Immediate"
      },
      faqs: job.applicationProcess?.faqs || []
    },

    socialProof: {
      metrics: {
        applicantsCount: job.socialProof?.metrics?.applicantsCount || 0,
        viewedCount: job.socialProof?.metrics?.viewedCount || 0,
        interviewedCount: job.socialProof?.metrics?.interviewedCount || 0,
        averageResponseTime: job.socialProof?.metrics?.averageResponseTime || "2 days"
      },
      successStories: job.socialProof?.successStories || [],
      testimonials: job.socialProof?.testimonials || []
    },

    actions: {
      applyLink: job.applyLink,
      externalApply: job.externalApply,
      isApplied: false, // This needs user context
      upskillLink: "/courses",
      mentorLink: "/mentorships"
    },
    
    relatedOpportunities: {
        similarJobs: [],
        relatedInternships: []
    }
  };
}

async function createJob(req, res) {
  try {
    const {
      title,
      subtitle,
      type,
      salary,
      skills,
      description,
      responsibilities,
      minExperience,
      workMode,
      location,
      applicationDeadline,
      companyName,
      companyLogoUrl,
      companyId,
      // New fields
      shortDescription,
      overview,
      growth,
      companyDetails,
      applicationProcess,
      socialProof,
      externalApply,
      applyLink
    } = req.body;

    let finalCompanyName = companyName;
    let finalCompanyLogoUrl = companyLogoUrl;
    let finalCompanyId;

    if (req.userModel === "User") {
      finalCompanyId = req.user._id;
    } else {
      // SystemUser must provide companyId
      if (!companyId) {
        return res.status(400).json({ message: "companyId is required for admin postings" });
      }
      finalCompanyId = companyId;
    }

    // Try to fetch profile details if not provided
    if (!finalCompanyName || !finalCompanyLogoUrl) {
      const profile = await CompanyProfile.findOne({ user: finalCompanyId }).populate("user", "name");
      
      if (profile) {
        if (!finalCompanyName) {
          finalCompanyName = profile.user ? profile.user.name : undefined;
        }
        if (!finalCompanyLogoUrl) finalCompanyLogoUrl = profile.logoUrl;
      }
      
      // Fallback: if user is posting and we still don't have name
      if (!finalCompanyName && req.userModel === "User") {
        finalCompanyName = req.user.name;
      }
    }

    const job = await Job.create({
      title,
      subtitle,
      type,
      salary,
      skills,
      description,
      responsibilities,
      minExperience,
      workMode,
      location,
      applicationDeadline,
      poster: req.user._id,
      posterModel: req.userModel,
      company: finalCompanyId,
      companyName: finalCompanyName,
      companyLogoUrl: finalCompanyLogoUrl,
      
      shortDescription,
      overview,
      growth,
      companyDetails,
      applicationProcess,
      socialProof,
      externalApply,
      applyLink
    });

    const populatedJob = await job.populate("skills", "name");
    res.status(201).json(populatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create job posting" });
  }
}

async function getJobs(req, res) {
  try {
    const { type, workMode, location } = req.query;
    const query = { status: "active" };

    if (type) query.type = type;
    if (workMode) query.workMode = workMode;
    if (location) query.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(query)
      .populate("skills", "name")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
}

async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id)
        .populate("skills", "name")
        .populate("company", "name avatarUrl")
        .populate("growth.recommendedCourses")
        .populate("growth.recommendedMentors");
        
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let transformed = await transformJobData(job);

    // Dynamic recommendations if missing
    const recommendations = await getRecommendations(job.skills, {
      excludeId: job._id,
      excludeType: job.type === "internship" ? "internship" : "job",
    });

    if (!transformed.growth.recommendedCourses || transformed.growth.recommendedCourses.length === 0) {
        transformed.growth.recommendedCourses = recommendations.recommendedCourses.map(c => ({
            title: c.title,
            company: "Empedi",
            level: c.level,
            duration: c.duration,
            price: c.salary || c.originalPrice || "Free",
            logo: c.bannerUrl || "https://logo.clearbit.com/unknown.com",
            link: `/courses/${c.slug || c._id}`
        }));
    }
    
    if (!transformed.growth.recommendedMentors || transformed.growth.recommendedMentors.length === 0) {
        transformed.growth.recommendedMentors = recommendations.recommendedMentors.map(m => ({
            name: m.user?.name,
            role: "Mentor",
            experience: `${m.experienceYears || 0}+ years`,
            price: m.quickCallPrice ? `₹${m.quickCallPrice}/session` : "Free",
            avatar: m.user?.avatarUrl,
            link: `/mentors/${m._id}`
        }));
    }

    // Populate related opportunities
    transformed.relatedOpportunities = {
        similarJobs: recommendations.recommendedJobs.map(j => ({
            id: j._id,
            title: j.title,
            company: j.companyName || "Unknown",
            location: j.location,
            salary: j.salary ? (typeof j.salary === 'object' ? `₹${j.salary.min}-${j.salary.max}` : j.salary) : "Competitive",
            logo: j.companyLogoUrl || "https://logo.clearbit.com/unknown.com",
            link: `/jobs/${j._id}`
        })),
        relatedInternships: recommendations.recommendedInternships.map(i => ({
            id: i._id,
            title: i.title,
            company: i.companyName || "Unknown",
            location: i.location,
            stipend: i.salary ? (i.salary.min ? `₹${i.salary.min}/month` : "Unpaid") : "Unpaid",
            logo: i.companyLogoUrl || "https://logo.clearbit.com/unknown.com",
            link: `/internships/${i._id}`
        }))
    };

    // Check application status if user is logged in
    if (req.user) {
        const application = await JobApplication.findOne({ job: job._id, applicant: req.user._id });
        transformed.actions.isApplied = !!application;
    }

    res.json(transformed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
}

async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.poster.toString() !== req.user._id.toString()) {
       if (req.userModel !== 'SystemUser') {
          return res.status(403).json({ message: "Not authorized to update this job" });
       }
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate("skills", "name")
    .populate("company", "name avatarUrl");

    res.json(await transformJobData(updatedJob));
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
}

async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.poster.toString() !== req.user._id.toString()) {
        if (req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized to delete this job" });
        }
    }

    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
}

// Component-specific getters
async function getJobHero(req, res) {
    const job = await Job.findById(req.params.id).populate("company", "name avatarUrl");
    if (!job) return res.status(404).json({ message: "Job not found" });
    const data = await transformJobData(job);
    res.json({
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary,
        experienceLevel: data.experienceLevel,
        jobType: data.jobType,
        workMode: data.workMode,
        postedAt: data.postedAt,
        isActive: data.isActive,
        shortDescription: data.shortDescription
    });
}

async function updateJobHero(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { title, subtitle, location, salary, type, workMode, status, shortDescription } = req.body;
        
        if (title) job.title = title;
        if (subtitle) job.subtitle = subtitle;
        if (location) job.location = location;
        if (salary) job.salary = salary;
        if (type) job.type = type;
        if (workMode) job.workMode = workMode;
        if (status) job.status = status;
        if (shortDescription) job.shortDescription = shortDescription;

        await job.save();
        const data = await transformJobData(job);
        res.json({
            title: data.title,
            company: data.company,
            location: data.location,
            salary: data.salary,
            experienceLevel: data.experienceLevel,
            jobType: data.jobType,
            workMode: data.workMode,
            postedAt: data.postedAt,
            isActive: data.isActive,
            shortDescription: data.shortDescription
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update job hero" });
    }
}

async function getJobOverview(req, res) {
    const job = await Job.findById(req.params.id).populate("skills", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });
    const data = await transformJobData(job);
    res.json(data.overview);
}

async function updateJobOverview(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { summary, responsibilities, requiredSkills, preferredQualifications, techStack } = req.body;
        
        if (!job.overview) job.overview = {};
        if (summary) job.overview.summary = summary;
        if (responsibilities) job.overview.responsibilities = responsibilities;
        if (requiredSkills) job.overview.requiredSkills = requiredSkills;
        if (preferredQualifications) job.overview.preferredQualifications = preferredQualifications;
        if (techStack) job.overview.techStack = techStack;

        await job.save();
        const data = await transformJobData(job);
        res.json(data.overview);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job overview" });
    }
}

async function getJobGrowth(req, res) {
    const job = await Job.findById(req.params.id)
        .populate("growth.recommendedCourses")
        .populate("growth.recommendedMentors")
        .populate("skills", "name");
        
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    let transformed = await transformJobData(job);

    // Dynamic recommendations if missing
    if ((!transformed.growth.recommendedCourses || transformed.growth.recommendedCourses.length === 0) || 
        (!transformed.growth.recommendedMentors || transformed.growth.recommendedMentors.length === 0)) {
        
        const recommendations = await getRecommendations(job.skills, {
            excludeId: job._id,
            excludeType: job.type === "internship" ? "internship" : "job",
        });

        if (!transformed.growth.recommendedCourses || transformed.growth.recommendedCourses.length === 0) {
            transformed.growth.recommendedCourses = recommendations.recommendedCourses.map(c => ({
                title: c.title,
                company: "Empedi",
                level: c.level,
                duration: c.duration,
                price: c.salary || c.originalPrice || "Free",
                logo: c.bannerUrl || "https://logo.clearbit.com/unknown.com",
                link: `/courses/${c.slug || c._id}`
            }));
        }
        
        if (!transformed.growth.recommendedMentors || transformed.growth.recommendedMentors.length === 0) {
            transformed.growth.recommendedMentors = recommendations.recommendedMentors.map(m => ({
                name: m.user?.name,
                role: "Mentor",
                experience: `${m.experienceYears || 0}+ years`,
                price: m.quickCallPrice ? `₹${m.quickCallPrice}/session` : "Free",
                avatar: m.user?.avatarUrl,
                link: `/mentors/${m._id}`
            }));
        }
    }
    
    res.json(transformed.growth);
}

async function updateJobGrowth(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { careerPath } = req.body;
        
        // Use findByIdAndUpdate for atomic update and to avoid object structure issues
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { 
                $set: { 
                    "growth.careerPath": careerPath 
                } 
            },
            { new: true, runValidators: true }
        )
        .populate("growth.recommendedCourses")
        .populate("growth.recommendedMentors");
            
        const data = await transformJobData(updatedJob);
        res.json(data.growth);
    } catch (error) {
        console.error("Update Job Growth Error:", error);
        res.status(500).json({ message: "Failed to update job growth" });
    }
}

async function getJobCompany(req, res) {
    const job = await Job.findById(req.params.id).populate("company");
    if (!job) return res.status(404).json({ message: "Job not found" });
    const data = await transformJobData(job);
    res.json({ company: data.companyDetails });
}

async function updateJobCompany(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { description, founded, headquarters, employees, industry, website, culture, benefits, reviews } = req.body;
        
        if (!job.companyDetails) job.companyDetails = {};
        if (description) job.companyDetails.description = description;
        if (founded) job.companyDetails.founded = founded;
        if (headquarters) job.companyDetails.headquarters = headquarters;
        if (employees) job.companyDetails.employees = employees;
        if (industry) job.companyDetails.industry = industry;
        if (website) job.companyDetails.website = website;
        if (culture) job.companyDetails.culture = culture;
        if (benefits) job.companyDetails.benefits = benefits;
        if (reviews) job.companyDetails.reviews = reviews;

        await job.save();
        const data = await transformJobData(job);
        res.json({ company: data.companyDetails });
    } catch (error) {
        res.status(500).json({ message: "Failed to update job company details" });
    }
}

async function getJobProcess(req, res) {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const data = await transformJobData(job);
    res.json(data.applicationProcess);
}

async function updateJobProcess(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { steps, timeline, faqs } = req.body;
        
        if (!job.applicationProcess) job.applicationProcess = {};
        if (steps) job.applicationProcess.steps = steps;
        if (timeline) job.applicationProcess.timeline = timeline;
        if (faqs) job.applicationProcess.faqs = faqs;

        await job.save();
        const data = await transformJobData(job);
        res.json(data.applicationProcess);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job application process" });
    }
}

async function getJobSocialProof(req, res) {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const data = await transformJobData(job);
    res.json(data.socialProof);
}

async function updateJobSocialProof(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { metrics, successStories, testimonials } = req.body;
        
        if (!job.socialProof) job.socialProof = {};
        if (metrics) job.socialProof.metrics = metrics;
        if (successStories) job.socialProof.successStories = successStories;
        if (testimonials) job.socialProof.testimonials = testimonials;

        await job.save();
        const data = await transformJobData(job);
        res.json(data.socialProof);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job social proof" });
    }
}

async function getJobRelated(req, res) {
    const job = await Job.findById(req.params.id)
        .populate("skills", "name")
        .populate({
            path: "related.similarJobs",
            select: "title companyName companyLogoUrl location salary type company",
            populate: { path: "company", select: "name avatarUrl" }
        })
        .populate({
            path: "related.relatedInternships",
            select: "title companyName companyLogoUrl location salary type company",
            populate: { path: "company", select: "name avatarUrl" }
        });

    if (!job) return res.status(404).json({ message: "Job not found" });
    
    // Start with manual recommendations
    let similarJobs = [];
    let relatedInternships = [];
    
    // Helper to map job to response format
    const mapJob = (j) => ({
        id: j._id,
        title: j.title,
        company: j.companyName || j.company?.name || "Unknown",
        location: j.location,
        salary: j.salary ? (typeof j.salary === 'object' ? `₹${j.salary.min}-${j.salary.max}` : j.salary) : "Competitive",
        logo: j.companyLogoUrl || j.company?.avatarUrl || "https://logo.clearbit.com/unknown.com",
        link: j.type === 'internship' ? `/internships/${j._id}` : `/jobs/${j._id}`
    });

    if (job.related?.similarJobs?.length > 0) {
        similarJobs = job.related.similarJobs.map(mapJob);
    }

    if (job.related?.relatedInternships?.length > 0) {
        relatedInternships = job.related.relatedInternships.map(j => ({
            ...mapJob(j),
            stipend: j.salary ? (j.salary.min ? `₹${j.salary.min}/month` : "Unpaid") : "Unpaid"
        }));
    }

    // If missing, fetch dynamic
    if (similarJobs.length === 0 || relatedInternships.length === 0) {
        const recommendations = await getRecommendations(job.skills, {
            excludeId: job._id,
            excludeType: job.type === "internship" ? "internship" : "job",
        });

        if (similarJobs.length === 0) {
            similarJobs = recommendations.recommendedJobs.map(j => ({
                id: j._id,
                title: j.title,
                company: j.companyName || "Unknown",
                location: j.location,
                salary: j.salary ? (typeof j.salary === 'object' ? `₹${j.salary.min}-${j.salary.max}` : j.salary) : "Competitive",
                logo: j.companyLogoUrl || "https://logo.clearbit.com/unknown.com",
                link: `/jobs/${j._id}`
            }));
        }

        if (relatedInternships.length === 0) {
            relatedInternships = recommendations.recommendedInternships.map(i => ({
                id: i._id,
                title: i.title,
                company: i.companyName || "Unknown",
                location: i.location,
                stipend: i.salary ? (i.salary.min ? `₹${i.salary.min}/month` : "Unpaid") : "Unpaid",
                logo: i.companyLogoUrl || "https://logo.clearbit.com/unknown.com",
                link: `/internships/${i._id}`
            }));
        }
    }

    res.json({
        similarJobs,
        relatedInternships
    });
}

async function updateJobRelated(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { similarJobs, relatedInternships } = req.body;
        
        if (!job.related) job.related = {};
        if (similarJobs) job.related.similarJobs = similarJobs;
        if (relatedInternships) job.related.relatedInternships = relatedInternships;

        await job.save();
        
        // Re-fetch to return formatted data
        return getJobRelated(req, res);
    } catch (error) {
        res.status(500).json({ message: "Failed to update related opportunities" });
    }
}

async function getJobActions(req, res) {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const data = await transformJobData(job);
    
    // Check application status if user is logged in
    if (req.user) {
        const application = await JobApplication.findOne({ job: job._id, applicant: req.user._id });
        data.actions.isApplied = !!application;
    }
    
    res.json(data.actions);
}

async function updateJobActions(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.poster.toString() !== req.user._id.toString() && req.userModel !== 'SystemUser') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { applyLink, externalApply } = req.body;
        
        if (applyLink !== undefined) job.applyLink = applyLink;
        if (externalApply !== undefined) job.externalApply = externalApply;

        await job.save();
        const data = await transformJobData(job);
        res.json(data.actions);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job actions" });
    }
}

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  // Component exports
  getJobHero,
  updateJobHero,
  getJobOverview,
  updateJobOverview,
  getJobGrowth,
  updateJobGrowth,
  getJobCompany,
  updateJobCompany,
  getJobProcess,
  updateJobProcess,
  getJobSocialProof,
  updateJobSocialProof,
  getJobRelated,
  updateJobRelated,
  getJobActions,
  updateJobActions
};
