"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MaterialCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  count: number;
  gradient: string;
  bgColor: string;
}

const materialCategories: MaterialCategory[] = [
  {
    id: "books",
    icon: "📚",
    title: "Text Books",
    description: "ICAR recommended textbooks and reference materials",
    count: 1250,
    gradient: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "notes",
    icon: "📝",
    title: "Study Notes",
    description: "Concise notes prepared by expert faculty members",
    count: 3450,
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    id: "pyqs",
    icon: "📋",
    title: "PYQs & Solutions",
    description: "Previous year questions with detailed solutions",
    count: 8900,
    gradient: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: "practicals",
    icon: "🔬",
    title: "Practical Manuals",
    description: "Lab manuals and practical guides for all subjects",
    count: 680,
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: "question-banks",
    icon: "❓",
    title: "Question Banks",
    description: "Topic-wise question collections for practice",
    count: 5200,
    gradient: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    id: "videos",
    icon: "🎥",
    title: "Video Lectures",
    description: "HD video lectures by experienced faculty",
    count: 1200,
    gradient: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function MaterialsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredCategories =
    searchQuery || activeFilter !== "all"
      ? materialCategories.filter((cat) => {
          if (searchQuery) {
            return (
              cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cat.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
          }
          return true;
        })
      : materialCategories;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-agri-lime/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
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
            20,000+ Resources
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Study{" "}
            <span className="gradient-text">Materials Library</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access a vast collection of study materials curated by experts for
            your ICAR exam preparation.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10"
        >
          {/* Search Input */}
          <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="search"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-xl border-border/50 bg-card focus:border-primary/50 h-12"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["all", "free", "premium", "new"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200",
                  activeFilter === filter
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-card border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Material Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={`/materials/${category.id}`}>
                <Card
                  className={cn(
                    "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card h-full"
                  )}
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br -z-10",
                      category.gradient
                    )}
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, black 60%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 60%, transparent 100%)",
                    }}
                  />

                  <CardContent className="p-6">
                    {/* Header with Icon and Count */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                          category.bgColor
                        )}
                      >
                        {category.icon}
                      </div>
                      <Badge
                        variant="secondary"
                        className="font-semibold text-sm bg-background/80 backdrop-blur-sm"
                      >
                        {category.count.toLocaleString()}+
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 group-hover:text-white/80 transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* Action Link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:text-white transition-colors duration-300">
                      Browse Resources
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
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Total Resources", value: "20K+" },
            { label: "Free Materials", value: "8K+" },
            { label: "Premium Content", value: "12K+" },
            { label: "Updated Daily", value: "100+" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* View All CTA */}
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
            <Link href="/materials">
              Explore Full Library
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

export default MaterialsSection;
