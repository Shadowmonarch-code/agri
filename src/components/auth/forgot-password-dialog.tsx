"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  Leaf,
  CheckCircle2,
  Inbox,
  ExternalLink,
} from "lucide-react";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ForgotStep = "email" | "success";

export function ForgotPasswordDialog() {
  const { showForgotPasswordDialog, closeForgotPasswordDialog, switchToLogin, isLoading } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<ForgotStep>("email");

  // Prevent SSR hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate email
  const validateEmail = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle send reset link
  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Show success state
      setCurrentStep("success");
    } catch (error) {
      setErrors({ general: "Failed to send reset link. Please try again." });
    }
  };

  // Reset states when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeForgotPasswordDialog();
      setTimeout(() => {
        setEmail("");
        setErrors({});
        setCurrentStep("email");
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
    <Dialog open={showForgotPasswordDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
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
              </motion.div>
            </div>
            <DialogTitle className="text-2xl font-bold">
              Forgot Password? 🔑
            </DialogTitle>
            <DialogDescription className="text-base">
              No worries! We&apos;ll help you get back in.
            </DialogDescription>
          </DialogHeader>

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
            {/* Email Input Step */}
            {currentStep === "email" && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSendResetLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <p className="text-sm text-muted-foreground">
                      Enter your registered email address and we&apos;ll send you a password reset link.
                    </p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        autoFocus
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-agri-green hover:bg-agri-green-light text-white h-11 font-semibold btn-premium"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Tips */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    💡 Tips for recovering access:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Check your spam folder if you don&apos;t see the email within a few minutes</li>
                    <li>The reset link will expire after 24 hours</li>
                    <li>Make sure you&apos;re using the email associated with your AgriVerse account</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Success Step */}
            {currentStep === "success" && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-agri-green/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-agri-green" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-2">Check Your Email! 📧</h3>
                
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>

                {/* Email preview mockup */}
                <div className="bg-card rounded-xl p-4 border shadow-sm max-w-sm mx-auto text-left mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-agri-green to-agri-lime flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">AgriVerse Academy</p>
                      <p className="text-xs text-muted-foreground truncate">Reset Your Password</p>
                      <p className="text-xs mt-1 line-clamp-2">
                        Click the button below to create a new password for your account...
                      </p>
                    </div>
                    <Inbox className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => switchToLogin()}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setCurrentStep("email");
                      setEmail("");
                    }}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Didn&apos;t receive the email? Send again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to login link (only on email step) */}
          {currentStep === "email" && (
            <div className="mt-6 text-center">
              <button
                onClick={() => switchToLogin()}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
