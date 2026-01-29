# Jobs Module Documentation

This document outlines the API endpoints, data structures, and component requirements for the Jobs module.

## API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/jobs` | List all jobs with filtering and pagination |
| `GET` | `/api/jobs/:id` | Get full details of a specific job |
| `POST` | `/api/jobs` | Create a new job posting |
| `PUT` | `/api/jobs/:id` | Update an existing job |
| `DELETE` | `/api/jobs/:id` | Delete a job |
| `POST` | `/api/jobs/:id/apply` | Apply for a job |

---

## Component Data Requirements (JSON)

Below is the JSON data structure required for each component on the Job Details page. These can be served via individual endpoints or a combined `GET /api/jobs/:id` response.

### 1. JobHero
**Endpoint:** `GET /api/jobs/:id/hero`

**Component:** Displays key job info (title, company, salary, etc.) at the top.

```json
{
  "_id": "job_123",
  "title": "Senior Frontend Engineer",
  "company": {
    "name": "TechFlow AI",
    "logo": "https://logo.clearbit.com/techflow.ai",
    "_id": "company_123"
  },
  "location": "Bangalore, India",
  "salary": {
    "min": 1800000,
    "max": 2500000,
    "currency": "INR",
    "period": "yearly"
  },
  "workMode": "Hybrid",
  "postedAt": "2023-10-15T10:00:00Z",
  "isActive": true
}
```

### 2. JobOverview
**Endpoint:** `GET /api/jobs/:id/overview`

**Component:** Displays job summary, responsibilities, and tech stack.

```json
{
  "overview": {
    "summary": "Join our engineering team to build the next generation of AI-powered analytics tools...",
    "responsibilities": [
      "Design and implement scalable frontend architectures",
      "Collaborate with cross-functional teams",
      "Optimize applications for maximum speed"
    ],
    "requiredSkills": ["React.js", "TypeScript", "Next.js"],
    "preferredQualifications": ["GraphQL", "AWS"],
    "techStack": [
      { "name": "React", "logo": "https://logo.clearbit.com/reactjs.org" },
      { "name": "TypeScript", "logo": "https://logo.clearbit.com/typescriptlang.org" }
    ]
  },
  "skills": [
    { "_id": "skill_1", "name": "React.js" },
    { "_id": "skill_2", "name": "TypeScript" }
  ]
}
```

### 3. JobCompany
**Endpoint:** `GET /api/jobs/:id/company`

**Component:** Displays detailed company information, culture, and benefits.

```json
{
  "companyDetails": {
    "description": "TechFlow AI is a leading provider of artificial intelligence solutions...",
    "founded": "2018",
    "headquarters": "San Francisco, CA",
    "employees": "200-500",
    "website": "https://techflow.ai",
    "industry": "Artificial Intelligence",
    "culture": ["Innovation-first", "Remote-friendly", "Inclusive"],
    "benefits": ["Health Insurance", "Unlimited PTO", "Stock Options"],
    "reviews": [
      {
        "author": "Current Employee",
        "rating": 4.8,
        "comment": "Great work-life balance and challenging problems."
      }
    ]
  }
}
```

### 4. JobGrowth
**Endpoint:** `GET /api/jobs/:id/growth`

**Component:** Displays career path, recommended courses, and mentors.

```json
{
  "growth": {
    "careerPath": [
      { "title": "Senior Frontend Engineer", "timeframe": "Now", "type": "job" },
      { "title": "Lead Frontend Engineer", "timeframe": "2-3 years", "type": "promotion" }
    ],
    "recommendedCourses": [
      {
        "title": "Advanced React Patterns",
        "company": "Frontend Masters",
        "price": "₹1,499",
        "link": "/courses/advanced-react"
      }
    ],
    "recommendedMentors": [
      {
        "name": "Amit Patel",
        "role": "Staff Engineer",
        "link": "/mentorships/amit-patel"
      }
    ]
  }
}
```

### 5. JobProcess
**Endpoint:** `GET /api/jobs/:id/process`

**Component:** Displays the hiring process timeline and steps.

```json
{
  "applicationProcess": {
    "steps": [
      { "title": "Application Review", "description": "Resume screening", "icon": "ClipboardList" },
      { "title": "Technical Round", "description": "Coding interview", "icon": "Code" }
    ],
    "timeline": {
      "applicationClose": "10 days",
      "processDuration": "2-3 weeks",
      "joiningDate": "Immediate"
    },
    "faqs": [
      { "question": "Is this remote?", "answer": "Yes, hybrid remote." }
    ]
  }
}
```

### 6. JobSocialProof & Actions
**Endpoint:** `GET /api/jobs/:id/social`

**Component:** Sidebar stats and action buttons.

```json
{
  "socialProof": {
    "metrics": {
      "applicantsCount": 145,
      "viewedCount": 1200,
      "interviewedCount": 12,
      "averageResponseTime": "2 days"
    }
  },
  "externalApply": false,
  "applyLink": "https://techflow.ai/apply",
  "isApplied": false
}
```

### Combined Response (Full Job Details)
**Endpoint:** `GET /api/jobs/:id`

```json
{
  "_id": "job_123",
  "title": "Senior Frontend Engineer",
  "company": {
    "name": "TechFlow AI",
    "logo": "https://logo.clearbit.com/techflow.ai",
    "_id": "company_123"
  },
  "location": "Bangalore, India",
  "salary": {
    "min": 1800000,
    "max": 2500000,
    "currency": "INR",
    "period": "yearly"
  },
  "workMode": "Hybrid",
  "postedAt": "2023-10-15T10:00:00Z",
  "isActive": true,
  "overview": {
    "summary": "Join our engineering team...",
    "responsibilities": ["Design and implement scalable frontend architectures"],
    "requiredSkills": ["React.js", "TypeScript"],
    "techStack": [
      { "name": "React", "logo": "https://logo.clearbit.com/reactjs.org" }
    ]
  },
  "companyDetails": {
    "description": "TechFlow AI is a leading provider...",
    "website": "https://techflow.ai"
  },
  "growth": {
    "careerPath": [],
    "recommendedCourses": [],
    "recommendedMentors": []
  },
  "applicationProcess": {
    "steps": [],
    "timeline": {}
  },
  "socialProof": {
    "metrics": {
      "applicantsCount": 145
    }
  }
}
```

---

## Job Management APIs (CRUD)

### 1. Create Job (POST)
**Endpoint:** `POST /api/jobs`

**Request Body:**
```json
{
  "title": "Senior Frontend Engineer",
  "company": {
    "name": "TechFlow AI",
    "logo": "https://logo.clearbit.com/techflow.ai",
    "industry": "Technology"
  },
  "location": "Bangalore, India",
  "type": "Full-time",
  "workMode": "Hybrid",
  "salary": {
    "min": 1800000,
    "max": 2500000,
    "currency": "INR",
    "period": "yearly"
  },
  "description": "We are looking for...",
  "skills": ["React", "TypeScript", "Next.js"],
  "externalApply": true,
  "applyLink": "https://techflow.ai/careers/apply/123",
  "overview": {
    "summary": "Join our engineering team...",
    "responsibilities": ["Write code", "Review PRs"],
    "requiredSkills": ["React", "TypeScript"],
    "techStack": [
      { "name": "React", "logo": "..." }
    ]
  },
  "companyDetails": {
    "description": "About the company...",
    "website": "https://techflow.ai",
    "employees": "50-100"
  },
  "applicationProcess": {
    "steps": [
      { "title": "Interview", "description": "Technical round" }
    ]
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "job_123",
    "title": "Senior Frontend Engineer",
    "createdAt": "2023-10-15T10:00:00Z",
    ...
  }
}
```

### 2. Update Job (PUT)
**Endpoint:** `PUT /api/jobs/:id`

**Request Body:** (Partial updates allowed)
```json
{
  "salary": {
    "min": 2000000,
    "max": 2800000,
    "currency": "INR",
    "period": "yearly"
  },
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "job_123",
    "salary": { ... },
    "isActive": false,
    ...
  }
}
```

### 3. Delete Job (DELETE)
**Endpoint:** `DELETE /api/jobs/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### 4. List Jobs (GET)
**Endpoint:** `GET /api/jobs`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by title or company
- `type`: Filter by job type (Full-time, Contract, etc.)
- `location`: Filter by location
- `remote`: Boolean filter for remote jobs

**Response (200 OK):**
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "current": 1,
    "total": 5,
    "limit": 10
  },
  "data": [
    {
      "_id": "job_123",
      "title": "Senior Frontend Engineer",
      "company": { "name": "TechFlow AI", "logo": "..." },
      "location": "Bangalore",
      "salary": "₹18-25 LPA",
      "postedAt": "2023-10-15T10:00:00Z"
    },
    ...
  ]
}
```

### 5. Apply for Job (POST)
**Endpoint:** `POST /api/jobs/:id/apply`

**Request Body:**
```json
{
  "userId": "user_456",
  "coverLetter": "I am excited to apply...",
  "resume": "https://resume-link.com/file.pdf"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```
