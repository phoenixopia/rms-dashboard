// import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import { getAllBranches } from "@/actions/branch/api";
import BranchTable from "@/components/restaurant/branch/BranchTable";
import SuperAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { RoleData, RoleResponse } from "@/types";
import Link from "next/link";
import MenuCategoryTable from "@/components/restaurant/menu-categories/MenuCategoryTable";
import { getAllMenuCategory, getAllMenuCategoryItems, getAllMenuItems } from "@/actions/menu/api";
import MenuCategoryItemsTable from "@/components/restaurant/menu-categories-items/MenuCategoryItemsTable";
export default async function SuperAdminRolePage({
  searchParams,
}: any) {
  let data:any = [];

    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);

    let error: string | null = null;

  try {
    data = await getAllMenuItems(page, limit);;
  } catch (err: any) {
    console.error("Error fetching roles data:", err);
    error = `Failed to menu items. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
   
  // if (!data || data.length === 0) {
  //   return <div className="p-4 text-center">No Record Found</div>;
  // }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Menu Categrories Items</h1>
      {(!data || data.length === 0)? (<>
      <div className="flex flex-row justify-between">
        <h1 className="flex items-center justify-center">Empty Record</h1>
        <Link className="flex p-2 rounded-md bg-gray-200" href="/dashboard/restaurant/staff/new"> Create New Branch</Link>
      
      </div>
    
      </>
       
      ) : <MenuCategoryItemsTable data={data} />}
      {/* <SuperAdminRoleTable roles={data} /> */}
      
   
      <div className="mt-4">
        <Pagination
          currentPage={data?.data?.pagination?.page}
          totalPages={data?.data?.pagination?.totalPages}
          limit={data?.data?.pagination?.limit}
        />
      </div>
    </div>
  );
}
