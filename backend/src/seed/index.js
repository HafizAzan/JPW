import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Notification } from "../models/Notification.js";
import { SavedJob } from "../models/SavedJob.js";

const jobsSeed = [
  {
    title: "Frontend Developer",
    description:
      "Build polished product interfaces with React and Next.js. You will work closely with design to ship accessible, performant pages and reusable component systems.",
    location: "Remote",
    workplace: "remote",
    jobType: "full-time",
    experienceLevel: "mid",
    salary: { min: 1500, max: 2500, currency: "USD" },
    skills: ["React", "Next.js", "JavaScript", "TypeScript"],
    category: "development",
    remote: true,
  },
  {
    title: "Next.js Developer",
    description:
      "Own the HireHub-facing web experience. You will design server components, streaming UI, and a design system that stays calm under pressure.",
    location: "Karachi",
    workplace: "hybrid",
    jobType: "full-time",
    experienceLevel: "senior",
    salary: { min: 2500, max: 4000, currency: "USD" },
    skills: ["Next.js", "React", "TypeScript", "Tailwind"],
    category: "development",
  },
  {
    title: "Backend Developer",
    description:
      "Design APIs, data models, and hiring workflows. Experience with Node.js, Express, and MongoDB is essential.",
    location: "Lahore",
    workplace: "onsite",
    jobType: "full-time",
    experienceLevel: "mid",
    salary: { min: 1800, max: 2800, currency: "USD" },
    skills: ["Node.js", "Express", "MongoDB", "JWT"],
    category: "development",
  },
  {
    title: "Full Stack Developer",
    description:
      "Ship features end to end — from job search filters to recruiter dashboards. Comfortable across Next.js and Express.",
    location: "Remote",
    workplace: "remote",
    jobType: "full-time",
    experienceLevel: "senior",
    salary: { min: 3000, max: 5000, currency: "USD" },
    skills: ["React", "Next.js", "Node.js", "MongoDB"],
    category: "development",
    remote: true,
  },
  {
    title: "Product Design Intern",
    description:
      "Support hiring product design: dashboards, empty states, and a polite visual language. Portfolio required.",
    location: "Islamabad",
    workplace: "hybrid",
    jobType: "internship",
    experienceLevel: "entry",
    salary: { min: 400, max: 700, currency: "USD" },
    skills: ["Figma", "UI", "Prototyping"],
    category: "design",
  },
  {
    title: "Talent Partner",
    description:
      "Partner with engineering managers to run structured hiring loops, write thoughtful outreach, and keep candidates informed.",
    location: "Dubai",
    workplace: "onsite",
    jobType: "full-time",
    experienceLevel: "junior",
    salary: { min: 2000, max: 3200, currency: "USD" },
    skills: ["Recruiting", "Communication", "ATS"],
    category: "human-resources",
  },
];

async function seed() {
  await connectDb();
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Notification.deleteMany({}),
    SavedJob.deleteMany({}),
  ]);

  const [admin, employer, seeker] = await User.create([
    {
      name: "Amina Shah",
      email: "admin@hirehub.dev",
      password: "Admin1234!",
      role: "admin",
      emailVerified: true,
      bio: "Platform steward for HireHub.",
      location: "Karachi",
    },
    {
      name: "Omar Farooq",
      email: "employer@hirehub.dev",
      password: "Employer1234!",
      role: "employer",
      emailVerified: true,
      bio: "Building thoughtful engineering teams.",
      location: "Dubai",
    },
    {
      name: "Azzu Rahman",
      email: "seeker@hirehub.dev",
      password: "Seeker1234!",
      role: "jobseeker",
      emailVerified: true,
      bio: "Frontend engineer who likes calm interfaces and clear systems.",
      location: "Lahore",
      skills: ["React", "Next.js", "Node.js", "MongoDB", "TypeScript"],
      phone: "+92 300 0000000",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      portfolio: "https://example.com",
      experience: [
        {
          title: "Frontend Engineer",
          company: "Northwind Studio",
          location: "Remote",
          startDate: "2023-01",
          current: true,
          description: "Shipped design systems and hiring dashboards.",
        },
      ],
      education: [
        {
          school: "NUST",
          degree: "BS",
          field: "Computer Science",
          startDate: "2018",
          endDate: "2022",
        },
      ],
    },
  ]);

  const company = await Company.create({
    name: "ABC Software",
    description: "A product studio that builds hiring tools with restraint and care.",
    website: "https://abcsoftware.example",
    industry: "Software",
    location: "Karachi",
    size: "51-200",
    foundedYear: 2016,
    owner: employer._id,
    verified: true,
  });

  const jobs = await Job.insertMany(
    jobsSeed.map((job, index) => ({
      ...job,
      company: company._id,
      employer: employer._id,
      status: index === jobsSeed.length - 1 ? "pending" : "approved",
      deadline: new Date(Date.now() + (30 + index) * 24 * 60 * 60 * 1000),
      views: 80 + index * 37,
    }))
  );

  await Application.create({
    job: jobs[0]._id,
    applicant: seeker._id,
    employer: employer._id,
    coverLetter: "I would be glad to help ABC Software refine its product interface.",
    resume: { url: "https://example.com/resume.pdf", publicId: "seed-resume" },
    status: "applied",
  });

  await Notification.create({
    user: employer._id,
    title: "New application",
    message: "Azzu Rahman applied for Frontend Developer.",
    type: "application",
    link: `/employer/jobs/${jobs[0]._id}/applicants`,
  });

  console.log("Seed complete");
  console.log("Admin     admin@hirehub.dev / Admin1234!");
  console.log("Employer  employer@hirehub.dev / Employer1234!");
  console.log("Seeker    seeker@hirehub.dev / Seeker1234!");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
