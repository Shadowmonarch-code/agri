"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Target,
  Download,
  FileText,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Users,
  Medal,
  Crown,
  Star,
  Calendar,
  BookOpen,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Share2,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface QuestionResult {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  userAnswer: "A" | "B" | "C" | "D" | null;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  subject: string;
  marks: number;
  isCorrect: boolean | null; // null = not attempted
}

interface SubjectBreakdown {
  subject: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
}

interface TestResultsData {
  testId: string;
  testName: string;
  date: Date;
  totalQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  maxMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  accuracy: number;
  percentile: number;
  rank: number;
  totalParticipants: number;
  timeTaken: number; // in seconds
  totalTime: number; // in seconds
  questions: QuestionResult[];
  subjectBreakdown: SubjectBreakdown[];
}

interface TestResultsProps {
  results: TestResultsData;
  onRetry?: () => void;
  onViewSolutions?: () => void;
  onGoHome?: () => void;
}

// Sample Data
const sampleTestResults: TestResultsData = {
  testId: "TEST-2024-001",
  testName: "ICAR AICE-JRF/SRF (PGS) - Mock Test 1",
  date: new Date(),
  totalQuestions: 50,
  totalMarks: 100,
  obtainedMarks: 72,
  maxMarks: 100,
  correctAnswers: 36,
  wrongAnswers: 8,
  skippedQuestions: 6,
  accuracy: 81.8,
  percentile: 87.5,
  rank: 145,
  totalParticipants: 1250,
  timeTaken: 5420, // ~90 minutes
  totalTime: 7200, // 2 hours
  questions: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    question: `Sample question ${i + 1}: This is a test question about agriculture and related sciences that was part of the mock examination.`,
    options: {
      A: `Option A for question ${i + 1}`,
      B: `Option B for question ${i + 1}`,
      C: `Option C for question ${i + 1}`,
      D: `Option D for question ${i + 1}`,
    },
    userAnswer: i % 7 === 0 ? null : (["A", "B", "C", "D"] as const)[i % 4],
    correctAnswer: (["A", "B", "C", "D"] as const)[i % 4],
    explanation:
      "This is a detailed explanation of why this answer is correct. It would include references to concepts and principles relevant to the topic.",
    subject: ["Agronomy", "Soil Science", "Plant Pathology", "Entomology"][i % 4],
    marks: 2,
    isCorrect: i % 7 === 0 ? null : i % 5 !== 0,
  })),
  subjectBreakdown: [
    { subject: "Agronomy", totalQuestions: 15, correct: 12, wrong: 2, skipped: 1, accuracy: 85.7 },
    { subject: "Soil Science", totalQuestions: 12, correct: 9, wrong: 2, skipped: 1, accuracy: 81.8 },
    { subject: "Plant Pathology", totalQuestions: 12, correct: 9, wrong: 2, skipped: 1, accuracy: 81.8 },
    { subject: "Entomology", totalQuestions: 11, correct: 6, wrong: 2, skipped: 3, accuracy: 75 },
  ],
};

// Circular Progress Component
const CircularProgress: React.FC<{
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}> = ({ value, size = 120, strokeWidth = 10, color = "#2E7D32", label, sublabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{value}%</span>
        </div>
      </div>
      {label && <p className="mt-2 font-medium">{label}</p>}
      {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
    </div>
  );
};

// Stats Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subvalue?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
}> = ({ icon, label, value, subvalue, variant = "default" }) => {
  const variants = {
    default: "bg-accent",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  };

  const textVariants = {
    default: "",
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <Card className={cn(variants[variant])}>
      <CardContent className="py-4 flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-background", textVariants[variant])}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn("text-xl font-bold", textVariants[variant])}>{value}</p>
          {subvalue && (
            <p className="text-xs text-muted-foreground">{subvalue}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Custom Bar Chart Component
const BarChart: React.FC<{ data: SubjectBreakdown[] }> = ({ data }) => {
  const maxAccuracy = Math.max(...data.map((d) => d.accuracy));

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.subject} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium truncate mr-4">{item.subject}</span>
            <span className="text-muted-foreground shrink-0">{item.accuracy}%</span>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
              style={{
                width: `${(item.accuracy / 100) * 100}%`,
                background: item.accuracy >= 80
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : item.accuracy >= 60
                  ? "linear-gradient(90deg, #f59e0b, #d97706)"
                  : "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            >
              <span className="text-xs font-medium text-white hidden sm:block">
                {item.correct}/{item.totalQuestions}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>✓{item.correct} ✗{item.wrong} −{item.skipped}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Question Review Item Component
const QuestionReviewItem: React.FC<{
  question: QuestionResult;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ question, index, isExpanded, onToggle }) => {
  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        question.isCorrect === true && "border-green-200 dark:border-green-800",
        question.isCorrect === false && "border-red-200 dark:border-red-800",
        question.isCorrect === null && "border-gray-200 dark:border-gray-700"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-accent/30 transition-colors"
      >
        {/* Status Icon */}
        <span
          className={cn(
            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            question.isCorrect === true && "bg-green-500 text-white",
            question.isCorrect === false && "bg-red-500 text-white",
            question.isCorrect === null && "bg-gray-300 dark:bg-gray-600 text-white"
          )}
        >
          {question.isCorrect === true ? (
            <CheckCircle2 className="size-4" />
          ) : question.isCorrect === false ? (
            <XCircle className="size-4" />
          ) : (
            <Minus className="size-4" />
          )}
        </span>

        {/* Question Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">Q.{question.id}</Badge>
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
              {question.subject}
            </Badge>
            <Badge
              variant={
                question.isCorrect === true
                  ? "default"
                  : question.isCorrect === false
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs ml-auto"
            >
              +{question.isCorrect === true ? question.marks : question.isCorrect === false ? -Math.round(question.marks / 3) : 0}
            </Badge>
          </div>
          <p className="text-sm line-clamp-2">{question.question}</p>

          {!isExpanded && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Your answer: <strong>{question.userAnswer || "Not Attempted"}</strong></span>
              {question.userAnswer !== question.correctAnswer && (
                <span>Correct: <strong className="text-green-600">{question.correctAnswer}</strong></span>
              )}
            </div>
          )}
        </div>

        {/* Expand/Collapse */}
        {isExpanded ? (
          <ChevronUp className="size-4 shrink-0 mt-1 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 shrink-0 mt-1 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t animate-in slide-in-from-top-2">
          {/* Options */}
          <div className="grid gap-2 pt-4">
            {(["A", "B", "C", "D"] as const).map((option) => (
              <div
                key={option}
                className={cn(
                  "p-3 rounded-md border text-sm flex items-start gap-3",
                  option === question.correctAnswer &&
                    "border-green-300 bg-green-50 dark:bg-green-900/20",
                  option === question.userAnswer &&
                    option !== question.correctAnswer &&
                    "border-red-300 bg-red-50 dark:bg-red-900/20",
                  option !== question.correctAnswer &&
                    option !== question.userAnswer &&
                    "border-border opacity-60"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    option === question.correctAnswer && "bg-green-500 text-white",
                    option === question.userAnswer &&
                      option !== question.correctAnswer &&
                      "bg-red-500 text-white"
                  )}
                >
                  {option}
                </span>
                <span>{question.options[option]}</span>
                {option === question.correctAnswer && (
                  <CheckCircle2 className="size-4 ml-auto text-green-500 shrink-0" />
                )}
                {option === question.userAnswer && option !== question.correctAnswer && (
                  <XCircle className="size-4 ml-auto text-red-500 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              💡 Explanation:
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export function TestResults({
  results = sampleTestResults,
  onRetry,
  onViewSolutions,
  onGoHome,
}: TestResultsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Filter questions
  const filteredQuestions = results.questions.filter((q) => {
    if (filterSubject !== "all" && q.subject !== filterSubject) return false;
    if (filterStatus === "correct" && q.isCorrect !== true) return false;
    if (filterStatus === "wrong" && q.isCorrect !== false) return false;
    if (filterStatus === "skipped" && q.isCorrect !== null) return false;
    return true;
  });

  // Get unique subjects
  const subjects = ["all", ...new Set(results.questions.map((q) => q.subject))];

  // Performance message
  const getPerformanceMessage = () => {
    if (results.accuracy >= 90)
      return { emoji: "🏆", message: "Outstanding Performance!", color: "text-yellow-600" };
    if (results.accuracy >= 75)
      return { emoji: "🌟", message: "Excellent Work!", color: "text-green-600" };
    if (results.accuracy >= 60)
      return { emoji: "💪", message: "Good Effort!", color: "text-blue-600" };
    return { emoji: "📚", message: "Keep Practicing!", color: "text-orange-600" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="size-4" />
            <span>{results.date.toLocaleDateString("en-IN", { dateStyle: "long" })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{results.testName}</h1>
          <p className="text-muted-foreground">Your test results are ready!</p>
        </header>

        {/* Main Score Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Score Circle */}
          <Card className="lg:col-span-1 overflow-hidden">
            <CardContent className="py-8 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">{performance.emoji}</div>
              <CircularProgress
                value={results.accuracy}
                size={160}
                strokeWidth={12}
                color={results.accuracy >= 70 ? "#22c55e" : results.accuracy >= 50 ? "#f59e0b" : "#ef4444"}
                label="Score"
                sublabel={`${results.obtainedMarks}/${results.maxMarks} marks`}
              />
              <p className={cn("mt-4 font-semibold text-lg", performance.color)}>
                {performance.message}
              </p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <StatCard
              icon={<CheckCircle2 className="size-5" />}
              label="Correct Answers"
              value={results.correctAnswers}
              subvalue={`+${results.correctAnswers * 2} marks`}
              variant="success"
            />
            <StatCard
              icon={<XCircle className="size-5" />}
              label="Wrong Answers"
              value={results.wrongAnswers}
              subvalue={`-${results.wrongAnswers * 0.67} marks`}
              variant="error"
            />
            <StatCard
              icon={<Minus className="size-5" />}
              label="Skipped Questions"
              value={results.skippedQuestions}
              subvalue={`${Math.round((results.skippedQuestions / results.totalQuestions) * 100)}% of total`}
              variant="warning"
            />
            <StatCard
              icon={<Clock className="size-5" />}
              label="Time Taken"
              value={formatTime(results.timeTaken)}
              subvalue={`of ${formatTime(results.totalTime)} available`}
              variant="info"
            />

            {/* Rank & Percentile */}
            <Card className="sm:col-span-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardContent className="py-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    {results.rank <= 10 ? (
                      <Crown className="size-6 text-primary" />
                    ) : results.rank <= 100 ? (
                      <Medal className="size-6 text-primary" />
                    ) : (
                      <Trophy className="size-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Rank</p>
                    <p className="text-2xl font-bold text-primary">
                      #{results.rank.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Percentile</p>
                  <p className="text-2xl font-bold text-primary">
                    Top {100 - results.percentile}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {results.totalParticipants.toLocaleString()} participants
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="subjects" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects" className="gap-1.5">
              <BarChart3 className="size-4" />
              Subject-wise
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-1.5">
              <BookOpen className="size-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-1.5">
              <PieChart className="size-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          {/* Subject Breakdown Tab */}
          <TabsContent value="subjects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={results.subjectBreakdown} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Review Tab */}
          <TabsContent value="questions" className="mt-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-base">Question Review</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                      <SelectTrigger className="w-36 h-8 text-sm">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s} className="text-sm">
                            {s === "all" ? "All Subjects" : s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-sm">All</SelectItem>
                        <SelectItem value="correct" className="text-sm">✓ Correct</SelectItem>
                        <SelectItem value="wrong" className="text-sm">✗ Wrong</SelectItem>
                        <SelectItem value="skipped" className="text-sm">− Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
                    <p>No questions match your filters.</p>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => (
                    <QuestionReviewItem
                      key={q.id}
                      question={q}
                      index={idx}
                      isExpanded={expandedQuestion === q.id}
                      onToggle={() =>
                        setExpandedQuestion(expandedQuestion === q.id ? null : q.id)
                      }
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Time Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="size-5" />
                    Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Time Used</span>
                        <span>{formatTime(results.timeTaken)}</span>
                      </div>
                      <Progress
                        value={(results.timeTaken / results.totalTime) * 100}
                        className="h-3"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="text-center p-2 rounded bg-accent/50">
                        <p className="text-lg font-bold">
                          {(results.timeTaken / results.totalQuestions).toFixed(1)}s
                        </p>
                        <p className="text-xs text-muted-foreground">Avg per Q</p>
                      </div>
                      <div className="text-center p-2 rounded bg-accent/50">
                        <p className="text-lg font-bold">
                          {Math.round(
                            ((results.totalTime - results.timeRemaining ?? results.totalTime) /
                              results.totalTime) *
                              100
                          )}%
                        </p>
                        <p className="text-xs text-muted-foreground">Utilization</p>
                      </div>
                      <div className="text-center p-2 rounded bg-accent/50">
                        <p className="text-lg font-bold">
                          {formatTime(Math.max(0, results.totalTime - results.timeTaken))}
                        </p>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accuracy Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="size-5" />
                    Accuracy Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                      <CheckCircle2 className="size-8 mx-auto text-green-500 mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {results.correctAnswers}
                      </p>
                      <p className="text-sm text-muted-foreground">Correct</p>
                      <p className="text-xs text-green-600">
                        {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                      <XCircle className="size-8 mx-auto text-red-500 mb-2" />
                      <p className="text-2xl font-bold text-red-600">
                        {results.wrongAnswers}
                      </p>
                      <p className="text-sm text-muted-foreground">Wrong</p>
                      <p className="text-xs text-red-600">
                        {Math.round((results.wrongAnswers / results.totalQuestions) * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Net Accuracy</span>
                      <span className="text-lg font-bold text-primary">
                        {results.accuracy}%
                      </span>
                    </div>
                    <Progress value={results.accuracy} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {results.accuracy >= 75
                        ? "Great job! You're performing above average."
                        : results.accuracy >= 50
                        ? "Good effort! Keep practicing to improve."
                        : "Don't give up! Regular practice will help you improve."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={onViewSolutions} variant="outline" size="lg">
                <FileText className="size-5 mr-2" />
                View Solutions PDF
              </Button>
              <Button variant="outline" size="lg">
                <Download className="size-5 mr-2" />
                Download Certificate
              </Button>
              <Button variant="outline" size="lg">
                <Printer className="size-5 mr-2" />
                Print Results
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="size-5 mr-2" />
                Share Results
              </Button>
              <Button onClick={onRetry} size="lg" className="bg-primary hover:bg-primary/90">
                <RotateCcw className="size-5 mr-2" />
                Retry Test
              </Button>
              {onGoHome && (
                <Button variant="ghost" size="lg" onClick={onGoHome}>
                  Go Home
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TestResults;

// Export sample data for use in other components
export { sampleTestResults };
export type { TestResultsData, QuestionResult, SubjectBreakdown };
