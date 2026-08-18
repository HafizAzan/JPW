import { z } from "zod";

export const probeSchema = z.object({
  body: z.object({
    baseUrl: z
      .string()
      .min(8)
      .max(200)
      .refine((value) => /^https?:\/\/.+/i.test(value), "Enter a valid http(s) URL"),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().min(1).max(800),
        })
      )
      .min(1)
      .max(16),
  }),
});

export const draftJobSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    location: z.string().max(120).optional(),
    workplace: z.string().max(40).optional(),
    jobType: z.string().max(40).optional(),
    experienceLevel: z.string().max(40).optional(),
    category: z.string().max(80).optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const coverLetterSchema = z.object({
  body: z.object({
    jobId: z.string().min(8),
  }),
});
