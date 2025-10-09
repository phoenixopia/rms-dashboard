'use client'
import { useState,useEffect } from "react";
import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import RestaurantAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import { RoleData, RoleResponse } from "@/types";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import Settings from "@/components/restaurant/settings/Settings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAllBranches } from "@/actions/branch/api";
export default function SettingsPage() {
    const { isAuthenticated, user } = useAuth();
      const [allBranches, setAllBranches] = useState<any[]>([]);
      const t =useTranslations("full");
  let data: RoleData[] = [];
  let error: string | null = null;



   const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [branches] = await Promise.all([
          getAllBranches(),

        ]);
    
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

    const restaurantData ={
      id:user?.restaurant_id,
      restaurant_name:user?.role_name
    }
  

  return (
    <div className="container mx-auto py-5">
           <h1 className="text-3xl font-bold mb-8">{t("Restaurant Settings")}</h1>

     <Settings restaurant={restaurantData}  branches={allBranches}/>
    
    </div>
  );
}
