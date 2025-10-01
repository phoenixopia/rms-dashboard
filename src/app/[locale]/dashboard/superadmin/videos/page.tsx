"use client";

import { useEffect, useState } from "react";
import { fetchVideos, approveVideo, rejectVideo } from "@/actions/video/api";
import { Video } from "@/types/video";
import { VideoCard } from "@/components/dashboard/social_media/VideoCard";
import VideoStatsSection from "@/components/dashboard/social_media/VideoStats";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [restaurantFilter, setRestaurantFilter] = useState<string>("");

  const loadVideos = async () => {
    const data = await fetchVideos({
      status: statusFilter,
      title: titleFilter,
      restaurant_name: restaurantFilter,
    });
    setVideos(data.data.rows);
  };

  useEffect(() => {
    loadVideos();
  }, [statusFilter, titleFilter, restaurantFilter]);

  const handleApprove = async (id: string) => {
    await approveVideo(id);
    loadVideos();
  };

  const handleReject = async (id: string) => {
    await rejectVideo(id);
    loadVideos();
  };

  return (
    <div className="space-y-6 p-6">
      <VideoStatsSection />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Filter by Title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="w-48"
        />
        <Input
          placeholder="Filter by Restaurant"
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
          className="w-48"
        />
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadVideos}>Apply Filters</Button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
}
