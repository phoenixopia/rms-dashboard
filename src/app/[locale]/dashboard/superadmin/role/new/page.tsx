"use client";

import { getAllPermissions } from "@/actions/role/api";
import RoleForm from "@/components/dashboard/role/RoleForm";
import { useRouter } from "@/i18n/navigation";
import { Permission } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateRolePage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPermissions() {
      try {
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
        onSuccess={() => router.push("/dashboard/superadmin/role")}
      />
    </div>
  );
}
