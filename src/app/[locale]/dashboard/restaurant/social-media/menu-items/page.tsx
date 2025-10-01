"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { getAllBranches } from "@/actions/branch/api";
import { getAllMenuCategory, getAllMenuItems, getAllMenuItemsFilter, getAllOfMenuCategory } from "@/actions/menu/api";
import MenuItemSocialMediaForm from "@/components/restaurant/social-media/MenuItemSocialMediaForm";

export default function CreateSocialMediaForMediaItems() {
  const [allMenuItem, setAllMenuItem] = useState<any[]>([]);
  const [allBranches, setAllBranches] = useState<any[]>([]);
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

  const router = useRouter();

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

  if (loading) {
    return (
      <div className="container py-5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
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
         updatedData={updatedData}
        allMenuItem={allMenuItem}
        onSuccess={() => router.push("/dashboard/restaurant/social-media")}
        pagination={{
          currentPage: searchParams.page,
          totalPages: Math.ceil(totalItems / searchParams.limit),
          onPageChange: handlePageChange
        }}
        isLoading={isFiltering}
      />
    </div>
  );
}