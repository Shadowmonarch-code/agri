"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  BookOpen,
  FileText,
  GraduationCap,
  Users,
  Library,
  ClipboardCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Animated counter hook
function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  start: number = 0
): number {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      countRef.current = Math.floor(start + (end - start) * easeOutQuart);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// Stats data
const statsData = [
  {
    value: 100000,
    suffix: "+",
    label: "Students",
    icon: Users,
  },
  {
    value: 5000,
    suffix: "+",
    label: "Study Materials",
    icon: FileText,
  },
  {
    value: 1000,
    suffix: "+",
    label: "Books",
    icon: BookOpen,
  },
  {
    value: 200,
    suffix: "+",
    label: "Test Series",
    icon: ClipboardCheck,
  },
  {
    value: 50,
    suffix: "+",
    label: "Universities",
    icon: Building2,
  },
];

// Stat Item Component
function StatItem({
  value,
  suffix,
  label,
  icon: Icon,
  index,
}: (typeof statsData)[number] & { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const animatedValue = useAnimatedCounter(value, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 card-hover"
    >
      <div className="flex items-center gap-1.5">
        <Icon className="w-5 h-5 text-agri-green" />
        <span className="text-3xl md:text-4xl font-bold gradient-text font-[family-name:var(--font-poppins)]">
          {isInView ? animatedValue.toLocaleString() : "0"}
          {suffix}
        </span>
      </div>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </motion.div>
  );
}

// Floating decorative element
function FloatingElement({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Main Hero Section Component
export default function HeroSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-agri-green/20 via-agri-lime/15 to-emerald-300/10 rounded-full blur-3xl blob" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-agri-green-light/15 to-agri-lime/10 rounded-full blur-3xl blob" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-200/20 to-agri-green/10 rounded-full blur-3xl blob" style={{ animationDelay: "4s" }} />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />

        {/* Decorative gradient lines */}
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/4 left-0 w-full h-px"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-agri-green/30 to-transparent" />
        </motion.div>
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute bottom-1/3 left-0 w-full h-px"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-agri-lime/20 to-transparent" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col gap-6 lg:gap-8 max-w-2xl"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-agri-green/10 text-agri-green border-agri-green/20 hover:bg-agri-green/15 transition-all duration-300 group"
                >
                  <Sparkles className="w-4 h-4 group-animate-pulse" />
                  <span>India&apos;s #1 ICAR Learning Platform</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight font-[family-name:var(--font-poppins)]"
              >
                <span className="block text-foreground">AgriVerse</span>
                <span className="block animate-text-gradient mt-2">Academy</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl font-semibold text-agri-green-light font-[family-name:var(--font-jakarta)]"
              >
                Your Complete ICAR Education Ecosystem
              </motion.p>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl font-[family-name:var(--font-inter)]"
              >
                Access premium study materials, comprehensive books, previous year questions,
                mock tests, and video lectures for all ICAR disciplines. Join{" "}
                <span className="font-semibold text-foreground">100,000+</span> students
                preparing for ICAR JRF, SRF, and other agricultural examinations.
              </motion.p>

              {/* Search Bar */}
              <motion.div variants={itemVariants} className="relative max-w-xl">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-agri-green transition-colors" />
                  <Input
                    type="search"
                    placeholder="Search departments, exams, subjects..."
                    className="pl-12 pr-4 py-6 text-base rounded-2xl border-2 border-border/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg shadow-black/5 focus:border-agri-green focus:ring-4 focus:ring-agri-green/10 transition-all duration-300 h-auto"
                  />
                  <Button
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-agri-green hover:bg-agri-green-light text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Search
                  </Button>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Button
                  size="lg"
                  className="btn-premium h-12 px-8 text-base font-semibold rounded-xl bg-agri-green hover:bg-agri-green-light text-white shadow-lg shadow-agri-green/25 hover:shadow-agri-green/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Library className="w-5 h-5" />
                  Explore Materials
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base font-semibold rounded-xl border-2 border-agri-green/30 text-agri-green hover:bg-agri-green/5 hover:border-agri-green/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Take Mock Test
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 px-6 text-base font-semibold rounded-xl text-muted-foreground hover:text-agri-green hover:bg-agri-green/5 transition-all duration-300"
                >
                  <GraduationCap className="w-5 h-5" />
                  Browse Departments
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-6 text-base font-semibold rounded-xl bg-secondary hover:bg-agri-green/10 text-secondary-foreground hover:text-agri-green hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  Join Community
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 pt-4 flex-wrap"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-agri-green to-agri-lime border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9/5</span>{" "}
                  rating from 10,000+ reviews
                </p>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Illustration */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-agri-green/10 to-agri-lime/10 blur-3xl" />
              </div>

              {/* Main image container with glassmorphism */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <div className="relative">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-agri-green/30 via-agri-lime/20 to-emerald-300/20 rounded-3xl blur-2xl scale-110" />
                  
                  {/* Glass card containing image */}
                  <div className="relative glass rounded-3xl p-4 shadow-2xl shadow-black/10">
                    <Image
                      src="/images/hero-illustration.png"
                      alt="AgriVerse Academy - ICAR Learning Platform"
                      width={500}
                      height={500}
                      priority
                      className="rounded-2xl w-full h-auto object-contain"
                    />
                    
                    {/* Overlay gradient at bottom of image */}
                    <div className="absolute bottom-4 left-4 right-4 h-24 bg-gradient-to-t from-white/80 to-transparent rounded-b-2xl pointer-events-none" />
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <FloatingElement delay={0.5} className="absolute top-10 right-10">
                <div className="glass rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-agri-green/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-agri-green" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">5000+</p>
                      <p className="text-xs text-muted-foreground">Materials</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement delay={1} className="absolute bottom-20 left-0">
                <div className="glass rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-agri-lime/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-agri-green-light" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">100K+</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement delay={1.5} className="absolute bottom-40 right-0">
                <div className="glass rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">95% Success</p>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Decorative dots/circles */}
              <div className="absolute top-1/4 left-0 w-4 h-4 rounded-full bg-agri-green/30" />
              <div className="absolute top-1/3 right-5 w-3 h-3 rounded-full bg-agri-lime/40" />
              <div className="absolute bottom-1/4 left-10 w-2 h-2 rounded-full bg-emerald-400/50" />
              <div className="absolute top-1/2 right-1/4 w-5 h-5 rounded-full border-2 border-agri-green/20" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative pb-12 pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle separator line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {statsData.map((stat, index) => (
              <StatItem key={stat.label} {...stat} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
