"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Lock,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  Search,
  FileText,
  Zap,
  Crown,
  Gift,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Timer,
  Target,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface TestSeries {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: string; // ICAR, State Exams, etc.
  totalTests: number;
  completedTests?: number;
  duration: number; // in minutes per test
  questionsPerTest: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  price: number;
  originalPrice?: number;
  isFree: boolean;
  isPremium: boolean;
  status: "available" | "upcoming" | "completed" | "enrolled";
  startDate?: Date;
  endDate?: Date;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  features: string[];
  instructor?: string;
  thumbnail?: string;
  progress?: number; // 0-100 for enrolled series
}

interface TestSeriesListProps {
  series?: TestSeries[];
  onEnroll?: (seriesId: string) => void;
  onStartTest?: (seriesId: string, testId: string) => void;
  onViewDetails?: (seriesId: string) => void;
}

// Sample Data
const sampleTestSeries: TestSeries[] = [
  {
    id: "ts-001",
    title: "ICAR AICE-JRF/SRF (PGS) Complete Test Series",
    description:
      "Comprehensive test series covering all subjects for ICAR PG entrance exam. Includes 25 full-length mock tests with detailed solutions and performance analytics.",
    subject: "All Subjects",
    category: "ICAR",
    totalTests: 25,
    completedTests: 0,
    duration: 180,
    questionsPerTest: 160,
    difficulty: "Mixed",
    price: 999,
    originalPrice: 1999,
    isFree: false,
    isPremium: true,
    status: "available",
    enrollmentCount: 12500,
    rating: 4.8,
    reviewCount: 2340,
    features: [
      "25 Full Mock Tests",
      "Detailed Solutions",
      "Performance Analytics",
      "All India Ranking",
      "Doubt Resolution",
      "PDF Downloads",
    ],
    instructor: "Dr. R.K. Sharma",
    progress: undefined,
  },
  {
    id: "ts-002",
    title: "Agronomy Subject-wise Practice Tests",
    description:
      "Master Agronomy with topic-wise tests covering all important concepts for competitive exams.",
    subject: "Agronomy",
    category: "Subject-wise",
    totalTests: 15,
    completedTests: 5,
    duration: 60,
    questionsPerTest: 50,
    difficulty: "Medium",
    price: 299,
    isFree: false,
    isPremium: false,
    status: "enrolled",
    enrollmentCount: 8900,
    rating: 4.6,
    reviewCount: 1567,
    features: [
      "15 Topic-wise Tests",
      "Instant Results",
      "Explanation for Each Q",
      "Bookmark Questions",
    ],
    progress: 33,
  },
  {
    id: "ts-003",
    title: "Free Daily Quiz Challenge - Week 1",
    description:
      "Start your preparation journey with free daily quizzes. One new quiz every day for a week!",
    subject: "Mixed",
    category: "Daily Quiz",
    totalTests: 7,
    duration: 10,
    questionsPerTest: 10,
    difficulty: "Easy",
    price: 0,
    isFree: true,
    isPremium: false,
    status: "available",
    enrollmentCount: 45000,
    rating: 4.9,
    reviewCount: 5678,
    features: [
      "7 Free Quizzes",
      "10 Questions Each",
      "Instant Feedback",
      "Streak Tracking",
      "Leaderboard",
    ],
  },
  {
    id: "ts-004",
    title: "Soil Science & Fertility Mastery Series",
    description:
      "Deep dive into Soil Science with advanced-level tests designed by subject matter experts.",
    subject: "Soil Science",
    category: "Subject-wise",
    totalTests: 20,
    duration: 90,
    questionsPerTest: 75,
    difficulty: "Hard",
    price: 499,
    originalPrice: 799,
    isFree: false,
    isPremium: true,
    status: "available",
    enrollmentCount: 5620,
    rating: 4.7,
    reviewCount: 892,
    features: [
      "20 Advanced Tests",
      "Previous Year Qs",
      "Concept Videos",
      "Expert Doubt Support",
    ],
    instructor: "Prof. S. Gupta",
  },
  {
    id: "ts-005",
    title: "Plant Pathology Quick Revision Pack",
    description:
      "Last-minute revision tests for Plant Pathology. Perfect for quick practice before exams.",
    subject: "Plant Pathology",
    category: "Revision",
    totalTests: 10,
    completedTests: 10,
    duration: 45,
    questionsPerTest: 40,
    difficulty: "Medium",
    price: 149,
    isFree: false,
    isPremium: false,
    status: "completed",
    enrollmentCount: 3200,
    rating: 4.5,
    reviewCount: 456,
    features: [
      "10 Quick Tests",
      "High Yield Topics",
      "Speed Practice Mode",
      "Performance Report",
    ],
    progress: 100,
  },
  {
    id: "ts-006",
    title: "ICAR 2025 Prelims Mega Mock Test",
    description:
      "The ultimate mock test based on latest pattern and syllabus. Experience real exam environment.",
    subject: "All Subjects",
    category: "Mock Test",
    totalTests: 1,
    duration: 180,
    questionsPerTest: 160,
    difficulty: "Mixed",
    price: 99,
    originalPrice: 199,
    isFree: false,
    isPremium: false,
    status: "upcoming",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    enrollmentCount: 15000,
    rating: 0,
    reviewCount: 0,
    features: [
      "Full Syllabus Coverage",
      "Latest Pattern",
      "All India Rank",
      "Detailed Analysis",
    ],
  },
  {
    id: "ts-007",
    title: "Entomology Fundamentals - Free Starter Pack",
    description:
      "Get started with Entomology basics through this free starter pack of 5 practice tests.",
    subject: "Entomology",
    category: "Starter",
    totalTests: 5,
    duration: 30,
    questionsPerTest: 25,
    difficulty: "Easy",
    price: 0,
    isFree: true,
    isPremium: false,
    status: "available",
    enrollmentCount: 28000,
    rating: 4.4,
    reviewCount: 1234,
    features: [
      "5 Free Tests",
      "Basic to Intermediate",
      "Visual Explanations",
      "Progress Tracking",
    ],
  },
  {
    id: "ts-008",
    title: "Agricultural Engineering Pro Series",
    description:
      "Comprehensive test series for Agricultural Engineering aspirants with numerical problem focus.",
    subject: "Agricultural Engineering",
    category: "Subject-wise",
    totalTests: 18,
    duration: 120,
    questionsPerTest: 80,
    difficulty: "Hard",
    price: 699,
    originalPrice: 1299,
    isFree: false,
    isPremium: true,
    status: "available",
    enrollmentCount: 3450,
    rating: 4.7,
    reviewCount: 567,
    features: [
      "18 Comprehensive Tests",
      "Numerical Focus",
      "Step-by-step Solutions",
      "Formula Sheets",
      "Calculator Practice",
    ],
    instructor: "Er. P. Kumar",
  },
];

// Difficulty Badge Color
const getDifficultyColor = (
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed"
) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "Mixed":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  }
};

// Status Badge Component
const StatusBadge: React.FC<{ status: TestSeries["status"] }> = ({ status }) => {
  const styles = {
    available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    enrolled: "bg-primary/10 text-primary border border-primary/20",
  };

  const labels = {
    available: "Available",
    upcoming: "Upcoming",
    completed: "Completed",
    enrolled: "Enrolled",
  };

  return (
    <Badge className={cn("font-medium", styles[status])}>{labels[status]}</Badge>
  );
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; count: number }> = ({
  rating,
  count,
}) => {
  if (rating === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{rating}</span>
      <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
    </div>
  );
};

// Test Series Card Component
const TestSeriesCard: React.FC<{
  series: TestSeries;
  onEnroll?: (seriesId: string) => void;
  onStartTest?: (seriesId: string, testId: string) => void;
  onViewDetails?: (seriesId: string) => void;
}> = ({ series, onEnroll, onStartTest, onViewDetails }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Header Gradient */}
      <div
        className={cn(
          "p-4 bg-gradient-to-r",
          series.isPremium
            ? "from-yellow-500/20 via-orange-500/10 to-transparent"
            : series.isFree
            ? "from-green-500/20 via-emerald-500/10 to-transparent"
            : "from-primary/10 via-primary/5 to-transparent"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={series.status} />
            {series.isFree && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                <Gift className="size-3 mr-1" />
                FREE
              </Badge>
            )}
            {series.isPremium && !series.isFree && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <Crown className="size-3 mr-1" />
                PREMIUM
              </Badge>
            )}
          </div>
          <Badge className={getDifficultyColor(series.difficulty)}>
            {series.difficulty}
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {series.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {series.description}
        </p>
      </div>

      <CardContent className="flex-1 py-4 space-y-4">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="size-4" />
            {series.totalTests} Tests
          </span>
          <span className="flex items-center gap-1">
            <Timer className="size-4" />
            {Math.floor(series.duration / 60)}h {(series.duration % 60)}m
          </span>
          <span className="flex items-center gap-1">
            <Target className="size-4" />
            {series.questionsPerTest} Qs/test
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-4" />
            {series.subject}
          </span>
        </div>

        {/* Rating */}
        <StarRating rating={series.rating} count={series.reviewCount} />

        {/* Features Preview */}
        <div className="flex flex-wrap gap-1.5">
          {series.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-xs"
            >
              ✓ {feature}
            </span>
          ))}
          {series.features.length > 3 && (
            <span className="text-xs text-muted-foreground self-center">
              +{series.features.length - 3} more
            </span>
          )}
        </div>

        {/* Progress Bar (for enrolled) */}
        {series.status === "enrolled" && series.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{series.progress}%</span>
            </div>
            <Progress value={series.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {series.completedTests || 0}/{series.totalTests} tests completed
            </p>
          </div>
        )}

        {/* Enrollment Count */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span>{series.enrollmentCount.toLocaleString()} enrolled</span>
        </div>

        {/* Upcoming Date */}
        {series.status === "upcoming" && series.startDate && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm">
            <Calendar className="size-4 shrink-0" />
            <span>Starts: {series.startDate.toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </span>
          </div>
        )}

        {/* Instructor */}
        {series.instructor && (
          <p className="text-xs text-muted-foreground">
            By <span className="font-medium text-foreground">{series.instructor}</span>
          </p>
        )}
      </CardContent>

      {/* Footer Actions */}
      <div className="px-6 pb-6 pt-2 border-t mt-auto">
        <div className="flex items-center justify-between gap-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {series.isFree ? (
              <span className="text-xl font-bold text-green-600">FREE</span>
            ) : (
              <>
                <span className="text-xl font-bold">₹{series.price}</span>
                {series.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{series.originalPrice}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action Button */}
          {series.status === "available" && !series.progress && (
            <Button onClick={() => onEnroll?.(series.id)} size="sm">
              {series.isFree ? (
                <>
                  <Sparkles className="size-4 mr-1" />
                  Start Free
                </>
              ) : (
                <>
                  Enroll Now
                  <ChevronRight className="size-4 ml-1" />
                </>
              )}
            </Button>
          )}

          {series.status === "enrolled" && (
            <Button
              onClick={() => onStartTest?.(series.id, "test-1")}
              size="sm"
            >
              <Play className="size-4 mr-1" />
              Continue
            </Button>
          )}

          {series.status === "completed" && (
            <Button variant="outline" size="sm" disabled>
              <CheckCircle2 className="size-4 mr-1" />
              Completed
            </Button>
          )}

          {series.status === "upcoming" && (
            <Button variant="outline" size="sm" disabled>
              <Lock className="size-4 mr-1" />
              Coming Soon
            </Button>
          )}
        </div>

        {/* View Details Link */}
        <button
          onClick={() => onViewDetails?.(series.id)}
          className="mt-3 w-full text-center text-sm text-primary hover:underline flex items-center justify-center gap-1"
        >
          View Details
          <ExternalLink className="size-3" />
        </button>
      </div>
    </Card>
  );
};

// Main Component
export function TestSeriesList({
  series: initialSeries,
  onEnroll,
  onStartTest,
  onViewDetails,
}: TestSeriesListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price-low" | "price-high" | "newest">("popular");

  const allSeries = initialSeries || sampleTestSeries;

  // Get unique subjects
  const subjects = ["all", ...new Set(allSeries.map((s) => s.subject))];

  // Filtered and sorted series
  const filteredSeries = useMemo(() => {
    let result = [...allSeries];

    // Tab filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "free":
          result = result.filter((s) => s.isFree);
          break;
        case "premium":
          result = result.filter((s) => s.isPremium);
          break;
        case "upcoming":
          result = result.filter((s) => s.status === "upcoming");
          break;
        case "my-tests":
          result = result.filter((s) => s.status === "enrolled" || s.status === "completed");
          break;
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.subject.toLowerCase().includes(query)
      );
    }

    // Subject filter
    if (subjectFilter !== "all") {
      result = result.filter((s) => s.subject === subjectFilter);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // For demo, just reverse
        result.reverse();
        break;
    }

    return result;
  }, [allSeries, activeTab, searchQuery, subjectFilter, sortBy]);

  // Stats
  const stats = {
    total: allSeries.length,
    free: allSeries.filter((s) => s.isFree).length,
    premium: allSeries.filter((s) => s.isPremium).length,
    upcoming: allSeries.filter((s) => s.status === "upcoming").length,
    enrolled: allSeries.filter((s) => s.status === "enrolled").length,
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Test Series</h1>
              <p className="text-muted-foreground">
                Comprehensive test packages to boost your preparation
              </p>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <Card className="py-3">
            <CardContent className="flex items-center gap-2 p-0">
              <FileText className="size-5 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-2 p-0">
              <Gift className="size-5 text-green-500" />
              <div>
                <p className="text-lg font-bold text-green-600">{stats.free}</p>
                <p className="text-xs text-muted-foreground">Free</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-2 p-0">
              <Crown className="size-5 text-yellow-500" />
              <div>
                <p className="text-lg font-bold text-yellow-600">{stats.premium}</p>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3">
            <CardContent className="flex items-center gap-2 p-0">
              <Calendar className="size-5 text-blue-500" />
              <div>
                <p className="text-lg font-bold text-blue-600">{stats.upcoming}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-3 col-span-2 sm:col-span-1">
            <CardContent className="flex items-center gap-2 p-0">
              <Zap className="size-5 text-primary" />
              <div>
                <p className="text-lg font-bold text-primary">{stats.enrolled}</p>
                <p className="text-xs text-muted-foreground">My Tests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="py-4 space-y-4">
            {/* Tab Filters */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger value="all" className="gap-1.5 py-2">
                  <FileText className="size-4 hidden sm:inline" />
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="free" className="gap-1.5 py-2">
                  <Gift className="size-4 hidden sm:inline" />
                  Free ({stats.free})
                </TabsTrigger>
                <TabsTrigger value="premium" className="gap-1.5 py-2">
                  <Crown className="size-4 hidden sm:inline" />
                  Premium ({stats.premium})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="gap-1.5 py-2">
                  <Calendar className="size-4 hidden sm:inline" />
                  Upcoming ({stats.upcoming})
                </TabsTrigger>
                <TabsTrigger value="my-tests" className="gap-1.5 py-2">
                  <TrendingUp className="size-4 hidden sm:inline" />
                  My Tests ({stats.enrolled})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search & Sort Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search test series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Subject Filter */}
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <Filter className="size-4 mr-2" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "all" ? "All Subjects" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredSeries.length}</strong> test series
          </p>
        </div>

        {/* Test Series Grid */}
        {filteredSeries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSeries.map((series) => (
              <TestSeriesCard
                key={series.id}
                series={series}
                onEnroll={onEnroll}
                onStartTest={onStartTest}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="py-16">
            <CardContent className="text-center">
              <AlertCircle className="size-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Test Series Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                  setSubjectFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More (for pagination in future) */}
        {filteredSeries.length > 0 && filteredSeries.length >= 8 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More
              <ChevronRight className="size-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestSeriesList;

// Export sample data for use in other components
export { sampleTestSeries };
export type { TestSeries };
