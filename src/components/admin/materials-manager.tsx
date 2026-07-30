"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  FileText,
  BookOpen,
  Video,
  FileQuestion,
  Database,
  Upload,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Tag,
  Image,
  User,
  Calendar,
  HardDrive,
  File,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  RefreshCw,
  Copy,
  Check,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Types
type MaterialType = "book" | "notes" | "pyq" | "video" | "question-bank";
type MaterialStatus = "published" | "draft" | "pending" | "rejected" | "archived";
type Visibility = "public" | "private" | "premium";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  department: string;
  subject: string;
  semester?: string;
  unit?: number;
  chapter?: string;
  topic?: string;
  driveUrl: string;
  thumbnailUrl?: string;
  author: string;
  edition?: string;
  fileSize: string;
  pageCount?: number;
  language: string;
  price?: number;
  visibility: Visibility;
  status: MaterialStatus;
  downloads: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  search: string;
  department: string;
  subject: string;
  semester: string;
  status: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

// Mock Data
const departments = [
  "Agronomy",
  "Horticulture",
  "Plant Pathology",
  "Soil Science",
  "Entomology",
  "Genetics & Plant Breeding",
  "Agricultural Extension",
  "Agricultural Economics",
];

const subjects = [
  "General Agriculture",
  "Crop Production",
  "Plant Physiology",
  "Soil Fertility",
  "Pest Management",
  "Genetics",
  "Biotechnology",
  "Agricultural Statistics",
];

const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const mockMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "ICAR AIEEA Complete Guide - Agriculture 2024",
    description: "Comprehensive guide covering all topics for ICAR AIEEA examination including theory, practicals, and previous year questions.",
    type: "book",
    department: "General Agriculture",
    subject: "General Agriculture",
    semester: "All Semesters",
    driveUrl: "https://drive.google.com/file/d/example1",
    thumbnailUrl: "",
    author: "Dr. Ramesh Kumar",
    edition: "5th Edition (2024)",
    fileSize: "45.6 MB",
    pageCount: 520,
    language: "English",
    price: 0,
    visibility: "public",
    status: "published",
    downloads: 12450,
    tags: ["ICAR", "AIEEA", "Complete Guide", "2024"],
    createdAt: "2024-01-10T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "2",
    title: "Plant Physiology - Unit 5 Photosynthesis Notes",
    description: "Detailed notes on photosynthesis mechanism, light reactions, Calvin cycle, and C3/C4 pathways.",
    type: "notes",
    department: "Agronomy",
    subject: "Plant Physiology",
    semester: "4th",
    unit: 5,
    chapter: "Photosynthesis",
    driveUrl: "https://drive.google.com/file/d/example2",
    author: "Prof. Sunita Devi",
    fileSize: "8.2 MB",
    pageCount: 35,
    language: "English",
    price: 0,
    visibility: "public",
    status: "published",
    downloads: 3420,
    tags: ["Photosynthesis", "Unit 5", "Notes"],
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-14T11:45:00Z",
  },
  {
    id: "3",
    title: "ICAR PG Botany PYQ (2015-2023) Solved",
    description: "Complete collection of ICAR PG Botany previous year questions with detailed solutions and explanations.",
    type: "pyq",
    department: "Horticulture",
    subject: "Botany",
    driveUrl: "https://drive.google.com/file/d/example3",
    author: "Neha Desai",
    fileSize: "22.1 MB",
    pageCount: 180,
    language: "English",
    price: 49,
    visibility: "premium",
    status: "published",
    downloads: 5670,
    tags: ["PYQ", "ICAR PG", "Botany", "Solved"],
    createdAt: "2024-01-08T16:00:00Z",
    updatedAt: "2024-01-13T08:30:00Z",
  },
  {
    id: "4",
    title: "Genetics & Plant Breeding - Lecture Series by Dr. Amit Joshi",
    description: "Complete video lecture series covering Mendelian genetics, quantitative genetics, and modern breeding techniques.",
    type: "video",
    department: "Genetics & Plant Breeding",
    subject: "Genetics",
    semester: "3rd",
    driveUrl: "https://drive.google.com/file/d/example4",
    thumbnailUrl: "/images/video-thumb.jpg",
    author: "Dr. Amit Joshi",
    fileSize: "1.2 GB",
    language: "English/Hindi",
    price: 99,
    visibility: "premium",
    status: "published",
    downloads: 2890,
    tags: ["Video", "Lecture Series", "Genetics"],
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-12T18:00:00Z",
  },
  {
    id: "5",
    title: "Soil Science Question Bank - 500+ Questions",
    description: "Extensive question bank with MCQs, short answer, and long answer questions for Soil Science examination preparation.",
    type: "question-bank",
    department: "Soil Science",
    subject: "Soil Science",
    semester: "2nd",
    driveUrl: "https://drive.google.com/file/d/example5",
    author: "Dr. Prakash Rao",
    fileSize: "15.8 MB",
    pageCount: 120,
    language: "English",
    price: 29,
    visibility: "premium",
    status: "pending",
    downloads: 450,
    tags: ["Question Bank", "MCQ", "Soil Science"],
    createdAt: "2024-01-15T07:30:00Z",
    updatedAt: "2024-01-15T07:30:00Z",
  },
  {
    id: "6",
    title: "Entomology - Pest Management Strategies",
    description: "Integrated pest management approaches, biological control methods, and pesticide resistance management.",
    type: "notes",
    department: "Entomology",
    subject: "Pest Management",
    semester: "5th",
    unit: 3,
    chapter: "IPM",
    driveUrl: "https://drive.google.com/file/d/example6",
    author: "Dr. Kavita Sharma",
    fileSize: "6.5 MB",
    pageCount: 42,
    language: "English",
    price: 0,
    visibility: "public",
    status: "draft",
    downloads: 0,
    notes: ["Notes", "IPM", "Pest Management"],
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
  } as unknown as StudyMaterial,
  {
    id: "7",
    title: "Agricultural Economics - Market Analysis Report",
    description: "Detailed analysis of agricultural markets, pricing mechanisms, and economic policies affecting Indian agriculture.",
    type: "book",
    department: "Agricultural Economics",
    subject: "Agricultural Economics",
    semester: "6th",
    driveUrl: "https://drive.google.com/file/d/example7",
    author: "Prof. Manoj Tiwari",
    edition: "2024 Edition",
    fileSize: "32.4 MB",
    pageCount: 280,
    language: "English",
    price: 79,
    visibility: "premium",
    status: "published",
    downloads: 1230,
    tags: ["Economics", "Market Analysis", "Report"],
    createdAt: "2024-01-03T10:00:00Z",
    updatedAt: "2024-01-10T16:30:00Z",
  },
  {
    id: "8",
    title: "Biotechnology in Agriculture - Practical Manual",
    description: "Step-by-step protocols for common biotechnology techniques used in agricultural research.",
    type: "notes",
    department: "Agronomy",
    subject: "Biotechnology",
    semester: "7th",
    driveUrl: "https://drive.google.com/file/d/example8",
    author: "Dr. Priya Menon",
    fileSize: "12.3 MB",
    pageCount: 85,
    language: "English",
    price: 39,
    visibility: "premium",
    status: "rejected",
    downloads: 0,
    tags: ["Biotechnology", "Practical", "Manual"],
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
];

// Type configurations
const typeConfig: Record<MaterialType, { label: string; icon: React.ElementType; color: string }> = {
  book: { label: "Book", icon: BookOpen, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  notes: { label: "Notes", icon: FileText, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  pyq: { label: "PYQ", icon: FileQuestion, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  video: { label: "Video", icon: Video, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "question-bank": { label: "Q Bank", icon: Database, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
};

const statusConfig: Record<MaterialStatus, { label: string; icon: React.ElementType; color: string }> = {
  published: { label: "Published", icon: CheckCircle2, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  draft: { label: "Draft", icon: FileText, color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  rejected: { label: "Rejected", icon: X, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  archived: { label: "Archived", icon: ArchiveIcon, color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400" },
};

function ArchiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="5" x="2" y="3" rx="1"/>
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
      <path d="M10 12h4"/>
    </svg>
  );
}

// Empty state component
function EmptyState({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No materials found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {type === "search"
          ? "Try adjusting your search or filters to find what you're looking for."
          : `No ${type} materials yet. Start by uploading your first material.`}
      </p>
      <Button onClick={() => document.getElementById("add-material-btn")?.click()}>
        <Plus className="h-4 w-4 mr-2" />
        Add Material
      </Button>
    </div>
  );
}

export function MaterialsManager() {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: "all",
    subject: "all",
    semester: "all",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "notes" as MaterialType,
    department: "",
    subject: "",
    semester: "",
    unit: "",
    chapter: "",
    topic: "",
    driveUrl: "",
    thumbnailUrl: "",
    author: "",
    edition: "",
    fileSize: "",
    pageCount: "",
    language: "English",
    price: "",
    visibility: "public" as Visibility,
    tags: "" as string,
  });
  
  const [drivePreview, setDrivePreview] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter materials based on current filters
  const filteredMaterials = useMemo(() => {
    return mockMaterials.filter((material) => {
      // Tab filter
      if (activeTab !== "all" && material.type !== activeTab) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !material.title.toLowerCase().includes(searchLower) &&
          !material.description.toLowerCase().includes(searchLower) &&
          !material.author.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Department filter
      if (filters.department !== "all" && material.department !== filters.department) return false;

      // Subject filter
      if (filters.subject !== "all" && material.subject !== filters.subject) return false;

      // Semester filter
      if (filters.semester !== "all" && material.semester !== filters.semester) return false;

      // Status filter
      if (filters.status !== "all" && material.status !== filters.status) return false;

      // Type filter
      if (filters.type !== "all" && material.type !== filters.type) return false;

      return true;
    });
  }, [activeTab, filters]);

  // Handle Google Drive URL paste
  const handleDriveUrlChange = (url: string) => {
    setFormData({ ...formData, driveUrl: url });
    
    // Simulate fetching preview data
    if (url.includes("drive.google.com")) {
      setDrivePreview({
        fileName: url.split("/").pop()?.split("?")[0] || "Google Drive File",
        fileSize: "~25 MB",
        fileType: "PDF Document",
      });
    } else {
      setDrivePreview(null);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "notes",
      department: "",
      subject: "",
      semester: "",
      unit: "",
      chapter: "",
      topic: "",
      driveUrl: "",
      thumbnailUrl: "",
      author: "",
      edition: "",
      fileSize: "",
      pageCount: "",
      language: "English",
      price: "",
      visibility: "public",
      tags: "",
    });
    setDrivePreview(null);
    setEditingMaterial(null);
  };

  // Handle form submit
  const handleSubmit = () => {
    console.log("Submitting:", formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkAction = (action: "publish" | "delete") => {
    console.log(`Bulk ${action}:`, selectedMaterials);
    setSelectedMaterials([]);
  };

  // Stats for header
  const stats = useMemo(() => ({
    total: mockMaterials.length,
    published: mockMaterials.filter(m => m.status === "published").length,
    draft: mockMaterials.filter(m => m.status === "draft").length,
    pending: mockMaterials.filter(m => m.status === "pending").length,
    totalDownloads: mockMaterials.reduce((acc, m) => acc + m.downloads, 0),
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="hidden sm:flex border rounded-md p-0.5">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && "bg-accent")}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.department !== "all" || filters.status !== "all" || filters.type !== "all") && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 justify-center px-1.5 text-[10px]">
                    {[filters.department, filters.status, filters.type].filter(f => f !== "all").length}
                  </Badge>
                )}
              </Button>

              {/* Add Button */}
              <Button
                id="add-material-btn"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Select value={filters.department} onValueChange={(v) => setFilters({ ...filters, department: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.subject} onValueChange={(v) => setFilters({ ...filters, subject: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.semester} onValueChange={(v) => setFilters({ ...filters, semester: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {semesters.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(typeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="h-9" onClick={() => setFilters({
                    search: "", department: "all", subject: "all", semester: "all",
                    status: "all", type: "all", dateFrom: "", dateTo: ""
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
            All Materials
            <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="book" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="pyq" className="gap-2">
            <FileQuestion className="h-4 w-4" />
            PYQs
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="question-bank" className="gap-2">
            <Database className="h-4 w-4" />
            Q Banks
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Bulk Actions Bar */}
          {selectedMaterials.length > 0 && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <span className="text-sm font-medium">
                {selectedMaterials.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("publish")}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Publish
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedMaterials([])}>
                  Clear
                </Button>
              </div>
            </motion.div>
          )}

          {/* Table View */}
          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                {filteredMaterials.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectedMaterials.length === filteredMaterials.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedMaterials(filteredMaterials.map(m => m.id));
                              } else {
                                setSelectedMaterials([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Department</TableHead>
                        <TableHead className="hidden lg:table-cell">Downloads</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.map((material) => {
                        const typeCfg = typeConfig[material.type];
                        const statusCfg = statusConfig[material.status];
                        
                        return (
                          <TableRow key={material.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedMaterials.includes(material.id)}
                                onCheckedChange={() => toggleSelection(material.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-start gap-3 min-w-0">
                                <div className={cn(
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                  typeCfg.color
                                )}>
                                  <typeCfg.icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                  <p className="font-medium truncate max-w-[250px]">{material.title}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    by {material.author}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge className={typeCfg.color} variant="outline">
                                {typeCfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">{material.department}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">{material.downloads.toLocaleString()}</span>
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
                                    onClick={() => setPreviewMaterial(material)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setEditingMaterial(material);
                                      setFormData({
                                        title: material.title,
                                        description: material.description,
                                        type: material.type,
                                        department: material.department,
                                        subject: material.subject,
                                        semester: material.semester || "",
                                        unit: material.unit?.toString() || "",
                                        chapter: material.chapter || "",
                                        topic: material.topic || "",
                                        driveUrl: material.driveUrl,
                                        thumbnailUrl: material.thumbnailUrl || "",
                                        author: material.author,
                                        edition: material.edition || "",
                                        fileSize: material.fileSize,
                                        pageCount: material.pageCount?.toString() || "",
                                        language: material.language,
                                        price: material.price?.toString() || "",
                                        visibility: material.visibility,
                                        tags: material.tags.join(", "),
                                      });
                                      setIsAddDialogOpen(true);
                                    }}
                                  >
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
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
                  <EmptyState type={filters.search ? "search" : activeTab} />
                )}
              </CardContent>
            </Card>
          ) : (
            /* Grid View */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => {
                  const typeCfg = typeConfig[material.type];
                  const statusCfg = statusConfig[material.status];
                  
                  return (
                    <Card key={material.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {/* Thumbnail / Icon */}
                          <div className={cn(
                            "flex h-32 items-center justify-center rounded-lg",
                            typeCfg.color,
                            "opacity-80 group-hover:opacity-100 transition-opacity"
                          )}>
                            <typeCfg.icon className="h-12 w-12" />
                          </div>
                          
                          {/* Info */}
                          <div className="space-y-2">
                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {material.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {material.author}
                            </p>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={cn(typeCfg.color, "text-[10px]")}>
                                {typeCfg.label}
                              </Badge>
                              <Badge className={cn(statusCfg.color, "text-[10px]")}>
                                {statusCfg.label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{material.fileSize}</span>
                              <span>{material.downloads.toLocaleString()} downloads</span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-1 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="flex-1 h-8" onClick={() => setPreviewMaterial(material)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 h-8">
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full">
                  <EmptyState type={filters.search ? "search" : activeTab} />
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Material Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? "Edit Material" : "Add New Material"}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? "Update the material details below."
                : "Fill in the details to add a new study material."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-140px)] pr-4">
            <div className="space-y-6 pt-2">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Basic Information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter material title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe this material..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as MaterialType })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeConfig).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={formData.language} onValueChange={(v) => setFormData({ ...formData, language: v })}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Both">Bilingual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Classification Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Classification
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={formData.semester} onValueChange={(v) => setFormData({ ...formData, semester: v })}>
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapter</Label>
                    <Input
                      id="chapter"
                      placeholder="e.g., Photosynthesis"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Specific topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Google Drive Integration */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Google Drive Integration
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="driveUrl">Google Drive URL *</Label>
                    <div className="relative">
                      <Input
                        id="driveUrl"
                        placeholder="Paste your Google Drive link here..."
                        value={formData.driveUrl}
                        onChange={(e) => handleDriveUrlChange(e.target.value)}
                        className="pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                        onClick={() => copyToClipboard(formData.driveUrl)}
                        disabled={!formData.driveUrl}
                      >
                        {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    
                    {/* Drive Preview */}
                    {drivePreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                      >
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{drivePreview.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {drivePreview.fileSize} • {drivePreview.fileType}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="thumbnailUrl"
                          placeholder="Image URL"
                          value={formData.thumbnailUrl}
                          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        />
                        <Button variant="outline" size="icon" className="shrink-0">
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        placeholder="Author name"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Additional Details
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="edition">Edition</Label>
                    <Input
                      id="edition"
                      placeholder="e.g., 5th Edition 2024"
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fileSize">File Size</Label>
                    <Input
                      id="fileSize"
                      placeholder="e.g., 25 MB"
                      value={formData.fileSize}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pageCount">Page Count</Label>
                    <Input
                      id="pageCount"
                      type="number"
                      placeholder="Number of pages"
                      value={formData.pageCount}
                      onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0 for free"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Separate with commas (e.g., ICAR, AIEEA, 2024)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="visibility" className="text-sm">Visibility</Label>
                    <p className="text-xs text-muted-foreground">
                      Control who can access this material
                    </p>
                  </div>
                  <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v as Visibility })}>
                    <SelectTrigger id="visibility" className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">🌐 Public</SelectItem>
                      <SelectItem value="private">🔒 Private</SelectItem>
                      <SelectItem value="premium">⭐ Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingMaterial ? "Update Material" : "Add Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewMaterial} onOpenChange={() => setPreviewMaterial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Material Preview</DialogTitle>
            <DialogDescription>
              Review the material details before taking action.
            </DialogDescription>
          </DialogHeader>
          
          {previewMaterial && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl",
                  typeConfig[previewMaterial.type].color
                )}>
                  {React.createElement(typeConfig[previewMaterial.type].icon, { className: "h-8 w-8" })}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-lg">{previewMaterial.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{previewMaterial.description}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <Badge className={typeConfig[previewMaterial.type].color}>
                      {typeConfig[previewMaterial.type].label}
                    </Badge>
                    <Badge className={statusConfig[previewMaterial.status].color}>
                      {statusConfig[previewMaterial.status].label}
                    </Badge>
                    <Badge variant="outline">{previewMaterial.department}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Author:</span> {previewMaterial.author}</div>
                <div><span className="text-muted-foreground">Language:</span> {previewMaterial.language}</div>
                <div><span className="text-muted-foreground">File Size:</span> {previewMaterial.fileSize}</div>
                <div><span className="text-muted-foreground">Downloads:</span> {previewMaterial.downloads.toLocaleString()}</div>
                {previewMaterial.pageCount && (
                  <div><span className="text-muted-foreground">Pages:</span> {previewMaterial.pageCount}</div>
                )}
                {previewMaterial.edition && (
                  <div><span className="text-muted-foreground">Edition:</span> {previewMaterial.edition}</div>
                )}
                <div><span className="text-muted-foreground">Visibility:</span> 
                  <Badge variant="outline" className="ml-2 capitalize">{previewMaterial.visibility}</Badge>
                </div>
                <div><span className="text-muted-foreground">Created:</span> 
                  {new Date(previewMaterial.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>
              
              {previewMaterial.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {previewMaterial.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 pt-4 border-t">
                <Button asChild className="flex-1">
                  <a href={previewMaterial.driveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Drive
                  </a>
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default MaterialsManager;
