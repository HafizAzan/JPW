# HireHub --- Advanced Job Portal

## A-to-Z Master Build Specification & Cursor AI Coding Prompt

> **Purpose:** This document is the single source of truth for building
> a production-style, portfolio-quality Job Portal using Next.js,
> Tailwind CSS, Framer Motion, Node.js, Express.js, MongoDB, JWT,
> bcrypt, and Cloudinary.
>
> **Important:** Build the project module-by-module. Do not generate the
> entire application in one step. Cursor AI must inspect the existing
> code before modifying it, preserve working functionality, and complete
> one module before moving to the next.

------------------------------------------------------------------------

# 1. Project Vision

Build **HireHub**, a modern full-stack recruitment platform connecting
job seekers and employers.

The platform has three roles:

-   **Job Seeker** --- discovers jobs, manages a professional profile,
    uploads a resume, saves jobs, applies to jobs, and tracks
    applications.
-   **Employer / Recruiter** --- creates a company profile, posts jobs,
    manages job listings, reviews applicants, changes application
    statuses, and views recruitment analytics.
-   **Admin** --- moderates users, companies, and jobs and monitors
    platform-level statistics.

The final product must feel like a real SaaS product rather than a
tutorial CRUD application.

The project should demonstrate:

-   Modern Next.js development
-   Responsive UI engineering
-   Advanced Tailwind CSS usage
-   Light/dark theme support
-   Framer Motion animation
-   Component architecture
-   REST API design
-   JWT authentication
-   Role-based authorization
-   Secure password hashing
-   MongoDB/Mongoose data modeling
-   Cloudinary file management
-   Search/filter/sort/pagination
-   Dashboard design
-   Analytics
-   Form validation
-   Error handling
-   Loading and empty states
-   Production-quality UX
-   Accessibility
-   SEO fundamentals
-   Clean Git-ready architecture

------------------------------------------------------------------------

# 2. Product Name and Branding

## Product

**HireHub**

## Tagline

**Find talent. Find opportunity. Build what's next.**

## Brand Personality

-   Professional
-   Modern
-   Trustworthy
-   Fast
-   Minimal
-   Premium
-   Developer-friendly
-   Human

Avoid an overly corporate or generic job-board appearance.

------------------------------------------------------------------------

# 3. Technology Stack

## Frontend

-   Next.js
-   React
-   JavaScript or TypeScript
-   Tailwind CSS
-   Framer Motion
-   React Hook Form
-   Zod
-   Lucide React
-   Sonner or equivalent toast library

## Backend

-   Node.js
-   Express.js
-   JavaScript or TypeScript
-   Mongoose
-   JWT
-   bcrypt
-   express-validator or Zod-based API validation
-   Multer where required for uploads
-   Cloudinary SDK

## Database

-   MongoDB

## Storage

-   Cloudinary

## Authentication

-   JWT
-   bcrypt

## Recommended supporting tools

-   Axios or native fetch
-   ESLint
-   Prettier
-   dotenv
-   CORS
-   Helmet
-   express-rate-limit
-   cookie-parser if using cookie-based JWT
-   Morgan or structured logging

------------------------------------------------------------------------

# 4. Architecture Decision

Use a separate frontend/backend architecture.

``` text
hirehub/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── public/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       ├── utils/
│       └── server.js
│
├── README.md
└── .gitignore
```

Do not put business logic directly inside route files.

Use:

``` text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

------------------------------------------------------------------------

# 5. Global UI / UX Direction

The UI should look like a premium modern SaaS application.

## Design principles

-   Clean whitespace
-   Strong typography hierarchy
-   Rounded cards
-   Subtle borders
-   Soft shadows
-   Clear CTA buttons
-   Minimal gradients
-   Elegant micro-interactions
-   No excessive animation
-   Mobile-first responsive design
-   Excellent empty/loading/error states
-   Consistent spacing
-   Consistent component variants

The design must work equally well in:

-   Light mode
-   Dark mode

Do not create two completely different designs. Use the same design
system with theme-aware colors.

------------------------------------------------------------------------

# 6. Theme System

Implement a proper light/dark theme.

Theme toggle should be available in the public navbar and authenticated
dashboard layout.

Use semantic design tokens rather than hardcoded colors everywhere.

Example conceptual tokens:

``` text
background
foreground
card
card-foreground
muted
muted-foreground
border
primary
primary-foreground
secondary
success
warning
danger
```

Avoid:

``` text
bg-white
text-black
```

everywhere in components.

Prefer semantic classes where possible.

Dark mode must not simply invert colors.

Check:

-   Text contrast
-   Borders
-   Cards
-   Inputs
-   Modals
-   Dropdowns
-   Charts
-   Badges
-   Toasts
-   Skeletons
-   Empty states

------------------------------------------------------------------------

# 7. Typography

Use a modern sans-serif font.

Recommended:

-   Inter
-   Geist
-   Manrope

Typography hierarchy:

``` text
Display
H1
H2
H3
Body
Small
Caption
```

Keep line heights readable.

Do not use huge text everywhere.

------------------------------------------------------------------------

# 8. Animation System

Use Framer Motion.

Animations should communicate hierarchy and interaction.

## Global rules

Use:

-   Fade
-   Slide
-   Scale
-   Stagger
-   Layout transitions
-   Hover transitions
-   Modal transitions
-   Page section reveal

Avoid:

-   Excessive bouncing
-   Long animations
-   Animation on every element
-   Distracting continuous motion

## Suggested timings

``` text
Fast:     150ms
Normal:   250ms
Medium:   350ms
Slow:     500ms
```

## Page entrance

Use a subtle fade + upward movement.

Concept:

``` text
opacity: 0 → 1
y: 12 → 0
```

## Card hover

Use:

``` text
y: -2
scale: 1.01
```

with a subtle shadow/border transition.

## Staggered lists

Job cards, dashboard cards and feature sections can reveal sequentially.

## Reduced motion

Respect:

``` text
prefers-reduced-motion
```

Users who prefer reduced motion should receive minimal animation.

------------------------------------------------------------------------

# 9. Global Components

Create reusable components.

``` text
Button
Input
Textarea
Select
Checkbox
Radio
Badge
Avatar
Card
Modal
Dialog
Dropdown
Tabs
Tooltip
Toast
Skeleton
Pagination
Breadcrumb
SearchInput
FilterPanel
EmptyState
ErrorState
LoadingState
ConfirmDialog
DataTable
StatCard
JobCard
CompanyCard
ApplicationCard
StatusBadge
FileUploader
ResumePreview
```

Do not duplicate components across pages.

------------------------------------------------------------------------

# 10. Public Website

Public navigation:

``` text
Logo
Jobs
Companies
About
For Employers
Login
Get Started
Theme Toggle
```

Responsive mobile navigation:

``` text
Logo
Menu
```

Mobile drawer should animate smoothly.

------------------------------------------------------------------------

# 11. Module 1 --- Landing Page

## Goal

Create a premium first impression.

## Sections

### Hero

Headline:

**Find your next opportunity.**

Supporting text explaining the platform.

Primary CTA:

**Find Jobs**

Secondary CTA:

**Post a Job**

Include a modern visual composition showing:

-   Search interface
-   Job cards
-   Application status
-   Floating UI cards

Do not use a generic stock-photo hero.

Use CSS/UI composition or subtle abstract shapes.

### Search section

Fields:

``` text
Job title / keyword
Location
Job type
Search button
```

### Popular categories

Examples:

``` text
Software Development
Design
Marketing
Finance
Product
Customer Support
Data
Operations
```

### Featured jobs

Display 6--8 jobs.

### How it works

Three steps:

``` text
1. Create your profile
2. Discover opportunities
3. Get hired
```

### Employer CTA

Section encouraging companies to find talent.

### Statistics

Example:

``` text
10K+ Jobs
5K+ Companies
25K+ Candidates
95% Satisfaction
```

Use realistic demo values only.

### Footer

Columns:

``` text
Product
Company
Resources
Legal
Social
```

------------------------------------------------------------------------

# 12. Module 2 --- Authentication

Pages:

``` text
/login
/register
/forgot-password
/reset-password
```

## Register

Allow role selection:

``` text
Job Seeker
Employer
```

Fields:

``` text
Name
Email
Password
Confirm Password
Role
```

Password requirements should be shown clearly.

## Login

Fields:

``` text
Email
Password
Remember me
```

Include:

``` text
Forgot password?
```

## UX

Show:

-   Field validation
-   Password visibility toggle
-   Loading state
-   Error state
-   Success toast
-   Disabled submit during request

Do not expose sensitive server errors.

------------------------------------------------------------------------

# 13. Module 3 --- Authentication Backend

Endpoints:

``` text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
PUT  /api/auth/change-password
```

## Register logic

1.  Validate input
2.  Check duplicate email
3.  Hash password using bcrypt
4.  Create user
5.  Generate JWT
6.  Return safe user information

Never return:

``` text
password
passwordHash
resetToken
```

## Login logic

1.  Validate credentials
2.  Find user
3.  Compare password with bcrypt
4.  Check account status
5.  Generate JWT
6.  Return safe user data

## JWT

JWT should contain only necessary claims.

Example:

``` text
userId
role
```

Do not put passwords or sensitive profile information into JWT.

------------------------------------------------------------------------

# 14. Module 4 --- User Profile

Job seeker profile page:

``` text
/dashboard/profile
```

Sections:

``` text
Profile Header
About
Skills
Experience
Education
Links
Resume
```

## Profile header

Display:

-   Avatar
-   Name
-   Location
-   Professional headline
-   Edit button

## Skills

Use tags.

Example:

``` text
React
Next.js
Node.js
MongoDB
TypeScript
```

## Experience

Each item:

``` text
Company
Position
Start Date
End Date
Description
```

## Education

``` text
Institution
Degree
Field
Start Date
End Date
```

## Social links

``` text
LinkedIn
GitHub
Portfolio
```

------------------------------------------------------------------------

# 15. Module 5 --- Cloudinary Uploads

Use Cloudinary for:

``` text
Profile Avatar
Company Logo
Resume
```

## Avatar

Support:

-   JPG
-   PNG
-   WebP

Validate file type and size.

## Resume

Support:

-   PDF
-   optionally DOC/DOCX

Do not allow arbitrary executable files.

## Upload flow

``` text
Frontend
   ↓
Express upload endpoint
   ↓
Validation
   ↓
Cloudinary
   ↓
Cloudinary URL + publicId
   ↓
MongoDB
```

When replacing an uploaded asset, clean up the previous Cloudinary asset
where appropriate.

------------------------------------------------------------------------

# 16. Module 6 --- Jobs Listing

Page:

``` text
/jobs
```

Desktop layout:

``` text
┌────────────────────────────────────────────┐
│ Search                                      │
├───────────────┬────────────────────────────┤
│ Filters       │ Job Results                │
│               │                            │
│ Job Type      │ Job Card                   │
│ Location      │ Job Card                   │
│ Experience    │ Job Card                   │
│ Salary        │ Job Card                   │
│ Category      │ Job Card                   │
└───────────────┴────────────────────────────┘
```

Mobile:

Filters become a drawer/modal.

## Job search

Support:

``` text
keyword
location
category
jobType
experienceLevel
remote
salary range
skills
```

## Sorting

``` text
Newest
Oldest
Salary: Low to High
Salary: High to Low
```

## Pagination

Use server-side pagination.

Example:

``` text
GET /api/jobs?page=1&limit=12
```

------------------------------------------------------------------------

# 17. Module 7 --- Job Card

Every job card should show:

``` text
Company Logo
Job Title
Company
Location
Remote badge
Job Type
Experience
Salary
Posted date
Save button
```

CTA:

``` text
View Job
```

Hover:

-   subtle lift
-   border transition
-   arrow movement

Do not make every element bounce.

------------------------------------------------------------------------

# 18. Module 8 --- Job Details

Page:

``` text
/jobs/[id]
```

Layout:

``` text
Main Content
├── Job Header
├── Description
├── Responsibilities
├── Requirements
├── Skills
└── About Company

Sidebar
├── Salary
├── Location
├── Job Type
├── Experience
├── Deadline
└── Apply Button
```

## Job header

Show:

``` text
Company logo
Job title
Company name
Location
Posted date
```

## Actions

``` text
Apply Now
Save Job
Share
```

If user already applied:

``` text
Application Submitted
```

Disable duplicate application.

------------------------------------------------------------------------

# 19. Module 9 --- Saved Jobs

Page:

``` text
/dashboard/saved-jobs
```

Display saved jobs.

Features:

-   Remove saved job
-   Open job
-   Apply
-   Search saved jobs

Empty state:

``` text
You haven't saved any jobs yet.
```

CTA:

``` text
Explore Jobs
```

------------------------------------------------------------------------

# 20. Module 10 --- Job Application

Application modal/page:

``` text
Apply for Frontend Developer
```

Fields:

``` text
Resume
Cover Letter
```

Show selected resume.

Optional:

``` text
Additional information
```

Submit button:

``` text
Submit Application
```

After successful submission:

``` text
Application submitted successfully.
```

Do not allow duplicate application for the same user/job.

------------------------------------------------------------------------

# 21. Module 11 --- My Applications

Page:

``` text
/dashboard/applications
```

Display:

``` text
Job
Company
Applied Date
Status
Actions
```

Statuses:

``` text
Applied
Reviewing
Shortlisted
Interview
Rejected
Hired
```

Use semantic status colors, but ensure text labels are always visible.

Filters:

``` text
All
Applied
Reviewing
Shortlisted
Interview
Rejected
Hired
```

------------------------------------------------------------------------

# 22. Module 12 --- Employer Onboarding

Employer registration should guide the employer through company setup.

Flow:

``` text
Create account
     ↓
Create company
     ↓
Upload logo
     ↓
Company information
     ↓
Employer dashboard
```

Company fields:

``` text
Name
Logo
Description
Website
Industry
Location
Company size
Founded year
```

------------------------------------------------------------------------

# 23. Module 13 --- Employer Dashboard

Page:

``` text
/employer
```

Stats:

``` text
Active Jobs
Total Applications
Shortlisted
Interviews
Hired
```

Recent jobs table.

Recent applications.

Simple analytics charts.

Quick actions:

``` text
Create Job
Manage Jobs
View Applicants
Edit Company
```

------------------------------------------------------------------------

# 24. Module 14 --- Create Job

Page:

``` text
/employer/jobs/create
```

Fields:

``` text
Job Title
Description
Responsibilities
Requirements
Skills
Category
Location
Remote
Job Type
Experience Level
Salary Min
Salary Max
Application Deadline
```

Use a proper form schema.

Validate on both frontend and backend.

## Draft / publish behavior

Recommended:

``` text
Save Draft
Submit for Review
```

Employer-created jobs can enter:

``` text
pending
```

Admin can approve them.

------------------------------------------------------------------------

# 25. Module 15 --- Manage Employer Jobs

Page:

``` text
/employer/jobs
```

Table:

``` text
Job
Status
Applications
Views
Created
Deadline
Actions
```

Actions:

``` text
View
Edit
Duplicate
Close
Delete
```

Status:

``` text
Draft
Pending
Approved
Rejected
Closed
Expired
```

Use confirmation dialogs for destructive actions.

------------------------------------------------------------------------

# 26. Module 16 --- Applicants

Page:

``` text
/employer/jobs/[id]/applicants
```

Applicant card/table:

``` text
Avatar
Name
Headline
Skills
Applied date
Status
Resume
```

Actions:

``` text
View Profile
View Resume
Change Status
```

Status workflow:

``` text
Applied
   ↓
Reviewing
   ↓
Shortlisted
   ↓
Interview
   ↓
Hired
```

Rejected can happen from any appropriate review stage.

------------------------------------------------------------------------

# 27. Module 17 --- Applicant Detail

Display:

``` text
Candidate Profile
About
Skills
Experience
Education
Resume
Application
Cover Letter
```

Employer can update status.

Add an optional private recruiter note field if desired.

Recruiter notes must never be visible to the candidate.

------------------------------------------------------------------------

# 28. Module 18 --- Company Directory

Page:

``` text
/companies
```

Features:

-   Search companies
-   Filter by industry
-   Filter by location
-   Sort
-   Pagination

Company card:

``` text
Logo
Company name
Industry
Location
Open jobs
Verified badge
```

------------------------------------------------------------------------

# 29. Module 19 --- Company Detail

Page:

``` text
/companies/[id]
```

Sections:

``` text
Company header
About
Industry
Company size
Website
Location
Open positions
```

CTA:

``` text
View Jobs
```

------------------------------------------------------------------------

# 30. Module 20 --- Admin Dashboard

Page:

``` text
/admin
```

Dashboard cards:

``` text
Total Users
Job Seekers
Employers
Companies
Jobs
Applications
Pending Jobs
```

Use charts for:

``` text
Applications over time
Jobs posted over time
User growth
Job categories
```

Keep charts readable in both themes.

------------------------------------------------------------------------

# 31. Module 21 --- Admin Users

Page:

``` text
/admin/users
```

Features:

-   Search
-   Filter by role
-   Filter by status
-   Pagination
-   View user
-   Suspend user
-   Reactivate user
-   Delete user where appropriate

Never expose passwords or security-sensitive data.

------------------------------------------------------------------------

# 32. Module 22 --- Admin Jobs

Page:

``` text
/admin/jobs
```

Admin can:

``` text
View
Approve
Reject
Close
Delete
```

Job moderation states:

``` text
Pending
Approved
Rejected
Closed
```

Rejection should support an optional reason.

------------------------------------------------------------------------

# 33. Module 23 --- Admin Companies

Admin can:

``` text
View
Verify
Unverify
Suspend
Delete
```

Verified company badge:

``` text
✓ Verified
```

Do not show a verified badge unless the backend confirms verification.

------------------------------------------------------------------------

# 34. Module 24 --- Notifications

Notification icon in authenticated navbar.

Notification examples:

Job seeker:

``` text
Your application moved to Shortlisted.
```

Employer:

``` text
You received a new application.
```

Admin:

``` text
A new job is waiting for review.
```

Routes:

``` text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

Unread count should be displayed.

------------------------------------------------------------------------

# 35. Module 25 --- Job Recommendation

Start with a deterministic matching system.

Example:

Candidate skills:

``` text
React
Next.js
Node.js
MongoDB
```

Job skills:

``` text
React
Next.js
TypeScript
Node.js
```

Matching:

``` text
Matched skills = 3
Job skills = 4
Match score = 75%
```

Use the score for:

``` text
Recommended for you
```

Do not claim the recommendation is AI-powered unless an actual AI
service is integrated.

------------------------------------------------------------------------

# 36. Module 26 --- Search Architecture

Job search should be server-side.

Query example:

``` text
GET /api/jobs
  ?search=react
  &location=remote
  &jobType=full-time
  &experienceLevel=mid
  &category=engineering
  &minSalary=1000
  &maxSalary=3000
  &page=1
  &limit=12
  &sort=newest
```

Backend must construct MongoDB queries safely.

Do not concatenate raw user input into database expressions.

------------------------------------------------------------------------

# 37. Module 27 --- MongoDB Models

## User

``` text
name
email
password
role
status
avatar
headline
bio
location
skills[]
experience[]
education[]
socialLinks
resume
createdAt
updatedAt
```

Roles:

``` text
jobseeker
employer
admin
```

## Company

``` text
name
slug
logo
description
website
industry
location
companySize
foundedYear
owner
isVerified
status
createdAt
updatedAt
```

## Job

``` text
title
slug
description
responsibilities[]
requirements[]
skills[]
category
location
isRemote
jobType
experienceLevel
salary
deadline
company
employer
status
views
createdAt
updatedAt
```

## Application

``` text
job
candidate
employer
resume
coverLetter
status
recruiterNote
createdAt
updatedAt
```

## SavedJob

``` text
user
job
createdAt
```

Prevent duplicate user/job combinations.

## Notification

``` text
recipient
type
title
message
entityId
isRead
createdAt
```

------------------------------------------------------------------------

# 38. Module 28 --- Database Relationships

Conceptual relationships:

``` text
User
 ├── owns Company
 ├── creates Jobs
 ├── submits Applications
 ├── saves Jobs
 └── receives Notifications

Company
 └── has many Jobs

Job
 ├── belongs to Company
 ├── belongs to Employer
 ├── has many Applications
 └── can be saved by Users

Application
 ├── belongs to Job
 ├── belongs to Candidate
 └── belongs to Employer
```

Use MongoDB ObjectId references where appropriate.

Avoid embedding huge or frequently changing relational datasets
unnecessarily.

------------------------------------------------------------------------

# 39. Module 29 --- API Routes

## Authentication

``` text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
PUT  /api/auth/change-password
```

## Users

``` text
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/avatar
POST   /api/users/resume
DELETE /api/users/resume
```

## Companies

``` text
POST   /api/companies
GET    /api/companies
GET    /api/companies/:id
PUT    /api/companies/:id
DELETE /api/companies/:id
POST   /api/companies/:id/logo
```

## Jobs

``` text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/save
DELETE /api/jobs/:id/save
GET    /api/employer/jobs
```

## Applications

``` text
POST   /api/applications
GET    /api/applications/my
GET    /api/applications/:id
DELETE /api/applications/:id
GET    /api/jobs/:jobId/applications
PATCH  /api/applications/:id/status
```

## Notifications

``` text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

## Admin

``` text
GET    /api/admin/users
PATCH  /api/admin/users/:id/status
DELETE /api/admin/users/:id

GET    /api/admin/jobs
PATCH  /api/admin/jobs/:id/approve
PATCH  /api/admin/jobs/:id/reject
DELETE /api/admin/jobs/:id

GET    /api/admin/companies
PATCH  /api/admin/companies/:id/verify
DELETE /api/admin/companies/:id

GET    /api/admin/stats
```

------------------------------------------------------------------------

# 40. Module 30 --- Authorization

Create middleware:

``` text
authenticate
authorize
```

Example:

``` text
authenticate()
authorize("employer")
```

Rules:

-   Job seekers cannot create jobs.
-   Employers cannot access admin APIs.
-   Candidates cannot modify another candidate's profile.
-   Employers can only modify their own companies/jobs.
-   Employers can only manage applications for their own jobs.
-   Admin has platform moderation privileges.
-   Public users can only access public resources.

Authorization must be enforced on the backend.

Never rely only on frontend route protection.

------------------------------------------------------------------------

# 41. Module 31 --- Error Handling

Use consistent API response structures.

Success:

``` json
{
  "success": true,
  "message": "Job created successfully",
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "message": "Unable to create job",
  "errors": []
}
```

Use centralized Express error middleware.

Handle:

``` text
Validation errors
Authentication errors
Authorization errors
Not found
Duplicate records
Cloudinary errors
MongoDB errors
Unexpected server errors
```

Never expose stack traces in production.

------------------------------------------------------------------------

# 42. Module 32 --- Frontend API Layer

Do not call APIs randomly from components.

Create service functions:

``` text
authService
userService
jobService
companyService
applicationService
notificationService
adminService
```

Example conceptual usage:

``` text
jobService.getJobs(filters)
jobService.getJobById(id)
jobService.createJob(payload)
jobService.updateJob(id, payload)
```

Components should remain focused on UI.

------------------------------------------------------------------------

# 43. Module 33 --- Forms

Use React Hook Form + Zod.

Every important form should include:

``` text
Schema
Client validation
Server validation
Loading state
Error state
Success state
Disabled submit
```

Do not trust client validation alone.

------------------------------------------------------------------------

# 44. Module 34 --- Loading States

Every async page must have a meaningful loading state.

Use skeletons for:

``` text
Job cards
Company cards
Dashboard stats
Tables
Profile
Job details
```

Avoid a blank screen.

Use skeleton UI rather than a giant spinner whenever possible.

------------------------------------------------------------------------

# 45. Module 35 --- Empty States

Every list should have an empty state.

Examples:

``` text
No jobs found.
Try changing your filters.
```

``` text
No applications yet.
Your applications will appear here.
```

``` text
No saved jobs.
Start exploring opportunities.
```

Every empty state should provide a useful CTA where appropriate.

------------------------------------------------------------------------

# 46. Module 36 --- Error States

Create reusable error UI.

Example:

``` text
Something went wrong.
We couldn't load the jobs right now.

Try again
```

Include retry where possible.

------------------------------------------------------------------------

# 47. Module 37 --- Responsive Design

Support:

``` text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Important mobile areas:

-   Navbar
-   Search
-   Job filters
-   Tables
-   Dashboards
-   Forms
-   Modals
-   Sidebar

Do not simply shrink desktop layouts.

For tables on mobile, use:

-   Cards
-   Horizontal scrolling
-   Condensed layouts

depending on context.

------------------------------------------------------------------------

# 48. Module 38 --- Accessibility

Implement:

-   Semantic HTML
-   Labels for inputs
-   Keyboard navigation
-   Visible focus states
-   Accessible dialogs
-   Accessible dropdowns
-   Alt text
-   Proper heading hierarchy
-   Sufficient contrast
-   Reduced-motion support

Buttons must be buttons.

Links must be links.

Do not use clickable divs when native elements are appropriate.

------------------------------------------------------------------------

# 49. Module 39 --- SEO

Public pages should have metadata.

Implement:

-   Title
-   Description
-   Open Graph metadata
-   Proper canonical strategy where appropriate
-   Semantic headings
-   Descriptive URLs
-   Job/company slugs

Example:

``` text
/jobs/frontend-developer-nextjs
/companies/acme-technologies
```

Do not use only database IDs in public URLs when slugs make sense.

------------------------------------------------------------------------

# 50. Module 40 --- Security Checklist

Backend:

``` text
JWT validation
Password hashing
Input validation
Rate limiting
CORS configuration
Helmet
Secure cookies if applicable
File type validation
File size limits
Authorization checks
MongoDB query safety
Environment variables
No secrets in Git
```

Never store:

``` text
JWT secret
MongoDB URI
Cloudinary secret
API keys
```

inside frontend source code.

------------------------------------------------------------------------

# 51. Module 41 --- Environment Variables

Frontend example:

``` text
NEXT_PUBLIC_API_URL=
```

Backend:

``` text
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
```

Use `.env.example`.

Never commit `.env`.

------------------------------------------------------------------------

# 52. Module 42 --- Seed Data

Create development seed data.

Include:

``` text
1 admin
3 employers
8 job seekers
5 companies
20 jobs
25 applications
saved jobs
notifications
```

Use realistic demo content.

Passwords must be development-only and clearly documented.

Do not use real people's personal information.

------------------------------------------------------------------------

# 53. Module 43 --- Dashboard Analytics

Employer analytics:

``` text
Job views
Applications
Shortlisted
Interviews
Hired
```

Admin analytics:

``` text
User growth
Job growth
Application growth
Popular categories
```

Use MongoDB aggregation pipelines where appropriate.

Charts must support dark mode.

------------------------------------------------------------------------

# 54. Module 44 --- Job Views

Each job should have a view count.

Avoid blindly incrementing views on every repeated refresh if possible.

A basic implementation may use a lightweight unique-view strategy based
on user/session information.

Do not build an unnecessarily complex analytics platform for the MVP.

------------------------------------------------------------------------

# 55. Module 45 --- Application Status Workflow

Allowed statuses:

``` text
applied
reviewing
shortlisted
interview
rejected
hired
```

Backend must validate status transitions.

At minimum:

-   Only employer/admin can update employer-side status.
-   Candidate cannot mark themselves hired.
-   Employer can only update applications belonging to their jobs.

Create notification events for important status changes.

------------------------------------------------------------------------

# 56. Module 46 --- UX Micro-interactions

Implement polished interactions:

-   Button loading indicator
-   Save-job icon animation
-   Toast notifications
-   Dropdown transitions
-   Modal entrance/exit
-   Sidebar transition
-   Mobile menu animation
-   Job-card hover
-   Filter drawer animation
-   Tabs transition
-   Status badge appearance
-   Form error transition
-   Copy/share feedback

Keep animations fast and purposeful.

------------------------------------------------------------------------

# 57. Module 47 --- Share Job

Job details should have share functionality.

Actions:

``` text
Copy link
```

Optional:

``` text
Web Share API
```

Show:

``` text
Link copied!
```

------------------------------------------------------------------------

# 58. Module 48 --- Confirmation Dialogs

Destructive actions require confirmation.

Examples:

``` text
Delete job?
Delete your resume?
Remove saved job?
Delete company?
Reject job?
Suspend user?
```

Use a reusable `ConfirmDialog`.

Never delete important resources immediately from a single accidental
click.

------------------------------------------------------------------------

# 59. Module 49 --- Code Quality

Rules:

-   No duplicated business logic
-   No huge components
-   No huge controllers
-   No database calls inside UI components
-   No hardcoded secrets
-   No unexplained magic values
-   Meaningful names
-   Small reusable components
-   Clear folder boundaries
-   Consistent error handling
-   Consistent API response structure

Prefer readable code over clever code.

------------------------------------------------------------------------

# 60. Module 50 --- Testing Strategy

At minimum, test:

Authentication:

``` text
Register
Login
Invalid password
Duplicate email
Protected route
Role authorization
```

Jobs:

``` text
Create
Read
Update
Delete
Search
Filters
Pagination
Authorization
```

Applications:

``` text
Apply
Duplicate application
Status update
Authorization
```

Uploads:

``` text
Valid avatar
Invalid file
Valid resume
Oversized file
```

------------------------------------------------------------------------

# 61. Recommended Frontend Route Map

``` text
/
├── jobs
│   └── [slug]
├── companies
│   └── [slug]
├── login
├── register
├── forgot-password
├── reset-password
│
├── dashboard
│   ├── page
│   ├── profile
│   ├── resume
│   ├── applications
│   ├── saved-jobs
│   └── settings
│
├── employer
│   ├── page
│   ├── company
│   ├── jobs
│   ├── jobs/create
│   ├── jobs/[id]/edit
│   ├── jobs/[id]/applicants
│   └── settings
│
└── admin
    ├── page
    ├── users
    ├── jobs
    ├── companies
    ├── applications
    └── settings
```

------------------------------------------------------------------------

# 62. Recommended Backend Structure

``` text
backend/
└── src/
    ├── config/
    │   ├── db.js
    │   └── cloudinary.js
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── company.controller.js
    │   ├── job.controller.js
    │   ├── application.controller.js
    │   ├── notification.controller.js
    │   └── admin.controller.js
    │
    ├── middleware/
    │   ├── auth.middleware.js
    │   ├── role.middleware.js
    │   ├── upload.middleware.js
    │   ├── validation.middleware.js
    │   └── error.middleware.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Company.js
    │   ├── Job.js
    │   ├── Application.js
    │   ├── SavedJob.js
    │   └── Notification.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── company.routes.js
    │   ├── job.routes.js
    │   ├── application.routes.js
    │   ├── notification.routes.js
    │   └── admin.routes.js
    │
    ├── services/
    │   ├── auth.service.js
    │   ├── user.service.js
    │   ├── company.service.js
    │   ├── job.service.js
    │   ├── application.service.js
    │   ├── notification.service.js
    │   └── upload.service.js
    │
    ├── validators/
    ├── utils/
    └── server.js
```

------------------------------------------------------------------------

# 63. Cursor AI Master Rules

Cursor AI must follow these rules throughout the project.

## Rule 1 --- Inspect first

Before writing code:

1.  Inspect relevant files.
2.  Understand the existing architecture.
3.  Identify reusable components.
4.  Do not overwrite working code unnecessarily.

## Rule 2 --- Work module-by-module

Do not build the entire application in one response.

Each module must be:

``` text
Planned
Implemented
Tested
Reviewed
Completed
```

before moving forward.

## Rule 3 --- Explain before large changes

Before a significant architectural change, briefly explain:

-   What will change
-   Why
-   Which files will change
-   What dependencies are needed

Then implement it.

## Rule 4 --- Preserve existing functionality

Never break existing modules while implementing a new module.

## Rule 5 --- Production mindset

Code should be:

-   Maintainable
-   Secure
-   Reusable
-   Testable
-   Responsive
-   Accessible

## Rule 6 --- No fake functionality

Do not create buttons that do nothing.

If an advanced feature is not implemented yet, use a clearly marked
placeholder rather than pretending it works.

## Rule 7 --- No unnecessary dependencies

Only add packages when they solve a real project requirement.

## Rule 8 --- Mobile-first

Every UI module must be tested conceptually at:

``` text
375px
768px
1024px
1440px
```

## Rule 9 --- Theme-aware

Every UI component must work in light and dark themes.

## Rule 10 --- Animation-aware

Use Framer Motion where it improves UX.

Do not animate everything.

------------------------------------------------------------------------

# 64. Cursor Prompt --- Project Initialization

Copy this prompt into Cursor:

``` text
You are the lead full-stack engineer for a production-quality project called HireHub.

We are building a modern job recruitment platform with:

Frontend:
- Next.js
- React
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Lucide React

Backend:
- Node.js
- Express.js
- Mongoose
- JWT
- bcrypt
- Cloudinary

Database:
- MongoDB

The application has three roles:
1. Job Seeker
2. Employer
3. Admin

Your job is to help me build this application module-by-module.

IMPORTANT DEVELOPMENT RULES:

1. Inspect the existing project before making changes.
2. Do not rewrite working code without a strong reason.
3. Do not build the entire application at once.
4. Work on exactly one module at a time.
5. Explain the implementation plan before significant changes.
6. Keep frontend and backend concerns separated.
7. Use reusable components.
8. Keep business logic out of route files.
9. Use controllers -> services -> models on the backend.
10. Validate input on both frontend and backend.
11. Never expose passwords or secrets.
12. Use JWT authentication and role-based authorization.
13. Make the UI responsive from mobile to desktop.
14. Support light and dark themes.
15. Use Framer Motion for polished but restrained animation.
16. Respect prefers-reduced-motion.
17. Implement loading, empty, error and success states.
18. Use accessible semantic HTML.
19. Avoid unnecessary dependencies.
20. Do not create fake buttons or fake functionality.
21. Use meaningful variable and function names.
22. Avoid duplicated logic.
23. Do not hardcode secrets.
24. Use environment variables.
25. Never store uploaded files directly in MongoDB; use Cloudinary.
26. Use MongoDB indexes for important searchable fields.
27. Protect backend authorization even if the frontend is protected.
28. Do not trust client-side validation.
29. Use consistent API response structures.
30. After implementing a module, review the changed files for bugs and integration issues.

DESIGN DIRECTION:

HireHub must feel like a premium modern SaaS product.

Design characteristics:
- Clean
- Minimal
- Professional
- Spacious
- Elegant
- Responsive
- Accessible

Support:
- Light mode
- Dark mode

Use semantic theme tokens and avoid scattering hardcoded colors throughout components.

Use:
- rounded cards
- subtle borders
- soft shadows
- modern typography
- clear CTAs
- tasteful gradients
- polished empty states
- skeleton loading
- micro-interactions

ANIMATION:

Use Framer Motion.

Preferred animation patterns:
- fade + slight upward entrance
- staggered card lists
- subtle card hover
- modal enter/exit
- mobile menu transitions
- filter drawer transitions
- button interaction
- layout transitions

Avoid excessive animation.

Respect prefers-reduced-motion.

ARCHITECTURE:

Frontend:
- app router
- reusable components
- feature-oriented organization where useful
- service/API layer
- hooks
- utilities
- validation schemas

Backend:
- routes
- middleware
- controllers
- services
- models
- validators
- utilities
- centralized error handling

Request flow:

Request
-> middleware
-> controller
-> service
-> model
-> database

PRODUCT MODULES:

1. Project setup
2. Design system
3. Landing page
4. Authentication
5. User profile
6. Cloudinary uploads
7. Jobs listing
8. Job details
9. Saved jobs
10. Job application
11. My applications
12. Employer onboarding
13. Employer dashboard
14. Create/edit job
15. Manage employer jobs
16. Applicants
17. Applicant detail
18. Company directory
19. Company detail
20. Admin dashboard
21. Admin users
22. Admin jobs
23. Admin companies
24. Notifications
25. Job recommendations
26. Search/filter/sort/pagination
27. Analytics
28. Security hardening
29. Testing
30. Production preparation

For every module:
- inspect current code
- create a plan
- identify files
- implement
- integrate
- handle loading/error/empty states
- verify light/dark theme
- verify responsive behavior
- review for security
- summarize what changed
- state what should be built next

Do not move to the next module until I explicitly tell you to continue.
```

------------------------------------------------------------------------

# 65. Cursor Prompt --- Design System

``` text
Implement the HireHub design system.

Requirements:

1. Create reusable UI primitives.
2. Support light and dark themes.
3. Use Tailwind CSS.
4. Use Framer Motion for appropriate interactions.
5. Use Lucide icons.
6. Establish consistent spacing.
7. Establish typography hierarchy.
8. Establish button variants.
9. Establish card variants.
10. Establish input/form styles.
11. Establish badge/status styles.
12. Establish skeleton styles.
13. Establish modal/dialog styles.
14. Establish toast usage.
15. Establish empty/error/loading components.

Create a consistent visual language.

Do not build business-specific pages yet.

Focus only on reusable UI foundations.

After implementation:
- inspect for duplicated styles
- verify theme behavior
- verify responsive behavior
- verify keyboard accessibility
- verify reduced motion
```

------------------------------------------------------------------------

# 66. Cursor Prompt --- Landing Page

``` text
Build the HireHub landing page based on the project specification.

Requirements:

- Premium SaaS aesthetic
- Light/dark theme
- Responsive
- Framer Motion
- Accessible
- SEO-friendly
- No unnecessary stock images
- Use modern UI composition

Sections:

1. Navbar
2. Hero
3. Job search
4. Popular categories
5. Featured jobs
6. How it works
7. Employer CTA
8. Platform statistics
9. Footer

Animations:
- Hero entrance
- Search section entrance
- Staggered category cards
- Staggered job cards
- CTA reveal

Keep animations subtle.

Use reusable components.

Do not implement backend functionality yet unless required for existing architecture.
Use realistic mock data only where necessary and clearly separate mock data from production API logic.
```

------------------------------------------------------------------------

# 67. Cursor Prompt --- Authentication

``` text
Implement authentication for HireHub.

Frontend pages:
- login
- register
- forgot-password
- reset-password

Backend:
- register
- login
- logout
- me
- forgot-password
- reset-password
- change-password

Requirements:

- bcrypt password hashing
- JWT authentication
- role support
- validation
- safe API responses
- protected routes
- authorization middleware
- loading states
- error states
- success toasts

Roles:
- jobseeker
- employer
- admin

Security:
- never return password
- never expose JWT secret
- never trust client-side role information
- validate all incoming data
- protect role-specific backend routes

After implementation, test:
- valid register
- duplicate email
- invalid login
- valid login
- protected route
- wrong role
- logout
```

------------------------------------------------------------------------

# 68. Cursor Prompt --- Job Module

``` text
Implement the Job module.

Frontend:
- jobs listing
- job details
- search
- filters
- sorting
- pagination
- save job

Backend:
- create job
- get jobs
- get single job
- update job
- delete job
- save job
- unsave job

Employer authorization:
- only employer can create
- employer can only update/delete owned jobs

Job seeker:
- can search
- can filter
- can save
- can view

Admin:
- can moderate

Implement:
- server-side filtering
- server-side pagination
- validation
- MongoDB indexes where appropriate
- loading states
- empty states
- error states
- responsive filter drawer
- Framer Motion micro-interactions

Do not implement applications yet.
```

------------------------------------------------------------------------

# 69. Cursor Prompt --- Application Module

``` text
Implement the job application system.

Candidate flow:

Job details
-> Apply
-> Resume
-> Cover letter
-> Submit
-> Application created
-> Confirmation

Employer flow:

Employer job
-> Applicants
-> Applicant detail
-> Change status
-> Notification

Statuses:

applied
reviewing
shortlisted
interview
rejected
hired

Requirements:

- prevent duplicate applications
- authorization
- resume support
- validation
- status validation
- notifications for important changes
- candidate application history
- employer applicant list
- loading states
- empty states
- errors
- confirmation dialogs where appropriate

Do not allow candidates to modify employer-side application status.
```

------------------------------------------------------------------------

# 70. Cursor Prompt --- Employer Dashboard

``` text
Build the Employer dashboard.

Include:

- total jobs
- active jobs
- applications
- shortlisted
- interviews
- hired
- recent jobs
- recent applications
- analytics

Pages:

/employer
/employer/company
/employer/jobs
/employer/jobs/create
/employer/jobs/[id]/edit
/employer/jobs/[id]/applicants

Use:
- responsive dashboard layout
- animated stat cards
- accessible charts
- dark mode
- empty states
- skeletons
- Framer Motion
- reusable components

Employer must only see and modify their own resources.
```

------------------------------------------------------------------------

# 71. Cursor Prompt --- Admin Dashboard

``` text
Build the Admin dashboard.

Include:

- total users
- job seekers
- employers
- companies
- jobs
- applications
- pending jobs
- recent activity

Pages:

/admin
/admin/users
/admin/jobs
/admin/companies
/admin/applications

Admin actions:
- suspend user
- reactivate user
- approve job
- reject job
- verify company
- unverify company
- delete resource where appropriate

Use:
- tables
- filters
- pagination
- search
- confirmation dialogs
- charts
- status badges
- dark mode
- responsive design
- loading/error/empty states

All admin authorization must be enforced on the backend.
```

------------------------------------------------------------------------

# 72. Cursor Prompt --- Final Production Review

``` text
Perform a production-readiness review of the HireHub application.

Do not rewrite the project automatically.

First inspect the entire architecture and identify:

1. Security problems
2. Authentication issues
3. Authorization issues
4. API inconsistencies
5. Validation gaps
6. MongoDB performance issues
7. Missing indexes
8. N+1 query risks
9. Cloudinary upload risks
10. File validation problems
11. Frontend performance problems
12. Accessibility issues
13. Responsive UI issues
14. Dark theme inconsistencies
15. Animation problems
16. SEO issues
17. Error handling gaps
18. Loading state gaps
19. Empty state gaps
20. Duplicate code
21. Poor component boundaries
22. Hardcoded secrets
23. Environment variable issues
24. Broken links/routes
25. Missing authorization checks

Return a prioritized report:

CRITICAL
HIGH
MEDIUM
LOW

Then wait for approval before fixing large groups of issues.
```

------------------------------------------------------------------------

# 73. Final Portfolio Requirements

Before calling HireHub complete, verify that it has:

## Product

-   [ ] Job seeker flow
-   [ ] Employer flow
-   [ ] Admin flow
-   [ ] Complete application workflow
-   [ ] Job moderation
-   [ ] Company management

## Frontend

-   [ ] Next.js
-   [ ] Tailwind CSS
-   [ ] Framer Motion
-   [ ] Responsive
-   [ ] Light theme
-   [ ] Dark theme
-   [ ] Accessible components
-   [ ] Loading states
-   [ ] Empty states
-   [ ] Error states
-   [ ] SEO

## Backend

-   [ ] Node.js
-   [ ] Express.js
-   [ ] REST API
-   [ ] Controllers
-   [ ] Services
-   [ ] Middleware
-   [ ] Validation
-   [ ] Central error handling

## Database

-   [ ] MongoDB
-   [ ] Mongoose
-   [ ] Proper references
-   [ ] Indexes
-   [ ] Aggregation where useful

## Security

-   [ ] JWT
-   [ ] bcrypt
-   [ ] RBAC
-   [ ] Input validation
-   [ ] Rate limiting
-   [ ] CORS
-   [ ] Helmet
-   [ ] Secure environment variables
-   [ ] File validation

## Storage

-   [ ] Cloudinary avatar
-   [ ] Cloudinary logo
-   [ ] Cloudinary resume

## Advanced

-   [ ] Saved jobs
-   [ ] Notifications
-   [ ] Recommendations
-   [ ] Analytics
-   [ ] Search
-   [ ] Filters
-   [ ] Sorting
-   [ ] Pagination

------------------------------------------------------------------------

# 74. Definition of Done

HireHub is complete only when:

1.  A new job seeker can register.
2.  A job seeker can create a professional profile.
3.  A job seeker can upload a resume.
4.  A job seeker can search jobs.
5.  A job seeker can filter jobs.
6.  A job seeker can save jobs.
7.  A job seeker can apply.
8.  A job seeker can track applications.
9.  An employer can register.
10. An employer can create a company.
11. An employer can create jobs.
12. Jobs can go through moderation.
13. Employers can manage applicants.
14. Employers can change application status.
15. Candidates receive relevant notifications.
16. Admin can manage users.
17. Admin can moderate jobs.
18. Admin can verify companies.
19. Light mode works.
20. Dark mode works.
21. Mobile UI works.
22. Desktop UI works.
23. API authorization works.
24. File uploads are secure.
25. Errors are handled gracefully.
26. Loading states exist.
27. Empty states exist.
28. Database indexes are reviewed.
29. Secrets are not committed.
30. README contains setup and architecture documentation.

------------------------------------------------------------------------

# 75. Recommended Build Order

Follow this exact order:

``` text
01. Project setup
02. Folder architecture
03. Environment configuration
04. Database connection
05. Express foundation
06. Next.js foundation
07. Tailwind design system
08. Theme system
09. Reusable UI components
10. Landing page
11. Authentication backend
12. Authentication frontend
13. Role-based authorization
14. User profile
15. Cloudinary
16. Company module
17. Job backend
18. Job frontend
19. Search/filter/pagination
20. Saved jobs
21. Application backend
22. Application frontend
23. Candidate dashboard
24. Employer dashboard
25. Employer job management
26. Applicant management
27. Notifications
28. Company directory
29. Admin backend
30. Admin frontend
31. Analytics
32. Recommendations
33. Security hardening
34. Accessibility review
35. Responsive review
36. Performance review
37. SEO review
38. Testing
39. Seed data
40. README
41. Deployment preparation
```

------------------------------------------------------------------------

# 76. Final Master Instruction for Cursor

``` text
From this point forward, treat the HireHub specification as the source of truth.

You are not a code generator that blindly produces files.

You are acting as a senior software architect and full-stack engineer.

For every task:

1. Understand the requirement.
2. Inspect the repository.
3. Identify existing architecture.
4. Explain the implementation approach.
5. Identify affected files.
6. Implement the smallest clean change.
7. Preserve existing functionality.
8. Handle edge cases.
9. Add validation.
10. Add loading/error/empty states where relevant.
11. Check light/dark theme.
12. Check responsive behavior.
13. Check accessibility.
14. Check authorization.
15. Check security implications.
16. Review the implementation.
17. Report what changed.
18. Mention any assumptions.
19. Mention what remains.
20. Wait for my next instruction.

Do not jump ahead.

Do not build future modules unless explicitly requested.

Do not create fake backend responses once the real API is available.

Do not use hardcoded production credentials.

Do not expose secrets.

Do not put business logic into UI components.

Do not put business logic into Express route definitions.

Do not create duplicated components when an existing reusable component can be extended.

Use clean, readable, production-oriented code.

The final result must look and behave like a real modern recruitment SaaS product, not a basic tutorial project.

Start by inspecting the repository and then propose the implementation plan for Module 01 only.
```

------------------------------------------------------------------------

# 77. Portfolio README Positioning

When the project is complete, describe it as:

> **HireHub is a full-stack recruitment platform built with Next.js,
> Node.js, Express.js and MongoDB. It provides role-based workflows for
> candidates, employers and administrators, including job discovery,
> advanced search, saved jobs, resume management, applications,
> applicant tracking, company management, job moderation, notifications
> and analytics.**

Highlight these engineering points:

``` text
Role-Based Access Control
REST API Architecture
JWT Authentication
Secure Password Hashing
MongoDB Data Modeling
Cloudinary File Management
Advanced Search & Filtering
Server-Side Pagination
Application Workflow
Recruiter Dashboard
Admin Moderation
Analytics
Responsive UI
Dark/Light Theme
Framer Motion UX
Accessibility
Security
```

------------------------------------------------------------------------

# 78. Project Philosophy

The goal is not to maximize the number of features.

The goal is to demonstrate that you can take a real business problem and
build a complete, maintainable software product around it.

Prioritize:

``` text
Architecture
>
Security
>
User Experience
>
Data Modeling
>
Business Logic
>
Performance
>
Visual Polish
>
Extra Features
```

A smaller feature implemented properly is better than ten unfinished
features.

------------------------------------------------------------------------

# 79. End Goal

The finished HireHub project should be strong enough to demonstrate:

-   Full-stack engineering ability
-   Modern frontend development
-   Backend API development
-   Database design
-   Authentication
-   Authorization
-   File management
-   Business workflow design
-   UI/UX engineering
-   Animation
-   Responsive design
-   Security awareness
-   Production thinking

It should be suitable for:

-   GitHub portfolio
-   Personal website
-   Freelance proposals
-   Client demonstrations
-   Technical interviews
-   Software engineering job applications

**Build it as a real product, document it like a real engineering
project, and explain every major architectural decision.**
