"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  FileText,
  ClipboardList,
  Download,
  Star,
  Calendar,
  ArrowRight,
  Play,
  CheckCircle2,
  Award,
  Coins,
  Zap,
  ChevronRight,
  BarChart3,
  Brain,
  Lightbulb,
  BookMarked,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { departments } from "@/data/departments";
import { competitiveExams } from "@/data/exams";

// Types
interface DashboardStats {
  testsTaken: number;
  averageScore: number;
  studyHours: number;
  rank: number;
}

interface CourseProgress {
  id: string;
  title: string;
  department: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail?: string;
}

interface ActivityItem {
  id: string;
  type: "test" | "course" | "achievement" | "download" | "bookmark";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface ExamCountdown {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  color: string;
  icon: string;
}

// Mock data generators
const getDashboardStats = (): DashboardStats => ({
  testsTaken: 47,
  averageScore: 78.5,
  studyHours: 124,
  rank: 156,
});

const getEnrolledCourses = (): CourseProgress[] => [
  {
    id: "1",
    title: "Principles of Agronomy",
    department: "agriculture",
    progress: 72,
    totalLessons: 24,
    completedLessons: 17,
  },
  {
    id: "2",
    title: "Crop Physiology",
    department: "agriculture",
    progress: 45,
    totalLessons: 18,
    completedLessons: 8,
  },
  {
    id: "3",
    title: "Soil Science Fundamentals",
    department: "soil-science",
    progress: 90,
    totalLessons: 20,
    completedLessons: 18,
  },
];

const getRecentActivity = (): ActivityItem[] => [
  {
    id: "1",
    type: "test",
    title: "Completed Agronomy Quiz",
    description: "Scored 85% on Chapter 5 quiz",
    timestamp: "2 hours ago",
    icon: <ClipboardList className="w-4 h-4 text-agri-green" />,
  },
  {
    id: "2",
    type: "course",
    title: "Started New Lesson",
    description: "Irrigation Management - Module 3",
    timestamp: "5 hours ago",
    icon: <Play className="w-4 h-4 text-blue-500" />,
  },
  {
    id: "3",
    type: "achievement",
    title: "Earned Badge!",
    description: "7-Day Study Streak Champion",
    timestamp: "1 day ago",
    icon: <Award className="w-4 h-4 text-agri-gold" />,
  },
  {
    id: "4",
    type: "download",
    title: "Downloaded Material",
    description: "ICAR JRF Previous Papers (2020-2024)",
    timestamp: "2 days ago",
    icon: <Download className="w-4 h-4 text-purple-500" />,
  },
  {
    id: "5",
    type: "bookmark",
    title: "Bookmarked Resource",
    description: "Weed Management - Quick Guide PDF",
    timestamp: "3 days ago",
    icon: <Star className="w-4 h-4 text-agri-gold" />,
  },
];

const getExamCountdowns = (): ExamCountdown[] => [
  {
    id: "1",
    name: "ICAR JRF 2025",
    date: "June 15, 2025",
    daysLeft: 127,
    color: "#2E7D32",
    icon: "🎓",
  },
  {
    id: "2",
    name: "AIEEA UG 2025",
    date: "July 1, 2025",
    daysLeft: 143,
    color: "#E65100",
    icon: "🌾",
  },
  {
    id: "3",
    name: "CSIR NET Life Sciences",
    date: "August 10, 2025",
    daysLeft: 183,
    color: "#00695C",
    icon: "🧪",
  },
];

const getRecommendedMaterials = (departmentId?: string) => {
  const dept = departments.find((d) => d.id === departmentId);
  return [
    {
      id: "1",
      title: `${dept?.name || "Agriculture"} Complete Notes`,
      type: "Notes",
      downloads: "12.5K",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Previous Year Question Papers (2019-2024)",
      type: "Papers",
      downloads: "25K+",
      rating: 4.9,
    },
    {
      id: "3",
      title: "Quick Revision Formula Sheet",
      type: "Formula",
      downloads: "8.2K",
      rating: 4.7,
    },
  ];
};

// Weekly progress data for chart
const weeklyData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 85 },
  { day: "Sun", value: 55 },
];

export function UserDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");

  if (!user && !isLoading) {
    return null; // Don't render dashboard for unauthenticated users
  }

  // Show loading skeleton while checking auth
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = getDashboardStats();
  const courses = getEnrolledCourses();
  const activities = getRecentActivity();
  const examCountdowns = getExamCountdowns();
  const recommendedMaterials = getRecommendedMaterials(user.department);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get user initials
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-agri-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-agri-lime/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-agri-green via-agri-green-light to-agri-lime p-6 sm:p-8 text-white"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-3 border-white/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  {getGreeting()}, {user.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-white/80 text-sm sm:text-base">
                  Ready to continue your ICAR preparation journey?
                </p>
              </div>
            </div>

            {/* Streak & Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <Flame className="w-6 h-6 mx-auto mb-1 text-orange-300" />
                <p className="text-2xl font-bold">{user.streak}</p>
                <p className="text-xs text-white/70">Day Streak</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <Coins className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                <p className="text-2xl font-bold">{user.coins.toLocaleString()}</p>
                <p className="text-xs text-white/70">Coins</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm hidden sm:block">
                <Zap className="w-6 h-6 mx-auto mb-1 text-purple-300" />
                <p className="text-2xl font-bold">{(user.xp / 1000).toFixed(1)}K</p>
                <p className="text-xs text-white/70">XP</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="card-hover border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.testsTaken}</p>
              <p className="text-sm text-muted-foreground">Tests Taken</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5%
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8h
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.studyHours}h</p>
              <p className="text-sm text-muted-foreground">Study Hours</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +23
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">#{stats.rank}</p>
              <p className="text-sm text-muted-foreground">Your Rank</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-agri-green" />
                      Study Progress
                    </CardTitle>
                    <div className="flex bg-muted rounded-lg p-0.5">
                      <button
                        onClick={() => setActiveTab("week")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          activeTab === "week"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setActiveTab("month")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          activeTab === "month"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Month
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Simple bar chart visualization */}
                  <div className="flex items-end justify-between gap-2 h-40 mt-4">
                    {weeklyData.map((item, index) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${item.value}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`w-full rounded-t-md min-h-[8px] ${
                            item.value >= 80
                              ? "bg-agri-green"
                              : item.value >= 60
                              ? "bg-agri-lime"
                              : item.value >= 40
                              ? "bg-agri-gold"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-agri-green">70%</p>
                      <p className="text-xs text-muted-foreground">Avg. Completion</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-agri-green">14.2h</p>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-agri-green">Top 15%</p>
                      <p className="text-xs text-muted-foreground">Performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enrolled Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-agri-green" />
                      Enrolled Courses
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-agri-green hover:text-agri-green-light">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="group p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-agri-green to-agri-lime flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm group-hover:text-agri-green transition-colors truncate">
                            {course.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {departments.find((d) => d.id === course.department)?.name}
                          </p>
                          
                          <div className="mt-3 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {course.completedLessons}/{course.totalLessons} lessons
                              </span>
                              <span className="font-medium text-agri-green">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-1.5" />
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Brain, label: "Take Test", color: "bg-blue-500/10 text-blue-500" },
                { icon: BookOpen, label: "Browse Materials", color: "bg-agri-green/10 text-agri-green" },
                { icon: BookMarked, label: "My Notes", color: "bg-purple-500/10 text-purple-500" },
                { icon: Lightbulb, label: "Daily Quiz", color: "bg-amber-500/10 text-amber-500" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-center">{action.label}</p>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Activity & Exams */}
          <div className="space-y-6">
            {/* Upcoming Exams */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-agri-green" />
                    Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {examCountdowns.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-3 rounded-xl border hover:border-agri-green/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{exam.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{exam.name}</h4>
                          <p className="text-xs text-muted-foreground">{exam.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: exam.color }}>
                            {exam.daysLeft}
                          </p>
                          <p className="text-xs text-muted-foreground">days left</p>
                        </div>
                      </div>
                      
                      {/* Countdown bar */}
                      <div className="mt-2">
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.max(0, 100 - (exam.daysLeft / 200) * 100)}%`,
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: exam.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-agri-green" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-agri-green hover:text-agri-green-light text-xs">
                      See All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 4).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{activity.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-0.5">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Materials */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-agri-green" />
                    Recommended
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="group p-3 rounded-xl border hover:border-agri-green/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-agri-green/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-agri-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm group-hover:text-agri-green transition-colors line-clamp-2">
                            {material.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {material.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Download className="w-3 h-3" /> {material.downloads}
                            </span>
                            <span className="text-xs text-agri-gold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-current" /> {material.rating}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
