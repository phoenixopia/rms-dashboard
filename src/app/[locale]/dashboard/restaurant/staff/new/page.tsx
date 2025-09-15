"use client";
import { getAllRoles } from "@/actions/role/api";
import { CreateRestaurantAdminForm } from "@/components/dashboard/admins/CreateRestaurantAdminForm";
import { CreateRestaurantStaffForm } from "@/components/restaurant/admins/CreateRestaurantStaffForm";
import { RoleData } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateAdminFormPage() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const roleData: RoleData[] = await getAllRoles();
        setRoles(roleData);
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
