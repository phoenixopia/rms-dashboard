"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createSocialMedia, updateSocialMedia } from "@/actions/social-media/api";
import { Button } from "@/components/ui/button";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  branch?: {
    name: string;
    location?: {
      address: string;
    };
  };
};

type Props = {
  allMenuItem: MenuItem[];
  onSuccess?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  isLoading?: boolean;
};

export default function MenuItemSocialMediaForm({ 
  updatedData,
  allMenuItem, 
  onSuccess, 
  pagination, 
  isLoading = false 
}: any) {
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
 
  const [menuItemId, setMenuItemId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVideoUpload = async () => {
    if (!menuItemId) {
      toast.error("Please select a menu item first.");
      return;
    }

    const title = titleRef.current?.value?.trim();
    const description = descriptionRef.current?.value?.trim();
    const videoFile = videoRef.current?.files?.[0];
    const thumbnailFile = imageRef.current?.files?.[0];

    if (!title || !description || !videoFile || !thumbnailFile) {
      toast.error("All fields including video and thumbnail image are required.");
      return;
    }
    let response;
    const formData = new FormData();
    formData.append("menu_item_id", menuItemId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Restaurant Menu Item Media Post</h1>

        {isLoading ? (
          <div className="text-center py-8">
            {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div> */}
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {allMenuItem.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No menu items found. Try adjusting your filters.
                </div>
              ) : (
                allMenuItem.map((item:any) => (
                  <div
                    key={item.id}
                    onClick={() => setMenuItemId(item.id)}
                    className={`cursor-pointer border p-4 rounded-md transition ${
                      item.id === menuItemId
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <DetailCard
                      label="Menu Item"
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      branchName={item.branch?.name}
                      address={item.branch?.location?.address}
                    />
                  </div>
                ))
              )}
            </div>

            
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || isLoading}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

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
        )}
      </div>
    </div>
  );
}

const DetailCard = ({
  label,
  name,
  description,
  price,
  branchName,
  address,
}: {
  label: string;
  name: string;
  description: string;
  price: number;
  branchName?: string;
  address?: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
    <p className="text-sm text-gray-500 py-2">{label}</p>
    <p className="font-medium text-gray-800 text-[0.9rem] capitalize">
      Name: {name}
    </p>
    <p className="text-gray-600 text-sm">Description: {description}</p>
    <p className="font-medium text-green-600">Price: ${price}</p>
    {branchName && (
      <p className="text-sm text-gray-600">Branch: {branchName}</p>
    )}
    {address && (
      <p className="text-sm text-gray-600">Address: {address}</p>
    )}
  </div>
);