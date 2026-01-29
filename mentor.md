# Mentor Page Components Data Structure

This document outlines the data structures and JSON payloads for the components used in the Mentor Detail Page. These can be served via individual endpoints or a combined `GET /mentorships/:id` response.

## 1. MentorHero
**Endpoint:** `GET /api/mentorships/:id/hero`

```json
{
  "mentor": {
    "id": "1",
    "name": "Dr. Priya Sharma",
    "role": "Senior Data Scientist",
    "company": "Google",
    "avatar": "https://randomuser.me/api/portraits/women/28.jpg",
    "rating": 4.9,
    "reviewCount": 120,
    "experience": "8+ years",
    "price": "₹2,500",
    "priceType": "session"
  }
}
```

## 2. MentorOverview
**Endpoint:** `GET /api/mentorships/:id/overview`

```json
{
  "mentor": {
    "bio": "I am a Senior Data Scientist at Google with over 8 years of experience in Machine Learning and AI...",
    "skills": [
      { "name": "Python", "link": "/skills/python" },
      { "name": "TensorFlow", "link": "/skills/tensorflow" },
      { "name": "Machine Learning", "link": "/skills/machine-learning" }
    ],
    "languages": ["English", "Hindi"],
    "availability": [
      {
        "date": "Saturday, 19 Aug",
        "slots": [
          { "time": "9:30 AM", "isAvailable": true },
          { "time": "12:00 PM", "isAvailable": true }
        ]
      }
    ]
  }
}
```

## 3. MentorValueSection
**Endpoint:** `GET /api/mentorships/:id/value`

```json
{
  "mentorName": "Dr. Priya Sharma",
  "values": [
    {
      "title": "1:1 Mentorship",
      "description": "Get personalized guidance tailored to your career goals."
    },
    {
      "title": "Resume Review",
      "description": "Detailed feedback to help you stand out to recruiters."
    }
  ]
}
```

## 4. MentorSuccessStories
**Endpoint:** `GET /api/mentorships/:id/success-stories`

```json
{
  "mentorName": "Dr. Priya Sharma",
  "stories": [
    {
      "name": "Rahul Verma",
      "role": "Data Analyst",
      "company": "Amazon",
      "quote": "Dr. Sharma's guidance was instrumental in helping me crack the Amazon interview.",
      "avatar": "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ]
}
```

## 5. MentorGrowthLink
**Endpoint:** `GET /api/mentorships/:id/growth`

```json
{
  "mentor": {
    "id": "1",
    "name": "Dr. Priya Sharma",
    "role": "Senior Data Scientist",
    "domain": "AI & Machine Learning",
    "experience": "8+ years"
  },
  "recommendedJobs": [
    {
      "title": "Data Scientist",
      "company": "Microsoft",
      "location": "Bangalore",
      "logo": "https://logo.clearbit.com/microsoft.com"
    }
  ],
  "recommendedCourses": [
    {
      "title": "Advanced Machine Learning",
      "platform": "Coursera",
      "logo": "https://logo.clearbit.com/coursera.org"
    }
  ]
}
```

## 6. MentorRelated
**Endpoint:** `GET /api/mentorships/:id/related`

```json
{
  "mentorDomain": "AI & Machine Learning",
  "relatedMentors": [
    {
      "id": "2",
      "name": "Amit Patel",
      "role": "ML Engineer",
      "company": "Uber",
      "avatar": "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ]
}
```

## 7. MentorTrustSafety
**Endpoint:** `GET /api/mentorships/:id/trust`

```json
{
  "mentorName": "Dr. Priya Sharma",
  "isVerified": true,
  "stats": {
    "sessionsCompleted": 500,
    "rating": 4.9
  }
}
```

## 8. MentorActionBar
**Endpoint:** `GET /api/mentorships/:id/actions`

```json
{
  "mentor": {
    "name": "Dr. Priya Sharma",
    "price": "₹2,500",
    "priceType": "session",
    "isAvailable": true,
    "bookingLink": "/book/1"
  }
}
```

## 9. Book Mentorship (Action)
**Endpoint:** `POST /api/mentorships/:id/book`

**Request Body:**
```json
{
  "userId": "user_123",
  "slotId": "slot_456",
  "date": "2023-08-19",
  "time": "10:30 AM",
  "note": "I want to discuss my career path in Data Science."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "bookingId": "booking_789",
  "message": "Session booked successfully",
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

## Combined Response (Full Mentor Details)
**Endpoint:** `GET /api/mentorships/:id`

```json
{
  "_id": "mentor_1",
  "name": "Dr. Priya Sharma",
  "role": "Senior Data Scientist",
  "company": "Google",
  "avatar": "https://randomuser.me/api/portraits/women/28.jpg",
  "bio": "I am a Senior Data Scientist at Google...",
  "domain": "AI & Machine Learning",
  "experience": "8+ years",
  "rating": 4.9,
  "reviewCount": 120,
  "price": "₹2,500",
  "priceType": "session",
  "isVerified": true,
  "isAvailable": true,
  "skills": [
    { "name": "Python", "link": "/skills/python" }
  ],
  "languages": ["English", "Hindi"],
  "availability": [],
  "stories": [],
  "relatedMentors": [],
  "recommendedJobs": []
}
```
