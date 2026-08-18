import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    description: z.string().max(3000).optional(),
    website: z.string().max(200).optional(),
    industry: z.string().optional(),
    location: z.string().optional(),
    size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  }),
});

export const updateCompanySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: createCompanySchema.shape.body.partial(),
});
