import mongoose from "mongoose";
import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadService } from "./upload.service.js";
import { parsePagination, paginated } from "../utils/pagination.js";
import { slugify } from "../utils/slug.js";

async function uniqueCompanySlug(name) {
  const base = slugify(name) || "company";
  let slug = base;
  let index = 1;
  while (await Company.exists({ slug })) {
    slug = `${base}-${index++}`;
  }
  return slug;
}

export const companyService = {
  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.search) filter.name = new RegExp(query.search, "i");
    if (query.industry) filter.industry = new RegExp(query.industry, "i");
    const [items, total] = await Promise.all([
      Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Company.countDocuments(filter),
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id) {
    const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
    const company = await Company.findOne(query).populate("owner", "name avatar");
    if (!company) throw new ApiError(404, "Company not found");
    const jobs = await Job.find({ company: company._id, status: "approved" })
      .sort({ createdAt: -1 })
      .limit(12);
    return { company, jobs };
  },

  async create(ownerId, payload) {
    const existing = await Company.findOne({ owner: ownerId });
    if (existing) throw new ApiError(409, "You already have a company profile");
    return Company.create({
      ...payload,
      slug: await uniqueCompanySlug(payload.name),
      owner: ownerId,
    });
  },

  async update(id, ownerId, payload, isAdmin = false) {
    const company = await Company.findById(id);
    if (!company) throw new ApiError(404, "Company not found");
    if (!isAdmin && String(company.owner) !== String(ownerId)) {
      throw new ApiError(403, "You can only edit your own company");
    }
    Object.assign(company, payload);
    await company.save();
    return company;
  },

  async remove(id, ownerId, isAdmin = false) {
    const company = await Company.findById(id);
    if (!company) throw new ApiError(404, "Company not found");
    if (!isAdmin && String(company.owner) !== String(ownerId)) {
      throw new ApiError(403, "You can only delete your own company");
    }
    if (company.logo?.publicId) await uploadService.destroy(company.logo.publicId);
    await Job.deleteMany({ company: id });
    await company.deleteOne();
    return { deleted: true };
  },

  async uploadLogo(id, ownerId, file) {
    const company = await Company.findById(id);
    if (!company) throw new ApiError(404, "Company not found");
    if (String(company.owner) !== String(ownerId)) {
      throw new ApiError(403, "You can only edit your own company");
    }
    if (company.logo?.publicId) await uploadService.destroy(company.logo.publicId);
    company.logo = await uploadService.uploadImage(file, "hirehub/logos");
    await company.save();
    return company;
  },

  async mine(ownerId) {
    return Company.findOne({ owner: ownerId });
  },
};
