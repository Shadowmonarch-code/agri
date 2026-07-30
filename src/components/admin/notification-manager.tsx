"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  MoreHorizontal,
  Users,
  UserCheck,
  GraduationCap,
  AlertTriangle,
  Info,
  Megaphone,
  Calendar,
  Filter,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Zap,
  BookOpen,
  Trophy,
  Gift,
  Settings2,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Search,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Types
type NotificationType = "info" | "alert" | "update" | "promotion" | "achievement" | "system";
type NotificationTarget = "all" | "department" | "individual" | "premium" | "free";
type NotificationStatus = "scheduled" | "sent" | "delivered" | "failed" | "draft";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  target: NotificationTarget;
  targetValue?: string; // department name or user email
  status: NotificationStatus;
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    total: number;
    delivered: number;
    read: number;
    clicked: number;
  };
  createdBy: string;
  createdAt: string;
}

// Mock Data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "🎉 New Year Special - Premium at 50% Off!",
    message: "Start your ICAR preparation journey with our premium content. Get 50% off on all premium subscriptions this January!",
    type: "promotion",
    target: "all",
    status: "sent",
    sentAt: "2024-01-01T10:00:00Z",
    stats: { total: 24589, delivered: 23456, read: 18234, clicked: 5678 },
    createdBy: "Admin",
    createdAt: "2023-12-31T15:00:00Z",
  },
  {
    id: "2",
    title: "⚠️ Server Maintenance Scheduled",
    message: "We will be performing server maintenance on Jan 20th from 2 AM to 6 AM IST. The platform may be unavailable during this time.",
    type: "alert",
    target: "all",
    status: "delivered",
    sentAt: "2024-01-18T09:00:00Z",
    stats: { total: 24589, delivered: 24123, read: 19876, clicked: 0 },
    createdBy: "System Admin",
    createdAt: "2024-01-17T14:00:00Z",
  },
  {
    id: "3",
    title: "📚 New Materials Added - Plant Physiology Unit 5",
    message: "New study materials for Plant Physiology Unit 5 (Photosynthesis) have been uploaded. Check them out now!",
    type: "update",
    target: "department",
    targetValue: "Agronomy",
    status: "sent",
    sentAt: "2024-01-15T14:30:00Z",
    stats: { total: 3420, delivered: 3389, read: 2567, clicked: 1234 },
    createdBy: "Dr. Suresh Patel",
    createdAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "4",
    title: "🏆 Daily Quiz Leaderboard Update",
    message: "Congratulations to today's top performers! Rahul Verma scored 95% on Daily Quiz #47. Can you beat him tomorrow?",
    type: "achievement",
    target: "all",
    status: "scheduled",
    scheduledAt: "2024-01-16T21:00:00Z",
    stats: { total: 0, delivered: 0, read: 0, clicked: 0 },
    createdBy: "System",
    createdAt: "2024-01-15T19:00:00Z",
  },
  {
    id: "5",
    title: "📢 ICAR AIEEA 2024 Important Dates Released",
    message: "ICAR has released important dates for AIEEA 2024 examination. Application starts from Feb 1st. Don't miss out!",
    type: "info",
    target: "all",
    status: "sent",
    sentAt: "2024-01-12T11:00:00Z",
    stats: { total: 24589, delivered: 24012, read: 21345, clicked: 15678 },
    createdBy: "Admin",
    createdAt: "2024-01-11T16:00:00Z",
  },
  {
    id: "6",
    title: "⭐ Exclusive Offer for Premium Members",
    message: "As a valued premium member, get early access to our new AI-powered doubt solving feature. Launching next week!",
    type: "promotion",
    target: "premium",
    status: "draft",
    stats: { total: 1234, delivered: 0, read: 0, clicked: 0 },
    createdBy: "Marketing Team",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "7",
    title: "🔧 System Update Complete",
    message: "We've updated our platform with new features and bug fixes. You can now bookmark questions and view detailed analytics.",
    type: "system",
    target: "all",
    status: "failed",
    sentAt: "2024-01-14T08:00:00Z",
    stats: { total: 24589, delivered: 12000, read: 8900, clicked: 3456 },
    createdBy: "Dev Team",
    createdAt: "2024-01-13T18:00:00Z",
  },
];

// Configurations
const typeConfig: Record<NotificationType, { label: string; color: string; icon: React.ElementType }> = {
  info: { label: "Info", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Info },
  alert: { label: "Alert", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
  update: { label: "Update", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Sparkles },
  promotion: { label: "Promotion", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Gift },
  achievement: { label: "Achievement", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Trophy },
  system: { label: "System", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: Settings2 },
};

const statusConfig: Record<NotificationStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: FileTextIcon },
  scheduled: { label: "Scheduled", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Send },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
};

const targetConfig: Record<NotificationTarget, { label: string; description: string; icon: React.ElementType }> = {
  all: { label: "All Users", description: "Send to every registered user", icon: Users },
  department: { label: "Specific Department", description: "Send to users in a specific department", icon: GraduationCap },
  individual: { label: "Individual User", description: "Send to a specific user by email", icon: UserCheck },
  premium: { label: "Premium Users Only", description: "Send only to premium subscribers", icon: Sparkles },
  free: { label: "Free Users Only", description: "Send only to free tier users", icon: Users },
};

// Helper components
function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bell className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        Create your first notification to engage with your users.
      </p>
      <Button onClick={() => document.getElementById("create-notification-btn")?.click()}>
        <Plus className="h-4 w-4 mr-2" />
        Create Notification
      </Button>
    </div>
  );
}

export function NotificationManager() {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    target: "all",
  });
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  // Form state
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as NotificationType,
    target: "all" as NotificationTarget,
    targetValue: "",
    scheduleType: "now" as "now" | "schedule",
    scheduleDate: "",
    scheduleTime: "",
  });

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return mockNotifications.filter((notif) => {
      if (activeTab !== "all" && notif.status !== activeTab) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!notif.title.toLowerCase().includes(query) && !notif.message.toLowerCase().includes(query))
          return false;
      }
      if (filters.type !== "all" && notif.type !== filters.type) return false;
      if (filters.status !== "all" && notif.status !== filters.status) return false;
      if (filters.target !== "all" && notif.target !== filters.target) return false;
      return true;
    });
  }, [activeTab, searchQuery, filters]);

  // Stats
  const stats = useMemo(() => ({
    total: mockNotifications.length,
    sent: mockNotifications.filter(n => n.status === "sent").length,
    scheduled: mockNotifications.filter(n => n.status === "scheduled").length,
    failed: mockNotifications.filter(n => n.status === "failed").length,
    totalDelivered: mockNotifications.reduce((acc, n) => acc + n.stats.delivered, 0),
    totalRead: mockNotifications.reduce((acc, n) => acc + n.stats.read, 0),
    avgReadRate: Math.round(
      mockNotifications
        .filter(n => n.stats.total > 0)
        .reduce((acc, n) => acc + (n.stats.read / n.stats.total) * 100, 0) /
        mockNotifications.filter(n => n.stats.total > 0).length || 0
    ),
  }), []);

  // Reset form
  const resetForm = () => {
    setFormStep(1);
    setFormData({
      title: "",
      message: "",
      type: "info",
      target: "all",
      targetValue: "",
      scheduleType: "now",
      scheduleDate: "",
      scheduleTime: "",
    });
  };

  // Handle submit
  const handleSubmit = () => {
    console.log("Creating notification:", formData);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-xs text-muted-foreground">Sent</p>
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
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgReadRate}%</p>
                <p className="text-xs text-muted-foreground">Avg Read Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Delivered:</span>
              <span className="font-semibold">{stats.totalDelivered.toLocaleString()}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Read:</span>
              <span className="font-semibold">{stats.totalRead.toLocaleString()}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Overall Read Rate:</span>
              <span className="font-semibold">
                {Math.round((stats.totalRead / stats.totalDelivered) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Button
                id="create-notification-btn"
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Notification
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-muted/50">
          <TabsTrigger value="all" className="gap-2">
            All Notifications
            <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <Clock className="h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Delivered
          </TabsTrigger>
          <TabsTrigger value="failed" className="gap-2">
            <XCircle className="h-4 w-4" />
            Failed
          </TabsTrigger>
          <TabsTrigger value="draft" className="gap-2">
            Drafts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filteredNotifications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Notification</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Target</TableHead>
                      <TableHead className="hidden lg:table-cell">Delivery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notif) => {
                      const typeCfg = typeConfig[notif.type];
                      const statusCfg = statusConfig[notif.status];
                      const targetCfg = targetConfig[notif.target];
                      
                      return (
                        <TableRow key={notif.id}>
                          <TableCell>
                            <div className="space-y-1 min-w-0 max-w-[300px]">
                              <p className="font-medium truncate">{notif.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{notif.message}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={typeCfg.color} variant="outline">
                              <typeCfg.icon className="h-3 w-3 mr-1" />
                              {typeCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-sm">
                              <targetCfg.icon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{notif.target === "department" ? notif.targetValue : targetCfg.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {notif.stats.total > 0 ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-muted-foreground">
                                    {notif.stats.delivered}/{notif.stats.total}
                                  </span>
                                  <Progress 
                                    value={(notif.stats.delivered / notif.stats.total) * 100} 
                                    className="h-1.5 flex-1 max-w-[60px]"
                                  />
                                  <span className="text-muted-foreground">
                                    {Math.round((notif.stats.delivered / notif.stats.total) * 100)}%
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  {notif.stats.read} read • {notif.stats.clicked} clicked
                                </p>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
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
                                    setSelectedNotification(notif);
                                    setIsDetailOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                {notif.status === "draft" || notif.status === "scheduled" ? (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                                      <Send className="mr-2 h-4 w-4" />
                                      Send Now
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                ) : null}
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

      {/* Create Notification Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
            <DialogDescription>
              Compose and send a push notification to your users.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pt-4">
              {/* Content Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Content
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="notif-title">Title *</Label>
                  <Input
                    id="notif-title"
                    placeholder="Enter notification title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Keep it short and engaging (max 65 characters recommended)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notif-message">Message *</Label>
                  <Textarea
                    id="notif-message"
                    placeholder="Write your notification message..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 500 characters. Be clear about the action you want users to take.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v as NotificationType })}
                    className="grid grid-cols-3 sm:grid-cols-6 gap-2"
                  >
                    {Object.entries(typeConfig).map(([key, cfg]) => (
                      <div key={key} className="relative">
                        <RadioGroupItem
                          value={key}
                          id={`type-${key}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`type-${key}`}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg border cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent",
                            formData.type === key && "border-primary bg-primary/5"
                          )}
                        >
                          <cfg.icon className="h-4 w-4" />
                          <span className="text-[10px] font-medium">{cfg.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <Separator />

              {/* Target Audience */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Target Audience
                </h3>
                
                <Select value={formData.target} onValueChange={(v) => setFormData({ ...formData, target: v as NotificationTarget })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(targetConfig).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <cfg.icon className="h-4 w-4" />
                          <div>
                            <span className="font-medium">{cfg.label}</span>
                            <span className="block text-xs text-muted-foreground">{cfg.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(formData.target === "department" || formData.target === "individual") && (
                  <div className="space-y-2">
                    <Label htmlFor="target-value">
                      {formData.target === "department" ? "Department" : "User Email"}
                    </Label>
                    {formData.target === "department" ? (
                      <Select value={formData.targetValue} onValueChange={(v) => setFormData({ ...formData, targetValue: v })}>
                        <SelectTrigger id="target-value">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agronomy">Agronomy</SelectItem>
                          <SelectItem value="horticulture">Horticulture</SelectItem>
                          <SelectItem value="plant-pathology">Plant Pathology</SelectItem>
                          <SelectItem value="soil-science">Soil Science</SelectItem>
                          <SelectItem value="entomology">Entomology</SelectItem>
                          <SelectItem value="genetics">Genetics & Plant Breeding</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="target-value"
                        type="email"
                        placeholder="user@email.com"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                      />
                    )}
                  </div>
                )}
                
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium">Estimated Reach</p>
                  <p className="text-muted-foreground mt-1">
                    {formData.target === "all" && "~24,589 users"}
                    {formData.target === "premium" && "~1,234 premium users"}
                    {formData.target === "free" && "~23,355 free users"}
                    {formData.target === "department" && `~${Math.floor(Math.random() * 5000 + 2000)} ${formData.targetValue || "selected"} users`}
                    {formData.target === "individual" && "1 user"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </h3>
                
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="send-now"
                      checked={formData.scheduleType === "now"}
                      onChange={() => setFormData({ ...formData, scheduleType: "now" })}
                      className="accent-primary"
                    />
                    <Label htmlFor="send-now" className="cursor-pointer">Send Now</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="schedule-later"
                      checked={formData.scheduleType === "schedule"}
                      onChange={() => setFormData({ ...formData, scheduleType: "schedule" })}
                      className="accent-primary"
                    />
                    <Label htmlFor="schedule-later" className="cursor-pointer">Schedule for Later</Label>
                  </div>
                </div>
                
                {formData.scheduleType === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="schedule-date">Date</Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={formData.scheduleDate}
                        onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-time">Time</Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={formData.scheduleTime}
                        onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Preview */}
              {formData.title && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Preview</h3>
                  <div className="rounded-xl border overflow-hidden shadow-sm">
                    {/* Mobile Preview Frame */}
                    <div className="bg-gradient-to-b from-primary to-agri-green p-4 pb-2">
                      <div className="flex items-center gap-2 text-white">
                        <Bell className="h-5 w-5" />
                        <span className="font-medium text-sm">AgriVerse Academy</span>
                        <span className="ml-auto text-xs opacity-80">Just now</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-card p-4 space-y-2">
                      <p className="font-semibold text-sm">{formData.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{formData.message}</p>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title.trim() || !formData.message.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              {formData.scheduleType === "schedule" ? "Schedule Notification" : "Send Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>View delivery statistics and details.</DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-6 pt-4">
              {/* Notification Content */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={typeConfig[selectedNotification.type].color} variant="outline">
                      {typeConfig[selectedNotification.type].label}
                    </Badge>
                    <Badge className={statusConfig[selectedNotification.status].color} variant="outline">
                      {statusConfig[selectedNotification.status].label}
                    </Badge>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{selectedNotification.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedNotification.message}</p>
              </div>

              {/* Target Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="font-medium">
                    {selectedNotification.target === "department" 
                      ? selectedNotification.targetValue 
                      : targetConfig[selectedNotification.target].label}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Created By</p>
                  <p className="font-medium">{selectedNotification.createdBy}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(selectedNotification.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {selectedNotification.scheduledAt ? "Scheduled For" : "Sent At"}
                  </p>
                  <p className="font-medium">
                    {new Date(
                      selectedNotification.sentAt || selectedNotification.scheduledAt || ""
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Delivery Stats */}
              {selectedNotification.stats.total > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Delivery Statistics</h4>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedNotification.stats.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedNotification.stats.delivered.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedNotification.stats.read.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Read</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedNotification.stats.clicked.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Clicked</p>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Delivery Rate</span>
                        <span>
                          {Math.round((selectedNotification.stats.delivered / selectedNotification.stats.total) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(selectedNotification.stats.delivered / selectedNotification.stats.total) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Read Rate</span>
                        <span>
                          {Math.round((selectedNotification.stats.read / selectedNotification.stats.delivered) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(selectedNotification.stats.read / selectedNotification.stats.delivered) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Click-Through Rate</span>
                        <span>
                          {Math.round((selectedNotification.stats.clicked / selectedNotification.stats.read) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedNotification.stats.read > 0
                            ? (selectedNotification.stats.clicked / selectedNotification.stats.read) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default NotificationManager;
