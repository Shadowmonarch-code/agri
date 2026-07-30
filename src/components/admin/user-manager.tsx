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
  UserPlus,
  ShieldCheck,
  Ban,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Download,
  ClipboardList,
  Bookmark,
  Activity as ActivityIcon,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Clock,
  Crown,
  GraduationCap,
  ArrowUpDown,
  FileText,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Types
type UserRole = "student" | "contributor" | "moderator" | "admin" | "superadmin";
type UserStatus = "active" | "inactive" | "pending" | "banned" | "suspended";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  university?: string;
  joinDate: string;
  lastActive: string;
  stats: {
    testsTaken: number;
    downloads: number;
    bookmarks: number;
    contributions: number;
  };
  location?: string;
  isVerified: boolean;
  isPremium: boolean;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: "login" | "download" | "test" | "upload" | "profile" | "system";
}

// Mock Data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    phone: "+91 98765 43210",
    avatar: "",
    role: "student",
    status: "active",
    department: "Agronomy",
    university: "Punjab Agricultural University",
    joinDate: "2023-06-15",
    lastActive: "2024-01-15T14:30:00Z",
    stats: { testsTaken: 45, downloads: 128, bookmarks: 23, contributions: 0 },
    location: "Ludhiana, Punjab",
    isVerified: true,
    isPremium: false,
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    avatar: "",
    role: "student",
    status: "active",
    department: "Horticulture",
    university: "Tamil Nadu Agricultural University",
    joinDate: "2023-08-22",
    lastActive: "2024-01-15T12:15:00Z",
    stats: { testsTaken: 67, downloads: 89, bookmarks: 45, contributions: 2 },
    location: "Coimbatore, Tamil Nadu",
    isVerified: true,
    isPremium: true,
  },
  {
    id: "3",
    name: "Dr. Suresh Patel",
    email: "dr.patel@agri.edu",
    phone: "+91 76543 21098",
    avatar: "",
    role: "contributor",
    status: "active",
    department: "Plant Pathology",
    university: "NAU, Gujarat",
    joinDate: "2023-03-10",
    lastActive: "2024-01-14T18:45:00Z",
    stats: { testsTaken: 0, downloads: 45, bookmarks: 12, contributions: 34 },
    location: "Anand, Gujarat",
    isVerified: true,
    isPremium: false,
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    avatar: "",
    role: "student",
    status: "pending",
    department: "Soil Science",
    joinDate: "2024-01-14",
    lastActive: "2024-01-14T10:20:00Z",
    stats: { testsTaken: 0, downloads: 5, bookmarks: 1, contributions: 0 },
    isVerified: false,
    isPremium: false,
  },
  {
    id: "5",
    name: "Anita Patel",
    email: "anita.p@email.com",
    avatar: "",
    role: "moderator",
    status: "active",
    department: "Entomology",
    university: "GBPUAT, Uttarakhand",
    joinDate: "2023-01-05",
    lastActive: "2024-01-15T16:00:00Z",
    stats: { testsTaken: 120, downloads: 256, bookmarks: 78, contributions: 15 },
    location: "Pantnagar, Uttarakhand",
    isVerified: true,
    isPremium: true,
  },
  {
    id: "6",
    name: "Arjun Reddy",
    email: "arjun.reddy@email.com",
    avatar: "",
    role: "student",
    status: "inactive",
    department: "Genetics & Plant Breeding",
    university: "ANGRAU, Andhra Pradesh",
    joinDate: "2023-05-20",
    lastActive: "2023-12-28T08:30:00Z",
    stats: { testsTaken: 23, downloads: 67, bookmarks: 12, contributions: 0 },
    location: "Guntur, AP",
    isVerified: true,
    isPremium: false,
  },
  {
    id: "7",
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    avatar: "",
    role: "student",
    status: "banned",
    department: "Agricultural Economics",
    joinDate: "2023-09-12",
    lastActive: "2024-01-05T11:45:00Z",
    stats: { testsTaken: 8, downloads: 34, bookmarks: 5, contributions: 0 },
    isVerified: false,
    isPremium: false,
  },
  {
    id: "8",
    name: "Prof. Kavita Rao",
    email: "kavita.rao@university.edu",
    avatar: "",
    role: "contributor",
    status: "active",
    department: "Statistics",
    university: "IARI, New Delhi",
    joinDate: "2023-02-28",
    lastActive: "2024-01-15T09:00:00Z",
    stats: { testsTaken: 5, downloads: 78, bookmarks: 23, contributions: 56 },
    location: "New Delhi",
    isVerified: true,
    isPremium: true,
  },
];

const mockActivityLogs: ActivityLog[] = [
  { id: "1", action: "Login", description: "Logged in from Chrome on Windows", timestamp: "2024-01-15T14:30:00Z", type: "login" },
  { id: "2", action: "Download", description: "Downloaded 'ICAR AIEEA Complete Guide'", timestamp: "2024-01-15T13:20:00Z", type: "download" },
  { id: "3", action: "Test Completed", description: "Completed Daily Quiz #47 - Score: 85%", timestamp: "2024-01-15T11:45:00Z", type: "test" },
  { id: "4", action: "Profile Update", description: "Updated profile picture and bio", timestamp: "2024-01-14T16:30:00Z", type: "profile" },
  { id: "5", action: "Upload", description: "Uploaded 'Plant Physiology Notes Unit 6'", timestamp: "2024-01-14T10:15:00Z", type: "upload" },
  { id: "6", action: "Login", description: "Logged in from Safari on iPhone", timestamp: "2024-01-14T08:00:00Z", type: "login" },
  { id: "7", action: "Bookmark Added", description: "Bookmarked 'Genetics Question Bank'", timestamp: "2024-01-13T19:20:00Z", type: "download" },
  { id: "8", action: "Password Reset", description: "Requested password reset link", timestamp: "2024-01-12T14:00:00Z", type: "system" },
];

// Role configurations
const roleConfig: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
  student: { label: "Student", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: GraduationCap },
  contributor: { label: "Contributor", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: FileText },
  moderator: { label: "Moderator", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: ShieldCheck },
  admin: { label: "Admin", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: Users },
  superadmin: { label: "Super Admin", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: Crown },
};

const statusConfig: Record<UserStatus, { label: string; color: string; dotColor: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dotColor: "bg-green-500" },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", dotColor: "bg-gray-500" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dotColor: "bg-yellow-500" },
  banned: { label: "Banned", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dotColor: "bg-red-500" },
  suspended: { label: "Suspended", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", dotColor: "bg-orange-500" },
};

// Empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No users found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </div>
  );
}

export function UserManager() {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    department: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "joinDate" | "lastActive">("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Detail panel state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Dialog states
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("student");

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let result = [...mockUsers];
    
    // Tab filter
    if (activeTab !== "all") {
      result = result.filter((u) => u.status === activeTab || u.role === activeTab);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.department.toLowerCase().includes(query)
      );
    }
    
    // Filters
    if (filters.role !== "all") {
      result = result.filter((u) => u.role === filters.role);
    }
    if (filters.status !== "all") {
      result = result.filter((u) => u.status === filters.status);
    }
    if (filters.department !== "all") {
      result = result.filter((u) => u.department === filters.department);
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "joinDate":
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case "lastActive":
          comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return result;
  }, [activeTab, searchQuery, filters, sortField, sortDirection]);

  // Stats
  const stats = useMemo(() => ({
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === "active").length,
    premium: mockUsers.filter(u => u.isPremium).length,
    pending: mockUsers.filter(u => u.status === "pending").length,
    banned: mockUsers.filter(u => u.status === "banned").length,
  }), []);

  // Handle sort toggle
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Open user detail panel
  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  // Handle user actions
  const handleRoleChange = () => {
    console.log(`Changing ${targetUser?.name}'s role to ${newRole}`);
    setIsRoleDialogOpen(false);
    setTargetUser(null);
  };

  const handleBanUser = () => {
    console.log(`Banning user: ${targetUser?.name}`);
    setIsBanDialogOpen(false);
    setTargetUser(null);
  };

  const handleResetPassword = () => {
    console.log(`Resetting password for: ${targetUser?.email}`);
    setIsResetPasswordDialogOpen(false);
    setTargetUser(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.premium}</p>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.banned}</p>
                <p className="text-xs text-muted-foreground">Banned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or department..."
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
                {(filters.role !== "all" || filters.status !== "all" || filters.department !== "all") && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 justify-center px-1.5 text-[10px]">
                    {[filters.role, filters.status, filters.department].filter(f => f !== "all").length}
                  </Badge>
                )}
              </Button>
              
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Export
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
                  <Select value={filters.role} onValueChange={(v) => setFilters({ ...filters, role: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {Object.entries(roleConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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

                  <Select value={filters.department} onValueChange={(v) => setFilters({ ...filters, department: v })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Agronomy">Agronomy</SelectItem>
                      <SelectItem value="Horticulture">Horticulture</SelectItem>
                      <SelectItem value="Plant Pathology">Plant Pathology</SelectItem>
                      <SelectItem value="Soil Science">Soil Science</SelectItem>
                      <SelectItem value="Entomology">Entomology</SelectItem>
                      <SelectItem value="Genetics & Plant Breeding">Genetics</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="h-9" onClick={() => setFilters({
                    role: "all", status: "all", department: "all", dateFrom: "", dateTo: ""
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
            All Users
            <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="banned" className="gap-2">
            <UserX className="h-4 w-4" />
            Banned
          </TabsTrigger>
          <TabsTrigger value="moderator" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Moderators
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Bulk Actions Bar */}
          {selectedUsers.length > 0 && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <span className="text-sm font-medium">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setTargetUser(mockUsers.find(u => u.id === selectedUsers[0]) || null);
                  setIsRoleDialogOpen(true);
                }}>
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Change Role
                </Button>
                <Button size="sm" variant="destructive" onClick={() => {
                  setTargetUser(mockUsers.find(u => u.id === selectedUsers[0]) || null);
                  setIsBanDialogOpen(true);
                }}>
                  <Ban className="h-4 w-4 mr-1" />
                  Ban
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedUsers([])}>
                  Clear
                </Button>
              </div>
            </motion.div>
          )}

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              {filteredUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(filteredUsers.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          User
                          <ArrowUpDown className={cn(
                            "h-3 w-3",
                            sortField === "name" ? "opacity-100" : "opacity-40"
                          )} />
                        </div>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">Role</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead 
                        className="hidden lg:table-cell cursor-pointer select-none"
                        onClick={() => handleSort("joinDate")}
                      >
                        <div className="flex items-center gap-1">
                          Joined
                          <ArrowUpDown className={cn(
                            "h-3 w-3",
                            sortField === "joinDate" ? "opacity-100" : "opacity-40"
                          )} />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const roleCfg = roleConfig[user.role];
                      const statusCfg = statusConfig[user.status];
                      
                      return (
                        <TableRow key={user.id} className="cursor-pointer" onClick={() => openUserDetail(user)}>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => {
                                setSelectedUsers(prev =>
                                  prev.includes(user.id)
                                    ? prev.filter(id => id !== user.id)
                                    : [...prev, user.id]
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className={cn(
                                  "text-sm font-medium",
                                  user.isPremium ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : "bg-primary/10 text-primary"
                                )}>
                                  {user.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-medium truncate">{user.name}</p>
                                  {user.isVerified && (
                                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                  )}
                                  {user.isPremium && (
                                    <Crown className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={roleCfg.color} variant="outline">
                              <roleCfg.icon className="h-3 w-3 mr-1" />
                              {roleCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm">{user.department}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                            {new Date(user.joinDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2 w-2 rounded-full", statusCfg.dotColor)} />
                              <Badge className={statusCfg.color} variant="outline">
                                {statusCfg.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer" onClick={() => openUserDetail(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setTargetUser(user);
                                    setNewRole(user.role);
                                    setIsRoleDialogOpen(true);
                                  }}
                                >
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setTargetUser(user);
                                    setIsResetPasswordDialogOpen(true);
                                  }}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status !== "banned" ? (
                                  <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => {
                                      setTargetUser(user);
                                      setIsBanDialogOpen(true);
                                    }}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Ban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="cursor-pointer text-green-600 focus:text-green-600"
                                  >
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Unban User
                                  </DropdownMenuItem>
                                )}
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

      {/* User Detail Panel (Sheet) */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle>User Details</SheetTitle>
                <SheetDescription>
                  View and manage user information
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Profile Header */}
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="h-16 w-16 shrink-0">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback className={cn(
                      "text-lg font-semibold",
                      selectedUser.isPremium ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" : "bg-primary/10 text-primary"
                    )}>
                      {selectedUser.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                      {selectedUser.isVerified && (
                        <Badge variant="secondary" className="gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                      {selectedUser.isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" /> Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={statusConfig[selectedUser.status].color} variant="outline">
                        {statusConfig[selectedUser.status].label}
                      </Badge>
                      <Badge className={roleConfig[selectedUser.role].color} variant="outline">
                        {roleConfig[selectedUser.role].label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {selectedUser.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {selectedUser.email}
                    </div>
                    {selectedUser.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {selectedUser.location}
                      </div>
                    )}
                    {selectedUser.university && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        {selectedUser.university}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Academic Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Academic Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="font-medium">{selectedUser.department}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Joined On</p>
                      <p className="font-medium">
                        {new Date(selectedUser.joinDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Last Active</p>
                      <p className="font-medium">
                        {new Date(selectedUser.lastActive).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Account Age</p>
                      <p className="font-medium">
                        {Math.floor(
                          (Date.now() - new Date(selectedUser.joinDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Statistics */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Activity Statistics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <ClipboardList className="h-5 w-5 text-blue-600 mb-1" />
                      <p className="text-2xl font-bold text-blue-600">{selectedUser.stats.testsTaken}</p>
                      <p className="text-xs text-muted-foreground">Tests Taken</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <Download className="h-5 w-5 text-green-600 mb-1" />
                      <p className="text-2xl font-bold text-green-600">{selectedUser.stats.downloads}</p>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <Bookmark className="h-5 w-5 text-purple-600 mb-1" />
                      <p className="text-2xl font-bold text-purple-600">{selectedUser.stats.bookmarks}</p>
                      <p className="text-xs text-muted-foreground">Bookmarks</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600 mb-1" />
                      <p className="text-2xl font-bold text-orange-600">{selectedUser.stats.contributions}</p>
                      <p className="text-xs text-muted-foreground">Contributions</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Recent Activity</h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2 pr-2">
                      {mockActivityLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            log.type === "login" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                            log.type === "download" && "bg-green-100 text-green-600 dark:bg-green-900/30",
                            log.type === "test" && "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
                            log.type === "upload" && "bg-orange-100 text-orange-600 dark:bg-orange-900/30",
                            log.type === "profile" && "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30",
                            log.type === "system" && "bg-gray-100 text-gray-600 dark:bg-gray-900/30",
                          )}>
                            <ActivityIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{log.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setTargetUser(selectedUser);
                      setNewRole(selectedUser.role);
                      setIsRoleDialogOpen(true);
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Role
                  </Button>
                  {selectedUser.status !== "banned" ? (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setTargetUser(selectedUser);
                        setIsBanDialogOpen(true);
                      }}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Ban User
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 text-green-600 hover:text-green-600"
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Unban
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setTargetUser(selectedUser);
                    setIsResetPasswordDialogOpen(true);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for <strong>{targetUser?.name}</strong>. This will affect their permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Label htmlFor="new-role">New Role</Label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
              <SelectTrigger id="new-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p><strong>Current Role:</strong> {targetUser ? roleConfig[targetUser.role].label : ""}</p>
              <p className="text-muted-foreground mt-1">
                {newRole === "superadmin" && "⚠️ Super Admin has full access to all features."}
                {newRole === "admin" && "Admin can manage most platform features."}
                {newRole === "moderator" && "Moderator can moderate content and users."}
                {newRole === "contributor" && "Contributors can upload materials."}
                {newRole === "student" && "Standard student access."}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleChange}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban <strong>{targetUser?.name}</strong>? They will no longer be able to access their account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                This action can be reversed by unbanning the user later.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input id="reason" placeholder="Enter reason for banning..." />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBanUser}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset link to <strong>{targetUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p>The user will receive an email with instructions to create a new password.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default UserManager;
