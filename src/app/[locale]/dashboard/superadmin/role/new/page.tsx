"use client";

import { getAllPermissions, getAllRoleTags } from "@/actions/role/api";
import RoleForm from "@/components/dashboard/role/RoleForm";
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
        const [roleTags, allPerms] = await Promise.all([
          getAllRoleTags(),
          getAllPermissions(),
        ]);
        setRoleTags(roleTags);
        setPermissions(allPerms);

        const data: Permission[] = await getAllPermissions();
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
      <RoleForm
        allPermissions={permissions}
        allRoleTags={role_tags}
        onSuccess={() => router.push("/dashboard/superadmin/role")}
      />
    </div>
  );
}
