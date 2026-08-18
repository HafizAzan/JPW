import type { Metadata } from "next";
import { Hero } from "@/features/home/Hero";
import { HomeSearch } from "@/features/home/HomeSearch";
import { Categories } from "@/features/home/Categories";
import { FeaturedJobs } from "@/features/home/FeaturedJobs";
import { HowItWorks } from "@/features/home/HowItWorks";
import { EmployerCta } from "@/features/home/EmployerCta";
import { Stats } from "@/features/home/Stats";

export const metadata: Metadata = {
  title: "Find your next opportunity",
  description: "Search jobs, apply with a resume, and hire with a clear workflow on HireHub.",
};

export default function HomePage() {
  return (
    <div>
      <Hero />
      <HomeSearch />
      <Categories />
      <FeaturedJobs />
      <HowItWorks />
      <EmployerCta />
      <Stats />
    </div>
  );
}
