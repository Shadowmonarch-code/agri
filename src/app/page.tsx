"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Layout components - static imports
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/sections/footer";

// Section components - lazy loaded for better performance
const HeroSection = dynamic(
  () => import("@/components/sections/hero-section"),
  { ssr: false, loading: () => <div className="h-screen min-h-[600px] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800" /> }
);

const FeaturesSection = dynamic(
  () => import("@/components/sections/features-section"),
  { ssr: true }
);

const DepartmentsSection = dynamic(
  () => import("@/components/sections/departments-section"),
  { ssr: true }
);

const ExamsSection = dynamic(
  () => import("@/components/sections/exams-section"),
  { ssr: true }
);

const MaterialsSection = dynamic(
  () => import("@/components/sections/materials-section"),
  { ssr: true }
);

const TestimonialsSection = dynamic(
  () => import("@/components/sections/testimonials-section"),
  { ssr: true }
);

const LeaderboardSection = dynamic(
  () => import("@/components/sections/leaderboard-section"),
  { ssr: true }
);

const CTASection = dynamic(
  () => import("@/components/sections/cta-section"),
  { ssr: true }
);

// Auth dialogs - always client-side only
const LoginDialog = dynamic(
  () => import("@/components/auth/login-dialog"),
  { ssr: false }
);

const RegisterDialog = dynamic(
  () => import("@/components/auth/register-dialog"),
  { ssr: false }
);

// Loading spinner component
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Auth Dialogs - Hidden until triggered */}
      <Suspense fallback={null}>
        <LoginDialog />
        <RegisterDialog />
      </Suspense>
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <DepartmentsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ExamsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <MaterialsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <LeaderboardSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <CTASection />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

