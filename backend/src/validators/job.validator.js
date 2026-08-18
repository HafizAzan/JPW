import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(20),
    location: z.string().min(2),
    workplace: z.enum(["remote", "onsite", "hybrid"]).default("onsite"),
    jobType: z.enum(["full-time", "part-time", "contract", "internship"]).default("full-time"),
    experienceLevel: z.enum(["entry", "junior", "mid", "senior"]).default("mid"),
    salary: z
      .object({
        min: z.number().min(0).default(0),
        max: z.number().min(0).default(0),
        currency: z.string().default("USD"),
      })
      .optional(),
    skills: z.array(z.string().min(1)).default([]),
    responsibilities: z.array(z.string().min(1)).optional(),
    requirements: z.array(z.string().min(1)).optional(),
    category: z.string().min(2),
    deadline: z.string().datetime().or(z.string().min(4)).optional(),
    remote: z.boolean().optional(),
    status: z.enum(["draft", "pending"]).optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: createJobSchema.shape.body.partial(),
});

export const jobQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    location: z.string().optional(),
    type: z.string().optional(),
    workplace: z.string().optional(),
    experience: z.string().optional(),
    category: z.string().optional(),
    skills: z.string().optional(),
    minSalary: z.string().optional(),
    maxSalary: z.string().optional(),
    datePosted: z.string().optional(),
    sort: z.enum(["newest", "oldest", "salary-asc", "salary-desc"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
