"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Home,
  Leaf,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  Clock,
  Newspaper,
  Download,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { departments } from "@/data/departments";
import { competitiveExams } from "@/data/exams";

interface MobileNavProps {
  onClose: () => void;
}

// Main navigation items
const mainNavItems = [
  { label: "Home", href: "/", icon: Home },
];

// Study resources
const studyResources = [
  { label: "Study Materials", href: "/study-materials", icon: FileText },
  { label: "Books", href: "/books", icon: BookOpen },
  { label: "Test Series", href: "/test-series", icon: ClipboardList },
  { label: "Mock Tests", href: "/mock-tests", icon: HelpCircle },
  { label: "MCQ Practice", href: "/mcq-practice", icon: ClipboardList },
  { label: "PYQs (Previous Year Questions)", href: "/pyqs", icon: Clock },
];

// Additional resources
const additionalResources = [
  { label: "Current Affairs", href: "/current-affairs", icon: Newspaper },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Downloads", href: "/downloads", icon: Download },
];

// Popular exams for quick access
const popularExams = competitiveExams.filter((exam) => exam.popular).slice(0, 6);

// Core departments
const coreDepartments = departments.slice(0, 8);

export function MobileNav({ onClose }: MobileNavProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  // Expandable sections state
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    departments: false,
    exams: false,
  });

  // Handle mount state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLinkClick = () => {
    onClose();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  } as const;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-agri-green to-agri-emerald flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">AgriVerse</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1">
        <motion.div
          className="p-4 space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Home - Prominent */}
          {mainNavItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center gap-3 rounded-lg p-3 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}

          {/* Departments Section */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => toggleSection("departments")}
              className="flex items-center justify-between w-full rounded-lg p-3 hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-agri-green" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Departments</p>
                  <p className="text-xs text-muted-foreground">
                    {departments.length}+ disciplines
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.departments ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.departments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden ml-4 pl-4 border-l-2 border-primary/20"
                >
                  <div className="py-2 space-y-1">
                    {coreDepartments.map((dept) => (
                      <Link
                        key={dept.id}
                        href={`/departments/${dept.slug}`}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors"
                      >
                        <span className="text-base">{dept.icon}</span>
                        <span className="text-sm">{dept.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/departments"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      View All Departments
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Competitive Exams Section */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => toggleSection("exams")}
              className="flex items-center justify-between w-full rounded-lg p-3 hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Competitive Exams</p>
                  <p className="text-xs text-muted-foreground">
                    {competitiveExams.length} exams
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.exams ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.exams && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden ml-4 pl-4 border-l-2 border-purple-500/20"
                >
                  <div className="py-2 space-y-1">
                    {popularExams.map((exam) => (
                      <Link
                        key={exam.id}
                        href={`/exams/${exam.slug}`}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors"
                      >
                        <span className="text-base">{exam.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{exam.name}</span>
                          <span
                            className={cn(
                              "ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium",
                              exam.difficulty === "Easy" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                              exam.difficulty === "Medium" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                              exam.difficulty === "Hard" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            )}
                          >
                            {exam.difficulty}
                          </span>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href="/exams"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                    >
                      View All Exams
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Separator className="my-2" />

          {/* Study Resources Section */}
          <motion.div variants={itemVariants}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Study Resources
            </p>
            <div className="space-y-1">
              {studyResources.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          <Separator className="my-2" />

          {/* More Resources Section */}
          <motion.div variants={itemVariants}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              More Resources
            </p>
            <div className="space-y-1">
              {additionalResources.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t p-4 space-y-3 mt-auto">
        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={toggleTheme}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="mr-2 h-4 w-4 text-slate-600" />
                )}
              </motion.div>
            </AnimatePresence>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        )}

        {/* Login Button */}
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <Link href="/login" onClick={handleLinkClick}>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>

        {/* Register CTA Button */}
        <Button
          className="w-full bg-gradient-to-r from-agri-green to-agri-green-light hover:from-agri-green-light hover:to-agri-emerald shadow-md btn-premium"
          asChild
        >
          <Link href="/register" onClick={handleLinkClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Get Started Free
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default MobileNav;
