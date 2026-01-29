const User = require("./models/User");
const MentorProfile = require("./models/MentorProfile");

async function seedInstructor() {
  const instructors = [
    {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@empedia.one",
      password: "12345678",
      phone: "1234567890",
      type: "mentor",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      currentRole: "Senior Data Scientist",
      currentCompany: "Google",
      about: "Dr. Sarah Johnson has over 10 years of experience in data science and machine learning. She has worked on projects for Fortune 500 companies and has published several research papers on advanced ML techniques.",
      studentsCount: 15420,
      coursesCount: 8,
      rating: 4.8,
      certifications: [
        { title: "PhD in Computer Science", issuer: "Stanford University", icon: "award" },
        { title: "10+ Years Industry Experience", issuer: "Google, Microsoft, Amazon", icon: "briefcase" },
        { title: "Published Author", issuer: "O'Reilly Media", icon: "book" }
      ]
    },
    {
      name: "Michael Chen",
      email: "michael.chen@empedia.one",
      password: "12345678",
      phone: "1234567891",
      type: "mentor",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      currentRole: "Lead Frontend Engineer",
      currentCompany: "Meta",
      about: "Michael is a passionate frontend architect who loves building scalable UI systems. He specializes in React, TypeScript, and performance optimization.",
      studentsCount: 12500,
      coursesCount: 5,
      rating: 4.9,
      certifications: [
        { title: "AWS Certified Developer", issuer: "Amazon Web Services", icon: "award" },
        { title: "Meta Frontend Specialist", issuer: "Meta", icon: "briefcase" },
        { title: "Open Source Contributor", issuer: "GitHub", icon: "book" }
      ]
    },
    {
      name: "Jessica Williams",
      email: "jessica.williams@empedia.one",
      password: "12345678",
      phone: "1234567892",
      type: "mentor",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      currentRole: "Product Design Manager",
      currentCompany: "Airbnb",
      about: "Jessica brings 8 years of design leadership experience. She believes in user-centric design and has helped launch multiple award-winning products.",
      studentsCount: 8900,
      coursesCount: 4,
      rating: 4.7,
      certifications: [
        { title: "Master of Design", issuer: "Rhode Island School of Design", icon: "award" },
        { title: "UX Design Lead", issuer: "Airbnb", icon: "briefcase" },
        { title: "Design Sprint Facilitator", issuer: "Google", icon: "book" }
      ]
    },
    {
      name: "David Kumar",
      email: "david.kumar@empedia.one",
      password: "12345678",
      phone: "1234567893",
      type: "mentor",
      avatarUrl: "https://randomuser.me/api/portraits/men/86.jpg",
      currentRole: "Senior Cloud Architect",
      currentCompany: "Microsoft",
      about: "David is an expert in cloud infrastructure and DevOps. He helps organizations migrate to the cloud and build resilient, scalable systems on Azure.",
      studentsCount: 10200,
      coursesCount: 6,
      rating: 4.8,
      certifications: [
        { title: "Azure Solutions Architect Expert", issuer: "Microsoft", icon: "award" },
        { title: "Certified Kubernetes Administrator", issuer: "CNCF", icon: "briefcase" },
        { title: "DevOps Engineer Professional", issuer: "Microsoft", icon: "book" }
      ]
    },
    {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@empedia.one",
      password: "12345678",
      phone: "1234567894",
      type: "mentor",
      avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
      currentRole: "Marketing Director",
      currentCompany: "Spotify",
      about: "Emily specializes in digital marketing strategies and brand growth. She has led successful global campaigns and loves teaching modern marketing techniques.",
      studentsCount: 18000,
      coursesCount: 7,
      rating: 4.9,
      certifications: [
        { title: "MBA in Marketing", issuer: "Wharton School", icon: "award" },
        { title: "Google Ads Certified", issuer: "Google", icon: "briefcase" },
        { title: "Digital Strategy Expert", issuer: "HubSpot", icon: "book" }
      ]
    }
  ];

  try {
    for (const instructor of instructors) {
      const existing = await User.findOne({ email: instructor.email });
      if (!existing) {
        const user = await User.create({
          name: instructor.name,
          email: instructor.email,
          password: instructor.password,
          phone: instructor.phone,
          type: instructor.type,
          avatarUrl: instructor.avatarUrl
        });

        await MentorProfile.create({
          user: user._id,
          currentRole: instructor.currentRole,
          currentCompany: instructor.currentCompany,
          about: instructor.about,
          studentsCount: instructor.studentsCount,
          coursesCount: instructor.coursesCount,
          rating: instructor.rating,
          certifications: instructor.certifications
        });

        console.log(`Seeded instructor: ${instructor.email}`);
      } else {
        console.log(`Instructor already exists: ${instructor.email}`);
      }
    }
  } catch (err) {
    console.error("Failed to seed instructors", err);
  }
}

module.exports = seedInstructor;
