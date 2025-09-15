'use client'
import { useState,useEffect } from "react";
import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import RestaurantAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import { RoleData, RoleResponse } from "@/types";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import Settings from "@/components/restaurant/settings/Settings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAllBranches } from "@/actions/branch/api";
export default function SettingsPage() {
    const { isAuthenticated, user } = useAuth();
      const [allBranches, setAllBranches] = useState<any[]>([]);
    
  let data: RoleData[] = [];
  let error: string | null = null;
  console.log(user,'user details')


   const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [branches] = await Promise.all([
          getAllBranches(),

        ]);
          console.log(branches,'all branches that are fetched')
        // setPermissions(permissionsRes);
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

  if (loading) return <div>Loading...</div>;
console.log(allBranches,'all branhces list')
    const restaurantData ={
      id:user?.restaurant_id,
      restaurant_name:user?.role_name
    }
  
 console.log(allBranches,'all br')
  return (
    <div className="container mx-auto py-5">
           <h1 className="text-3xl font-bold mb-8">Restaurant Settings</h1>

     <Settings restaurant={restaurantData}  branches={allBranches}/>
    
    </div>
  );
}
