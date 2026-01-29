# Internship Page Components Data Structure

This document outlines the data structures and JSON payloads for the components used in the Internship Detail Page (`src/app/internships/[id]/page.tsx`).

## 1. InternshipHero

**File:** `src/app/components/sections/internship/internship-hero.tsx`

**Props Interface:**
```typescript
type InternshipHeroProps = {
  internship: CategoryCardProps & {
    duration?: string;
    deadline?: string;
    description?: string;
  };
};
```

**JSON Payload Example:**
```json
{
  "internship": {
    "id": "1",
    "title": "Software Engineering Intern",
    "provider": "Google",
    "rating": "4.9",
    "reviews": "120",
    "level": "Intermediate",
    "duration": "3 months",
    "tags": ["React", "Node.js"],
    "logo": "https://logo.clearbit.com/google.com",
    "price": "Stipend: ₹50,000/mo",
    "deadline": "2023-12-31",
    "description": "Join our team to build scalable web applications."
  }
}
```

## 2. InternshipOverview

**File:** `src/app/components/sections/internship/internship-overview.tsx`

**Props Interface:**
```typescript
type InternshipOverviewProps = {
  internship: CategoryCardProps & {
    description?: string;
    skills?: string[];
  };
};
```

**JSON Payload Example:**
```json
{
  "internship": {
    "description": "Detailed description of the internship role...",
    "skills": ["JavaScript", "React", "TypeScript", "HTML/CSS"]
  }
}
```

## 3. Responsibilities

**File:** `src/app/components/sections/internship/responsibilities.tsx`

**Props Interface:**
```typescript
type ResponsibilitiesProps = {
  internship: CategoryCardProps & {
    responsibilities?: string[];
  };
};
```

**JSON Payload Example:**
```json
{
  "internship": {
    "responsibilities": [
      "Develop new user-facing features",
      "Build reusable code and libraries",
      "Ensure the technical feasibility of UI/UX designs"
    ]
  }
}
```

## 4. Requirements

**File:** `src/app/components/sections/internship/requirements.tsx`

**Props Interface:**
```typescript
type RequirementsProps = {
  internship: CategoryCardProps & {
    requirements?: string[];
  };
};
```

**JSON Payload Example:**
```json
{
  "internship": {
    "requirements": [
      "Strong proficiency in JavaScript",
      "Experience with React.js workflows",
      "Familiarity with RESTful APIs"
    ]
  }
}
```

## 5. CompanyInfo

**File:** `src/app/components/sections/internship/company-info.tsx`

**Props Interface:**
```typescript
type CompanyInfoProps = {
  internship: CategoryCardProps & {
    provider: string;
    location?: string;
    about?: string; // About the company
  };
};
```

**JSON Payload Example:**
```json
{
  "internship": {
    "provider": "Google",
    "location": "Bangalore, India",
    "logo": "https://logo.clearbit.com/google.com",
    "about": "Google's mission is to organize the world's information and make it universally accessible and useful."
  }
}
```

## 6. GrowthLink

**File:** `src/app/components/sections/internship/growth-link.tsx`

**Props Interface:**
```typescript
type GrowthLinkProps = {
  internship: CategoryCardProps;
};
```

**Data Source (Internal Mock Data):**
This component currently uses internal mock data for recommended courses.

**JSON Payload Example (Internal Data):**
```json
[
  {
    "title": "JavaScript Fundamentals",
    "company": "Udemy",
    "level": "Beginner",
    "duration": "10 hours",
    "price": "₹499",
    "logo": "https://logo.clearbit.com/udemy.com",
    "link": "/courses/javascript-fundamentals"
  },
  {
    "title": "React - The Complete Guide",
    "company": "Coursera",
    "level": "Intermediate",
    "duration": "40 hours",
    "price": "₹999",
    "logo": "https://logo.clearbit.com/coursera.org",
    "link": "/courses/react-complete-guide"
  }
]
```

## 7. ActionBar

**File:** `src/app/components/sections/internship/action-bar.tsx`

**Props Interface:**
```typescript
type ActionBarProps = {
  internship: CategoryCardProps;
};
```

**JSON Payload Example:**
```json
{
  "internship": {
    "title": "Software Engineering Intern",
    "provider": "Google",
    "logo": "https://logo.clearbit.com/google.com",
    "price": "Stipend: ₹50,000/mo"
  }
}
```

## 8. SimilarOpportunities

**File:** `src/app/components/sections/internship/similar-opportunities.tsx`

**Props Interface:**
```typescript
type SimilarOpportunitiesProps = {
  internship: CategoryCardProps & {
    skills?: string[];
  };
};
```

**Data Logic:**
Filters `internshipsData.cards` for items with similar titles/skills, excluding current item.

**JSON Payload Example (Derived):**
```json
{
  "internship": {
    "id": "1",
    "title": "Software Engineering Intern",
    "skills": ["React", "Node.js"]
  },
  "similarInternships": [
     {
        "id": "2",
        "title": "Frontend Intern",
        "provider": "Microsoft",
        "logo": "https://logo.clearbit.com/microsoft.com"
     }
  ]
}
```
