"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Leaf,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  BookOpen,
  FileText,
  GraduationCap,
  ClipboardList,
  HelpCircle,
  Clock,
  Newspaper,
  Download,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { departments } from "@/data/departments";
import { competitiveExams } from "@/data/exams";
import { MobileNav } from "./mobile-nav";

// Navigation items configuration
const navItems = [
  { label: "Home", href: "/" },
  { label: "Departments", href: "/departments", hasDropdown: true },
  { label: "Competitive Exams", href: "/exams", hasDropdown: true },
  { label: "Study Materials", href: "/study-materials" },
  { label: "Books", href: "/books" },
  { label: "Test Series", href: "/test-series" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "MCQ Practice", href: "/mcq-practice" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Current Affairs", href: "/current-affairs" },
  { label: "Blog", href: "/blog" },
  { label: "Downloads", href: "/downloads" },
];

// Popular exams for quick access
const popularExams = competitiveExams.filter((exam) => exam.popular);

// Core departments to show in dropdown
const coreDepartments = departments.slice(0, 8);
const allDepartments = departments;

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Handle mount state for theme toggle
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for glassmorphism effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "glass-strong shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex h-16 md:h-18 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <Image
                  src="/images/logo.png"
                  alt="AgriVerse Academy Logo"
                  width={40}
                  height={40}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-lg object-contain"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold gradient-text leading-tight">
                  AgriVerse
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground font-medium -mt-0.5">
                  Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {/* Home */}
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Departments Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Departments</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-4 md:w-[700px] md:grid-cols-2 lg:w-[800px]">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Popular Departments
                          </h4>
                          <ul className="grid gap-1">
                            {coreDepartments.map((dept) => (
                              <li key={dept.id}>
                                <Link href={`/departments/${dept.slug}`} legacyBehavior passHref>
                                  <NavigationMenuLink
                                    className="flex items-center gap-3 rounded-md p-3 hover:bg-accent transition-colors group"
                                  >
                                    <span className="text-xl">{dept.icon}</span>
                                    <div>
                                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                        {dept.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                        {dept.description.slice(0, 60)}...
                                      </p>
                                    </div>
                                  </NavigationMenuLink>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Quick Links
                          </h4>
                          <div className="grid gap-2">
                            <Link
                              href="/departments"
                              legacyBehavior
                              passHref
                            >
                              <NavigationMenuLink
                                className="block rounded-md p-3 hover:bg-accent transition-colors border border-dashed"
                              >
                                <p className="font-medium text-sm text-primary">
                                  View All Departments
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Explore {allDepartments.length}+ ICAR disciplines
                                </p>
                              </NavigationMenuLink>
                            </Link>
                            <div className="rounded-md bg-secondary/50 p-3">
                              <p className="text-xs font-medium text-secondary-foreground mb-2">
                                By Category
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {["Core Sciences", "Life Sciences", "Engineering"].map(
                                  (cat) => (
                                      <span
                                        key={cat}
                                        className="inline-flex items-center rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                      >
                                        {cat}
                                      </span>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Competitive Exams Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Competitive Exams</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Popular Exams
                          </h4>
                          <ul className="grid gap-1">
                            {popularExams.slice(0, 6).map((exam) => (
                              <li key={exam.id}>
                                <Link href={`/exams/${exam.slug}`} legacyBehavior passHref>
                                  <NavigationMenuLink
                                    className="flex items-center gap-3 rounded-md p-3 hover:bg-accent transition-colors group"
                                  >
                                    <span className="text-lg">{exam.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                        {exam.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {exam.fullName}
                                      </p>
                                    </div>
                                    <span
                                      className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded font-medium",
                                        exam.difficulty === "Easy" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                                        exam.difficulty === "Medium" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                                        exam.difficulty === "Hard" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                      )}
                                    >
                                      {exam.difficulty}
                                    </span>
                                  </NavigationMenuLink>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Exam Categories
                          </h4>
                          <div className="grid gap-2">
                            {[
                              { name: "ICAR Exams", icon: "🎓", count: 3, href: "/exams?category=icar" },
                              { name: "CSIR/DBT", icon: "🧪", count: 2, href: "/exams?category=csir" },
                              { name: "GATE Exams", icon: "⚡", count: 2, href: "/exams?category=gate" },
                              { name: "NET Exams", icon: "📋", count: 3, href: "/exams?category=net" },
                            ].map((cat) => (
                              <Link key={cat.name} href={cat.href} legacyBehavior passHref>
                                <NavigationMenuLink
                                  className="flex items-center justify-between rounded-md p-3 hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{cat.icon}</span>
                                    <span className="text-sm font-medium">{cat.name}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {cat.count}
                                  </span>
                                </NavigationMenuLink>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/exams"
                            legacyBehavior
                            passHref
                            className="mt-2 block"
                          >
                            <NavigationMenuLink
                              className="flex items-center justify-center rounded-md p-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <span className="text-sm font-medium">View All Exams</span>
                              <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
                            </NavigationMenuLink>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Study Materials */}
                  <NavigationMenuItem>
                    <Link href="/study-materials" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <FileText className="mr-1.5 h-4 w-4 hidden xl:inline" />
                        Study Materials
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Books */}
                  <NavigationMenuItem>
                    <Link href="/books" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <BookOpen className="mr-1.5 h-4 w-4 hidden xl:inline" />
                        Books
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Test Series */}
                  <NavigationMenuItem>
                    <Link href="/test-series" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <ClipboardList className="mr-1.5 h-4 w-4 hidden xl:inline" />
                        Test Series
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* More Items Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>More</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[280px] gap-1 p-2">
                        {[
                          { href: "/mock-tests", icon: HelpCircle, label: "Mock Tests", desc: "Practice with timed tests" },
                          { href: "/mcq-practice", icon: ClipboardList, label: "MCQ Practice", desc: "Topic-wise MCQs" },
                          { href: "/pyqs", icon: Clock, label: "PYQs", desc: "Previous Year Questions" },
                          { href: "/current-affairs", icon: Newspaper, label: "Current Affairs", desc: "Daily agriculture updates" },
                          { href: "/blog", icon: BookOpen, label: "Blog", desc: "Articles & guides" },
                          { href: "/downloads", icon: Download, label: "Downloads", desc: "Free resources" },
                        ].map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} legacyBehavior passHref>
                              <NavigationMenuLink
                                className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors group"
                              >
                                <item.icon className="mt-0.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div>
                                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.desc}
                                  </p>
                                </div>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hidden sm:flex"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Moon className="h-5 w-5 text-slate-700" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              )}

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Login Button - Hidden on small screens */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                asChild
              >
                <Link href="/login">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Login
                </Link>
              </Button>

              {/* Register CTA Button - Hidden on small screens */}
              <Button
                size="sm"
                className="hidden sm:inline-flex bg-gradient-to-r from-agri-green to-agri-green-light hover:from-agri-green-light hover:to-agri-emerald shadow-md btn-premium"
                asChild
              >
                <Link href="/register">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Get Started
                </Link>
              </Button>

              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
                  <MobileNav onClose={() => setIsMobileNavOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search AgriVerse Academy
            </DialogTitle>
            <DialogDescription>
              Find study materials, books, notes, and more
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics, subjects, exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Suggestions */}
            {searchQuery.length > 0 && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Quick Results
                  </h4>
                  <div className="space-y-1 max-h-[300px] overflow-auto">
                    {[
                      ...departments
                        .filter((d) =>
                          d.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 3)
                        .map((d) => ({
                          type: "Department" as const,
                          title: d.name,
                          href: `/departments/${d.slug}`,
                          icon: d.icon,
                        })),
                      ...competitiveExams
                        .filter((e) =>
                          e.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 3)
                        .map((e) => ({
                          type: "Exam" as const,
                          title: e.name,
                          href: `/exams/${e.slug}`,
                          icon: e.icon,
                        })),
                    ].slice(0, 5).length > 0 ? (
                      [
                        ...departments
                          .filter((d) =>
                            d.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .slice(0, 3)
                          .map((d) => ({
                            type: "Department" as const,
                            title: d.name,
                            href: `/departments/${d.slug}`,
                            icon: d.icon,
                          })),
                        ...competitiveExams
                          .filter((e) =>
                            e.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .slice(0, 3)
                          .map((e) => ({
                            type: "Exam" as const,
                            title: e.name,
                            href: `/exams/${e.slug}`,
                            icon: e.icon,
                          })),
                      ]
                        .slice(0, 5)
                        .map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.type}
                              </p>
                            </div>
                          </Link>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No results found for "{searchQuery}"
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["ICAR JRF", "Agronomy", "Plant Pathology", "AIEEA"].map(
                      (term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setSearchQuery(term)}
                        >
                          {term}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Default State */}
            {searchQuery.length === 0 && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Trending Topics
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "ICAR JRF Prep", href: "/exams/icar-jrf", emoji: "🎯" },
                      { label: "Agriculture Notes", href: "/study-materials", emoji: "📝" },
                      { label: "Mock Tests", href: "/mock-tests", emoji: "📋" },
                      { label: "PYQ Bank", href: "/pyqs", emoji: "🗂️" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent transition-colors"
                      >
                        <span>{item.emoji}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-18 lg:h-20" />
    </>
  );
}

export default Navbar;
