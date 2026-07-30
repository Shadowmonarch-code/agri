"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Download,
  Coins,
  Award,
  ChevronDown,
  Flame,
  Sparkles,
} from "lucide-react";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileDropdown() {
  const { user, logout, openLoginDialog } = useAuth();

  // If user is not logged in, show login button
  if (!user) {
    return (
      <Button
        onClick={openLoginDialog}
        className="bg-agri-green hover:bg-agri-green-light text-white gap-2 btn-premium"
      >
        <User className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format XP to readable number
  const formatXP = (xp: number) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  };

  // Menu items configuration
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "#dashboard", description: "View your overview" },
    { icon: BookOpen, label: "My Courses", href: "#courses", description: "Enrolled courses" },
    { icon: Bookmark, label: "Bookmarks", href: "#bookmarks", description: "Saved materials" },
    { icon: Download, label: "Downloads", href: "#downloads", description: "Downloaded files" },
    { icon: Settings, label: "Settings", href: "#settings", description: "Account settings" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 px-2 sm:px-3 gap-2 hover:bg-accent"
        >
          {/* Streak indicator */}
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-agri-green/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-agri-green to-agri-lime text-white text-xs font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {user.streak > 0 && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <Flame className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* User info - hidden on mobile */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium leading-tight">{user.name}</span>
            <span className="text-xs text-muted-foreground leading-tight">{user.email}</span>
          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-2">
        {/* User Info Header */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-agri-green/5 to-agri-lime/5 mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-agri-green/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-agri-green to-agri-lime text-white font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-agri-gold" />
              <span className="text-sm font-medium">{user.coins.toLocaleString()}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">{formatXP(user.xp)} XP</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-agri-green" />
              <span className="text-sm font-medium">{user.badges}</span>
            </div>
          </div>

          {/* Streak Badge */}
          {user.streak > 0 && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 gap-1">
                <Flame className="w-3 h-3" />
                {user.streak} Day Streak!
              </Badge>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.label} className="flex items-center gap-3 py-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={logout}
          className="flex items-center gap-3 py-2.5 text-destructive focus:text-destructive cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Sign Out</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
