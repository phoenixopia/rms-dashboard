"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Video, Eye, ThumbsUp, MessageCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { BASEURL } from "@/actions/api";
import { getAuthToken } from "@/auth/auth";
import { toast } from "sonner";

export interface VideoStatsProps {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface StatResponseProps {
  success: boolean;
  message: string;
  data: VideoStatsProps;
}

const fmt = new Intl.NumberFormat();
const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

function safeDiv(n: number, d: number) {
  if (!d || d === 0) return 0;
  return n / d;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  hint,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  return (
    <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <div className="bg-muted rounded-xl p-2">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {hint ? (
          <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function VideoStatsCard({ data }: { data: VideoStatsProps }) {
  const { totalVideos, totalViews, totalLikes, totalComments } = data;

  const avgViewsPerVideo = safeDiv(totalViews, totalVideos);
  const likeRate = safeDiv(totalLikes, totalViews);
  const commentRate = safeDiv(totalComments, totalViews);
  const engagementRate = safeDiv(totalLikes + totalComments, totalViews);

  const engagementLabel =
    engagementRate >= 0.1
      ? "Excellent"
      : engagementRate >= 0.05
        ? "Good"
        : "Needs attention";

  return (
    <TooltipProvider>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 md:grid-cols-2"
        >
          <Card className="border-muted/50 from-background to-muted/30 col-span-1 rounded-2xl bg-gradient-to-br md:col-span-2">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl">
                  Video Performance Overview
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Snapshot of your channel performance and engagement quality.
                </p>
              </div>
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs"
              >
                <Activity className="mr-1 size-3" /> Engagement:{" "}
                {pct(engagementRate)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Videos"
                  value={fmt.format(totalVideos)}
                  icon={Video}
                />
                <MetricCard
                  title="Total Views"
                  value={fmt.format(totalViews)}
                  icon={Eye}
                  hint={`Avg ${fmt.format(Math.floor(avgViewsPerVideo))} per video`}
                />
                <MetricCard
                  title="Total Likes"
                  value={fmt.format(totalLikes)}
                  icon={ThumbsUp}
                  hint={`Like rate ${pct(likeRate)}`}
                />
                <MetricCard
                  title="Total Comments"
                  value={fmt.format(totalComments)}
                  icon={MessageCircle}
                  hint={`Comment rate ${pct(commentRate)}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Overall engagement: {pct(engagementRate)}
              </p>
              <p className="text-muted-foreground">
                Engagement quality: {engagementLabel}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Quality Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Views / video
                </Badge>
                <span className="text-muted-foreground">
                  {fmt.format(Math.floor(avgViewsPerVideo))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Likes / view
                </Badge>
                <span className="text-muted-foreground">{pct(likeRate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Comments / view
                </Badge>
                <span className="text-muted-foreground">
                  {pct(commentRate)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}

export default function VideoStatsSection() {
  const [stats, setStats] = useState<VideoStatsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const token = await getAuthToken();
        if (!token) {
          throw new Error("You are not authorized to perform this action.");
        }
        const res = await fetch(`${BASEURL}/social-media/stats-overview`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const json: StatResponseProps = await res.json();
        if (!json.success) throw new Error(json.message);
        setStats(json.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load stats");
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4 text-red-500 md:p-8">
        Error: {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <VideoStatsCard data={stats} />
    </div>
  );
}
