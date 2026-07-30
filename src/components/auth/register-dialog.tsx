"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Leaf,
  CheckCircle2,
  Check,
  GraduationCap,
  Target,
  Heart,
  Gift,
} from "lucide-react";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { departments } from "@/data/departments";
import { competitiveExams } from "@/data/exams";

type RegisterStep = 1 | 2 | 3;

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string;
  year: string;
  targetExams: string[];
  interests: string[];
  referralCode: string;
  agreeTerms: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  department: "",
  year: "",
  targetExams: [],
  interests: [],
  referralCode: "",
  agreeTerms: false,
};

const INTEREST_OPTIONS = [
  "Crop Science",
  "Soil Management",
  "Plant Breeding",
  "Agricultural Engineering",
  "Biotechnology",
  "Entomology",
  "Dairy Technology",
  "Horticulture",
  "Agri Business",
  "Research & Development",
];

export function RegisterDialog() {
  const { showRegisterDialog, closeRegisterDialog, register, switchToLogin, isLoading } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);

  // Prevent SSR hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Password strength calculation
  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 20, label: "Weak", color: "bg-destructive" };
    if (score <= 2) return { score: 40, label: "Fair", color: "bg-agri-gold" };
    if (score <= 3) return { score: 60, label: "Good", color: "bg-agri-lime" };
    if (score <= 4) return { score: 80, label: "Strong", color: "bg-agri-green-light" };
    return { score: 100, label: "Excellent", color: "bg-agri-green" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Email availability check
  useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        setEmailAvailable(null);
        return;
      }

      setEmailChecking(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Demo: email is available unless it's a common test email
      const isAvailable = !formData.email.includes("taken") && !formData.email.includes("exists");
      setEmailAvailable(isAvailable);
      setEmailChecking(false);
    };

    const debounceTimer = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.email]);

  // Validate step
  const validateStep = (step: RegisterStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Full name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid Indian phone number";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 2) {
      if (!formData.department) {
        newErrors.department = "Please select your department";
      }
      if (!formData.year) {
        newErrors.year = "Please select your year/semester";
      }
      if (formData.targetExams.length === 0) {
        newErrors.targetExams = "Please select at least one target exam";
      }
    }

    if (step === 3) {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3) as RegisterStep);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as RegisterStep);
    setErrors({});
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        year: parseInt(formData.year),
        targetExams: formData.targetExams,
        password: formData.password,
      });
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Registration failed" });
    }
  };

  // Toggle target exam selection
  const toggleTargetExam = (examId: string) => {
    setFormData((prev) => ({
      ...prev,
      targetExams: prev.targetExams.includes(examId)
        ? prev.targetExams.filter((id) => id !== examId)
        : [...prev.targetExams, examId],
    }));
    if (errors.targetExams) setErrors((prev) => ({ ...prev, targetExams: "" }));
  };

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeRegisterDialog();
      setTimeout(() => {
        setFormData(INITIAL_FORM_DATA);
        setCurrentStep(1);
        setErrors({});
        setEmailAvailable(null);
      }, 300);
    }
  };

  // Step content variants for animation
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Don't render dialog content until mounted (prevents SSR issues)
  if (!mounted) {
    return (
      <Dialog open={false}>
        <DialogContent className="hidden"></DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showRegisterDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 max-h-[90vh] overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-bg opacity-5 pointer-events-none" />
        
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-agri-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-agri-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-agri-green to-agri-lime flex items-center justify-center shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-agri-gold rounded-full animate-pulse" />
              </motion.div>
            </div>
            <DialogTitle className="text-2xl font-bold">
              Create Account 🌱
            </DialogTitle>
            <DialogDescription className="text-base">
              Join India&apos;s Largest ICAR Learning Platform
            </DialogDescription>
          </DialogHeader>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <button
                    onClick={() => {
                      if (step < currentStep || validateStep(currentStep)) {
                        setCurrentStep(step as RegisterStep);
                      }
                    }}
                    className={`flex flex-col items-center ${
                      step <= currentStep ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        step < currentStep
                          ? "bg-agri-green text-white"
                          : step === currentStep
                          ? "bg-agri-green text-white ring-4 ring-agri-green/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium ${
                        step === currentStep ? "text-agri-green" : "text-muted-foreground"
                      }`}
                    >
                      {step === 1 ? "Basic" : step === 2 ? "Academic" : "Preferences"}
                </span>
                  </button>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-6 transition-colors duration-300 ${
                        step < currentStep ? "bg-agri-green" : "bg-muted"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-1.5" />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
              >
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Rahul Kumar"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`pl-10 pr-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                    {emailChecking && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                    {!emailChecking && emailAvailable !== null && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${emailAvailable ? "text-agri-green" : "text-destructive"}`}>
                        {emailAvailable ? <CheckCircle2 className="w-4 h-4" /> : "✕"}
                      </span>
                    )}
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  {emailAvailable === false && (
                    <p className="text-xs text-destructive">This email is already registered</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone Number *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      +91
                    </span>
                    <Phone className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      className={`pl-16 ${errors.phone ? "border-destructive" : ""}`}
                      maxLength={10}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, password: e.target.value }));
                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[20, 40, 60, 80, 100].map((threshold) => (
                          <div
                            key={threshold}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              passwordStrength.score >= threshold ? passwordStrength.color : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength.color.replace("bg-", "text-")}`}>
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Academic Info */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-agri-green" />
                  <span className="font-medium">Academic Information</span>
                </div>

                <div className="space-y-2">
                  <Label>Department / Branch *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, department: value }));
                      if (errors.department) setErrors((prev) => ({ ...prev, department: "" }));
                    }}
                  >
                    <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          <span className="mr-2">{dept.icon}</span>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Year / Semester *</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, year: value }));
                      if (errors.year) setErrors((prev) => ({ ...prev, year: "" }));
                    }}
                  >
                    <SelectTrigger className={errors.year ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-agri-green" />
                    <Label>Target Exams * (select all that apply)</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                    {competitiveExams.slice(0, 10).map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => toggleTargetExam(exam.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all ${
                          formData.targetExams.includes(exam.id)
                            ? "bg-agri-green/10 border border-agri-green text-agri-green"
                            : "bg-muted/50 border border-transparent hover:bg-muted"
                        }`}
                      >
                        <span>{exam.icon}</span>
                        <span className="truncate">{exam.name}</span>
                        {formData.targetExams.includes(exam.id) && (
                          <Check className="w-3 h-3 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.targetExams && (
                    <p className="text-xs text-destructive">{errors.targetExams}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-agri-green" />
                  <span className="font-medium">Your Preferences</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Areas of Interest (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer transition-all px-3 py-1 ${
                          formData.interests.includes(interest)
                            ? "bg-agri-green hover:bg-agri-green-light text-white"
                            : "hover:border-agri-green hover:text-agri-green"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-agri-gold" />
                    <Label htmlFor="referral" className="text-muted-foreground">
                      Referral Code (Optional)
                    </Label>
                  </div>
                  <Input
                    id="referral"
                    placeholder="Enter referral code for bonus coins"
                    value={formData.referralCode}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, referralCode: e.target.value.toUpperCase() }))
                    }
                    className="font-mono uppercase"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Get 50 bonus coins when you use a referral code!
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }));
                        if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: "" }));
                      }}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-agri-green hover:underline font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-agri-green hover:underline font-medium">
                        Privacy Policy
                      </a>
                      . I understand that my data will be processed as described.
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-xs text-destructive ml-6">{errors.agreeTerms}</p>
                  )}
                </div>

                {/* Summary Card */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-agri-green/5 to-agri-lime/5 border border-agri-green/20">
                  <h4 className="font-medium text-sm mb-2">📋 Registration Summary</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="text-foreground">Name:</span> {formData.name}</p>
                    <p><span className="text-foreground">Email:</span> {formData.email}</p>
                    <p><span className="text-foreground">Department:</span> {departments.find(d => d.id === formData.department)?.name || "Not selected"}</p>
                    <p><span className="text-foreground">Target Exams:</span> {formData.targetExams.length} selected</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-agri-green hover:bg-agri-green-light text-white gap-2 btn-premium"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-agri-green hover:bg-agri-green-light text-white gap-2 btn-premium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <Leaf className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => switchToLogin()}
                className="text-agri-green hover:text-agri-green-light font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
