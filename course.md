# Component Data Requirements (JSON)

Below is the JSON data structure required for each component to be fully dynamic. You can combine these into a single API response for `GET /courses/:id`.

## 1. CourseHero
**Endpoint:** `GET /api/courses/:id/hero` (or part of main object)

```json
{
  "title": "Python for Data Science – Beginner to Advanced",
  "company": "Udemy",
  "logo": "https://logo.clearbit.com/udemy.com",
  "level": "Beginner to Advanced",
  "duration": "6 Weeks, 40 Hours",
  "salary": "₹1,999",
  "originalPrice": "₹3,999",
  "rating": 4.7,
  "enrolledCount": 15420
}
```

## 2. CourseOverview
**Endpoint:** `GET /api/courses/:id/overview`

```json
{
  "shortDescription": "Kickstart your data science career with hands-on Python projects.",
  "description": "Master Python for data science with this comprehensive course covering everything from basic syntax to advanced machine learning concepts. Perfect for beginners and intermediate learners looking to advance their data science skills.",
  "highlights": [
    "Industry-recognized certificate upon completion",
    "Placement assistance with partner companies",
    "8 hands-on projects with real-world datasets",
    "24/7 mentor support throughout the course",
    "Access to exclusive community forums",
    "Lifetime access to course materials"
  ],
  "prerequisites": [
    "Basic understanding of programming concepts",
    "Familiarity with mathematical concepts (algebra, statistics)",
    "No prior Python experience required",
    "A computer with internet access"
  ]
}
```

## 3. CourseCurriculum
**Endpoint:** `GET /api/courses/:id/curriculum`

```json
{
  "modules": [
    {
      "id": "module-1",
      "title": "Introduction to Python and Data Science",
      "description": "Get started with Python basics and understand the data science landscape.",
      "estimatedTime": "2 weeks",
      "isCompleted": false,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "Welcome to the Course",
          "type": "video",
          "duration": "10 min",
          "isFreePreview": true,
          "isCompleted": false
        },
        {
          "id": "lesson-1-2",
          "title": "Setting Up Your Development Environment",
          "type": "video",
          "duration": "15 min",
          "isFreePreview": true,
          "isCompleted": false
        },
        {
          "id": "lesson-1-3",
          "title": "Python Syntax and Variables",
          "type": "video",
          "duration": "25 min",
          "isFreePreview": false,
          "isCompleted": false
        },
        {
          "id": "lesson-1-4",
          "title": "Data Types and Structures",
          "type": "reading",
          "duration": "30 min",
          "isFreePreview": false,
          "isCompleted": false
        },
        {
          "id": "lesson-1-5",
          "title": "Module 1 Quiz",
          "type": "quiz",
          "duration": "20 min",
          "isFreePreview": false,
          "isCompleted": false
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Data Manipulation with Pandas",
      "description": "Learn how to use the powerful Pandas library for data analysis.",
      "estimatedTime": "1 week",
      "isCompleted": false,
      "lessons": [
        {
          "id": "lesson-2-1",
          "title": "Introduction to Pandas Series and DataFrames",
          "type": "video",
          "duration": "20 min",
          "isFreePreview": false,
          "isCompleted": false
        }
      ]
    }
  ]
}
```

## 4. CourseAudience
**Endpoint:** `GET /api/courses/:id/audience`

```json
{
  "targetAudience": {
    "personas": [
      "College students pursuing Computer Science or related fields",
      "Recent graduates looking to build practical data skills",
      "Working professionals wanting to transition to data-focused roles",
      "Career switchers with basic programming knowledge"
    ],
    "outcomes": [
      "Land your first Data Analyst job in 3-6 months",
      "Build a portfolio of 5+ real-world data projects",
      "Master Python for data analysis and visualization",
      "Gain confidence in technical interviews"
    ]
  }
}
```

## 5. CourseOutcomes
**Endpoint:** `GET /api/courses/:id/outcomes`

```json
{
  "careerPath": [
    {
      "title": "Entry Level: Data Analyst",
      "timeframe": "0-1 years",
      "salary": "₹4-7 LPA",
      "description": "Apply data cleaning, basic analysis, and visualization skills",
      "icon": "analyst"
    },
    {
      "title": "Mid Level: Senior Data Analyst",
      "timeframe": "2-4 years",
      "salary": "₹8-12 LPA",
      "description": "Lead complex analyses and provide actionable insights",
      "icon": "senior"
    },
    {
      "title": "Advanced: Data Scientist",
      "timeframe": "4-6 years",
      "salary": "₹12-18 LPA",
      "description": "Develop machine learning models and advanced analytics",
      "icon": "scientist"
    },
    {
      "title": "Expert: Lead Data Scientist",
      "timeframe": "6+ years",
      "salary": "₹18-30+ LPA",
      "description": "Direct data strategy and lead cross-functional teams",
      "icon": "lead"
    }
  ],
  "salaryInsights": [
    {
      "role": "Junior Data Analyst",
      "timeframe": "0-1 years",
      "salaryRange": "₹4-7 LPA",
      "growth": "+12% YoY"
    },
    {
      "role": "Data Analyst",
      "timeframe": "1-3 years",
      "salaryRange": "₹7-10 LPA",
      "growth": "+15% YoY"
    },
    {
      "role": "Senior Data Analyst",
      "timeframe": "3-5 years",
      "salaryRange": "₹10-15 LPA",
      "growth": "+10% YoY"
    },
    {
      "role": "Data Scientist",
      "timeframe": "4+ years",
      "salaryRange": "₹12-25 LPA",
      "growth": "+18% YoY"
    }
  ],
  "successStories": [
    {
      "name": "Priya Sharma",
      "previousRole": "Marketing Associate",
      "currentRole": "Data Analyst at Amazon",
      "achievement": "Secured job within 4 months of course completion",
      "salary": "₹8 LPA",
      "avatar": "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      "name": "Rahul Verma",
      "previousRole": "Business Graduate",
      "currentRole": "Junior Data Scientist at Flipkart",
      "achievement": "Built portfolio of 5 projects that impressed recruiters",
      "salary": "₹9.5 LPA",
      "avatar": "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
      "name": "Ananya Patel",
      "previousRole": "Customer Support",
      "currentRole": "Business Intelligence Analyst at Myntra",
      "achievement": "Career transition with no prior technical background",
      "salary": "₹9.5 LPA",
      "avatar": "https://randomuser.me/api/portraits/women/12.jpg"
    }
  ]
}
```

## 6. InstructorMentorSection
**Endpoint:** `GET /api/courses/:id/instructor`

```json
{
  "instructor": {
    "name": "Dr. Sarah Johnson",
    "role": "Senior Data Scientist",
    "company": "Google",
    "avatar": "https://randomuser.me/api/portraits/women/44.jpg",
    "bio": "Dr. Sarah Johnson has over 10 years of experience in data science and machine learning. She has worked on projects for Fortune 500 companies and has published several research papers on advanced ML techniques.",
    "studentsCount": 15420,
    "coursesCount": 8,
    "rating": 4.8,
    "certifications": [
      {
        "title": "PhD in Computer Science",
        "issuer": "Stanford University",
        "icon": "award"
      },
      {
        "title": "10+ Years Industry Experience",
        "issuer": "Google, Microsoft, Amazon",
        "icon": "briefcase"
      },
      {
        "title": "Published Author",
        "issuer": "O'Reilly Media",
        "icon": "book"
      }
    ]
  },
  "otherCourses": [
    {
      "title": "Advanced Machine Learning Techniques",
      "level": "Advanced",
      "duration": "8 weeks",
      "enrolledCount": 8750,
      "rating": 4.9,
      "price": "₹2,499",
      "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
      "link": "/courses/advanced-machine-learning"
    },
    {
      "title": "Data Visualization Masterclass",
      "level": "Intermediate",
      "duration": "4 weeks",
      "enrolledCount": 12340,
      "rating": 4.7,
      "price": "₹1,799",
      "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      "link": "/courses/data-visualization-masterclass"
    },
    {
      "title": "Statistical Analysis with Python",
      "level": "Intermediate",
      "duration": "6 weeks",
      "enrolledCount": 9870,
      "rating": 4.6,
      "price": "₹1,999",
      "image": "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
      "link": "/courses/statistical-analysis-python"
    }
  ]
}
```

## 7. CourseFAQ
**Endpoint:** `GET /api/courses/:id/faq`

```json
{
  "faqs": [
    {
      "question": "How long does the course take to complete?",
      "answer": "The course duration is 6 Weeks, 40 Hours. However, since it's self-paced, you can complete it at your own speed. Most students finish within 2-3 months while balancing other commitments."
    },
    {
      "question": "Is the certification valid and recognized by employers?",
      "answer": "Yes, our certification is industry-recognized and valued by employers. The certificate includes verification features that allow employers to confirm its authenticity."
    },
    {
      "question": "What is your refund policy?",
      "answer": "We offer a 7-day money-back guarantee. If you're not satisfied with the course within the first week of enrollment, you can request a full refund with no questions asked."
    },
    {
      "question": "Do you provide placement support after course completion?",
      "answer": "Yes, we provide comprehensive placement support including resume reviews, interview preparation, and connections with our hiring partners."
    },
    {
      "question": "What is the language of instruction for this course?",
      "answer": "The primary language of instruction is English. However, subtitles are available in multiple languages including Hindi, Spanish, and Mandarin."
    },
    {
      "question": "Are there any prerequisites for joining this course?",
      "answer": "This Beginner to Advanced level course is designed to accommodate learners at various skill levels. Basic understanding of programming concepts is helpful but not required."
    },
    {
      "question": "Will I get access to the instructor for doubt clearing?",
      "answer": "Yes, you'll have multiple channels for doubt clearing. We offer weekly live Q&A sessions and a dedicated discussion forum."
    },
    {
      "question": "Can I access the course content offline?",
      "answer": "Yes, our mobile app allows you to download lectures for offline viewing."
    }
  ]
}
```

## 8. CourseGrowthLink
**Endpoint:** `GET /api/courses/:id/growth`

```json
{
  "relatedJobs": [
    {
      "title": "Junior Data Analyst",
      "company": "TechCorp",
      "location": "Bangalore",
      "salary": "₹5-8 LPA",
      "logo": "https://logo.clearbit.com/techcorp.com",
      "link": "/jobs/junior-data-analyst"
    },
    {
      "title": "ML Engineer Intern",
      "company": "DataVision",
      "location": "Remote",
      "salary": "₹25,000/month",
      "logo": "https://logo.clearbit.com/datavision.com",
      "link": "/jobs/ml-engineer-intern"
    }
  ],
  "relatedInternships": [
    {
      "title": "Data Science Intern",
      "company": "AnalyticsPro",
      "duration": "3 months",
      "stipend": "₹20,000/month",
      "logo": "https://logo.clearbit.com/analyticspro.com",
      "link": "/internships/data-science-intern"
    },
    {
      "title": "Python Developer Intern",
      "company": "CodeWorks",
      "duration": "4 months",
      "stipend": "₹15,000/month",
      "logo": "https://logo.clearbit.com/codeworks.com",
      "link": "/internships/python-developer-intern"
    }
  ],
  "nextLevelCourses": [
    {
      "title": "Intermediate Machine Learning",
      "company": "Coursera",
      "level": "Intermediate",
      "duration": "8 weeks",
      "price": "₹2,999",
      "logo": "https://logo.clearbit.com/coursera.org",
      "link": "/courses/intermediate-machine-learning"
    },
    {
      "title": "Advanced Data Visualization",
      "company": "Udemy",
      "level": "Advanced",
      "duration": "6 weeks",
      "price": "₹1,799",
      "logo": "https://logo.clearbit.com/udemy.com",
      "link": "/courses/advanced-data-visualization"
    }
  ],
  "recommendedMentors": [
    {
      "name": "Dr. Rajesh Kumar",
      "role": "Senior Data Scientist at Amazon",
      "experience": "8+ years",
      "price": "₹2,999/month",
      "avatar": "https://randomuser.me/api/portraits/men/42.jpg",
      "link": "/mentorships/rajesh-kumar"
    },
    {
      "name": "Priya Sharma",
      "role": "ML Engineer at Microsoft",
      "experience": "5+ years",
      "price": "₹2,499/month",
      "avatar": "https://randomuser.me/api/portraits/women/28.jpg",
      "link": "/mentorships/priya-sharma"
    }
  ]
}
```

## Combined Response (Full Course Details)
**Endpoint:** `GET /api/courses/:id`

```json
{
  "_id": "course_12345",
  "title": "Python for Data Science – Beginner to Advanced",
  "company": "Udemy",
  "location": "Online",
  "salary": "₹1,999",
  "originalPrice": "₹3,999",
  "logo": "https://logo.clearbit.com/udemy.com",
  "isActive": true,
  "level": "Beginner to Advanced",
  "duration": "6 Weeks, 40 Hours",
  "format": "Self-paced",
  "rating": 4.7,
  "enrolledCount": 15420,
  "shortDescription": "Kickstart your data science career with hands-on Python projects.",
  "description": "Master Python for data science with this comprehensive course covering everything from basic syntax to advanced machine learning concepts...",
  "highlights": [
    "Industry-recognized certificate upon completion",
    "Placement assistance with partner companies",
    "8 hands-on projects with real-world datasets",
    "24/7 mentor support throughout the course"
  ],
  "prerequisites": [
    "Basic understanding of programming concepts",
    "Familiarity with mathematical concepts"
  ],
  "instructor": {
    "name": "Dr. Sarah Johnson",
    "role": "Senior Data Scientist",
    "company": "Google",
    "avatar": "https://randomuser.me/api/portraits/women/44.jpg",
    "bio": "Dr. Sarah Johnson has over 10 years of experience...",
    "studentsCount": 15420,
    "coursesCount": 8,
    "rating": 4.8,
    "certifications": [
      {
        "title": "PhD in Computer Science",
        "issuer": "Stanford University",
        "icon": "award"
      }
    ]
  },
  "modules": [
    {
      "id": "module-1",
      "title": "Introduction to Python and Data Science",
      "description": "Get started with Python basics...",
      "estimatedTime": "2 weeks",
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "Welcome to the Course",
          "type": "video",
          "duration": "10 min",
          "isFreePreview": true
        }
      ]
    }
  ],
  "targetAudience": {
    "personas": ["College students", "Recent graduates"],
    "outcomes": ["Land your first Data Analyst job", "Build a portfolio"]
  },
  "outcomes": {
    "careerPath": [
      {
        "title": "Entry Level: Data Analyst",
        "timeframe": "0-1 years",
        "salary": "₹4-7 LPA",
        "icon": "analyst"
      }
    ],
    "salaryInsights": [
      {
        "role": "Junior Data Analyst",
        "salaryRange": "₹4-7 LPA",
        "growth": "+12% YoY"
      }
    ],
    "successStories": [
      {
        "name": "Priya Sharma",
        "currentRole": "Data Analyst at Amazon",
        "achievement": "Secured job within 4 months"
      }
    ]
  },
  "faqs": [
    {
      "question": "How long does the course take?",
      "answer": "6 Weeks, 40 Hours..."
    }
  ],
  "growth": {
    "relatedJobs": [],
    "relatedInternships": [],
    "nextLevelCourses": [],
    "recommendedMentors": []
  }
}
```
