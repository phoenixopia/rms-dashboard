// import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import { getAllBranches } from "@/actions/branch/api";
import BranchTable from "@/components/restaurant/branch/BranchTable";
import SuperAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { RoleData, RoleResponse } from "@/types";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
export default async function SuperAdminRolePage() {
  let data:any = [];
  let error: string | null = null;

  try {
    data = await getAllBranches();
  } catch (err: unknown) {
    console.error("Error fetching roles data:", err);
    error = `Failed to load Branches. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // if (!data || data.length === 0) {
  //   return <div className="p-4 text-center">No Record Found</div>;
  // }
  
  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Branches</h1>
      {(!data || data.length === 0)? (<>
      <div className="flex flex-row justify-between">
        <h1 className="flex items-center justify-center">Empty Record</h1>
        <Link className="flex p-2 rounded-md bg-gray-200" href="/dashboard/restaurant/branch/new"> Create New Branch</Link>
      
      </div>
    
      </>
       
      ) : <BranchTable data={data} />}
      {/* <SuperAdminRoleTable roles={data} /> */}
      

      {/* <div className="mt-4">
        <Pagination
          currentPage={data?.meta?.currentPage}
          totalPages={data?.meta?.totalPages}
          limit={data?.meta?.pageSize}
        />
      </div> */}
    </div>
  );
}
