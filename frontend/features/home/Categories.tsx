"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp } from "@/lib/motion";
import { POPULAR_CATEGORIES } from "@/lib/landing";

export function Categories() {
  const reduce = useReducedMotion();

  return (
    <section className="pb-20">
      <Container>
        <Reveal>
          <p className="text-xs tracking-[0.2em] text-primary uppercase">Browse</p>
          <h2 className="mt-2 font-display text-4xl">Popular categories</h2>
        </Reveal>
        <motion.div
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-64px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
          }}
        >
          {POPULAR_CATEGORIES.map((category) => (
            <motion.div
              key={category.value}
              variants={reduce ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : fadeUp}
            >
              <Link
                href={`/jobs?category=${category.value}`}
                className="hover-lift block h-full rounded-3xl border border-border bg-card px-5 py-6"
              >
                <p className="font-medium">{category.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">Explore open roles</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
