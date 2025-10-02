// import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import { getAllBranches } from "@/actions/branch/api";
import BranchTable from "@/components/restaurant/branch/BranchTable";
import SuperAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { RoleData, RoleResponse } from "@/types";
import Link from "next/link";
import MenuCategoryTable from "@/components/restaurant/menu-categories/MenuCategoryTable";
import { getAllMenuCategory } from "@/actions/menu/api";
export default async function SuperAdminRolePage({
  searchParams,
}: any)  {
  let data:any = [];

    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);


  let error: string | null = null;

  try {
    data = await getAllMenuCategory(page, limit);
  } catch (err: any) {
    console.error("Error fetching roles data:", err);
    error = `Failed to load menu categories. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  


  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Menu Categrories</h1>
      {(!data || data.length === 0)? (<>
      <div className="flex flex-row justify-between">
        <h1 className="flex items-center justify-center">Empty Record</h1>
        {/* <Link className="flex p-2 rounded-md bg-gray-200" href="/dashboard/restaurant/branch/new"> Create New Branch</Link> */}
      
      </div>
    
      </>
       
      ) : <MenuCategoryTable data={data} />}
      {/* <SuperAdminRoleTable roles={data} /> */}
      

        {/* <div className="mt-4">
            <Pagination
              currentPage={data?.data?.page}
              totalPages={data?.data?.total}
              limit={data?.data?.limit}
            />
          </div> */}
    </div>
  );
}
