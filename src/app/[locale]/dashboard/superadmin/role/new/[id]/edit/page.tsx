"use client";

import { getAllPermissions, getRoleById } from "@/actions/role/api";
import RoleForm from "@/components/dashboard/role/RoleForm";
import { useRouter } from "@/i18n/navigation";
import { Permission, RoleData } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [role, setRole] = useState<RoleData | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!params.id) {
          throw new Error("Role ID is missing");
        }
        const [roleData, allPerms] = await Promise.all([
          getRoleById(params.id),
          getAllPermissions(),
        ]);
        setRole(roleData);
        setPermissions(allPerms);
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
        onSuccess={() => router.push("/dashboard/superadmin/role")}
      />
    </div>
  );
}
