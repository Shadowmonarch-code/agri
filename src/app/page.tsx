"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import DepartmentsSection from "@/components/sections/departments-section";
import ExamsSection from "@/components/sections/exams-section";
import MaterialsSection from "@/components/sections/materials-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import LeaderboardSection from "@/components/sections/leaderboard-section";
import BlogSection from "@/components/sections/blog-section";
import ForumSection from "@/components/sections/forum-section";
import CurrentAffairsSection from "@/components/sections/current-affairs-section";
import CTASection from "@/components/sections/cta-section";
import Footer from "@/components/sections/footer";
import { AuthProvider } from "@/components/auth";

// Dynamic imports for auth dialogs to prevent SSR issues
const LoginDialog = dynamic(
  () => import("@/components/auth").then((mod) => mod.LoginDialog),
  { ssr: false }
);

const RegisterDialog = dynamic(
  () => import("@/components/auth").then((mod) => mod.RegisterDialog),
  { ssr: false }
);

const ForgotPasswordDialog = dynamic(
  () => import("@/components/auth").then((mod) => mod.ForgotPasswordDialog),
  { ssr: false }
);

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {/* Auth Dialogs - Global (loaded dynamically to prevent SSR issues) */}
        <LoginDialog />
        <RegisterDialog />
        <ForgotPasswordDialog />
        
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <DepartmentsSection />
          <ExamsSection />
          <MaterialsSection />
          <TestimonialsSection />
          <LeaderboardSection />
          <BlogSection />
          <ForumSection />
          <CurrentAffairsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
