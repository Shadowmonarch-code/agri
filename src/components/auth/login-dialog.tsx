"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  Loader2,
  Leaf,
  Sparkles,
  CheckCircle2,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type LoginTab = "email" | "otp" | "google";

export function LoginDialog() {
  const { showLoginDialog, closeLoginDialog, login, loginWithOTP, loginWithGoogle, switchToRegister, switchToForgotPassword, isLoading } = useAuth();
  
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = useState<LoginTab>("email");

  // Prevent SSR hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // OTP states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Validate email form
  const validateEmailForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate phone
  const validatePhone = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid Indian phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
    try {
      await login(email, password);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Login failed" });
    }
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    if (!validatePhone()) return;
    
    try {
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
      setCountdown(30); // 30 second countdown
    } catch (error) {
      setErrors({ general: "Failed to send OTP. Please try again." });
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: "Please enter complete OTP" });
      return;
    }
    
    try {
      await loginWithOTP(phone, otp);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Verification failed" });
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setErrors({ general: "Google sign-in failed" });
    }
  };

  // Reset states when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeLoginDialog();
      // Reset form after animation
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setCountdown(0);
        setErrors({});
        setActiveTab("email");
      }, 300);
    }
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
    <Dialog open={showLoginDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-bg opacity-5 pointer-events-none" />
        
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-agri-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-agri-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          {/* Header with logo */}
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
              Welcome Back! 👋
            </DialogTitle>
            <DialogDescription className="text-base">
              Sign in to continue your ICAR journey
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LoginTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
              <TabsTrigger value="email" className="text-xs sm:text-sm">
                <Mail className="w-4 h-4 mr-1 hidden sm:inline" />
                Email
              </TabsTrigger>
              <TabsTrigger value="otp" className="text-xs sm:text-sm">
                <Phone className="w-4 h-4 mr-1 hidden sm:inline" />
                OTP
              </TabsTrigger>
              <TabsTrigger value="google" className="text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 mr-1 hidden sm:inline" />
                Google
              </TabsTrigger>
            </TabsList>

            {/* Error message */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2"
                >
                  <span>{errors.general}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Tab Content */}
            <TabsContent value="email" className="mt-0">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => switchToForgotPassword()}
                      className="text-xs text-agri-green hover:text-agri-green-light transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-agri-green hover:bg-agri-green-light text-white h-11 font-semibold btn-premium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Google Sign In Button */}
              <Button
                variant="outline"
                className="w-full h-11 font-medium hover:bg-accent"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </TabsContent>

            {/* OTP Tab Content */}
            <TabsContent value="otp" className="mt-0">
              {!otpSent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                        +91
                      </span>
                      <Phone className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        className={`pl-16 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    We&apos;ll send a 6-digit verification code to this number
                  </p>

                  <Button
                    onClick={handleSendOTP}
                    className="w-full bg-agri-green hover:bg-agri-green-light text-white h-11 font-semibold btn-premium"
                    disabled={isLoading || phone.length !== 10}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-agri-green mb-2" />
                    <p className="font-medium">OTP Sent!</p>
                    <p className="text-sm text-muted-foreground">
                      Enter the code sent to +91 {phone}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                      }}
                      className="justify-center"
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((idx) => (
                          <InputOTPSlot key={idx} index={idx} className="h-12 w-12 text-lg" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {errors.otp && (
                      <p className="text-xs text-destructive text-center">{errors.otp}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleOTPVerify}
                    className="w-full bg-agri-green hover:bg-agri-green-light text-white h-11 font-semibold btn-premium"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend code in <span className="font-medium text-agri-green">{countdown}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOTP}
                        className="text-sm text-agri-green hover:text-agri-green-light font-medium transition-colors"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Change phone number
                  </button>
                </div>
              )}
            </TabsContent>

            {/* Google Tab Content */}
            <TabsContent value="google" className="mt-0">
              <div className="text-center py-8 space-y-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 p-[2px]"
                >
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <svg className="w-10 h-10" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                </motion.div>

                <div>
                  <h3 className="font-semibold text-lg mb-1">Continue with Google</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick and secure sign-in with your Google account
                  </p>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 h-12 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-agri-green" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => switchToRegister()}
                className="text-agri-green hover:text-agri-green-light font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="text-agri-green hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-agri-green hover:underline">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
