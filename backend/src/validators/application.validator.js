import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1),
    coverLetter: z.string().max(4000).optional(),
    resumeUrl: z.string().url().optional(),
    resumePublicId: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: z.enum(["applied", "reviewing", "shortlisted", "interview", "rejected", "hired"]),
    recruiterNote: z.string().max(2000).optional(),
  }),
});
