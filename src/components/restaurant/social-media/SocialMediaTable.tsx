"use client"; 
import { useEffect, useRef,useCallback } from "react";
import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import { useRouter } from "@/i18n/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BASEURL } from "@/actions/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteMenuCategory, deleteMenuItem, getAllMenu, getAllMenuItemsFilter, getAllMenuTags, getAllOfMenuCategory, updateMenuCategory, updateMenuItem } from "@/actions/menu/api";
import { getAllBranches } from "@/actions/branch/api";
import { deleteCatering } from "@/actions/catering/api";
import { createSocialMedia, deleteSocialPosts } from "@/actions/social-media/api";
import BranchSocialMediaForm from "./BranchSocialMediaForm";
import MenuItemSocialMediaForm from "./MenuItemSocialMediaForm";
import GeneralSocialMediaForm from "./GeneralSocialMediaForm";

interface AdminTableProps {
  data: User[];
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
  menu_id: z.string().min(1, "Menu is required"),
  branchId: z.string().optional(),
  tags_ids: z.array(z.string()).default([]).optional(),
});

type MenuCategoryFormValues = z.infer<typeof schema>;

export default function SocialMediaTable({ data }: any) {
  const router = useRouter();
  const [searchRes, setSearchRes] = useState("");
  const [editMenuItem, setEditMenuItem] = useState<any | null>(null);
  const [detailMenuItem, setDetailMenuItem] = useState<any | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [branchId, setBranchId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
  const [allBranches, setAllBranches] = useState<any[]>([]);
 const [allMenuItem, setAllMenuItem] = useState<any[]>([]);

  const [allCategory, setAllCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const updatedData = null;

  const [searchParams, setSearchParams] = useState({
    search: "",
    menu_category_id: "",
    branch_id: "",
    page: 1,
    limit: 20
  });
  const [totalItems, setTotalItems] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);


  const fetchMenuItems = useCallback(async () => {
    try {
      setIsFiltering(true);
      const response = await getAllMenuItemsFilter(
        searchParams.page,
        searchParams.limit,
        searchParams.search,
        searchParams.menu_category_id || undefined,
        searchParams.branch_id || undefined
      );
      
      setAllMenuItem(response?.data?.items || []);
      setTotalItems(response?.data?.total || 0);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      toast.error("Failed to fetch menu items");
    } finally {
      setIsFiltering(false);
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [branchesRes, categoriesRes] = await Promise.all([
          getAllBranches(),
          getAllOfMenuCategory()
        ]);

        setAllBranches(branchesRes?.data || []);
        setAllCategory(categoriesRes?.data?.data || []);
        
       
        await fetchMenuItems();
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const handleSearchChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    setSearchParams(prev => ({
      ...prev,
      page: 1
    }));
    
  };

  const handleClearFilters = () => {
    setSearchParams({
      search: "",
      menu_category_id: "",
      branch_id: "",
      page: 1,
      limit: 20
    });
 
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  
  useEffect(() => {
    if (!loading) {
      fetchMenuItems();
    }
  }, [searchParams.page, searchParams.search, searchParams.menu_category_id, searchParams.branch_id]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [branches] = await Promise.all([
          getAllBranches(),
        ]);
        console.log(branches, 'all branches that are fetched');
        setAllBranches(branches?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleVideoUpload = async () => {
    if (!branchId) {
      toast.error("Please select a subscription branch first.");
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
  
    const formData = new FormData();
    console.log(branchId, 'branchId');
    formData.append("branch_id", branchId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
  
    try {
      setIsSubmitting(true);
      console.log("create social media");
      console.log(formData, 'form data');
  
      const response = await createSocialMedia(formData);
  
      if (response?.success) {
        toast.success("Social media post uploaded successfully.");
        setDetailMenuItem(null);
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to upload post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  console.log(data, 'data of social media');

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">

        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 cursor-pointer font-bold">
                Create Social Media Posts
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/restaurant/social-media/new">
                  General Restaurant Post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/restaurant/social-media/branch">
                  Restaurant Branches Post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/restaurant/social-media/menu-items">
                  Restaurant Menu Items Post
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Branch name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((post: any, index: any) => {
                return (
                  <TableRow
                    key={post.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{post?.Branch?.name || "-"}</TableCell>
                    <TableCell>{post?.title ?? "N/A"}</TableCell>
                    <TableCell>{post?.description ?? "N/A"}</TableCell>
                    <TableCell>{post?.status ?? "N/A"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                            Action
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setDetailMenuItem(post)}
                          >
                            <span>Detail</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setEditMenuItem(post); 
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => setDeleteItemId(post.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

      
          {detailMenuItem && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-bold">Social Media Post Details</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setDetailMenuItem(null)}
                  >
                    Close
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                 
                  {detailMenuItem.Branch && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch:</label>
                      <p>{detailMenuItem.Branch.name}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title:</label>
                    <p>{detailMenuItem.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                    <p>{detailMenuItem.description || "N/A"}</p>
                  </div>

                  {detailMenuItem.MenuItem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Menu Item:</label>
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p><strong>Name:</strong> {detailMenuItem.MenuItem.name}</p>
                        <p><strong>Description:</strong> {detailMenuItem.MenuItem.description}</p>
                        <p><strong>Price:</strong> ${detailMenuItem.MenuItem.unit_price}</p>
                        <p><strong>Category:</strong> {detailMenuItem.MenuItem.MenuCategory?.name}</p>
                        {detailMenuItem.MenuItem.image && (
                          <div className="mt-2">
                            <img 
                              src={detailMenuItem.MenuItem.image} 
                              alt={detailMenuItem.MenuItem.name}
                              className="h-32 w-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {detailMenuItem.thumbnail_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail:</label>
                      <img 
                        src={detailMenuItem.thumbnail_url} 
                        alt="Thumbnail" 
                        className="mt-2 h-48 w-full object-cover rounded-md"
                      />
                    </div>
                  )}

                  {detailMenuItem.video_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL:</label>
                      <a 
                        href={detailMenuItem.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-words"
                      >
                        {detailMenuItem.video_url}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Likes:</label>
                      <p>{detailMenuItem.like_count || "0"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Views:</label>
                      <p>{detailMenuItem.view_count || "0"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comments:</label>
                      <p>{detailMenuItem.comment_count || "0"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Favorites:</label>
                      <p>{detailMenuItem.favorite_count || "0"}</p>
                    </div>
                  </div>

                  {detailMenuItem.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (seconds):</label>
                      <p>{detailMenuItem.duration}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                      <p className="capitalize">{detailMenuItem.status}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At:</label>
                      <p>{new Date(detailMenuItem.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {detailMenuItem.is_featured !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured:</label>
                      <p>{detailMenuItem.is_featured ? "Yes" : "No"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

      
          {deleteItemId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                <p>Are you sure you want to delete this social media post?</p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteItemId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const res = await deleteSocialPosts(deleteItemId);
                        if (res.success) {
                          toast.success("Social media post deleted successfully");
                          router.refresh();
                        } else {
                          toast.error(res.message || "Failed to delete post");
                        }
                      } catch (err) {
                        toast.error("Unexpected error during deletion");
                      } finally {
                        setDeleteItemId(null);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

   
          {editMenuItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-bold">Edit Social Media Data</h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditMenuItem(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
                    {editMenuItem?.Branch ? 
                    <div>
                      <BranchSocialMediaForm 
                      updatedData={editMenuItem}
                    allBranches={allBranches} 
                    onSuccess={() =>setEditMenuItem(null)}
     
                    />
                    </div>:editMenuItem?.MenuItem ? 
                    <div>
                        <div className="container py-5">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                              <h2 className="text-lg font-semibold mb-4">Filter Menu Items</h2>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Search</label>
                                  <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    value={searchParams.search}
                                    onChange={(e) => handleSearchChange("search", e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">Category</label>
                                  <select
                                    value={searchParams.menu_category_id}
                                    onChange={(e) => handleSearchChange("menu_category_id", e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                  >
                                    <option value="">All Categories</option>
                                    {allCategory.map((category) => (
                                      <option key={category.id} value={category.id}>
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">Branch</label>
                                  <select
                                    value={searchParams.branch_id}
                                    onChange={(e) => handleSearchChange("branch_id", e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                  >
                                    <option value="">All Branches</option>
                                    {allBranches.map((branch) => (
                                      <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                      
                              <div className="flex gap-3">
                          
                                
                                <button
                                  onClick={handleClearFilters}
                                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                  Clear Filters
                                </button>
                              </div>
                            </div>
                      
                            <MenuItemSocialMediaForm
                               updatedData={editMenuItem}
                              allMenuItem={allMenuItem}
                              onSuccess={() =>setEditMenuItem(null)}
                              pagination={{
                                currentPage: searchParams.page,
                                totalPages: Math.ceil(totalItems / searchParams.limit),
                                onPageChange: handlePageChange
                              }}
                              isLoading={isFiltering}
                            />
                          </div>
                    </div>:
                    <div><GeneralSocialMediaForm onSuccess={()=>setEditMenuItem(null)}/></div>}


                {/* <div>
                  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Social Media</h1>
                    <div className="space-y-6">
                      {allBranches?.map((branch) => (
                        <div
                          key={branch.id}
                          onClick={() => setBranchId(branch.id)}
                          className={`cursor-pointer border p-4 rounded-md transition ${
                            branch.id === branchId
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <DetailCard
                            label="Branch Detail"
                            value={branch.name}
                            total_menu_items={branch.total_menu_items}
                            address={branch.location?.address}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                        <input
                          ref={titleRef}
                          type="text"
                          placeholder="Enter the title"
                          defaultValue={editMenuItem.title}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <input
                          ref={descriptionRef}
                          type="text"
                          placeholder="Enter the description"
                          defaultValue={editMenuItem.description}
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
                      <button onClick={handleVideoUpload} disabled={isSubmitting} className="w-full bg-blue-600 text-white px-4 py-2 rounded">
                        {isSubmitting ? "Uploading..." : "Update Social Media Post"}
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const DetailCard = ({
  label,
  value,
  total_menu_items,
  address,
}: {
  label: string;
  value: string;
  total_menu_items: number;
  address: string;
}) => (
  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm space-y-2">
    <p className="text-sm text-gray-500 dark:text-gray-400 py-2">{label}</p>
    <p className="font-medium text-gray-800 text-[0.9rem] dark:text-gray-200 capitalize">
      Branch Name: {value}
    </p>
    <p className="font-medium text-gray-800 text-[0.9rem] dark:text-gray-200 capitalize">
      Total Menu Items: {total_menu_items}
    </p>
    <p className="font-medium text-gray-800 text-[0.9rem] dark:text-gray-200 capitalize">
      Address: {address}
    </p>
  </div>
);