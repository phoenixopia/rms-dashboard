"use client";

import { getAllPermissions, getAllRestuarantPermissions, getAllRoleTags } from "@/actions/role/api";
import RestaurantRoleForm from "@/components/restaurant/role/RestaurantRoleForm";
import { useRouter } from "@/i18n/navigation";
import { Permission, RoleTag } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateRolePage() {
  const [role_tags, setRoleTags] = useState<RoleTag[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const [ allPerms] = await Promise.all([
          // getAllRoleTags(),
          getAllRestuarantPermissions(),
        ]);
        // setRoleTags(roleTags);
        setPermissions(allPerms);

        const data: Permission[] = await getAllRestuarantPermissions();
        setPermissions(data);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        toast.error("Faild to fetch permissions");
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container py-5">
      <RestaurantRoleForm
        allPermissions={permissions}
        allRoleTags={role_tags}
        onSuccess={() => (router.push("/dashboard/restaurant/role"),router.refresh())}
      />
    </div>
  );
}
