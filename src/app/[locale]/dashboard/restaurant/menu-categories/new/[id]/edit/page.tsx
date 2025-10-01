"use client";

import {
  getAllPermissions,
  getAllRoleTags,
  getRoleById,
} from "@/actions/role/api";
import RoleForm from "@/components/dashboard/role/RoleForm";
import { useRouter } from "@/i18n/navigation";
import { Permission, RoleData, RoleTag } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [role, setRole] = useState<RoleData | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role_tags, setRoleTags] = useState<RoleTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!params.id) {
          throw new Error("Role ID is missing");
        }
        const [roleData, allPerms, allRoleTags] = await Promise.all([
          getRoleById(params.id),
          getAllPermissions(),
          getAllRoleTags(),
        ]);
        setRole(roleData);
        setPermissions(allPerms);
        setRoleTags(allRoleTags);
      } catch (err) {
        console.error("Error loading role details:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        toast.error("Error loading role details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!role) return <div>Role not found</div>;

  return (
    <div className="container py-5">
      <RoleForm
        role={role}
        allPermissions={permissions}
        allRoleTags={role_tags}
        onSuccess={() => router.push("/dashboard/superadmin/role")}
      />
    </div>
  );
}
