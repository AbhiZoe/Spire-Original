# Spire — Product Memory (v2)

> **How to use this file:** Paste this into the start of every Claude Code / AI session that touches Spire. This file is the single source of truth for what Spire is. If any AI output contradicts this file, the AI is wrong. Do not let AI invent strategy — only implementation.

---

## What Spire Is

**Spire is a self-paced online learning platform where students purchase courses and receive human mentorship as part of the purchase.**

Students browse the catalog, buy individual courses (or services). After purchase, they receive an email acknowledgment and a digital agreement, and they can start learning immediately at their own pace.

Each course includes video lessons to watch, weekly assignments to submit, and quizzes to pass. Every course has a **pool of instructors who serve as mentors** — students are assigned to one mentor from the pool based on mentor capacity. Students can request on-demand Zoom sessions with their mentor when they are stuck — sessions are **not** scheduled by default. If a student is inactive for too long, the system automatically nudges them to request a session.

Upon completing all lessons, passing all quizzes (60% threshold, multiple attempts allowed), and submitting the final assignment, the student receives a certificate.

**Services** (Resume Preparation, Interview Training, LinkedIn Optimization, Placement Assistance) work similarly but are shorter, don't grant certificates, and are delivered by separate trainers rather than course instructors. Services are self-paced video content — they teach *how* to do something, they do not review the student's actual work.

## How Students Pay

- **One-time purchase per course.** Pay once, access that course forever.
- **One-time purchase per service.** Same model as courses.
- Students can buy multiple courses and/or services (cart with checkout).
- Payment via Razorpay (India, INR).
- On successful payment: email acknowledgment + agreement.

Not subscriptions. Not tiers. Not monthly. Not lifetime-all-access. **Pay per item, own that item.**

## What Spire Is NOT

- ❌ NOT a subscription platform with Free / Pro / Enterprise tiers
- ❌ NOT Netflix for courses
- ❌ NOT Udemy (Udemy has no mentorship; Spire's differentiator IS mentorship)
- ❌ NOT cohort-based (no fixed start dates)
- ❌ NOT a pure MOOC (mentorship is included)
- ❌ NOT DRM-protected streaming (signed URLs only; "DRM" language in old code must go)
- ❌ NOT multi-tenant B2B
- ❌ NOT SCORM/LTI compliant
- ❌ NOT a forum/community platform
- ❌ NOT open to student-to-instructor upgrade (closed roster, admin-controlled)

## The User Types

### Student
- Browses, creates account, purchases
- Consumes content at own pace (self-paced)
- Gets ONE assigned mentor per course (from the course's mentor pool)
- Requests Zoom sessions when stuck
- Submits weekly assignments, takes quizzes (60% to pass, multiple attempts allowed)
- Earns certificate on course completion
- Receives automatic nudges if inactive

### Instructor (Mentor)
- Attached to courses as part of the mentor pool
- Serves as assigned mentor for up to **10 students at a time**
- Receives on-demand session requests from their assigned students
- **Cannot decline session requests** — must accept all
- Reviews and grades assignment submissions
- Has a dashboard of all their assigned students

### Trainer (for Services)
- Separate role from Instructor
- Authors service content (video-based)
- Does NOT mentor students 1:1
- Role can overlap with Instructor but the responsibilities are distinct

### Admin
- Full visibility: analytics, activity logs, all student progress
- Manages all users, courses, services, instructors, trainers
- Approves or removes any role
- Manages mentor pools for courses (adds/removes instructors from a course's pool)

## Course Structure

A course has:
- **Metadata:** title, description, thumbnail, price, level, category
- **Mentor pool:** one or more instructors who can be assigned to students of this course
- **Modules:** sequential sections
- **Lessons within modules:** each is a video (Cloudinary for now; may migrate to Mux)
- **Quizzes:** multiple choice, auto-graded. **60% to pass. Multiple attempts allowed.**
- **Weekly assignments:** text or file submissions, graded by the assigned mentor
- **A final assignment:** required for course completion
- **A certificate:** generated on completion (all lessons watched + all quizzes passed with 60%+ + final assignment graded)

A service has:
- **Metadata:** title, description, thumbnail, price, category, trainer
- **Modules and lessons:** like a course, but shorter
- **No quizzes, no assignments, no certificate**
- Progress is tracked for analytics and student view

Content is self-paced. No date-gating. "Weekly" is a suggested pace only.

## The Mentor Pool Model

This is the most important architectural decision.

- Each course has a **pool of mentors** — not a single mentor.
- When a student buys Course X, the system **auto-assigns them to a mentor from Course X's pool** based on capacity.
- **Capacity rule: one mentor can have at most 10 active students** (across ALL courses they mentor).
- When a student completes a course, that mentor "slot" opens up for a new student.
- If all mentors in a pool are at capacity and a new student buys, the assignment is **pending_assignment** until admin adds a new mentor to the pool OR a slot opens up.
- Admin can manually reassign students between mentors if needed.
- A single instructor can be in the mentor pools of multiple courses, subject to the 10-student-total cap.

## The Mentorship Flow

1. Student buys Course X
2. System finds a mentor in Course X's pool with available capacity
3. If found → student assigned to that mentor. Enrollment active immediately.
4. If all mentors at capacity → enrollment status `pending_assignment`. Admin notified. Student sees "mentor assignment in progress — access to course is available; your mentor will be announced shortly." Student can still consume content.
5. Student learns at own pace; no required mentor interaction
6. When student has a question / is stuck: clicks "Request a session with your mentor"
7. System creates session request visible to the assigned mentor
8. **Mentor must accept** — picks a time slot, system generates Zoom meeting, notifies both parties
9. Session happens; attendance logged
10. If student is inactive (thresholds TBD — likely 7 days no login or 14 days no lesson completed): system sends nudge email + dashboard banner: "You haven't checked in recently — want to schedule a session with your mentor?"

## The "One Next Action" Principle (UX North Star)

**When a student logs in, there is exactly one obvious thing to do next.**

Not a dashboard of options. A single, prominent next action.

Examples:
- Fresh purchase: "Start Course: Watch Lesson 1 — Intro to React"
- Mid-course: "Continue where you left off: Lesson 5 — Component State"
- After lesson: "Next up: Lesson 6 — Props and Events"
- Due assignment: "Submit your Week 2 Assignment (due in 3 days)"
- Quiz failed: "Retake Quiz: Module 2 Check"
- Inactive: "You haven't checked in recently — want a session with your mentor?"
- Course complete: "Download your certificate"

The platform tells the student what to do. The student does not figure it out.

## Stack (Current)

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion
- **Backend:** Spring Boot 3 (Java 17) — already built; kept
- **Database:** MySQL (dev), PostgreSQL/Supabase (prod)
- **Auth:** JWT with refresh tokens
- **Video:** Cloudinary (may migrate to Mux later)
- **Payments:** Razorpay (India, INR, one-time payments)
- **Live sessions:** Zoom (integration pending)
- **Email:** TBD (Resend / Brevo / AWS SES)
- **Deployment:** Vercel (frontend), Railway (backend), Supabase (database)

## Content Rules

**Never invent:**
- Testimonials, names, career outcomes
- User counts
- Star ratings on courses with no enrollments
- "Featured in" / "partnered with" claims

**Always show zero state honestly:**
- No students → don't claim thousands
- No ratings → don't show stars
- Empty dashboards feel like a beginning, not a broken page

**Language to avoid:**
- "Premium", "Pro", "Elite"
- "Netflix-grade", "Binge-watch"
- "Unlock"
- "DRM", "Widevine", "FairPlay"
- "Subscription", "Monthly plan", "Billing cycle"

**Language to prefer:**
- "Your mentor"
- "Self-paced"
- "Request a session"
- "Continue where you left off"
- "One next step"

## Metrics That Matter for MVP

NOT measuring: MRR/ARR, subscription retention, DAU/MAU.

Measuring:
- Purchase conversion (visitor → buyer)
- Course completion rate
- Mentor session utilization
- Certificate generation rate
- Nudge effectiveness
- Service attach rate

## Resolved Open Questions (from previous iteration)

- **Quiz passing threshold:** 60%, multiple attempts allowed ✓
- **Mentor declining requests:** Mentor CANNOT decline, must accept all ✓
- **Mentor capacity:** 1 mentor : 10 students maximum (across all courses) ✓

## Still Open (resolve with Project Manager)

1. **Does the instructor author the course content, or does internal team author and attach instructor for mentorship only?**
2. **Exact "inactive" thresholds** — 7 days no login? 14 days no lesson?
3. **Refund policy** for Terms & Conditions.
4. **Instructor departure** — if an instructor leaves, how do their students get reassigned?

---

**Last updated:** v2, after resolving quiz threshold, mentor decline policy, and mentor capacity.
**Owner:** You — the only source of truth for Spire strategy.
