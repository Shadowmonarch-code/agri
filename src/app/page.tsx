"use client";

import { useState, useEffect } from "react";

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { 
  children: React.ReactNode; 
  fallback: React.ReactNode;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) return <>{fallback}</>;
  return <>{children}</>;
}

// Safe dynamic import wrapper
function SafeSection({ 
  importer, 
  fallback,
  name 
}: { 
  importer: () => Promise<any>; 
  fallback: React.ReactNode;
  name: string;
}) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    importer()
      .then(mod => {
        if (mod.default) {
          setComponent(() => mod.default);
        } else if (mod[name]) {
          setComponent(() => mod[name]);
        }
      })
      .catch(() => setError(true));
  }, [importer, name]);

  if (error || !Component) return <>{fallback}</>;
  
  try {
    return <Component />;
  } catch {
    return <>{fallback}</>;
  }
}

// Fallback section component
function SectionFallback({ title }: { title?: string }) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold gradient-text">{title || "Loading..."}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-6 animate-pulse">
              <div className="h-5 w-20 bg-muted rounded mb-4" />
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal Navbar Component (inline to avoid import issues)
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold text-lg hidden sm:block">AgriVerse Academy</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#departments" className="text-sm font-medium hover:text-primary transition-colors">Departments</a>
            <a href="#exams" className="text-sm font-medium hover:text-primary transition-colors">Exams</a>
            <a href="#materials" className="text-sm font-medium hover:text-primary transition-colors">Materials</a>
            <a href="#tests" className="text-sm font-medium hover:text-primary transition-colors">Tests</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
              Login
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
            
            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t bg-background">
            <div className="flex flex-col gap-3">
              <a href="#departments" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent">Departments</a>
              <a href="#exams" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent">Exams</a>
              <a href="#materials" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent">Materials</a>
              <a href="#tests" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent">Tests</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-primary">Login</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section (inline for reliability)
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/30 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
              🎓 India's #1 ICAR Learning Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">AgriVerse Academy</span>
              <br />
              <span className="text-foreground text-2xl sm:text-3xl lg:text-4xl mt-4 block">
                Your Complete ICAR Education Ecosystem
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl">
              Access premium study materials, previous year questions, mock tests, and video lectures for all ICAR disciplines. Join 100,000+ students preparing for their dream career in agriculture.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <input
                type="search"
                placeholder="Search departments, exams, subjects..."
                className="w-full px-6 py-4 pl-14 rounded-xl border bg-background shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all">
                Explore Materials
              </button>
              <button className="px-8 py-4 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary transition-all">
                Take Mock Test
              </button>
              <button className="px-8 py-4 text-muted-foreground font-medium hover:text-foreground transition-colors hidden sm:inline-flex">
                Browse Departments →
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {['A', 'R', 'S', 'P'].map((letter, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500">★★★★★</div>
                <p className="text-xs text-muted-foreground">4.9/5 from 10,000+ reviews</p>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration Placeholder */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-gray-800 dark:to-gray-700 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-8xl">🌾</div>
                    <p className="text-lg font-semibold text-foreground">AgriVerse Academy</p>
                    <p className="text-sm text-muted-foreground">India's Largest ICAR Learning Platform</p>
                    
                    {/* Floating Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {[
                        { label: 'Students', value: '100K+' },
                        { label: 'Materials', value: '5000+' },
                        { label: 'Tests', value: '200+' },
                        { label: 'Success Rate', value: '95%' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-3 shadow-lg">
                          <div className="text-lg font-bold text-green-600">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Bar
function StatsBar() {
  const stats = [
    { icon: '👨‍🎓', label: 'Students', value: '100,000+' },
    { icon: '📚', label: 'Study Materials', value: '5,000+' },
    { icon: '📖', label: 'Books', value: '1,000+' },
    { icon: '📝', label: 'Test Series', value: '200+' },
    { icon: '🏛️', label: 'Universities', value: '50+' },
  ];

  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section (inline)
function FeaturesSection() {
  const features = [
    { icon: '📚', title: 'Comprehensive Study Material', desc: 'Books, notes, PYQs, and video lectures for all ICAR subjects' },
    { icon: '📝', title: 'Previous Year Questions', desc: 'Solved PYQs from last 10 years with detailed explanations' },
    { icon: '🎯', title: 'Mock Tests & Practice', desc: 'Exam-pattern tests with timer, analytics, and leaderboard' },
    { icon: '📹', title: 'Video Lectures', desc: 'HD videos by expert faculty covering entire syllabus' },
    { icon: '🏆', title: 'Expert Faculty Notes', desc: 'Curated notes from IIT/IISc professors and ICAR experts' },
    { icon: '💬', title: 'Community Discussion', desc: 'Doubt resolution, peer learning, and mentorship programs' },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete preparation ecosystem designed specifically for ICAR aspirants
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="group p-6 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Departments Preview (inline)
function DepartmentsPreview() {
  const departments = [
    { name: 'Agriculture', icon: '🌾', color: 'from-green-500 to-emerald-600' },
    { name: 'Horticulture', icon: '🍎', color: 'from-orange-500 to-red-500' },
    { name: 'Forestry', icon: '🌲', color: 'from-green-700 to-green-900' },
    { name: 'Biotechnology', icon: '🧬', color: 'from-purple-500 to-pink-500' },
    { name: 'Agri Engineering', icon: '⚙️', color: 'from-blue-500 to-cyan-500' },
    { name: 'Food Technology', icon: '🏭', color: 'from-orange-600 to-yellow-500' },
    { name: 'Animal Science', icon: '🐄', color: 'from-red-600 to-orange-500' },
    { name: 'Fisheries', icon: '🐟', color: 'from-blue-600 to-blue-400' },
    { name: 'Plant Pathology', icon: '🍂', color: 'from-amber-700 to-amber-500' },
    { name: 'Entomology', icon: '🐛', color: 'from-violet-600 to-purple-500' },
    { name: 'Soil Science', icon: '🪴', color: 'from-yellow-700 to-amber-600' },
    { name: 'Microbiology', icon: '🔬', color: 'from-teal-600 to-green-500' },
  ];

  return (
    <section id="departments" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore <span className="gradient-text">ICAR Departments</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive coverage of all 25+ ICAR disciplines
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {departments.map((dept, i) => (
            <a key={i} href="#" className="group p-4 rounded-xl bg-card border hover:shadow-md hover:-translate-y-1 transition-all text-center">
              <div className="text-3xl mb-2">{dept.icon}</div>
              <div className="text-sm font-medium group-hover:text-primary transition-colors">{dept.name}</div>
            </a>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="px-6 py-3 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all">
            View All 25+ Departments →
          </button>
        </div>
      </div>
    </section>
  );
}

// Exams Preview (inline)
function ExamsPreview() {
  const exams = [
    { name: 'ICAR JRF', icon: '🎓', difficulty: 'Hard', duration: '3 Hours' },
    { name: 'ICAR SRF', icon: '🔬', difficulty: 'Hard', duration: '3 Hours' },
    { name: 'AIEEA UG', icon: '🌾', difficulty: 'Medium', duration: '2.5 Hours' },
    { name: 'CSIR NET', icon: '🧪', difficulty: 'Hard', duration: '3 Hours' },
    { name: 'GATE BT', icon: '⚡', difficulty: 'Hard', duration: '3 Hours' },
    { name: 'CUET PG', icon: '📋', difficulty: 'Medium', duration: '2 Hours' },
  ];

  return (
    <section id="exams" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Competitive Exam <span className="gradient-text">Preparation</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Dedicated preparation for all agriculture entrance exams
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{exam.icon}</div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  exam.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {exam.difficulty}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{exam.name}</h3>
              <p className="text-sm text-muted-foreground">Duration: {exam.duration}</p>
              <button className="mt-4 text-sm font-medium text-primary hover:underline">
                Start Preparing →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Materials Section (inline)
function MaterialsSection() {
  const categories = [
    { icon: '📚', title: 'Books', count: '1,000+', color: 'bg-blue-500/10 text-blue-600' },
    { icon: '📝', title: 'Notes', count: '2,500+', color: 'bg-green-500/10 text-green-600' },
    { icon: '📄', title: 'PYQs', count: '500+', color: 'bg-purple-500/10 text-purple-600' },
    { icon: '🎥', title: 'Video Lectures', count: '300+', color: 'bg-red-500/10 text-red-600' },
    { icon: '🔬', title: 'Practical Manuals', count: '200+', color: 'bg-orange-500/10 text-orange-600' },
    { icon: '❓', title: 'Question Banks', count: '10,000+', color: 'bg-teal-500/10 text-teal-600' },
  ];

  return (
    <section id="materials" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Study <span className="gradient-text">Materials Library</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Access thousands of curated resources organized by subject & semester
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <a key={i} href="#" className={`p-4 rounded-xl ${cat.color} text-center hover:scale-105 transition-transform`}>
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-sm">{cat.title}</div>
              <div className="text-xs opacity-70">{cat.count} items</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section (inline)
function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-12 text-center text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Your ICAR Journey Today! 🚀
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join 100,000+ students already preparing with AgriVerse Academy. Free registration, premium content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                Create Free Account
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                Explore Materials
              </button>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// Footer (inline)
function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="font-bold text-lg">AgriVerse Academy</span>
            </div>
            <p className="text-sm opacity-70">
              India's largest ICAR learning platform. Empowering agricultural education since 2024.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100">About Us</a></li>
              <li><a href="#" className="hover:opacity-100">All Courses</a></li>
              <li><a href="#" className="hover:opacity-100">Test Series</a></li>
              <li><a href="#" className="hover:opacity-100">Blog</a></li>
            </ul>
          </div>
          
          {/* Departments */}
          <div>
            <h4 className="font-semibold mb-4">Popular Departments</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100">Agriculture</a></li>
              <li><a href="#" className="hover:opacity-100">Horticulture</a></li>
              <li><a href="#" className="hover:opacity-100">Biotechnology</a></li>
              <li><a href="#" className="hover:opacity-100">Forestry</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>support@agriverse.academy</li>
              <li>New Delhi, India</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="opacity-70 hover:opacity-100">Twitter</a>
              <a href="#" className="opacity-70 hover:opacity-100">LinkedIn</a>
              <a href="#" className="opacity-70 hover:opacity-100">YouTube</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm opacity-50">
          © 2024 AgriVerse Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Main App Component
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted" />
          <div className="h-screen bg-gradient-to-br from-green-50 to-emerald-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <DepartmentsPreview />
        <ExamsPreview />
        <MaterialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
