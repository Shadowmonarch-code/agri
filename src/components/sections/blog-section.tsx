"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
    role: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
  gradient: string;
}

interface BlogCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

const blogCategories: BlogCategory[] = [
  { id: "all", name: "All Posts", icon: "📰", count: 8, color: "bg-primary" },
  { id: "icar-news", name: "ICAR News", icon: "🏛️", count: 12, color: "bg-blue-500" },
  { id: "career-guidance", name: "Career Guidance", icon: "💼", count: 8, color: "bg-purple-500" },
  { id: "research-updates", name: "Research Updates", icon: "🔬", count: 15, color: "bg-orange-500" },
  { id: "scholarships", name: "Scholarships", icon: "🎓", count: 6, color: "bg-green-500" },
  { id: "exam-tips", name: "Exam Tips", icon: "📝", count: 10, color: "bg-red-500" },
  { id: "success-stories", name: "Success Stories", icon: "🏆", count: 7, color: "bg-yellow-500" },
];

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "ICAR AIEEA-UG 2025: Complete Syllabus Breakdown & Preparation Strategy",
    excerpt:
      "Get a comprehensive breakdown of the ICAR AIEEA-UG 2025 syllabus with subject-wise weightage, important topics, and expert-recommended preparation strategies to maximize your score.",
    category: "icar-news",
    author: {
      name: "Dr. Rajesh Kumar",
      avatar: "",
      initials: "RK",
      role: "ICAR Expert Faculty",
    },
    date: "Dec 15, 2024",
    readTime: "8 min read",
    featured: true,
    gradient: "from-green-600 to-emerald-700",
  },
  {
    id: "2",
    title: "Top 10 Scholarships for Agriculture Students in India - 2025 Edition",
    excerpt:
      "Explore the best scholarship opportunities available for agriculture students including ICAR scholarships, state government schemes, and private sector funding options.",
    category: "scholarships",
    author: {
      name: "Priya Sharma",
      avatar: "",
      initials: "PS",
      role: "Career Counselor",
    },
    date: "Dec 14, 2024",
    readTime: "6 min read",
    gradient: "from-blue-600 to-cyan-700",
  },
  {
    id: "3",
    title: "Understanding Plant Breeding & Genetics: Key Concepts for ICAR JRF",
    excerpt:
      "Master the fundamental concepts of plant breeding and genetics with this detailed guide covering Mendelian genetics, quantitative traits, and modern breeding techniques.",
    category: "exam-tips",
    author: {
      name: "Dr. Anita Patel",
      avatar: "",
      initials: "AP",
      role: "Genetics Professor",
    },
    date: "Dec 13, 2024",
    readTime: "10 min read",
    gradient: "from-purple-600 to-violet-700",
  },
  {
    id: "4",
    title: "How I Cleared ICAR JRF with AIR 23: Success Story of Priya Sharma",
    excerpt:
      "Read the inspiring journey of Priya Sharma who secured AIR 23 in ICAR JRF (Agronomy) in her first attempt. Learn her study strategies and time management tips.",
    category: "success-stories",
    author: {
      name: "Priya Sharma",
      avatar: "",
      initials: "PS",
      role: "JRF Qualified",
    },
    date: "Dec 12, 2024",
    readTime: "7 min read",
    gradient: "from-orange-600 to-red-700",
  },
  {
    id: "5",
    title: "Latest Research Developments in Sustainable Agriculture - December 2024",
    excerpt:
      "Stay updated with the latest breakthroughs in sustainable agriculture including precision farming techniques, organic farming innovations, and climate-resilient crop varieties.",
    category: "research-updates",
    author: {
      name: "Dr. Vikram Singh",
      avatar: "",
      initials: "VS",
      role: "Research Scientist",
    },
    date: "Dec 11, 2024",
    readTime: "9 min read",
    gradient: "from-teal-600 to-green-700",
  },
  {
    id: "6",
    title: "Career Opportunities After B.Sc Agriculture: Beyond Traditional Farming",
    excerpt:
      "Discover diverse career paths available after completing B.Sc Agriculture including agribusiness, food technology, agricultural banking, and emerging tech roles in agritech.",
    category: "career-guidance",
    author: {
      name: "Rahul Mehta",
      avatar: "",
      initials: "RM",
      role: "Industry Expert",
    },
    date: "Dec 10, 2024",
    readTime: "8 min read",
    gradient: "from-pink-600 to-rose-700",
  },
  {
    id: "7",
    title: "ICAR Announces New Guidelines for PG Admissions 2025-26 Session",
    excerpt:
      "The Indian Council of Agricultural Research has released updated guidelines for postgraduate admissions including changes in eligibility criteria, exam pattern, and counseling process.",
    category: "icar-news",
    author: {
      name: "Admin Team",
      avatar: "",
      initials: "AT",
      role: "AgriVerse Team",
    },
    date: "Dec 9, 2024",
    readTime: "5 min read",
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    id: "8",
    title: "Effective Time Management Strategies for ICAR Aspirants Working Full-Time",
    excerpt:
      "Balancing job preparation with full-time work? Learn proven time management strategies used by successful candidates who cracked ICAR exams while working.",
    category: "exam-tips",
    author: {
      name: "Ananya Gupta",
      avatar: "",
      initials: "AG",
      role: "Study Coach",
    },
    date: "Dec 8, 2024",
    readTime: "7 min read",
    gradient: "from-amber-600 to-orange-700",
  },
];

const categoryColors: Record<string, string> = {
  "icar-news": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "career-guidance":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "research-updates":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  scholarships:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  "exam-tips": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  "success-stories":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
};

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

export function BlogSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    if (activeCategory !== "all") {
      posts = posts.filter((post) => post.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [activeCategory, searchQuery]);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-agri-lime/5 rounded-full blur-3xl" />
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
            Knowledge Hub
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Latest from{" "}
            <span className="gradient-text">AgriVerse Blog</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, exam tips, research updates, and success stories from the world of agricultural education.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-xl mx-auto mb-10"
        >
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
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
            placeholder="Search articles, topics, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 rounded-xl border-border/50 bg-card focus:border-primary/50 h-12"
          />
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {blogCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                activeCategory === category.id
                  ? "text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeBlogCategory"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-70">({category.count})</span>
              </span>
            </button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {activeCategory === "all" && !searchQuery && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <Card className="group relative overflow-hidden card-hover border-border/50 bg-card/80 backdrop-blur-sm">
              {/* Gradient Background */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r -z-10",
                  featuredPost.gradient
                )}
                style={{
                  maskImage:
                    "linear-gradient(to right, black 0%, black 50%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, black 0%, black 50%, transparent 100%)",
                }}
              />

              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Featured Image Placeholder */}
                  <div
                    className={cn(
                      "lg:w-2/5 h-64 lg:h-auto min-h-[280px] bg-gradient-to-br flex items-center justify-center relative overflow-hidden",
                      featuredPost.gradient
                    )}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-center text-white p-6">
                      <span className="text-6xl mb-4 block">📰</span>
                      <span className="text-lg font-semibold">Featured Article</span>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium capitalize",
                          categoryColors[featuredPost.category]
                        )}
                      >
                        {blogCategories.find((c) => c.id === featuredPost.category)?.icon}{" "}
                        {blogCategories.find((c) => c.id === featuredPost.category)?.name}
                      </Badge>
                      <Badge className="bg-agri-gold text-white border-0">
                        ⭐ Featured
                      </Badge>
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {featuredPost.title}
                    </h3>

                    <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2 lg:line-clamp-3">
                      {featuredPost.excerpt}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                          <AvatarImage src={featuredPost.author.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                            {featuredPost.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{featuredPost.author.name}</p>
                          <p className="text-xs text-muted-foreground">{featuredPost.author.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-1">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          {regularPosts.slice(0, activeCategory === "all" && !searchQuery ? 8 : 8).map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card
                className={cn(
                  "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm h-full flex flex-col"
                )}
              >
                {/* Thumbnail Gradient Placeholder */}
                <div
                  className={cn(
                    "h-48 bg-gradient-to-br relative overflow-hidden flex items-center justify-center",
                    post.gradient
                  )}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="text-4xl relative z-10">
                    {blogCategories.find((c) => c.id === post.category)?.icon || "📄"}
                  </span>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-fit font-medium capitalize text-xs mb-3",
                      categoryColors[post.category]
                    )}
                  >
                    {blogCategories.find((c) => c.id === post.category)?.name || post.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {post.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium truncate max-w-[80px]">
                        {post.author.name.split(" ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <Link href="/blog">
              View All Articles
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

export default BlogSection;
