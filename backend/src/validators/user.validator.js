import { z } from "zod";

const experience = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

const education = z.object({
  school: z.string().min(2),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    headline: z.string().max(160).optional(),
    bio: z.string().max(1000).optional(),
    location: z.string().max(120).optional(),
    phone: z.string().max(30).optional(),
    linkedin: z.string().max(200).optional(),
    github: z.string().max(200).optional(),
    portfolio: z.string().max(200).optional(),
    skills: z.array(z.string().min(1)).optional(),
    experience: z.array(experience).optional(),
    education: z.array(education).optional(),
  }),
});

export const updateSkillsSchema = z.object({
  body: z.object({
    skills: z.array(z.string().min(1)).min(1),
  }),
});

export const updateAiSettingsSchema = z.object({
  body: z
    .object({
      ollamaBaseUrl: z
        .string()
        .max(200)
        .refine((value) => !value || /^https?:\/\/.+/i.test(value), "Enter a valid http(s) URL")
        .transform((value) => value.trim().replace(/\/$/, "")),
      ollamaModel: z.string().max(80).transform((value) => value.trim()),
    })
    .superRefine((value, ctx) => {
      if (value.ollamaBaseUrl && !value.ollamaModel) {
        ctx.addIssue({ code: "custom", path: ["ollamaModel"], message: "Enter a model name" });
      }
    }),
});
