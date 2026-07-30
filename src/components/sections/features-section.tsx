"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: "📚",
    title: "Comprehensive Study Material",
    description:
      "Access curated study notes, textbooks, and reference materials covering all ICAR syllabus topics with regular updates.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: "📝",
    title: "Previous Year Questions (PYQs)",
    description:
      "Practice with 10+ years of solved PYQs for all major exams including ICAR JRF, AIEEA, and more with detailed solutions.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: "🎯",
    title: "Mock Tests & Practice",
    description:
      "Take full-length mock tests simulating actual exam patterns. Get instant analysis and performance tracking.",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: "📹",
    title: "Video Lectures",
    description:
      "Learn from expert faculty through HD video lectures covering complex topics with visual explanations and animations.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: "🏆",
    title: "Expert Faculty Notes",
    description:
      "Study materials prepared by ICAR professors and subject matter experts with exam-focused content.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: "💬",
    title: "Community Discussion",
    description:
      "Connect with fellow aspirants, share doubts, get answers from experts, and participate in group study sessions.",
    gradient: "from-teal-500 to-green-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-agri-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-agri-lime/5 rounded-full blur-3xl" />
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
            Why Choose AgriVerse
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed in ICAR</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the resources and tools you need
            to crack any agricultural competitive examination.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={cn(
                  "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm"
                )}
              >
                {/* Gradient accent on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
                    feature.gradient
                  )}
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, black 0%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, transparent 100%)",
                  }}
                />

                <CardContent className="p-6 lg:p-8">
                  {/* Icon */}
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br text-white text-2xl mb-5 shadow-lg",
                      feature.gradient
                    )}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                    Learn more
                    <svg
                      className="w-4 h-4"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
