export type Role = "jobseeker" | "employer" | "admin";
export type UserStatus = "active" | "suspended";
export type JobStatus = "draft" | "pending" | "approved" | "rejected" | "closed" | "expired";
export type ApplicationStatus = "applied" | "reviewing" | "shortlisted" | "interview" | "rejected" | "hired";
export type Workplace = "remote" | "onsite" | "hybrid";
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type ExperienceLevel = "entry" | "junior" | "mid" | "senior";

export type Media = {
  url?: string;
  publicId?: string;
  originalName?: string;
  format?: string;
  bytes?: number;
};

export type ResumeFile = Media & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Experience = {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

export type Education = {
  _id?: string;
  school: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type OtpPurpose = "verify-email" | "change-email" | "change-password" | "delete-account";

export type OtpChallenge = {
  needsVerification: boolean;
  email: string;
  purpose: OtpPurpose;
  otp?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified?: boolean;
  avatar?: Media;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  resume?: Media;
  resumes?: ResumeFile[];
  activeResumeId?: string;
  ollamaBaseUrl?: string;
  ollamaModel?: string;
  createdAt: string;
};

export type Company = {
  _id: string;
  name: string;
  slug?: string;
  logo?: Media;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
  foundedYear?: number;
  owner: string | User;
  verified?: boolean;
  createdAt: string;
};

export type Job = {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  company: Company | string;
  employer: User | string;
  location: string;
  workplace: Workplace;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary?: { min: number; max: number; currency?: string };
  skills: string[];
  category: string;
  deadline?: string;
  remote?: boolean;
  status: JobStatus;
  views?: number;
  matchScore?: number;
  createdAt: string;
};

export type Application = {
  _id: string;
  job: Job | string;
  applicant: User | string;
  employer: string | User;
  resume?: Media;
  coverLetter?: string;
  recruiterNote?: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "application" | "status" | "job" | "system";
  link?: string;
  read: boolean;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  statusCode: number;
};
