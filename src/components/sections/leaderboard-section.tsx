"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  initials: string;
  score: number;
  exam: string;
  badge: "gold" | "silver" | "bronze" | "default";
  streak: number;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Priya Sharma",
    avatar: "",
    initials: "PS",
    score: 9850,
    exam: "ICAR JRF",
    badge: "gold",
    streak: 45,
  },
  {
    rank: 2,
    name: "Rahul Kumar",
    avatar: "",
    initials: "RK",
    score: 9720,
    exam: "AIEEA-UG",
    badge: "silver",
    streak: 38,
  },
  {
    rank: 3,
    name: "Ananya Patel",
    avatar: "",
    initials: "AP",
    score: 9585,
    exam: "ICAR JRF",
    badge: "bronze",
    streak: 32,
  },
  {
    rank: 4,
    name: "Vikram Singh",
    avatar: "",
    initials: "VS",
    score: 9410,
    exam: "CSIR NET",
    badge: "default",
    streak: 28,
  },
  {
    rank: 5,
    name: "Sneha Reddy",
    avatar: "",
    initials: "SR",
    score: 9280,
    exam: "GATE BT",
    badge: "default",
    streak: 25,
  },
  {
    rank: 6,
    name: "Arjun Mehta",
    avatar: "",
    initials: "AM",
    score: 9155,
    exam: "CUET PG",
    badge: "default",
    streak: 22,
  },
  {
    rank: 7,
    name: "Neha Gupta",
    avatar: "",
    initials: "NG",
    score: 9020,
    exam: "ICAR PG",
    badge: "default",
    streak: 20,
  },
  {
    rank: 8,
    name: "Aditya Verma",
    avatar: "",
    initials: "AV",
    score: 8890,
    exam: "IIT JAM",
    badge: "default",
    streak: 18,
  },
];

const badgeStyles = {
  gold:
    "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30",
  silver:
    "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-400/30",
  bronze:
    "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30",
  default: "bg-muted text-muted-foreground",
};

const rankBadgeStyles = {
  1: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
  2: "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700",
  3: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
};

export function LeaderboardSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Top Performers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Student{" "}
            <span className="gradient-text">Leaderboard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating our top performers who are leading the way in ICAR
            preparation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 order-1"
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 1st Place */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-900/30">
                  <div className="relative">
                    <Avatar className="w-14 h-14 ring-4 ring-yellow-400">
                      <AvatarImage src={leaderboardData[0].avatar} alt={leaderboardData[0].name} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-700 font-bold text-lg">
                        {leaderboardData[0].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      1
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{leaderboardData[0].name}</h4>
                    <p className="text-sm text-muted-foreground">{leaderboardData[0].exam}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">{leaderboardData[0].score.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", badgeStyles.gold)}>
                    🏆 Top
                  </Badge>
                </div>

                {/* 2nd Place */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border border-gray-200 dark:border-gray-700/30">
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-4 ring-gray-300">
                      <AvatarImage src={leaderboardData[1].avatar} alt={leaderboardData[1].name} />
                      <AvatarFallback className="bg-gray-100 text-gray-700 font-bold">
                        {leaderboardData[1].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      2
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{leaderboardData[1].name}</h4>
                    <p className="text-sm text-muted-foreground">{leaderboardData[1].exam}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">{leaderboardData[1].score.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", badgeStyles.silver)}>
                    🥈 2nd
                  </Badge>
                </div>

                {/* 3rd Place */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/30">
                  <div className="relative">
                    <Avatar className="w-11 h-11 ring-4 ring-orange-400">
                      <AvatarImage src={leaderboardData[2].avatar} alt={leaderboardData[2].name} />
                      <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-sm">
                        {leaderboardData[2].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      3
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{leaderboardData[2].name}</h4>
                    <p className="text-sm text-muted-foreground">{leaderboardData[2].exam}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">{leaderboardData[2].score.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", badgeStyles.bronze)}>
                    🥉 3rd
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Full Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 order-2"
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Full Rankings</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Updated hourly
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Rank
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Student
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                          Exam
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          Score
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                          Streak
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((entry) => (
                        <motion.tr
                          key={entry.rank}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: entry.rank * 0.05 }}
                          className={cn(
                            "border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors",
                            entry.rank <= 3 && "bg-muted/30"
                          )}
                        >
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                                rankBadgeStyles[entry.rank as 1 | 2 | 3] ||
                                  "bg-muted text-muted-foreground"
                              )}
                            >
                              {entry.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-9 h-9">
                                <AvatarImage src={entry.avatar} alt={entry.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                  {entry.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{entry.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <Badge variant="secondary" className="text-xs">
                              {entry.exam}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-semibold text-primary">
                              {entry.score.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right hidden md:table-cell">
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                              <svg
                                className="w-4 h-4 text-orange-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                              {entry.streak} days
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* View Full CTA */}
                <div className="mt-6 pt-4 border-t border-border/50 text-center">
                  <Button asChild variant="outline" size="lg" className="rounded-xl px-6">
                    <Link href="/leaderboard">
                      View Full Leaderboard
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LeaderboardSection;
