import { getAllRoles } from "@/actions/role/api";
import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import { RoleData, RoleResponse } from "@/types";

export default async function SuperAdminRolePage() {
  let data: RoleData[] = [];
  let error: string | null = null;

  try {
    data = await getAllRoles();
  } catch (err: any) {
    console.error("Error fetching roles data:", err);
    error = `Failed to load Roles. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No Record Found</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Restaurants</h1>
      <SuperAdminRoleTable data={data} />
      {/* <div className="mt-4">
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          limit={data.limit}
        />
      </div> */}
    </div>
  );
}
