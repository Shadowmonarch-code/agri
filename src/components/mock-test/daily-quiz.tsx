"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  Share2,
  Calendar,
  Star,
  Target,
  Zap,
  Medal,
  TrendingUp,
  Users,
  Crown,
  Award,
  RotateCcw,
  Play,
  Gift,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface DailyQuestion {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

interface DailyQuizState {
  status: "not-started" | "in-progress" | "completed";
  currentQuestion: number;
  answers: Record<number, "A" | "B" | "C" | "D" | null>;
  timeRemaining: number;
}

interface QuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  rank?: number;
  totalParticipants?: number;
  percentile?: number;
}

interface DailyQuizProps {
  date?: Date;
  onQuizComplete?: (results: QuizResults) => void;
  streakCount?: number;
  bestScore?: number;
}

// Sample Daily Questions
const dailyQuestions: DailyQuestion[] = [
  {
    id: 1,
    text: "Which vitamin is synthesized by plants but required by humans?",
    options: {
      A: "Vitamin A",
      B: "Vitamin C",
      C: "Vitamin D",
      D: "Vitamin K",
    },
    correctAnswer: "B",
    explanation:
      "Vitamin C (ascorbic acid) is synthesized by plants and most animals, but humans lack the enzyme L-gulonolactone oxidase needed for its synthesis, making it an essential nutrient that must be obtained through diet.",
  },
  {
    id: 2,
    text: "The 'Golden Rice' is genetically modified to be rich in:",
    options: {
      A: "Vitamin A (beta-carotene)",
      B: "Iron",
      C: "Protein",
      D: "Zinc",
    },
    correctAnswer: "A",
    explanation:
      "Golden Rice is genetically engineered to produce beta-carotene, a precursor of Vitamin A, in the endosperm of rice grains. This was developed to address Vitamin A deficiency in developing countries.",
  },
  {
    id: 3,
    text: "Which agricultural practice helps in nitrogen fixation?",
    options: {
      A: "Crop rotation with legumes",
      B: "Monoculture",
      C: "Deep tillage",
      D: "Excessive fertilization",
    },
    correctAnswer: "A",
    explanation:
      "Crop rotation with legumes (like pulses, soybeans) helps in nitrogen fixation because legumes have symbiotic relationship with Rhizobium bacteria that fix atmospheric nitrogen into soil-available forms.",
  },
  {
    id: 4,
    text: "The process of 'vermicomposting' uses which organism?",
    options: {
      A: "Bacteria",
      B: "Fungi",
      C: "Earthworms",
      D: "Nematodes",
    },
    correctAnswer: "C",
    explanation:
      "Vermicomposting uses earthworms (mainly Eisenia fetida - red wiggler worms) to decompose organic waste into nutrient-rich vermicast. Earthworms enhance microbial activity and produce castings rich in nutrients.",
  },
  {
    id: 5,
    text: "Which is the largest producer of milk in the world?",
    options: {
      A: "USA",
      B: "China",
      C: "India",
      D: "European Union",
    },
    correctAnswer: "C",
    explanation:
      "India has been the world's largest milk producer since 1998, accounting for about 22% of global production. The White Revolution led by Dr. Verghese Kurien transformed India from a milk-deficient nation to the world's largest producer.",
  },
  {
    id: 6,
    text: "The term 'Zero Budget Natural Farming' (ZBNF) was popularized by:",
    options: {
      A: "Dr. M.S. Swaminathan",
      B: "Subhash Palekar",
      C: "Dr. R.H. Richharia",
      D: "Dr. Vandana Shiva",
    },
    correctAnswer: "B",
    explanation:
      "Subhash Palekar, known as the 'Father of ZBNF' in India, developed this farming method that eliminates the use of chemical pesticides and promotes natural inputs like Jeevamritha, Beejamritha, and mulching.",
  },
  {
    id: 7,
    text: "Which pest causes 'tungro disease' in rice?",
    options: {
      A: "Stem borer",
      B: "Green leafhopper",
      C: "Brown plant hopper",
      D: "Gall midge",
    },
    correctAnswer: "B",
    explanation:
      "Tungro disease in rice is caused by a virus complex transmitted primarily by green leafhoppers (Nephotettix virescens). The disease causes stunting and yellow-orange discoloration of leaves.",
  },
];

// Timer Component
const QuizTimer: React.FC<{
  seconds: number;
  isActive: boolean;
  className?: string;
}> = ({ seconds, isActive, className }) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold transition-colors",
        seconds <= 60 && isActive && "bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse",
        seconds > 60 && "bg-primary/10 text-primary",
        className
      )}
    >
      <Clock
        className={cn(
          "size-5",
          seconds <= 60 && isActive ? "text-red-500" : "text-primary"
        )}
      />
      <span>
        {minutes.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

// Streak Badge Component
const StreakBadge: React.FC<{ count: number; bestScore?: number }> = ({
  count,
  bestScore,
}) => (
  <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 border-none text-white">
    <CardContent className="py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <Flame className="size-6 fill-white" />
        </div>
        <div>
          <p className="text-sm opacity-90">Daily Streak</p>
          <p className="text-3xl font-bold">{count} days</p>
        </div>
      </div>
      {bestScore !== undefined && (
        <div className="text-right">
          <p className="text-sm opacity-90">Best Score</p>
          <p className="text-xl font-bold">{bestScore}/{dailyQuestions.length}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

// Results Screen Component
const ResultsScreen: React.FC<{
  results: QuizResults;
  streakCount: number;
  onShare: () => void;
  onRetry: () => void;
  onClose: () => void;
}> = ({ results, streakCount, onShare, onRetry, onClose }) => {
  const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { emoji: "🏆", message: "Outstanding!", color: "text-yellow-600 dark:text-yellow-400" };
    if (percentage >= 70) return { emoji: "🌟", message: "Great Job!", color: "text-green-600 dark:text-green-400" };
    if (percentage >= 50) return { emoji: "💪", message: "Good Effort!", color: "text-blue-600 dark:text-blue-400" };
    return { emoji: "📚", message: "Keep Practicing!", color: "text-orange-600 dark:text-orange-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Result Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-white text-center">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h2 className="text-3xl font-bold mb-2">{performance.message}</h2>
          <p className="opacity-90">Daily Quiz Completed!</p>

          {/* Score Circle */}
          <div className="mt-6 inline-flex items-center justify-center size-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30">
            <div className="text-center">
              <p className="text-5xl font-bold">{percentage}%</p>
              <p className="text-sm opacity-80">Score</p>
            </div>
          </div>
        </div>

        <CardContent className="py-6 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="size-6 mx-auto text-green-500 mb-1" />
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.correctAnswers}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <XCircle className="size-6 mx-auto text-red-500 mb-1" />
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {results.totalQuestions - results.correctAnswers}
              </p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Clock className="size-6 mx-auto text-blue-500 mb-1" />
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, "0")}
              </p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Flame className="size-6 mx-auto text-purple-500 mb-1" />
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{streakCount}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>

          {/* Leaderboard Position */}
          {results.rank && results.totalParticipants && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400">
                    {results.rank === 1 ? (
                      <Crown className="size-5 text-white" />
                    ) : results.rank <= 10 ? (
                      <Medal className="size-5 text-white" />
                    ) : (
                      <Award className="size-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Your Rank</p>
                    <p className="text-sm text-muted-foreground">
                      #{results.rank} of {results.totalParticipants.toLocaleString()} participants
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    Top {Math.round(results.percentile || 0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Percentile</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button onClick={onShare} variant="outline" className="flex-1 sm:flex-none">
              <Share2 className="size-4 mr-2" />
              Share Results
            </Button>
            <Button onClick={onRetry} variant="outline" className="flex-1 sm:flex-none">
              <RotateCcw className="size-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={onClose} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90">
              Continue
              <ChevronRight className="size-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="size-5" />
            Question Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyQuestions.map((q, index) => {
            const userAnswer = Object.values({})[q.id] as "A" | "B" | "C" | "D" | null; // Placeholder
            // For demo, we'll show all as correct except one wrong
            const isCorrect = index !== 2; // Demo: question 3 is wrong
            
            return (
              <div
                key={q.id}
                className={cn(
                  "p-3 rounded-lg border flex items-start gap-3",
                  isCorrect
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                    isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  )}
                >
                  {isCorrect ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1">{q.text}</p>
                  {!isCorrect && (
                    <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                      Correct answer: <strong>{q.correctAnswer}</strong>
                    </p>
                  )}
                </div>
                <Badge variant={isCorrect ? "secondary" : "destructive"} className="shrink-0">
                  Q.{index + 1}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

// Main Component
export function DailyQuiz({
  date = new Date(),
  onQuizComplete,
  streakCount = 7,
  bestScore = 6,
}: DailyQuizProps) {
  const [quizState, setQuizState] = useState<DailyQuizState>({
    status: "not-started",
    currentQuestion: 0,
    answers: {},
    timeRemaining: 300, // 5 minutes for daily quiz
  });

  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    if (quizState.status !== "in-progress") return;

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          handleQuizComplete(prev);
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.status]);

  const startQuiz = () => {
    setQuizState({
      status: "in-progress",
      currentQuestion: 0,
      answers: {},
      timeRemaining: 300,
    });
    setSelectedOption(null);
    setShowExplanation(false);
    setShowResults(false);
  };

  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    setSelectedOption(option);
    setQuizState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [dailyQuestions[prev.currentQuestion].id]: option },
    }));
  };

  const handleNext = () => {
    setShowExplanation(true); // Show explanation before moving

    setTimeout(() => {
      if (quizState.currentQuestion < dailyQuestions.length - 1) {
        setQuizState((prev) => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
        }));
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        handleQuizComplete(quizState);
      }
    }, showExplanation ? 300 : 1500); // If already shown, move quickly
  };

  const handleQuizComplete = (state: DailyQuizState) => {
    // Calculate results (demo)
    let correctCount = 0;
    dailyQuestions.forEach((q) => {
      if (state.answers[q.id] === q.correctAnswer) correctCount++;
    });

    const results: QuizResults = {
      score: correctCount * 10,
      totalQuestions: dailyQuestions.length,
      correctAnswers: correctCount,
      timeTaken: 300 - state.timeRemaining,
      rank: Math.floor(Math.random() * 100) + 1,
      totalParticipants: 1250 + Math.floor(Math.random() * 500),
      percentile: 85 + Math.floor(Math.random() * 14),
    };

    setQuizResults(results);
    setShowResults(true);
    setQuizState((prev) => ({ ...prev, status: "completed" }));
    onQuizComplete?.(results);
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentQuestion = dailyQuestions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / dailyQuestions.length) * 100;

  // Not Started Screen
  if (quizState.status === "not-started" && !showResults) {
    return (
      <div className="min-h-screen bg-background py-6">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Calendar className="size-4" />
              <span className="text-sm font-medium">{formatDate(date)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Quiz Challenge</h1>
            <p className="text-muted-foreground">
              Test your knowledge with today&apos;s quiz!
            </p>
          </div>

          {/* Streak Card */}
          <StreakBadge count={streakCount} bestScore={bestScore} />

          {/* Quiz Info Card */}
          <Card className="mt-6 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Zap className="size-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Today&apos;s Challenge</h2>
                  <p className="text-muted-foreground">
                    {dailyQuestions.length} questions • 5 minutes • Instant results
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="py-6 space-y-6">
              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-accent/50">
                  <Target className="size-6 mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">{dailyQuestions.length} Questions</p>
                  <p className="text-xs text-muted-foreground">Mixed topics</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/50">
                  <Clock className="size-6 mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">5 Minutes</p>
                  <p className="text-xs text-muted-foreground">Time limit</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/50">
                  <Trophy className="size-6 mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">Ranking</p>
                  <p className="text-xs text-muted-foreground">Leaderboard</p>
                </div>
              </div>

              {/* Rewards Preview */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <Gift className="size-8 text-yellow-500 shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Complete today&apos;s quiz to maintain your streak!
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      You&apos;re on a {streakCount}-day streak. Don&apos;t break it! 🔥
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <Button onClick={startQuiz} size="lg" className="w-full text-lg py-6">
                <Play className="size-6 mr-2" />
                Start Today&apos;s Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Previous Days Summary */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-5" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => {
                  const pastDate = new Date(date);
                  pastDate.setDate(pastDate.getDate() - (i + 1));
                  const score = 5 + Math.floor(Math.random() * 3);
                  
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                          {pastDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={score >= 6 ? "default" : "secondary"}>
                          {score}/{dailyQuestions.length}
                        </Badge>
                        <Star className={cn("size-4", score >= 6 ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // In Progress Screen
  if (quizState.status === "in-progress" && !showResults) {
    return (
      <div className="min-h-screen bg-background py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-card border-b shadow-sm mb-6">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden sm:inline-flex">
                  <Sparkles className="size-3 mr-1" />
                  Daily Quiz
                </Badge>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Q.{quizState.currentQuestion + 1} of {dailyQuestions.length}
                </span>
              </div>
              
              <QuizTimer
                seconds={quizState.timeRemaining}
                isActive={true}
              />
            </div>
            
            {/* Progress Bar */}
            <div className="px-4 pb-3">
              <Progress value={progress} className="h-2" />
            </div>
          </header>

          {/* Question Card */}
          {currentQuestion && (
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {/* Options */}
                <div className="grid gap-3">
                  {(["A", "B", "C", "D"] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelectOption(option)}
                      disabled={!!selectedOption}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 group",
                        selectedOption === option
                          ? option === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : selectedOption
                          ? "border-border opacity-50 cursor-not-allowed"
                          : "border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer active:scale-[0.99]"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                          selectedOption === option
                            ? option === currentQuestion.correctAnswer
                              ? "bg-green-500 border-green-500 text-white"
                              : "bg-red-500 border-red-500 text-white"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {selectedOption === option ? (
                          option === currentQuestion.correctAnswer ? (
                            <CheckCircle2 className="size-5" />
                          ) : (
                            <XCircle className="size-5" />
                          )
                        ) : (
                          option
                        )}
                      </span>
                      <span className="pt-1.5">{currentQuestion.options[option]}</span>
                    </button>
                  ))}
                </div>

                {/* Explanation (shown after selection) */}
                {showExplanation && selectedOption && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className="w-full"
                    size="lg"
                  >
                    {quizState.currentQuestion < dailyQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ChevronRight className="size-5 ml-2" />
                      </>
                    ) : (
                      <>
                        See Results
                        <Trophy className="size-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-background py-6">
        <div className="container mx-auto px-4 max-w-2xl">
          <ResultsScreen
            results={quizResults}
            streakCount={streakCount}
            onShare={() => setShareDialogOpen(true)}
            onRetry={() => {
              setShowResults(false);
              startQuiz();
            }}
            onClose={() => {
              setQuizState({ ...quizState, status: "not-started" });
              setShowResults(false);
            }}
          />
        </div>
      </div>
    );
  }

  // Share Dialog
  return (
    <>
      {/* Default fallback */}
      <div className="min-h-screen bg-background py-6">
        <div className="container mx-auto px-4 max-w-2xl">
          <StreakBadge count={streakCount} bestScore={bestScore} />
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <Button onClick={startQuiz} size="lg">
                <Play className="size-5 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="size-5" />
              Share Your Results
            </DialogTitle>
            <DialogDescription>
              Show off your quiz performance to friends!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-center">
              <p className="text-lg font-medium mb-2">
                🎯 AgriVerse Academy Daily Quiz
              </p>
              <p className="text-3xl font-bold text-primary mb-1">
                {quizResults?.correctAnswers}/{quizResults?.totalQuestions} Correct
              </p>
              <p className="text-muted-foreground">
                Score: {quizResults?.score} points • Rank #{quizResults?.rank}
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                🔥 {streakCount}-day streak!
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `🎯 AgriVerse Daily Quiz\n${quizResults?.correctAnswers}/${quizResults?.totalQuestions} Correct\nScore: ${quizResults?.score} pts • Rank #${quizResults?.rank}\n🔥 ${streakCount}-day streak!\n#AgriVerseAcademy`
                );
                setShareDialogOpen(false);
              }}
            >
              Copy Text
            </Button>
            <Button onClick={() => setShareDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DailyQuiz;
