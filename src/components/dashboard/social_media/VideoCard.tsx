"use client";

import { Video } from "@/types/video/index";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

interface Props {
  video: Video;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function VideoCard({ video, onApprove, onReject }: Props) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{video.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {video.Restaurant?.SystemSetting?.logo_url && (
          <Image
            src={video.Restaurant.SystemSetting.logo_url}
            alt="Restaurant Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <p className="font-medium">
          {video.Restaurant?.restaurant_name ?? "Unknown Restaurant"}
        </p>
        {!showVideo ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            className="h-40 w-full cursor-pointer rounded-lg object-cover"
            width={100}
            height={100}
            onClick={() => setShowVideo(true)}
          ></Image>
        ) : (
          <video
            src={video.video_url}
            controls
            className="h-40 w-full rounded-lg"
          />
        )}
        <div className="text-muted-foreground text-sm">
          <p>
            <strong>Description:</strong> {video.description ?? "N/A"}
          </p>
          <p>
            <strong>Duration:</strong> {video.duration}s
          </p>
          <p>
            <strong>Status:</strong> {video.status}
          </p>
          <p>
            <strong>Featured:</strong> {video.is_featured ? "Yes" : "No"}
          </p>
        </div>

        {video.status === "pending" && (
          <div className="flex gap-2">
            <Button onClick={() => onApprove(video.id)}>Approve</Button>
            <Button variant="destructive" onClick={() => onReject(video.id)}>
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
