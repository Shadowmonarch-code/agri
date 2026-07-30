"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { competitiveExams } from "@/data/exams";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExamCategory = "popular" | "pg" | "research" | "net";

interface ExamTab {
  id: ExamCategory;
  label: string;
  description: string;
}

const tabs: ExamTab[] = [
  {
    id: "popular",
    label: "Popular",
    description: "Most sought-after exams",
  },
  {
    id: "pg",
    label: "PG Entrance",
    description: "Postgraduate admissions",
  },
  {
    id: "research",
    label: "Research",
    description: "JRF/SRF fellowships",
  },
  {
    id: "net",
    label: "NET",
    description: "Eligibility tests",
  },
];

const getExamsByCategory = (category: ExamCategory) => {
  switch (category) {
    case "popular":
      return competitiveExams.filter((exam) => exam.popular);
    case "pg":
      return competitiveExams.filter(
        (exam) =>
          ["icar-jrf", "icar-pg", "aieea", "iit-jam", "cuet-pg"].includes(exam.id)
      );
    case "research":
      return competitiveExams.filter(
        (exam) =>
          ["icar-jrf", "icar-srf", "gate-bt", "gate-ls", "dbt-bet"].includes(
            exam.id
          )
      );
    case "net":
      return competitiveExams.filter(
        (exam) =>
          ["csir-net", "ugc-net", "ars-net", "net-ls"].includes(exam.id)
      );
    default:
      return competitiveExams.filter((exam) => exam.popular);
  }
};

const difficultyColors = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  Medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  Hard: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  "Very Hard":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
};

export function ExamsSection() {
  const [activeTab, setActiveTab] = useState<ExamCategory>("popular");
  const [hoveredExam, setHoveredExam] = useState<string | null>(null);

  const filteredExams = useMemo(() => getExamsByCategory(activeTab), [activeTab]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Exam Preparation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Competitive{" "}
            <span className="gradient-text">Exam Preparation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive preparation resources for all major agricultural and
            life sciences competitive examinations.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-primary"
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          {tabs.find((t) => t.id === activeTab)?.description}
        </motion.p>

        {/* Exam Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredExams.map((exam) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/exams/${exam.slug}`}>
                  <Card
                    className={cn(
                      "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm h-full",
                      hoveredExam === exam.id && "border-primary/30 shadow-lg shadow-primary/10"
                    )}
                    onMouseEnter={() => setHoveredExam(exam.id)}
                    onMouseLeave={() => setHoveredExam(null)}
                  >
                    {/* Color accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{
                        background: `linear-gradient(90deg, ${exam.color}, ${exam.color}80)`,
                      }}
                    />

                    <CardContent className="p-6">
                      {/* Header with icon and badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md",
                            "transition-transform duration-300 group-hover:scale-110"
                          )}
                          style={{
                            background: `linear-gradient(135deg, ${exam.color}15, ${exam.color}30)`,
                          }}
                        >
                          {exam.icon}
                        </div>

                        <div className="flex flex-col gap-1.5 items-end">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-semibold capitalize",
                              difficultyColors[exam.difficulty]
                            )}
                          >
                            {exam.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {exam.duration}
                          </span>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                        {exam.fullName}
                      </p>

                      {/* Eligibility Summary */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {exam.eligibility}
                      </p>

                      {/* Features Preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exam.features.slice(0, 2).map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {feature.split(" ")[0]}...
                          </Badge>
                        ))}
                        {exam.features.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            +{exam.features.length - 2} more
                          </Badge>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-sm font-medium text-primary">
                          {exam.marks} Marks
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          Explore
                          <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Explore All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="btn-premium bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Link href="/exams">
              Explore All Exams
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default ExamsSection;
