"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp } from "@/lib/motion";
import { jobService } from "@/services/job.service";
import { MOCK_FEATURED_JOBS } from "@/lib/landing";
import type { Job } from "@/types";

export function FeaturedJobs() {
  const reduce = useReducedMotion();
  const [jobs, setJobs] = useState<Job[]>(MOCK_FEATURED_JOBS);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    jobService
      .list({ limit: 8, sort: "newest" })
      .then((res) => {
        if (res.data.items.length) {
          setJobs(res.data.items);
          setFromApi(true);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="pb-20">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-primary uppercase">Open now</p>
            <h2 className="mt-2 font-display text-4xl">Featured jobs</h2>
            {!fromApi ? (
              <p className="mt-2 text-sm text-muted-foreground">Showing demo roles until approved jobs are available.</p>
            ) : null}
          </div>
          <Link href="/jobs">
            <Button variant="outline">View all jobs</Button>
          </Link>
        </Reveal>
        <motion.div
          className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-64px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
          }}
        >
          {jobs.slice(0, 6).map((job) => (
            <motion.div
              key={job._id}
              variants={
                reduce
                  ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
                  : fadeUp
              }
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
