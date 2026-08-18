"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden pt-14 pb-16 sm:pt-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs tracking-[0.28em] text-primary uppercase"
          >
            Find talent. Find opportunity.
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-xl font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl"
          >
            Find your next opportunity.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-lg text-lg text-muted-foreground"
          >
            HireHub connects job seekers and employers with a calm, modern hiring workspace — search, apply, and hire
            without the noise.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/jobs">
              <Button size="lg">Find Jobs</Button>
            </Link>
            <Link href="/for-employers">
              <Button size="lg" variant="secondary">
                Post a Job
              </Button>
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroVisual />
        </motion.div>
      </Container>
    </section>
  );
}
