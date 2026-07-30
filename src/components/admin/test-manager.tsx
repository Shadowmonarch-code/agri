"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Play,
  Pause,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  HelpCircle,
  Lightbulb,
  Target,
  Calendar,
  Timer,
  Award,
  Database,
  Import,
  GripVertical,
  PlusCircle,
  MinusCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Types
type TestStatus = "draft" | "published" | "active" | "completed" | "archived";
type TestDifficulty = "easy" | "medium" | "hard" | "mixed";
type TestAccess = "free" | "premium";
type QuestionType = "mcq" | "true-false" | "fill-blank" | "short-answer";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint: string;
  marks: number;
  negativeMarks: number;
}

interface MockTest {
  id: string;
  title: string;
  description: string;
  department: string;
  subject: string;
  difficulty: TestDifficulty;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  accessType: TestAccess;
  maxAttempts: number | null;
  status: TestStatus;
  attempts: number;
  avgScore: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
  questions: Question[];
}

// Mock Data
const mockTests: MockTest[] = [
  {
    id: "1",
    title: "ICAR AIEEA 2024 - General Agriculture Mock Test",
    description: "Full-length mock test based on ICAR AIEEA pattern covering all subjects.",
    department: "General Agriculture",
    subject: "General Agriculture",
    difficulty: "mixed",
    duration: 120,
    totalQuestions: 150,
    totalMarks: 450,
    marksPerQuestion: 3,
    negativeMarking: true,
    negativeMarkValue: -1,
    accessType: "free",
    maxAttempts: null,
    status: "active",
    attempts: 1245,
    avgScore: 287,
    createdAt: "2024-01-01T10:00:00Z",
    questions: [],
  },
  {
    id: "2",
    title: "Plant Physiology - Unit 5 Quiz",
    description: "Quick quiz on photosynthesis and respiration concepts.",
    department: "Agronomy",
    subject: "Plant Physiology",
    difficulty: "medium",
    duration: 30,
    totalQuestions: 25,
    totalMarks: 75,
    marksPerQuestion: 3,
    negativeMarking: true,
    negativeMarkValue: -1,
    accessType: "free",
    maxAttempts: 3,
    status: "active",
    attempts: 567,
    avgScore: 52,
    createdAt: "2024-01-05T14:00:00Z",
    questions: [],
  },
  {
    id: "3",
    title: "Genetics & Plant Breeding - Advanced Practice Set",
    description: "Comprehensive practice set for PG entrance preparation with detailed explanations.",
    department: "Genetics & Plant Breeding",
    subject: "Genetics",
    difficulty: "hard",
    duration: 90,
    totalQuestions: 60,
    totalMarks: 180,
    marksPerQuestion: 3,
    negativeMarking: true,
    negativeMarkValue: -0.33,
    accessType: "premium",
    maxAttempts: 5,
    status: "published",
    attempts: 234,
    avgScore: 112,
    createdAt: "2024-01-08T09:30:00Z",
    questions: [],
  },
  {
    id: "4",
    title: "Daily Quiz #47 - Soil Science Basics",
    description: "Daily practice quiz covering soil formation, composition, and classification.",
    department: "Soil Science",
    subject: "Soil Science",
    difficulty: "easy",
    duration: 15,
    totalQuestions: 10,
    totalMarks: 10,
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarkValue: 0,
    accessType: "free",
    maxAttempts: null,
    status: "completed",
    attempts: 1890,
    avgScore: 7.5,
    scheduledStart: "2024-01-14T18:00:00Z",
    scheduledEnd: "2024-01-14T23:59:00Z",
    createdAt: "2024-01-13T12:00:00Z",
    questions: [],
  },
  {
    id: "5",
    title: "Entomology - Pest Management MCQ Bank",
    description: "Large question bank for IPM and pest control topics.",
    department: "Entomology",
    subject: "Pest Management",
    difficulty: "mixed",
    duration: 45,
    totalQuestions: 50,
    totalMarks: 150,
    marksPerQuestion: 3,
    negativeMarking: true,
    negativeMarkValue: -1,
    accessType: "premium",
    maxAttempts: null,
    status: "draft",
    attempts: 0,
    avgScore: 0,
    createdAt: "2024-01-14T16:00:00Z",
    questions: [],
  },
];

const sampleQuestions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    question: "What is the primary product of the light-dependent reactions of photosynthesis?",
    options: ["Glucose", "ATP and NADPH", "Carbon dioxide", "Water"],
    correctAnswer: 1,
    explanation: "The light-dependent reactions produce ATP and NADPH, which are then used in the Calvin cycle to produce glucose.",
    hint: "Think about what happens when light energy is captured by chlorophyll.",
    marks: 3,
    negativeMarks: 1,
  },
  {
    id: "q2",
    type: "true-false",
    question: "C4 plants are more efficient than C3 plants in hot, dry conditions.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation: "C4 plants have a special carbon fixation mechanism that minimizes photorespiration, making them more efficient in hot, dry conditions.",
    hint: "Consider photorespiration rates in different plant types.",
    marks: 2,
    negativeMarks: 0.5,
  },
  {
    id: "q3",
    type: "mcq",
    question: "Which enzyme is responsible for carbon fixation in C3 plants?",
    options: ["PEP carboxylase", "Rubisco", "Carbonic anhydrase", "ATP synthase"],
    correctAnswer: 1,
    explanation: "Rubisco (Ribulose-1,5-bisphosphate carboxylase/oxygenase) is the enzyme that catalyzes the first step of carbon fixation in the Calvin cycle of C3 plants.",
    hint: "This is one of the most abundant enzymes on Earth.",
    marks: 3,
    negativeMarks: 1,
  },
];

// Configurations
const statusConfig: Record<TestStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: FileText },
  published: { label: "Published", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: CheckCircle2 },
  active: { label: "Active", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Play },
  completed: { label: "Completed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Award },
  archived: { label: "Archived", color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400", icon: XCircle },
};

const difficultyConfig: Record<TestDifficulty, { label: string; color: string }> = {
  easy: { label: "Easy", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  hard: { label: "Hard", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  mixed: { label: "Mixed", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

// Empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No tests found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        Create your first mock test to get started.
      </p>
      <Button onClick={() => document.getElementById("create-test-btn")?.click()}>
        <Plus className="h-4 w-4 mr-2" />
        Create Test
      </Button>
    </div>
  );
}

export function TestManager() {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    difficulty: "all",
    department: "all",
    access: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  
  // Form states
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    subject: "",
    difficulty: "medium" as TestDifficulty,
    duration: 30,
    marksPerQuestion: 3,
    negativeMarking: true,
    negativeMarkValue: 1,
    accessType: "free" as TestAccess,
    maxAttempts: "" as string,
    scheduledStart: "",
    scheduledEnd: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    hint: "",
    marks: 3,
    negativeMarks: 1,
  });

  // Filtered tests
  const filteredTests = useMemo(() => {
    return mockTests.filter((test) => {
      if (activeTab !== "all" && test.status !== activeTab) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !test.title.toLowerCase().includes(query) &&
          !test.description.toLowerCase().includes(query)
        )
          return false;
      }
      if (filters.status !== "all" && test.status !== filters.status) return false;
      if (filters.difficulty !== "all" && test.difficulty !== filters.difficulty) return false;
      if (filters.department !== "all" && test.department !== filters.department) return false;
      if (filters.access !== "all" && test.accessType !== filters.access) return false;
      return true;
    });
  }, [activeTab, searchQuery, filters]);

  // Stats
  const stats = useMemo(() => ({
    total: mockTests.length,
    active: mockTests.filter(t => t.status === "active").length,
    draft: mockTests.filter(t => t.status === "draft").length,
    totalAttempts: mockTests.reduce((acc, t) => acc + t.attempts, 0),
  }), []);

  // Add option to current question
  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), ""],
    });
  };

  // Remove option
  const removeOption = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options?.filter((_, i) => i !== index),
    });
  };

  // Update option
  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // Add question to list
  const addQuestion = () => {
    if (!currentQuestion.question?.trim()) return;
    
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      type: currentQuestion.type || "mcq",
      question: currentQuestion.question,
      options: currentQuestion.options?.filter(o => o.trim()),
      correctAnswer: currentQuestion.correctAnswer ?? 0,
      explanation: currentQuestion.explanation || "",
      hint: currentQuestion.hint || "",
      marks: currentQuestion.marks || 3,
      negativeMarks: currentQuestion.negativeMarks || 0,
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      hint: "",
      marks: 3,
      negativeMarks: 1,
    });
  };

  // Remove question
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Reset form
  const resetForm = () => {
    setFormStep(1);
    setFormData({
      title: "",
      description: "",
      department: "",
      subject: "",
      difficulty: "medium",
      duration: 30,
      marksPerQuestion: 3,
      negativeMarking: true,
      negativeMarkValue: 1,
      accessType: "free",
      maxAttempts: "",
      scheduledStart: "",
      scheduledEnd: "",
    });
    setQuestions([]);
    setCurrentQuestion({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      hint: "",
      marks: 3,
      negativeMarks: 1,
    });
  };

  // Handle form submit
  const handleSubmit = () => {
    console.log("Creating test:", { formData, questions });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 dark:bg-gray-950/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalAttempts.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && "bg-accent")}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Button
                id="create-test-btn"
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Separator className="my-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.entries(statusConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.difficulty} onValueChange={(v) => setFilters({ ...filters, difficulty: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {Object.entries(difficultyConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.access} onValueChange={(v) => setFilters({ ...filters, access: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Access</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="h-9" onClick={() => setFilters({
                    status: "all", difficulty: "all", department: "all", access: "all"
                  })}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-muted/50">
          <TabsTrigger value="all" className="gap-2">
            All Tests
            <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <Play className="h-4 w-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="published" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Published
          </TabsTrigger>
          <TabsTrigger value="draft" className="gap-2">
            <FileText className="h-4 w-4" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <Award className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filteredTests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Details</TableHead>
                      <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
                      <TableHead className="hidden md:table-cell">Duration</TableHead>
                      <TableHead className="hidden lg:table-cell">Attempts</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => {
                      const statusCfg = statusConfig[test.status];
                      const diffCfg = difficultyConfig[test.difficulty];
                      
                      return (
                        <TableRow key={test.id}>
                          <TableCell>
                            <div className="space-y-1 min-w-0">
                              <p className="font-medium truncate max-w-[280px]">{test.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{test.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px]">{test.subject}</Badge>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-[10px]", test.accessType === "premium" && "border-yellow-300 text-yellow-700")}
                                >
                                  {test.accessType === "premium" ? "⭐ Premium" : "Free"}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={diffCfg.color} variant="outline">
                              {diffCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm">
                            <div className="flex items-center gap-1">
                              <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                              {test.duration} min
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-sm">{test.attempts.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{test.avgScore}</span>
                              <span className="text-xs text-muted-foreground">/ {test.totalMarks}</span>
                              <Progress 
                                value={(test.avgScore / test.totalMarks) * 100} 
                                className="h-1.5 w-16 hidden sm:flex"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusCfg.color} variant="outline">
                              <statusCfg.icon className="h-3 w-3 mr-1" />
                              {statusCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedTest(test);
                                    setIsPreviewOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {test.status === "active" ? (
                                  <DropdownMenuItem className="cursor-pointer text-yellow-600 focus:text-yellow-600">
                                    <Pause className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                                    <Play className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Test Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Test</DialogTitle>
            <DialogDescription>
              Build your mock test step by step. Fill in basic info first, then add questions.
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 py-4 border-b">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setFormStep(step)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  formStep === step
                    ? "bg-primary text-primary-foreground"
                    : formStep > step
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                <span className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs",
                  formStep >= step && "bg-current text-background"
                )}>
                  {step}
                </span>
                {step === 1 && "Basic Info"}
                {step === 2 && "Settings"}
                {step === 3 && "Questions"}
              </button>
            ))}
          </div>

          <ScrollArea className="flex-1 pr-4">
            {/* Step 1: Basic Info */}
            {formStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="title">Test Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter test title..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe this test..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Agriculture</SelectItem>
                        <SelectItem value="agronomy">Agronomy</SelectItem>
                        <SelectItem value="horticulture">Horticulture</SelectItem>
                        <SelectItem value="plant-pathology">Plant Pathology</SelectItem>
                        <SelectItem value="soil-science">Soil Science</SelectItem>
                        <SelectItem value="entomology">Entomology</SelectItem>
                        <SelectItem value="genetics">Genetics & Plant Breeding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Plant Physiology"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v as TestDifficulty })}>
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(difficultyConfig).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t mt-6">
                  <Button onClick={() => setFormStep(2)}>
                    Next: Settings
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Settings */}
            {formStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="marksPerQuestion">Marks Per Question</Label>
                    <Input
                      id="marksPerQuestion"
                      type="number"
                      value={formData.marksPerQuestion}
                      onChange={(e) => setFormData({ ...formData, marksPerQuestion: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Negative Marking</Label>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Switch
                        checked={formData.negativeMarking}
                        onCheckedChange={(checked) => setFormData({ ...formData, negativeMarking: checked })}
                      />
                      <span className="text-sm">{formData.negativeMarking ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                  
                  {formData.negativeMarking && (
                    <div className="space-y-2">
                      <Label htmlFor="negativeMarkValue">Negative Mark Value</Label>
                      <Input
                        id="negativeMarkValue"
                        type="number"
                        step="0.1"
                        value={formData.negativeMarkValue}
                        onChange={(e) => setFormData({ ...formData, negativeMarkValue: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="accessType">Access Type</Label>
                    <Select value={formData.accessType} onValueChange={(v) => setFormData({ ...formData, accessType: v as TestAccess })}>
                      <SelectTrigger id="accessType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">🌐 Free for Everyone</SelectItem>
                        <SelectItem value="premium">⭐ Premium Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Attempts (optional)</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      placeholder="Leave empty for unlimited"
                      value={formData.maxAttempts}
                      onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduledStart">Schedule Start (optional)</Label>
                    <Input
                      id="scheduledStart"
                      type="datetime-local"
                      value={formData.scheduledStart}
                      onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduledEnd">Schedule End (optional)</Label>
                    <Input
                      id="scheduledEnd"
                      type="datetime-local"
                      value={formData.scheduledEnd}
                      onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setFormStep(1)}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setFormStep(3)}>
                    Next: Questions
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Questions */}
            {formStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
                {/* Current Question Editor */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Add Question #{questions.length + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select 
                        value={currentQuestion.type} 
                        onValueChange={(v) => setCurrentQuestion({ ...currentQuestion, type: v as QuestionType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                          <SelectItem value="true-false">True / False</SelectItem>
                          <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="question-text">Question Text *</Label>
                      <Textarea
                        id="question-text"
                        placeholder="Enter your question here..."
                        rows={3}
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      />
                    </div>
                    
                    {(currentQuestion.type === "mcq" || currentQuestion.type === "true-false") && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Options</Label>
                          {currentQuestion.type === "mcq" && (
                            <Button variant="ghost" size="sm" onClick={addOption}>
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Add Option
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {currentQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <div className="flex items-center gap-2 flex-1">
                                <Checkbox
                                  checked={currentQuestion.correctAnswer === index}
                                  onCheckedChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                />
                                <span className="text-xs text-muted-foreground w-6">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  value={option}
                                  onChange={(e) => updateOption(index, e.target.value)}
                                    className="flex-1"
                                />
                              </div>
                              {currentQuestion.type === "mcq" && currentQuestion.options!.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                  onClick={() => removeOption(index)}
                                >
                                  <MinusCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ✓ Select the checkbox next to the correct answer
                        </p>
                      </div>
                    )}
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="explanation">Explanation</Label>
                        <Textarea
                          id="explanation"
                          placeholder="Explain why this is the correct answer..."
                          rows={2}
                          value={currentQuestion.explanation}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hint">Hint (optional)</Label>
                        <Input
                          id="hint"
                          placeholder="Give students a hint..."
                          value={currentQuestion.hint}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, hint: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="marks">Marks</Label>
                        <Input
                          id="marks"
                          type="number"
                          value={currentQuestion.marks}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="neg-marks">Negative Marks</Label>
                        <Input
                          id="neg-marks"
                          type="number"
                          step="0.1"
                          value={currentQuestion.negativeMarks}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, negativeMarks: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={addQuestion} className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add This Question
                    </Button>
                  </CardContent>
                </Card>

                {/* Added Questions List */}
                {questions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>Added Questions ({questions.length})</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuestions(sampleQuestions);
                          }}
                        >
                          <Import className="h-4 w-4 mr-2" />
                          Import Sample
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-[200px]">
                        <div className="space-y-2 pr-2">
                          {questions.map((question, index) => (
                            <div
                              key={question.id}
                              className="flex items-start gap-3 p-3 bg-muted rounded-lg group"
                            >
                              <span className="font-semibold text-muted-foreground shrink-0">
                                Q{index + 1}.
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm line-clamp-2">{question.question}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-[10px] capitalize">
                                    {question.type.replace("-", " ")}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    +{question.marks} / -{question.negativeMarks}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0"
                                onClick={() => removeQuestion(question.id)}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-between pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setFormStep(2)}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={questions.length === 0}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Create Test ({questions.length} questions)
                  </Button>
                </div>
              </motion.div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test Preview</DialogTitle>
            <DialogDescription>Review test details before taking action.</DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{selectedTest.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedTest.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>{selectedTest.subject}</Badge>
                  <Badge className={difficultyConfig[selectedTest.difficulty].color} variant="outline">
                    {difficultyConfig[selectedTest.difficulty].label}
                  </Badge>
                  <Badge className={statusConfig[selectedTest.status].color} variant="outline">
                    {statusConfig[selectedTest.status].label}
                  </Badge>
                  <Badge variant={selectedTest.accessType === "premium" ? "default" : "secondary"}>
                    {selectedTest.accessType === "premium" ? "⭐ Premium" : "🌐 Free"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <Timer className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{selectedTest.duration} min</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <HelpCircle className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{selectedTest.totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{selectedTest.totalMarks}</p>
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{selectedTest.attempts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Attempts</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Marks per Question:</span> +{selectedTest.marksPerQuestion}</div>
                <div><span className="text-muted-foreground">Negative Marking:</span> {selectedTest.negativeMarking ? `${selectedTest.negativeMarkValue}` : "None"}</div>
                <div><span className="text-muted-foreground">Max Attempts:</span> {selectedTest.maxAttempts || "Unlimited"}</div>
                <div><span className="text-muted-foreground">Avg Score:</span> {selectedTest.avgScore}/{selectedTest.totalMarks}</div>
              </div>
              
              {selectedTest.scheduledStart && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Scheduled</p>
                    <p className="text-yellow-600 dark:text-yellow-400">
                      {new Date(selectedTest.scheduledStart).toLocaleString()} -{" "}
                      {selectedTest.scheduledEnd ? new Date(selectedTest.scheduledEnd).toLocaleString() : "Ongoing"}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
                <Button className="flex-1">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Test
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Missing icons
function ClipboardList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="14" x="4" y="3" rx="2"/>
      <path d="M8 3V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/>
      <path d="M8 7h8M8 11h8M8 15h4"/>
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

export default TestManager;
