"use client";

import { getAllPermissions, getAllRestuarantPermissions, getAllRoleTags } from "@/actions/role/api";

import { useRouter } from "@/i18n/navigation";
import { Permission, RoleTag } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BranchForm from "@/components/restaurant/branch/BranchForm";
import MenuCategoriesFormItems from "@/components/restaurant/menu-categories-items/MenuCategoriesFormItems";

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
      <MenuCategoriesFormItems
        // allPermissions={permissions}
        // allRoleTags={role_tags}
        onSuccess={() => router.push("/dashboard/restaurant/menu-items")}
      />
    </div>
  );
}
