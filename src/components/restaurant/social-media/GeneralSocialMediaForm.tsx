"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createSubscription } from "@/actions/susbscriptions/api";
import { Button } from "@/components/ui/button";
import { createSocialMedia, updateSocialMedia } from "@/actions/social-media/api";

type Branch = {
  id: string;
  name: string;
  total_menu_items: number;
  location: {
    address: string;
  };
};

type Props = {
  allBranches: Branch[];
  onSuccess?: () => void;
};

export default function GeneralSocialMediaForm({ updatedData,allBranches, onSuccess }: any) {
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  // const [branchId, setBranchId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleVideoUpload = async () => {


  const title = titleRef.current?.value?.trim();
  const description = descriptionRef.current?.value?.trim();
  const videoFile = videoRef.current?.files?.[0];
  const thumbnailFile = imageRef.current?.files?.[0];

  if (!title || !description || !videoFile || !thumbnailFile) {
    toast.error("All fields including video and thumbnail image are required.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("video", videoFile);
  formData.append("thumbnail", thumbnailFile);
  let response;
  try {
    setIsSubmitting(true);


   
         if (updatedData?.id) {
        
           response = await updateSocialMedia(formData,updatedData?.id);
         } else {
      
           response = await createSocialMedia(formData);
         }

    if (response?.success) {
      toast.success("Social media post uploaded successfully.");
      onSuccess?.();
    } else {
      toast.error(response?.message || "Something went wrong.");
    }
  } catch (err) {
    toast.error("Failed to upload post.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload General Social Media Post</h1>

        <div className="space-y-6">


          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Enter the title"
                defaultValue={updatedData?.title || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
            <input
              ref={descriptionRef}
              type="text"
              placeholder="Enter the description"
                defaultValue={updatedData?.description || ''}

              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Upload Video</label>
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Upload Thumbnail Image</label>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

        <Button 
            onClick={handleVideoUpload} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              updatedData ? "Updating..." : "Uploading..."
            ) : (
              updatedData ? "Update Social Media Post" : "Upload Social Media Post"
            )}
          </Button>

        </div>
      </div>
    </div>
  );
}


