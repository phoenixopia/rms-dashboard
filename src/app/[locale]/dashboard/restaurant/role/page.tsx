'use server'
import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import RestaurantAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import { RoleData, RoleResponse } from "@/types";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import { revalidatePath } from 'next/cache';
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { Button } from "@/components/ui/button";
export default async function SuperAdminRolePage() {
  let data:any;
  let error: string | null = null;
  const handleRevalidate = async () => {
    
    revalidatePath('/dashboard/restaurant/role');
  };
  try {
    data = await getAllRoles();
  } catch (err: unknown) {
    console.error("Error fetching roles data:", err);
    error = `Failed to load Roles. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  

  if (!data || data.length === 0) {
   return (
      <div className="container mx-auto py-5">
        <h1 className="mb-4 text-2xl font-bold">Role</h1>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-4">No role found.</p>
          <Link href="/dashboard/restaurant/role/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Roles</h1>
      <RestaurantAdminRoleTable data={data?.data?.roles} />
      <div className="mt-4">
        <Pagination
          currentPage={data?.data?.page}
          totalPages={data?.data?.totalPages}
          limit={data?.data?.limit}
        />
      </div>
    </div>
  );
}
