"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  ClipboardList,
  TrendingUp,
  Clock,
  Download,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  PlusCircle,
  Send,
  BarChart3,
  BookOpen,
  Video,
  FileQuestion,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  UserPlus,
  Calendar,
  Activity,
  GraduationCap,
  Award,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Types
interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

interface ActivityItem {
  id: string;
  type: "upload" | "register" | "test" | "download" | "approval" | "alert";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  department: string;
  joinDate: string;
  status: "active" | "inactive" | "pending" | "banned";
  testsTaken: number;
}

interface PendingApproval {
  id: string;
  title: string;
  type: "book" | "notes" | "video" | "pyq";
  uploadedBy: string;
  department: string;
  uploadedAt: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
}

// Mock Data
const statsCards: StatCard[] = [
  {
    title: "Total Students",
    value: "24,589",
    change: 12.5,
    changeLabel: "vs last month",
    icon: Users,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Study Materials",
    value: "1,847",
    change: 8.2,
    changeLabel: "new this week",
    icon: FileText,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Active Tests",
    value: "34",
    change: -2.4,
    changeLabel: "vs last week",
    icon: ClipboardList,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Downloads Today",
    value: "1,234",
    change: 18.7,
    changeLabel: "vs yesterday",
    icon: Download,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
];

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    type: "register",
    title: "New student registered",
    description: "Priya Sharma joined Agriculture Department",
    timestamp: "2 minutes ago",
    user: { name: "Priya Sharma" },
  },
  {
    id: "2",
    type: "upload",
    title: "New material uploaded",
    description: "ICAR AIEEA Physics Notes - Unit 5",
    timestamp: "15 minutes ago",
    user: { name: "Dr. Ramesh Kumar" },
  },
  {
    id: "3",
    type: "test",
    title: "Test completed by 45 students",
    description: "Daily Quiz #47 - General Agriculture",
    timestamp: "32 minutes ago",
  },
  {
    id: "4",
    type: "approval",
    title: "Material pending approval",
    description: "Organic Chemistry PYQs (2010-2024)",
    timestamp: "1 hour ago",
    user: { name: "Prof. Mehta" },
  },
  {
    id: "5",
    type: "download",
    title: "Popular download spike",
    description: "ICAR Syllabus PDF - 200+ downloads today",
    timestamp: "2 hours ago",
  },
  {
    id: "6",
    type: "alert",
    title: "Server load warning",
    description: "CPU usage at 85% during peak hours",
    timestamp: "3 hours ago",
  },
];

const recentUsers: RecentUser[] = [
  {
    id: "1",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    department: "Agronomy",
    joinDate: "2024-01-15",
    status: "active",
    testsTaken: 12,
  },
  {
    id: "2",
    name: "Anita Patel",
    email: "anita.p@email.com",
    department: "Horticulture",
    joinDate: "2024-01-14",
    status: "active",
    testsTaken: 8,
  },
  {
    id: "3",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    department: "Plant Pathology",
    joinDate: "2024-01-13",
    status: "pending",
    testsTaken: 0,
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    department: "Soil Science",
    joinDate: "2024-01-12",
    status: "active",
    testsTaken: 15,
  },
  {
    id: "5",
    name: "Arjun Reddy",
    email: "arjun.reddy@email.com",
    department: "Entomology",
    joinDate: "2024-01-11",
    status: "inactive",
    testsTaken: 3,
  },
];

const pendingApprovals: PendingApproval[] = [
  {
    id: "1",
    title: "ICAR AIEEA Chemistry Complete Notes",
    type: "notes",
    uploadedBy: "Dr. Suresh Patel",
    department: "Chemistry",
    uploadedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Agriculture Statistics 2024 Edition",
    type: "book",
    uploadedBy: "Prof. Kavita Rao",
    department: "Statistics",
    uploadedAt: "4 hours ago",
  },
  {
    id: "3",
    title: "Genetics & Plant Breeding Lecture Series",
    type: "video",
    uploadedBy: "Dr. Amit Joshi",
    department: "Genetics",
    uploadedAt: "6 hours ago",
  },
  {
    id: "4",
    title: "ICAR PG Botany PYQ (2015-2023)",
    type: "pyq",
    uploadedBy: "Neha Desai",
    department: "Botany",
    uploadedAt: "8 hours ago",
  },
];

// Chart Data (for visual representation)
const registrationData: ChartDataPoint[] = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 1800 },
  { label: "Mar", value: 2400 },
  { label: "Apr", value: 2100 },
  { label: "May", value: 2800 },
  { label: "Jun", value: 3200 },
  { label: "Jul", value: 2900 },
  { label: "Aug", value: 3500 },
  { label: "Sep", value: 3100 },
  { label: "Oct", value: 3800 },
  { label: "Nov", value: 4200 },
  { label: "Dec", value: 4500 },
];

const materialsByCategory = [
  { label: "Books", value: 420, color: "#2E7D32", percentage: 28 },
  { label: "Notes", value: 680, color: "#43A047", percentage: 36 },
  { label: "PYQs", value: 350, color: "#8BC34A", percentage: 19 },
  { label: "Videos", value: 245, color: "#10B981", percentage: 13 },
  { label: "Q Banks", value: 152, color: "#F59E0B", percentage: 8 },
];

const popularSubjects = [
  { subject: "General Agriculture", count: 1240, percentage: 100 },
  { subject: "Agronomy", count: 980, percentage: 79 },
  { subject: "Horticulture", count: 850, percentage: 69 },
  { subject: "Plant Breeding", count: 720, percentage: 58 },
  { subject: "Soil Science", count: 650, percentage: 52 },
  { subject: "Entomology", count: 540, percentage: 44 },
];

// Animation variants
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
  visible: { opacity: 1, y: 0 },
};

export function AdminDashboard() {
  const [isLoading] = useState(false);

  // Get activity icon based on type
  const getActivityIcon = (type: ActivityItem["type"]) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "register":
        return <UserPlus className={iconClass} />;
      case "upload":
        return <Upload className={iconClass} />;
      case "test":
        return <ClipboardList className={iconClass} />;
      case "download":
        return <Download className={iconClass} />;
      case "approval":
        return <AlertCircle className={iconClass} />;
      case "alert":
        return <AlertCircle className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

  // Get activity icon background color
  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "register":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "upload":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "test":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case "download":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
      case "approval":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "alert":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: RecentUser["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400">Pending</Badge>;
      case "banned":
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return null;
    }
  };

  // Get material type badge
  const getTypeBadge = (type: PendingApproval["type"]) => {
    const config = {
      book: { label: "Book", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      notes: { label: "Notes", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
      video: { label: "Video", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
      pyq: { label: "PYQ", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    };
    const c = config[type];
    return <Badge className={c.class}>{c.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Cards Row */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                      <span
                        className={cn(
                          "flex items-center text-xs font-medium",
                          stat.change > 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {stat.change > 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.changeLabel}</p>
                  </div>
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      stat.bgColor
                    )}
                  >
                    <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
                  </div>
                </div>

                {/* Mini progress bar for visual interest */}
                <div className="mt-4">
                  <Progress
                    value={Math.min(100, Math.abs(stat.change) * 5)}
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <Link href="/admin/materials?action=upload">
                  <Upload className="h-4 w-4" />
                  Upload Material
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/tests?action=create">
                  <PlusCircle className="h-4 w-4" />
                  Create Test
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/notifications?action=new">
                  <Send className="h-4 w-4" />
                  Send Notification
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/analytics">
                  <BarChart3 className="h-4 w-4" />
                  View Reports
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Left Column - Charts & Activity */}
        <div className="space-y-6 lg:col-span-4">
          {/* Registration Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">User Registrations</CardTitle>
                    <CardDescription>Monthly registration trends</CardDescription>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +18.5%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4 h-[250px] flex items-end justify-between gap-1 px-2">
                  {registrationData.map((data, index) => (
                    <div key={data.label} className="flex flex-col items-center gap-2 flex-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.value / 5000) * 100}%` }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-primary to-agri-lime rounded-t-md cursor-pointer hover:opacity-80 transition-opacity relative group"
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border shadow-md rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {data.value.toLocaleString()}
                        </span>
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{data.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Materials by Category & Popular Subjects */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Donut-like representation for materials */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Materials by Category</CardTitle>
                  <CardDescription>Distribution of study materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-4">
                    {materialsByCategory.map((category, index) => (
                      <div key={category.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {category.value} ({category.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Visual donut representation */}
                  <div className="mt-6 flex justify-center">
                    <div className="relative h-32 w-32">
                      <svg viewBox="0 0 36 36" className="h-32 w-32 transform -rotate-90">
                        {materialsByCategory.reduce((acc, category, index) => {
                          const offset = acc.offset;
                          const dashArray = `${category.percentage} ${100 - category.percentage}`;
                          const newOffset = offset - category.percentage;
                          
                          acc.elements.push(
                            <circle
                              key={category.label}
                              cx="18"
                              cy="18"
                              r="14"
                              fill="none"
                              stroke={category.color}
                              strokeWidth="4"
                              strokeDasharray={dashArray}
                              strokeDashoffset={offset}
                              className="transition-all duration-500"
                              style={{ opacity: 0.8 }}
                            />
                          );
                          acc.offset = newOffset;
                          return acc;
                        }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">1,847</span>
                        <span className="text-xs text-muted-foreground">Total</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Subjects Horizontal Bars */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Popular Subjects</CardTitle>
                  <CardDescription>Most accessed subjects this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-4">
                    {popularSubjects.map((subject, index) => (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate max-w-[140px]">{subject.subject}</span>
                          <span className="text-muted-foreground shrink-0">{subject.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.percentage}%` }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-agri-lime"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Activity & Pending */}
        <div className="space-y-6 lg:col-span-3">
          {/* Recent Activity Feed */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <ScrollArea className="h-[320px]">
                  <div className="space-y-1 px-6">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 border-b border-border/50 last:border-0"
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            getActivityColor(activity.type)
                          )}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium leading-none truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {activity.timestamp}
                          </p>
                        </div>
                        {activity.user && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {activity.user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Approvals */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Pending Approvals
                  </CardTitle>
                  <Badge variant="secondary">{pendingApprovals.length} pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <ScrollArea className="h-[260px]">
                  <div className="space-y-3 px-6 pb-4">
                    {pendingApprovals.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug line-clamp-2">
                              {item.title}
                            </p>
                            {getTypeBadge(item.type)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>by {item.uploadedBy}</span>
                            <span>•</span>
                            <span>{item.department}</span>
                          </div>
                          <p className="text-xs text-muted-foreground/70">{item.uploadedAt}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Users Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Users</CardTitle>
                <CardDescription>Newly registered students</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/users">View All Users</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Tests Taken</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="" alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{user.department}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{user.testsTaken}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AdminDashboard;
