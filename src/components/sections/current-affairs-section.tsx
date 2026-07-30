"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  category: string;
  headline: string;
  summary: string;
  source: string;
  date: string;
  featured?: boolean;
  icon: string;
}

interface FilterTab {
  id: string;
  label: string;
  count: number;
}

interface MonthArchive {
  month: string;
  year: string;
  count: number;
}

const filterTabs: FilterTab[] = [
  { id: "all", label: "All", count: 24 },
  { id: "agriculture", label: "Agriculture", count: 8 },
  { id: "icar", label: "ICAR", count: 5 },
  { id: "science-tech", label: "Science & Tech", count: 6 },
  { id: "policy", label: "Policy", count: 3 },
  { id: "environment", label: "Environment", count: 2 },
];

const monthArchives: MonthArchive[] = [
  { month: "December", year: "2024", count: 24 },
  { month: "November", year: "2024", count: 31 },
  { month: "October", year: "2024", count: 28 },
  { month: "September", year: "2024", count: 26 },
  { month: "August", year: "2024", count: 29 },
  { month: "July", year: "2024", count: 27 },
];

const newsItems: NewsItem[] = [
  {
    id: "1",
    category: "agriculture",
    headline:
      "Government Launches PM-KISAN 2.0 with Enhanced Direct Benefit Transfer for Farmers",
    summary:
      "The Union Cabinet has approved an upgraded version of PM-KISAN scheme with increased financial assistance of ₹12,000 per annum to small and marginal farmers, along with additional crop insurance benefits.",
    source: "PIB Delhi",
    date: "Dec 15, 2024",
    featured: true,
    icon: "🌾",
  },
  {
    id: "2",
    category: "icar",
    headline:
      "ICAR Announces New Research Priorities for 2025-30 Focusing on Climate-Resilient Crops",
    summary:
      "Indian Council of Agricultural Research has unveiled its strategic research roadmap emphasizing development of drought-resistant varieties, bio-fortified crops, and sustainable farming practices.",
    source: "ICAR Official",
    date: "Dec 14, 2024",
    icon: "🔬",
  },
  {
    id: "3",
    category: "science-tech",
    headline:
      "Breakthrough in CRISPR Technology Enables Precision Gene Editing in Major Indian Crops",
    summary:
      "Scientists at IARI have successfully demonstrated CRISPR-Cas9 gene editing technology for developing disease-resistant varieties of rice, wheat, and pulses with enhanced nutritional content.",
    source: "Science India",
    date: "Dec 14, 2024",
    icon: "🧬",
  },
  {
    id: "4",
    category: "policy",
    headline:
      "New National Agriculture Policy 2024 Aims to Double Farmers' Income by 2027",
    summary:
      "The Ministry of Agriculture has released a comprehensive policy framework focusing on crop diversification, value addition, market linkages, and digital agriculture initiatives.",
    source: "Agri Policy Watch",
    date: "Dec 13, 2024",
    icon: "📋",
  },
  {
    id: "5",
    category: "agriculture",
    headline:
      "Record Wheat Production Expected in Rabi Season Despite El Niño Concerns",
    summary:
      "Agricultural experts predict a bumper wheat harvest of 115 MT this rabi season due to favorable weather conditions in major growing regions and improved irrigation coverage.",
    source: "Farmers Today",
    date: "Dec 13, 2024",
    icon: "🌾",
  },
  {
    id: "6",
    category: "environment",
    headline:
      "India Commits to 45% Reduction in Agricultural Emissions by 2030 at COP30",
    summary:
      "At the global climate summit, India pledged significant reductions in agricultural greenhouse gas emissions through promotion of organic farming, renewable energy in farming, and carbon sequestration.",
    source: "Environment Daily",
    date: "Dec 12, 2024",
    icon: "🌍",
  },
  {
    id: "7",
    category: "science-tech",
    headline:
      "AI-Powered Crop Disease Detection System Launched for Real-Time Farm Monitoring",
    summary:
      "ICAR-IIT Delhi collaboration has developed an AI-based mobile application that can detect over 50 crop diseases using smartphone cameras with 95% accuracy.",
    source: "Tech Agri",
    date: "Dec 12, 2024",
    icon: "🤖",
  },
  {
    id: "8",
    category: "icar",
    headline:
      "ICAR JRF 2025 Exam Pattern Revised: New Subject Combinations Introduced",
    summary:
      "The ICAR examination cell has announced changes to the JRF examination pattern including new subject combinations, updated syllabus, and computer-based test format modifications.",
    source: "ICAR Exam Cell",
    date: "Dec 11, 2024",
    icon: "📝",
  },
];

const categoryConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  agriculture: {
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    label: "🌾 Agriculture",
  },
  icar: {
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    label: "🏛️ ICAR",
  },
  "science-tech": {
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
    label: "🔬 Science & Tech",
  },
  policy: {
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
    label: "📋 Policy",
  },
  environment: {
    color: "text-teal-700 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800",
    label: "🌍 Environment",
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

export function CurrentAffairsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("December 2024");

  const filteredNews = useMemo(() => {
    if (activeFilter === "all") return newsItems;
    return newsItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const featuredNews = newsItems.find((item) => item.featured);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-agri-lime/5 rounded-full blur-3xl" />
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
            Stay Updated
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Daily{" "}
            <span className="gradient-text">Current Affairs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated daily current affairs for ICAR, agricultural competitive exams, and general awareness. Updated every morning.
          </p>

          {/* Date Picker / Current Date Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 mt-6 px-5 py-3 rounded-xl bg-card border border-border/50 shadow-sm"
          >
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <Badge className="bg-primary/10 text-primary border-0">Today&apos;s Edition</Badge>
          </motion.div>
        </motion.div>

        {/* Featured News Card */}
        {featuredNews && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-10"
          >
            <Card className="group relative overflow-hidden card-hover border-border/50 bg-card/80 backdrop-blur-sm">
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-agri-lime to-primary" />

              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Featured Image Area */}
                  <div className="md:w-2/5 h-56 md:h-auto bg-gradient-to-br from-primary via-agri-green-light to-agri-lime relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 text-center p-6">
                      <span className="text-7xl block mb-3">{featuredNews.icon}</span>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                        ⭐ Featured Story
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-white/10 rounded-full" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 border-2 border-white/10 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium capitalize",
                          categoryConfig[featuredNews.category]?.bgColor,
                          categoryConfig[featuredNews.category]?.color
                        )}
                      >
                        {categoryConfig[featuredNews.category]?.label || featuredNews.category}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
                        🔥 Trending
                      </Badge>
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                      {featuredNews.headline}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-2 lg:line-clamp-3">
                      {featuredNews.summary}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                        Source: {featuredNews.source}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{featuredNews.date}</span>
                        <Button variant="ghost" size="sm" className="text-primary font-medium">
                          Read Full Article
                          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* News List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-3"
          >
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeFilter === tab.id
                      ? "text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {activeFilter === tab.id && (
                    <motion.div
                      layoutId="activeNewsFilter"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab.label} ({tab.count})
                  </span>
                </button>
              ))}
            </div>

            {/* News Items List */}
            <div className="space-y-4">
              {filteredNews.map((news, index) => (
                <motion.div key={news.id} variants={itemVariants}>
                  <Card
                    className={cn(
                      "group relative overflow-hidden card-hover cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm",
                      news.featured && "ring-2 ring-primary/20"
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-agri-lime/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                          {news.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-medium capitalize text-xs shrink-0",
                                categoryConfig[news.category]?.bgColor,
                                categoryConfig[news.category]?.color
                              )}
                            >
                              {categoryConfig[news.category]?.label || news.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {news.date}
                            </span>
                          </div>

                          <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {news.headline}
                          </h4>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {news.summary}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                              </svg>
                              {news.source}
                            </span>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary h-7 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Read More →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Monthly Archive Card */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Monthly Archive
                </h3>

                <div className="space-y-2">
                  {monthArchives.map((archive) => (
                    <button
                      key={`${archive.month}-${archive.year}`}
                      onClick={() => setSelectedMonth(`${archive.month} ${archive.year}`)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                        selectedMonth === `${archive.month} ${archive.year}`
                          ? "bg-primary text-white shadow-md"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>{archive.month} {archive.year}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          selectedMonth === `${archive.month} ${archive.year}`
                            ? "bg-white/20 text-white border-0"
                            : ""
                        )}
                      >
                        {archive.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Download PDF Card */}
            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-agri-lime/5 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-2xl mb-3">
                    📄
                  </div>
                  <h3 className="font-bold">Monthly Compilation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download all current affairs as PDF
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full btn-premium bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 h-11"
                >
                  <Link href="/current-affairs/download?month=december-2024">
                    <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download PDF
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  ✨ Includes MCQs & Summary Notes
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-agri-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  This Month&apos;s Stats
                </h3>

                <div className="space-y-3">
                  {[
                    { label: "Total Articles", value: "24", icon: "📰" },
                    { label: "MCQs Added", value: "150+", icon: "❓" },
                    { label: "Important for Exams", value: "18", icon: "⭐" },
                    { label: "Video Explainers", value: "8", icon: "🎥" },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-background/50"
                    >
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{stat.icon}</span>
                        {stat.label}
                      </span>
                      <span className="font-bold text-sm text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="btn-premium bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Link href="/current-affairs">
              View All Current Affairs
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

export default CurrentAffairsSection;
