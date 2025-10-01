import { VideoListResponse } from "@/types/video";
import { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";

export async function fetchVideos(
  query?: Record<string, string>,
): Promise<VideoListResponse> {
  const params = new URLSearchParams(query || {}).toString();
  const token = await getAuthToken();
  if (!token) throw new Error("No token found");
  const res = await fetch(`${BASEURL}/social-media/all-video?${params}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
}

export async function approveVideo(id: string) {
  const res = await fetch(`${BASEURL}/videos/${id}/approve`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to approve video");
  return res.json();
}

export async function rejectVideo(id: string) {
  const res = await fetch(`${BASEURL}/videos/${id}/reject`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to reject video");
  return res.json();
}
