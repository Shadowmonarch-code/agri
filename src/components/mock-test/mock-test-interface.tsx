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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  marks: number;
  negativeMarks: number;
}

interface QuestionStatus {
  answered: boolean | null; // null = not visited, false = not answered, true = answered
  markedForReview: boolean;
  selectedOption: "A" | "B" | "C" | "D" | null;
}

interface MockTestInterfaceProps {
  examName?: string;
  subject?: string;
  duration?: number; // in minutes
  questions?: Question[];
  onSubmit?: (results: TestResults) => void;
  onExit?: () => void;
}

interface TestResults {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  markedForReview: number;
  totalMarks: number;
  timeTaken: number;
  answers: Record<number, "A" | "B" | "C" | "D" | null>;
}

// Sample questions data
const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "Which of the following is the primary method of vegetative propagation in banana?",
    options: {
      A: "Suckers",
      B: "Rhizomes",
      C: "Tubers",
      D: "Cuttings",
    },
    correctAnswer: "A",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 2,
    text: "The process of converting atmospheric nitrogen into ammonia by bacteria is called:",
    options: {
      A: "Ammonification",
      B: "Nitrification",
      C: "Nitrogen fixation",
      D: "Denitrification",
    },
    correctAnswer: "C",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 3,
    text: "Which soil type is best suited for paddy cultivation?",
    options: {
      A: "Sandy soil",
      B: "Clay soil",
      C: "Loamy soil",
      D: "Laterite soil",
    },
    correctAnswer: "B",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 4,
    text: "The optimum pH range for most agricultural crops is:",
    options: {
      A: "4.0 - 5.5",
      B: "5.5 - 6.5",
      C: "6.0 - 7.5",
      D: "7.5 - 8.5",
    },
    correctAnswer: "C",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 5,
    text: "Green Revolution in India was primarily associated with which crop?",
    options: {
      A: "Wheat",
      B: "Rice",
      C: "Pulses",
      D: "Oilseeds",
    },
    correctAnswer: "A",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 6,
    text: "Which micronutrient deficiency causes 'whiptail' disease in cauliflower?",
    options: {
      A: "Zinc",
      B: "Boron",
      C: "Molybdenum",
      D: "Manganese",
    },
    correctAnswer: "C",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 7,
    text: "The scientific name of wheat is:",
    options: {
      A: "Oryza sativa",
      B: "Triticum aestivum",
      C: "Zea mays",
      D: "Hordeum vulgare",
    },
    correctAnswer: "B",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 8,
    text: "Which irrigation method is most efficient in terms of water use?",
    options: {
      A: "Flood irrigation",
      B: "Furrow irrigation",
      C: "Drip irrigation",
      D: "Sprinkler irrigation",
    },
    correctAnswer: "C",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 9,
    text: "Biofertilizer Rhizobium is used for which crop?",
    options: {
      A: "Wheat",
      B: "Rice",
      C: "Legumes",
      D: "Potato",
    },
    correctAnswer: "C",
    marks: 2,
    negativeMarks: 0.66,
  },
  {
    id: 10,
    text: "The term 'Zero Tillage' refers to:",
    options: {
      A: "No use of fertilizers",
      B: "No plowing of field before sowing",
      C: "No use of pesticides",
      D: "No irrigation",
    },
    correctAnswer: "B",
    marks: 2,
    negativeMarks: 0.66,
  },
];

// Generate more sample questions to reach 50
const generateQuestions = (count: number): Question[] => {
  const baseQuestions = [...sampleQuestions];
  while (baseQuestions.length < count) {
    const newQuestion: Question = {
      id: baseQuestions.length + 1,
      text: `Sample question ${baseQuestions.length + 1}: This is a test question about agriculture and related sciences for practice purposes.`,
      options: {
        A: `Option A for question ${baseQuestions.length + 1}`,
        B: `Option B for question ${baseQuestions.length + 1}`,
        C: `Option C for question ${baseQuestions.length + 1}`,
        D: `Option D for question ${baseQuestions.length + 1}`,
      },
      correctAnswer: (["A", "B", "C", "D"] as const)[Math.floor(Math.random() * 4)],
      marks: 2,
      negativeMarks: 0.66,
    };
    baseQuestions.push(newQuestion);
  }
  return baseQuestions;
};

// Timer Component
const ExamTimer: React.FC<{
  duration: number;
  onTimeUp: () => void;
  timeRemaining: number;
}> = ({ duration, onTimeUp, timeRemaining }) => {
  const getTimerColor = () => {
    if (timeRemaining <= 300) return "text-red-600 dark:text-red-400"; // < 5 min
    if (timeRemaining <= 600) return "text-orange-500 dark:text-orange-400"; // < 10 min
    return "text-primary";
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors",
        timeRemaining <= 300 && "bg-red-100 dark:bg-red-900/30 animate-pulse",
        timeRemaining > 300 &&
          timeRemaining <= 600 &&
          "bg-orange-100 dark:bg-orange-900/20"
      )}
    >
      <Clock className={cn("size-5", getTimerColor())} />
      <span className={getTimerColor()}>{formatTime(timeRemaining)}</span>
    </div>
  );
};

// Question Palette Component
const QuestionPalette: React.FC<{
  questionsCount: number;
  currentQuestion: number;
  statuses: Record<number, QuestionStatus>;
  onQuestionSelect: (id: number) => void;
}> = ({ questionsCount, currentQuestion, statuses, onQuestionSelect }) => {
  const getStatusColor = (id: number) => {
    const status = statuses[id];
    if (!status || !status.answered && !status.markedForReview) {
      // Not visited/not answered
      return currentQuestion === id
        ? "bg-blue-500 border-blue-600 text-white"
        : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600";
    }
    if (status.markedForReview && status.answered) {
      // Answered and marked for review
      return currentQuestion === id
        ? "bg-purple-600 border-purple-700 text-white"
        : "bg-purple-500 border-purple-600 text-white";
    }
    if (status.markedForReview) {
      // Marked for review only
      return currentQuestion === id
        ? "bg-purple-400 border-purple-500 text-white"
        : "bg-purple-300 border-purple-400 text-purple-800";
    }
    if (status.answered) {
      // Answered
      return currentQuestion === id
        ? "bg-green-600 border-green-700 text-white"
        : "bg-green-500 border-green-600 text-white";
    }
    return currentQuestion === id
      ? "bg-blue-500 border-blue-600 text-white"
      : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600";
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-4 rounded bg-green-500"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-4 rounded bg-red-500"></span>
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-4 rounded bg-blue-500"></span>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-4 rounded bg-purple-500"></span>
          <span>Marked</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: questionsCount }, (_, i) => i + 1).map((id) => (
          <button
            key={id}
            onClick={() => onQuestionSelect(id)}
            className={cn(
              "w-full aspect-square rounded-md border-2 flex items-center justify-center text-sm font-medium transition-all active:scale-95",
              getStatusColor(id)
            )}
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Component
export function MockTestInterface({
  examName = "ICAR AICE-JRF/SRF (PGS) 2024",
  subject = "Agriculture",
  duration = 180, // 3 hours
  questions: initialQuestions,
  onSubmit,
  onExit,
}: MockTestInterfaceProps) {
  const [questions] = useState<Question[]>(initialQuestions || generateQuestions(50));
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Initialize question statuses
  const initializeStatuses = useCallback(() => {
    const statuses: Record<number, QuestionStatus> = {};
    questions.forEach((q) => {
      statuses[q.id] = {
        answered: false,
        markedForReview: false,
        selectedOption: null,
      };
    });
    return statuses;
  }, [questions]);

  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>(initializeStatuses);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (option: "A" | "B" | "C" | "D") => {
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        selectedOption: option,
        answered: true,
      },
    }));
  };

  const handleClearSelection = () => {
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        selectedOption: null,
        answered: false,
      },
    }));
  };

  const handleMarkForReview = () => {
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        markedForReview: !prev[currentQuestion].markedForReview,
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = (): TestResults => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let totalMarks = 0;

    Object.entries(questionStatuses).forEach(([id, status]) => {
      const question = questions.find((q) => q.id === parseInt(id));
      if (!question) return;

      if (status.selectedOption === null) {
        skipped++;
      } else if (status.selectedOption === question.correctAnswer) {
        correct++;
        totalMarks += question.marks;
      } else {
        wrong++;
        totalMarks -= question.negativeMarks;
      }
    });

    const answers: Record<number, "A" | "B" | "C" | "D" | null> = {};
    Object.entries(questionStatuses).forEach(([id, status]) => {
      answers[parseInt(id)] = status.selectedOption;
    });

    return {
      totalQuestions: questions.length,
      attempted: correct + wrong,
      correct,
      wrong,
      skipped,
      markedForReview: Object.values(questionStatuses).filter((s) => s.markedForReview).length,
      totalMarks,
      timeTaken: duration * 60 - timeRemaining,
      answers,
    };
  };

  const handleSubmit = (isAutoSubmit = false) => {
    const results = calculateResults();
    onSubmit?.(results);
    setShowSubmitDialog(false);
  };

  const currentQ = questions.find((q) => q.id === currentQuestion);
  const currentStatus = questionStatuses[currentQuestion];

  // Calculate stats for submit dialog
  const stats = {
    answered: Object.values(questionStatuses).filter((s) => s.answered).length,
    notAnswered: Object.values(questionStatuses).filter((s) => !s.answered && s.answered !== null).length,
    marked: Object.values(questionStatuses).filter((s) => s.markedForReview).length,
    notVisited: Object.values(questionStatuses).filter((s) => s.answered === null).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                {isSidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
              </Button>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg line-clamp-1">{examName}</h1>
                <p className="text-sm text-muted-foreground">{subject}</p>
              </div>
            </div>

            {/* Center - Mobile Title */}
            <div className="sm:hidden text-center flex-1 min-w-0">
              <h1 className="font-semibold text-sm truncate">{examName}</h1>
            </div>

            {/* Right Section - Stats & Timer */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-green-500" />
                  <span>{stats.answered} Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flag className="size-4 text-purple-500" />
                  <span>{stats.marked} Marked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="size-4 text-red-500" />
                  <span>{stats.notAnswered + stats.notVisited} Remaining</span>
                </div>
              </div>

              <ExamTimer
                duration={duration}
                timeRemaining={timeRemaining}
                onTimeUp={() => {}}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="hidden sm:flex">
                    <Send className="size-4 mr-1" />
                    Submit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to exit? Your progress will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                    <AlertDialogAction onClick={onExit}>Exit Now</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="flex gap-6">
          {/* Sidebar - Question Palette */}
          <aside
            className={cn(
              "transition-all duration-300 lg:w-72 shrink-0",
              isSidebarOpen ? "block w-full sm:w-64" : "hidden lg:block"
            )}
          >
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="size-5" />
                  Question Palette
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionPalette
                  questionsCount={questions.length}
                  currentQuestion={currentQuestion}
                  statuses={questionStatuses}
                  onQuestionSelect={setCurrentQuestion}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Main Question Area */}
          <main className="flex-1 min-w-0 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Question {currentQuestion} of {questions.length}
                </span>
                <span>{Math.round((currentQuestion / questions.length) * 100)}% Complete</span>
              </div>
              <Progress value={(currentQuestion / questions.length) * 100} />
            </div>

            {/* Question Card */}
            {currentQ && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5 shrink-0">
                        Q.{currentQ.id}
                      </Badge>
                      <CardTitle className="text-lg leading-relaxed">
                        {currentQ.text}
                      </CardTitle>
                    </div>
                    <Badge
                      variant={currentQ.marks > 1 ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      +{currentQ.marks} / -{currentQ.negativeMarks}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                  {/* Options */}
                  <div className="grid gap-3">
                    {(["A", "B", "C", "D"] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 group hover:border-primary/50",
                          currentStatus?.selectedOption === option
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:bg-accent/50"
                        )}
                      >
                        <span
                          className={cn(
                            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                            currentStatus?.selectedOption === option
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30 group-hover:border-primary/50"
                          )}
                        >
                          {option}
                        </span>
                        <span className="pt-1 text-base">{currentQ.options[option]}</span>
                        {currentStatus?.selectedOption === option && (
                          <CheckCircle2 className="size-5 text-primary ml-auto shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkForReview}
                      className={cn(
                        currentStatus?.markedForReview &&
                          "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                      )}
                    >
                      <Flag
                        className={cn(
                          "size-4 mr-1.5",
                          currentStatus?.markedForReview && "fill-current"
                        )}
                      />
                      {currentStatus?.markedForReview ? "Unmark Review" : "Mark for Review"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSelection}
                      disabled={!currentStatus?.selectedOption}
                    >
                      <RotateCcw className="size-4 mr-1.5" />
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Footer */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 1}
                    size="lg"
                  >
                    <ChevronLeft className="size-5 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="size-4" />
                    <span>
                      {Object.values(questionStatuses).filter((s) => s.answered).length} of{" "}
                      {questions.length} answered
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {currentQuestion === questions.length ? (
                      <Button onClick={() => setShowSubmitDialog(true)} size="lg" className="bg-green-600 hover:bg-green-700">
                        <Send className="size-5 mr-1" />
                        Submit Test
                      </Button>
                    ) : (
                      <Button onClick={handleNext} size="lg">
                        Next
                        <ChevronRight className="size-5 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-500" />
              Confirm Submission
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.answered}</p>
                <p className="text-xs text-muted-foreground">Answered</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {questions.length - stats.answered}
                </p>
                <p className="text-xs text-muted-foreground">Not Answered</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.marked}</p>
                <p className="text-xs text-muted-foreground">Marked for Review</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-center">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(((duration * 60 - timeRemaining) / (duration * 60)) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Time Used</p>
              </div>
            </div>

            {stats.notAnswered + stats.notVisited > 0 && (
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ You have {stats.notAnswered + stats.notVisited} unanswered questions. 
                  Make sure to attempt all questions before submitting.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Test
            </Button>
            <Button onClick={() => handleSubmit()} className="bg-green-600 hover:bg-green-700">
              <Send className="size-4 mr-2" />
              Submit Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t lg:hidden z-30">
        <Button
          onClick={() => setShowSubmitDialog(true)}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Send className="size-5 mr-2" />
          Submit Test ({stats.answered}/{questions.length} answered)
        </Button>
      </div>
    </div>
  );
}

export default MockTestInterface;
