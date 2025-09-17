"use client";
import { getAllRoles } from "@/actions/role/api";
import { CreateRestaurantAdminForm } from "@/components/dashboard/admins/CreateRestaurantAdminForm";
import { CreateRestaurantStaffForm } from "@/components/restaurant/admins/CreateRestaurantStaffForm";
// import { RoleData } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateAdminFormPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const roleData = await getAllRoles();
        console.log(roleData,'role data in create staff form page')
        setRoles(roleData?.data?.roles || []);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        toast.error("Faild to fetch permissions");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);
  if (loading) return <div>Loading...</div>;
  return <CreateRestaurantStaffForm roles={roles} />;
}
