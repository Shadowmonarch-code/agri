"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { departments } from "@/data/departments";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function DepartmentsSection() {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  
  // Show first 12 departments
  const displayedDepartments = departments.slice(0, 12);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-agri-green/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-agri-lime/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            25+ Departments
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Explore All{" "}
            <span className="gradient-text">ICAR Departments</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From Agriculture to Veterinary Science - find comprehensive study
            resources for every ICAR discipline.
          </p>
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12"
        >
          {displayedDepartments.map((dept) => (
            <motion.div key={dept.id} variants={itemVariants}>
              <Link href={`/departments/${dept.slug}`}>
                <Card
                  className={cn(
                    "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card transition-all duration-300",
                    hoveredDept === dept.id && "border-primary/50 shadow-lg shadow-primary/10"
                  )}
                  onMouseEnter={() => setHoveredDept(dept.id)}
                  onMouseLeave={() => setHoveredDept(null)}
                >
                  <CardContent className="p-4 lg:p-6 flex flex-col items-center text-center">
                    {/* Icon with color accent */}
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110",
                        "bg-gradient-to-br shadow-md"
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${dept.color}20, ${dept.color}40)`,
                      }}
                    >
                      {dept.icon}
                    </div>

                    {/* Department Name */}
                    <h3 className="font-semibold text-sm lg:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>

                    {/* Subject Count */}
                    <p className="text-xs text-muted-foreground">
                      {dept.subjects.length} Subjects
                    </p>

                    {/* Hover indicator */}
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "rounded-b-xl"
                      )}
                      style={{
                        background: `linear-gradient(90deg, ${dept.color}, ${dept.color}80)`,
                      }}
                    />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
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
            <Link href="/departments">
              View All Departments
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

export default DepartmentsSection;
