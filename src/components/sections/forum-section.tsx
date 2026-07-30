"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ForumCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  discussions: number;
  color: string;
  gradient: string;
}

interface Discussion {
  id: string;
  title: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  timeAgo: string;
  replies: number;
  views: number;
  status: "open" | "solved" | "closed";
}

interface Contributor {
  name: string;
  avatar: string;
  initials: string;
  contributions: number;
  badge: string;
}

const forumCategories: ForumCategory[] = [
  {
    id: "jrf-prep",
    name: "ICAR JRF Preparation",
    icon: "🎓",
    description: "Tips & strategies for ICAR JRF exam",
    discussions: 1250,
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "study-materials",
    name: "Study Material Requests",
    icon: "📚",
    description: "Request and share study resources",
    discussions: 890,
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "doubt-solving",
    name: "Doubt Solving",
    icon: "💡",
    description: "Get your doubts cleared by experts",
    discussions: 2340,
    color: "text-purple-600",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: "pyq-discussions",
    name: "PYQ Discussions",
    icon: "📝",
    description: "Discuss previous year questions",
    discussions: 1567,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "research-guidance",
    name: "Research Guidance",
    icon: "🔬",
    description: "PhD and research-related queries",
    discussions: 678,
    color: "text-teal-600",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "career-advice",
    name: "Career Advice",
    icon: "💼",
    description: "Career guidance and opportunities",
    discussions: 945,
    color: "text-pink-600",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "success-stories",
    name: "Success Stories",
    icon: "🏆",
    description: "Share and read success stories",
    discussions: 432,
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    id: "current-affairs",
    name: "Current Affairs",
    icon: "📰",
    description: "Daily current affairs updates",
    discussions: 1123,
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-600",
  },
];

const recentDiscussions: Discussion[] = [
  {
    id: "1",
    title: "What is the best strategy for preparing Agronomy for ICAR JRF in 3 months?",
    tags: ["ICAR-JRF", "Agronomy", "Strategy"],
    author: {
      name: "Rahul Verma",
      avatar: "",
      initials: "RV",
    },
    timeAgo: "2 hours ago",
    replies: 24,
    views: 456,
    status: "open",
  },
  {
    id: "2",
    title: "Can someone explain the concept of heterosis and its application in plant breeding?",
    tags: ["Genetics", "Plant-Breeding", "Concept"],
    author: {
      name: "Ananya Singh",
      avatar: "",
      initials: "AS",
    },
    timeAgo: "4 hours ago",
    replies: 18,
    views: 312,
    status: "solved",
  },
  {
    id: "3",
    title: "Looking for recommended books for Soil Science - ICAR JRF 2025",
    tags: ["Books", "Soil-Science", "Resources"],
    author: {
      name: "Priya Gupta",
      avatar: "",
      initials: "PG",
    },
    timeAgo: "6 hours ago",
    replies: 32,
    views: 589,
    status: "open",
  },
  {
    id: "4",
    title: "Solved! My approach to cracking Entomology section with 85% accuracy",
    tags: ["Entomology", "Tips", "Success"],
    author: {
      name: "Vikram Patel",
      avatar: "",
      initials: "VP",
    },
    timeAgo: "1 day ago",
    replies: 45,
    views: 892,
    status: "solved",
  },
  {
    id: "5",
    title: "Is it worth pursuing M.Sc from IARI vs State Agricultural University?",
    tags: ["Career", "M.Sc", "IARI"],
    author: {
      name: "Neha Sharma",
      avatar: "",
      initials: "NS",
    },
    timeAgo: "1 day ago",
    replies: 56,
    views: 1024,
    status: "open",
  },
  {
    id: "6",
    title: "[Closed] Admission cutoff trends analysis for AIEEA-UG 2024",
    tags: ["Admission", "Cutoff", "Analysis"],
    author: {
      name: "Admin Team",
      avatar: "",
      initials: "AT",
    },
    timeAgo: "2 days ago",
    replies: 67,
    views: 1456,
    status: "closed",
  },
];

const topContributors: Contributor[] = [
  {
    name: "Dr. Rajesh Kumar",
    avatar: "",
    initials: "RK",
    contributions: 1245,
    badge: "Expert Mentor",
  },
  {
    name: "Priya Sharma",
    avatar: "",
    initials: "PS",
    contributions: 876,
    badge: "Top Contributor",
  },
  {
    name: "Arjun Mehta",
    avatar: "",
    initials: "AM",
    contributions: 654,
    badge: "Helping Hand",
  },
  {
    name: "Sneha Reddy",
    avatar: "",
    initials: "SR",
    contributions: 543,
    badge: "Active Member",
  },
];

const statusConfig = {
  open: {
    label: "Open",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  solved: {
    label: "Solved",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  closed: {
    label: "Closed",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  },
};

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

export function ForumSection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-[450px] h-[450px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-[350px] h-[350px] bg-agri-lime/5 rounded-full blur-3xl" />
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
            Community Hub
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Community{" "}
            <span className="gradient-text">Discussion Forum</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with fellow aspirants, share knowledge, get your doubts resolved, and learn from the community.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-primary">9,225+</div>
                <div className="text-xs text-muted-foreground">Active Discussions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-green-600">8,450+</div>
                <div className="text-xs text-muted-foreground">Solutions Provided</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-purple-600">25K+</div>
                <div className="text-xs text-muted-foreground">Community Members</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Forum Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {forumCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Card
                className={cn(
                  "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm",
                  hoveredCategory === category.id && "border-primary/30"
                )}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Gradient accent on hover */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br -z-10",
                    category.gradient
                  )}
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, black 50%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 50%, transparent 100%)",
                  }}
                />

                <CardContent className="p-5 text-center">
                  {/* Icon */}
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3 text-2xl shadow-md transition-transform duration-300 group-hover:scale-110",
                      `bg-gradient-to-br ${category.gradient}`
                    )}
                  >
                    {category.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-white transition-colors line-clamp-1">
                    {category.name}
                  </h3>

                  {/* Discussions Count */}
                  <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors">
                    {category.discussions.toLocaleString()} discussions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Two Column Layout: Discussions + Contributors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Discussions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Recent Discussions
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/forum" className="text-primary">
                      View All
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentDiscussions.map((discussion, index) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Status Badge + Title */}
                          <div className="flex items-start gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium shrink-0 mt-0.5",
                                statusConfig[discussion.status].className
                              )}
                            >
                              {statusConfig[discussion.status].label}
                            </Badge>
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {discussion.title}
                            </h4>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {discussion.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs font-normal px-2 py-0.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={discussion.author.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                  {discussion.author.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {discussion.author.name} • {discussion.timeAgo}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {discussion.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {discussion.views}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Join Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg h-8 text-xs"
                        >
                          Join
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Contributors Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-agri-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Top Contributors
                </h3>

                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <motion.div
                      key={contributor.name}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 hover:border-primary/20 transition-all duration-200"
                    >
                      {/* Rank Badge */}
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                          <AvatarImage src={contributor.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {contributor.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                            index === 0
                              ? "bg-agri-gold"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-amber-700"
                              : "bg-muted-foreground"
                          )}
                        >
                          {index + 1}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{contributor.name}</h4>
                        <Badge variant="secondary" className="text-xs font-normal mt-0.5">
                          {contributor.badge}
                        </Badge>
                      </div>

                      {/* Contributions */}
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">
                          {contributor.contributions.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-muted-foreground">posts</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Ask Question CTA */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button
                    asChild
                    className="w-full btn-premium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 h-11"
                  >
                    <Link href="/forum/ask">
                      <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ask a Question
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Join Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="btn-premium bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Link href="/forum">
              Explore Full Forum
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

export default ForumSection;
