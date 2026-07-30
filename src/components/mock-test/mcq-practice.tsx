"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Bookmark,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Flame,
  Target,
  Eye,
  EyeOff,
  Filter,
  Play,
  GraduationCap,
  Star,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface MCQQuestion {
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
  hint: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
  chapter: string;
  department: string;
}

interface PracticeStats {
  totalAttempted: number;
  correct: number;
  wrong: number;
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
}

interface MCQPracticeProps {
  questions?: MCQQuestion[];
  onComplete?: (stats: PracticeStats) => void;
}

// Sample Questions Data
const sampleQuestions: MCQQuestion[] = [
  {
    id: 1,
    text: "Which of the following is the most important greenhouse gas contributing to global warming?",
    options: {
      A: "Methane (CH₄)",
      B: "Carbon Dioxide (CO₂)",
      C: "Nitrous Oxide (N₂O)",
      D: "Water Vapor (H₂O)",
    },
    correctAnswer: "B",
    explanation:
      "Carbon dioxide (CO₂) is the primary greenhouse gas responsible for global warming. It accounts for about 76% of all greenhouse gas emissions. While other gases like methane have higher warming potential per molecule, CO₂'s abundance and long atmospheric lifetime make it the most significant contributor.",
    hint: "Think about which gas is most commonly associated with burning fossil fuels and human activities.",
    difficulty: "Easy",
    subject: "Environmental Science",
    chapter: "Climate Change",
    department: "Agronomy",
  },
  {
    id: 2,
    text: "The process of converting atmospheric nitrogen into ammonia by microorganisms is called:",
    options: {
      A: "Ammonification",
      B: "Nitrification",
      C: "Nitrogen Fixation",
      D: "Denitrification",
    },
    correctAnswer: "C",
    explanation:
      "Nitrogen fixation is the process by which atmospheric nitrogen (N₂) is converted into ammonia (NH₃) or related nitrogenous compounds. This can occur through biological processes (by bacteria like Rhizobium), industrial processes (Haber-Bosch), or through lightning. Ammonification converts organic N to NH₃, nitrification converts NH₃ to NO₃⁻, and denitrification converts NO₃⁻ back to N₂.",
    hint: "The name suggests 'fixing' or capturing something from the air.",
    difficulty: "Easy",
    subject: "Soil Science",
    chapter: "Nitrogen Cycle",
    department: "Soil Science",
  },
  {
    id: 3,
    text: "Which soil order has the highest cation exchange capacity (CEC)?",
    options: {
      A: "Entisols",
      B: "Vertisols",
      C: "Oxisols",
      D: "Spodosols",
    },
    correctAnswer: "B",
    explanation:
      "Vertisols have the highest CEC among soil orders due to their high content of 2:1 expanding clay minerals (smectite). These clays have large surface areas and high negative charges that attract and hold cations. Vertisols are clay-rich soils (>30% clay) that shrink and swell with moisture changes.",
    hint: "This soil type is known for its high clay content and shrinking/swelling properties.",
    difficulty: "Medium",
    subject: "Soil Science",
    chapter: "Soil Classification",
    department: "Soil Science",
  },
  {
    id: 4,
    text: "The optimum temperature for photosynthesis in C4 plants is approximately:",
    options: {
      A: "15-20°C",
      B: "25-30°C",
      C: "30-40°C",
      D: "40-50°C",
    },
    correctAnswer: "C",
    explanation:
      "C4 plants like maize, sugarcane, and sorghum have an optimal temperature range of 30-40°C for photosynthesis. This is higher than C3 plants (20-30°C) because C4 plants have a CO2 concentrating mechanism that reduces photorespiration at higher temperatures. The enzyme PEP carboxylase has higher affinity for CO2 than Rubisco.",
    hint: "C4 plants evolved in hot environments and perform better at higher temperatures than C3 plants.",
    difficulty: "Medium",
    subject: "Plant Physiology",
    chapter: "Photosynthesis",
    department: "Plant Breeding & Genetics",
  },
  {
    id: 5,
    text: "Which gene was used in the development of Bt cotton?",
    options: {
      A: "cry1Ab",
      b: "cry1Ac",
      C: "cry2Ab",
      D: "cry9C",
    },
    correctAnswer: "B",
    explanation:
      "The cry1Ac gene from Bacillus thuringiensis (Bt) was used in developing Bt cotton varieties in India. This gene produces a protein toxic to lepidopteran pests like American bollworm (Helicoverpa armigera). The cry1Ac toxin binds to specific receptors in the insect gut, causing pore formation and cell lysis.",
    hint: "This specific cry gene variant is most effective against bollworms.",
    difficulty: "Hard",
    subject: "Biotechnology",
    chapter: "Transgenic Crops",
    department: "Biotechnology",
  },
  {
    id: 6,
    text: "The term 'Green Revolution' in India is primarily associated with:",
    options: {
      A: "Dr. M.S. Swaminathan",
      B: "Dr. Verghese Kurien",
      C: "Dr. Norman Borlaug",
      D: "Dr. Panchwati Parida",
    },
    correctAnswer: "A",
    explanation:
      "While Dr. Norman Borlaug developed the semi-dwarf wheat varieties, Dr. M.S. Swaminathan is considered the 'Father of Green Revolution in India' for his role in introducing and adapting these high-yielding varieties to Indian conditions. Dr. Verghese Kurien is known as the 'Father of White Revolution' (milk production).",
    hint: "This scientist is often called the Father of Green Revolution in India specifically.",
    difficulty: "Easy",
    subject: "Agricultural Extension",
    chapter: "Agricultural Development",
    department: "Agricultural Extension",
  },
  {
    id: 7,
    text: "Which irrigation method has the highest water use efficiency?",
    options: {
      A: "Surface irrigation",
      B: "Sprinkler irrigation",
      C: "Drip irrigation",
      D: "Subsurface irrigation",
    },
    correctAnswer: "C",
    explanation:
      "Drip irrigation has the highest water use efficiency (90-95%) among irrigation methods because it delivers water directly to the root zone, minimizing losses due to evaporation, runoff, and deep percolation. Surface irrigation has the lowest efficiency (40-60%), followed by sprinkler (70-80%).",
    hint: "This method delivers water drop by drop directly to plant roots.",
    difficulty: "Easy",
    subject: "Irrigation",
    chapter: "Irrigation Methods",
    department: "Agricultural Engineering",
  },
  {
    id: 8,
    text: "The biofertilizer Azotobacter is used for which type of crops?",
    options: {
      A: "Leguminous crops only",
      B: "Non-leguminous crops",
      C: "Paddy crop only",
      D: "All types of crops",
    },
    correctAnswer: "B",
    explanation:
      "Azotobacter is a free-living nitrogen-fixing bacterium used for non-leguminous crops like cereals, vegetables, and fruits. Unlike Rhizobium which forms symbiotic association with legumes, Azotobacter fixes nitrogen independently in the soil. It can fix 15-20 kg N/ha/year.",
    hint: "Unlike Rhizobium, this bacterium doesn't need a plant host to fix nitrogen.",
    difficulty: "Medium",
    subject: "Soil Science",
    chapter: "Biofertilizers",
    department: "Soil Science",
  },
];

// Generate more practice questions
const generateMoreQuestions = (): MCQQuestion[] => {
  const additionalQuestions: MCQQuestion[] = [];
  const subjects = ["Plant Pathology", "Entomology", "Horticulture", "Agricultural Economics"];
  const chapters = ["Fundamentals", "Advanced Topics", "Applications", "Research"];
  const difficulties: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];

  for (let i = 0; i < 50; i++) {
    additionalQuestions.push({
      id: 9 + i,
      text: `Practice Question ${i + 9}: This is a ${difficulties[i % 3].toLowerCase()} level question about ${subjects[i % subjects.length]} covering topics important for ICAR examinations.`,
      options: {
        A: `Option A - Possible answer for question ${i + 9}`,
        B: `Option B - Another possible answer`,
        C: `Option C - Consider this option carefully`,
        D: `Option D - Final option to evaluate`,
      },
      correctAnswer: (["A", "B", "C", "D"] as const)[i % 4],
      explanation: `This is the detailed explanation for question ${i + 9}. In actual implementation, this would contain comprehensive information about why this answer is correct and why others are incorrect.`,
      hint: `Hint for question ${i + 9}: Think about the fundamental concepts you learned.`,
      difficulty: difficulties[i % 3],
      subject: subjects[i % subjects.length],
      chapter: chapters[i % chapters.length],
      department: subjects[i % subjects.length],
    });
  }

  return [...sampleQuestions, ...additionalQuestions];
};

// Stats Display Component
const StatsDisplay: React.FC<{ stats: PracticeStats }> = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
        <Target className="size-4" />
        <span className="text-xs font-medium">Accuracy</span>
      </div>
      <p className="text-xl font-bold">{stats.accuracy}%</p>
    </div>
    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
        <CheckCircle2 className="size-4" />
        <span className="text-xs font-medium">Correct</span>
      </div>
      <p className="text-xl font-bold">{stats.correct}</p>
    </div>
    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
        <Flame className="size-4" />
        <span className="text-xs font-medium">Streak</span>
      </div>
      <p className="text-xl font-bold">{stats.currentStreak}</p>
    </div>
    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
        <Trophy className="size-4" />
        <span className="text-xs font-medium">Best Streak</span>
      </div>
      <p className="text-xl font-bold">{stats.bestStreak}</p>
    </div>
  </div>
);

// Main Component
export function MCQPractice({ questions: initialQuestions, onComplete }: MCQPracticeProps) {
  // State
  const [allQuestions] = useState<MCQQuestion[]>(initialQuestions || generateMoreQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [practiceMode, setPracticeMode] = useState<"practice" | "exam">("practice");

  // Stats
  const [stats, setStats] = useState<PracticeStats>({
    totalAttempted: 0,
    correct: 0,
    wrong: 0,
    currentStreak: 0,
    bestStreak: 0,
    accuracy: 0,
  });

  // Filtered questions
  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
    if (selectedSubject !== "all" && q.subject !== selectedSubject) return false;
    return true;
  });

  const currentQuestion = filteredQuestions[currentIndex];
  const progress = ((currentIndex + 1) / filteredQuestions.length) * 100;

  // Get unique values for filters
  const difficulties = ["all", ...new Set(allQuestions.map((q) => q.difficulty))];
  const subjects = ["all", ...new Set(allQuestions.map((q) => q.subject))];

  // Handle answer selection
  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (showResult && practiceMode === "practice") return; // Prevent re-selection in practice mode

    setSelectedAnswer(answer);

    if (practiceMode === "practice") {
      // Instant feedback in practice mode
      setShowResult(true);
      updateStats(answer === currentQuestion.correctAnswer);
    }
  };

  // Update statistics
  const updateStats = useCallback(
    (isCorrect: boolean) => {
      setStats((prev) => {
        const newTotal = prev.totalAttempted + 1;
        const newCorrect = prev.correct + (isCorrect ? 1 : 0);
        const newWrong = prev.wrong + (isCorrect ? 0 : 1);
        const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
        const newBestStreak = Math.max(prev.bestStreak, newStreak);
        const newAccuracy = Math.round((newCorrect / newTotal) * 100);

        return {
          totalAttempted: newTotal,
          correct: newCorrect,
          wrong: newWrong,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          accuracy: newAccuracy,
        };
      });
    },
    []
  );

  // Handle next question
  const handleNext = () => {
    if (practiceMode === "exam" && !showResult) {
      // Show result first in exam mode
      setShowResult(true);
      if (selectedAnswer) {
        updateStats(selectedAnswer === currentQuestion.correctAnswer);
      } else {
        updateStats(false); // Count as wrong if skipped
      }
      return;
    }

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionState();
    } else {
      onComplete?.(stats);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetQuestionState();
    }
  };

  // Reset state for new question
  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setShowHint(false);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  // Reset session
  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setShowHint(false);
    setHintsUsed(0);
    setStats({
      totalAttempted: 0,
      correct: 0,
      wrong: 0,
      currentStreak: 0,
      bestStreak: 0,
      accuracy: 0,
    });
  };

  // Get answer button styling
  const getOptionStyle = (option: "A" | "B" | "C" | "D") => {
    const baseStyle =
      "w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 group";

    if (!showResult) {
      return cn(
        baseStyle,
        selectedAnswer === option
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
      );
    }

    // Show results
    if (option === currentQuestion.correctAnswer) {
      return cn(baseStyle, "border-green-500 bg-green-50 dark:bg-green-900/20");
    }
    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return cn(baseStyle, "border-red-500 bg-red-50 dark:bg-red-900/20");
    }
    return cn(baseStyle, "border-border opacity-60");
  };

  if (filteredQuestions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardContent className="py-12 text-center">
          <Filter className="size-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to see more questions.
          </p>
          <Button onClick={() => { setSelectedDifficulty("all"); setSelectedSubject("all"); }}>
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">MCQ Practice</h1>
                <p className="text-sm text-muted-foreground">
                  Master concepts with unlimited practice
                </p>
              </div>
            </div>

            {/* Mode Selector */}
            <Tabs value={practiceMode} onValueChange={(v) => setPracticeMode(v as "practice" | "exam")}>
              <TabsList>
                <TabsTrigger value="practice" className="gap-1.5">
                  <Sparkles className="size-4" />
                  Practice Mode
                </TabsTrigger>
                <TabsTrigger value="exam" className="gap-1.5">
                  <Play className="size-4" />
                  Exam Mode
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Stats Bar */}
          <StatsDisplay stats={stats} />

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-36">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all" ? "All Levels" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <BookOpen className="size-4 mr-2" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All Subjects" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={handleReset} title="Reset Session">
              <RefreshCw className="size-4" />
            </Button>

            {bookmarkedIds.size > 0 && (
              <Badge variant="secondary" className="px-3 py-1.5">
                <Bookmark className="size-3 mr-1" fill="currentColor" />
                {bookmarkedIds.size} Bookmarks
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="overflow-hidden mb-6">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Q.{currentQuestion.id}</Badge>
                    <Badge
                      variant={
                        currentQuestion.difficulty === "Easy"
                          ? "secondary"
                          : currentQuestion.difficulty === "Medium"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {currentQuestion.subject}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">
                    {currentQuestion.text}
                  </CardTitle>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleBookmark}
                  className="shrink-0"
                >
                  <Bookmark
                    className={cn(
                      "size-5",
                      bookmarkedIds.has(currentQuestion.id) && "fill-current text-yellow-500"
                    )}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* Options */}
              <div className="grid gap-3">
                {(["A", "B", "C", "D"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={showResult && practiceMode === "practice"}
                    className={getOptionStyle(option)}
                  >
                    <span
                      className={cn(
                        "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                        showResult && option === currentQuestion.correctAnswer
                          ? "bg-green-500 border-green-500 text-white"
                          : showResult &&
                            selectedAnswer === option &&
                            option !== currentQuestion.correctAnswer
                          ? "bg-red-500 border-red-500 text-white"
                          : selectedAnswer === option && !showResult
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {showResult && option === currentQuestion.correctAnswer ? (
                        <CheckCircle2 className="size-5" />
                      ) : showResult &&
                        selectedAnswer === option &&
                        option !== currentQuestion.correctAnswer ? (
                        <XCircle className="size-5" />
                      ) : (
                        option
                      )}
                    </span>
                    <span className="pt-1.5 text-base">{currentQuestion.options[option]}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {!showResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowHint(!showHint);
                      if (!showHint) setHintsUsed(hintsUsed + 1);
                    }}
                    disabled={showResult}
                  >
                    <Lightbulb className="size-4 mr-1.5" />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                )}

                {showResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    {showExplanation ? <EyeOff className="size-4 mr-1.5" /> : <Eye className="size-4 mr-1.5" />}
                    {showExplanation ? "Hide" : "Show"} Explanation
                  </Button>
                )}

                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                  <ListChecks className="size-4" />
                  <span>Hints used: {hintsUsed}</span>
                </div>
              </div>

              {/* Hint Section */}
              {showHint && !showResult && (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="size-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Hint:</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {currentQuestion.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation Section */}
              {showExplanation && showResult && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <BookOpen className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Feedback (Practice Mode) */}
              {showResult && practiceMode === "practice" && (
                <div
                  className={cn(
                    "p-4 rounded-lg flex items-center gap-3",
                    selectedAnswer === currentQuestion.correctAnswer
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  )}
                >
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle2 className="size-6 text-green-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          Correct! 🎉
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Great job! Keep up the good work.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-6 text-red-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200">
                          Not quite right
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          The correct answer is{" "}
                          <strong>{currentQuestion.correctAnswer}</strong>. Review the explanation above.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
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
                disabled={currentIndex === 0}
                size="lg"
              >
                <ChevronLeft className="size-5 mr-1" />
                Previous
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {filteredQuestions.length - currentIndex - 1} questions remaining
                </p>
              </div>

              <Button onClick={handleNext} size="lg">
                {currentIndex === filteredQuestions.length - 1 ? (
                  <>
                    Finish
                    <Trophy className="size-5 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="size-5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MCQPractice;
