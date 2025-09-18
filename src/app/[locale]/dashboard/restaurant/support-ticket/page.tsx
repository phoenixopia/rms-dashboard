
import { getAllBranches } from "@/actions/branch/api";
import BranchTable from "@/components/restaurant/branch/BranchTable";
import SuperAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { RoleData, RoleResponse } from "@/types";
import Link from "next/link";
import MenuCategoryTable from "@/components/restaurant/menu-categories/MenuCategoryTable";
import { getAllMenuCategory } from "@/actions/menu/api";
import CateringTable from "@/components/restaurant/catering/CateringTable";
import { getAllMenuCatering } from "@/actions/catering/api";
import { getAllTables } from "@/actions/table/api";
import RestaurantTablesTable from "@/components/restaurant/tables/RestaurantTablesTable";
import RestaurantSupportTicketTable from "@/components/restaurant/support-ticket/RestaurantSupportTicketTable";
import { getAllSupportTickets } from "@/actions/support-ticket/api";
// ... existing imports ...
export default async function RestaurantTablePage({
  searchParams,
}: any)  {
  let data:any = [];
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const search = params.search || "";
  const is_active = params.is_active || "";
  const branch_id = params.branch_id || "";

  let error: string | null = null;
  let branches: any[] = [];

  try {
    
    const branchesResponse = await getAllBranches();
    branches = branchesResponse?.data || [];
    
    
    data = await getAllSupportTickets(page, limit, search, is_active, branch_id);
  } catch (err: any) {
    console.error("Error fetching restaurant support ticket data:", err);
    error = `Failed to load restaurant support ticket data. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
   
  
  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Restaurant Support Ticket</h1>
     
 

      {(!data || data?.data?.tickets.length === 0) ? (
        <div className="flex flex-row justify-between">
          <h1 className="flex items-center justify-center">Empty Record</h1>
          <Link className="flex p-2 rounded-md bg-gray-200" href="/dashboard/restaurant/support-ticket/new">
            Create New Support Ticket
          </Link>
        </div>
      ) : (
        <>
          <RestaurantSupportTicketTable data={data?.data?.tickets} />
          <div className="mt-4">
            <Pagination
              currentPage={data?.data?.page}
              totalPages={data?.data?.totalPages}
              limit={data?.data?.pagination?.limit}
            />
          </div>
        </>
      )}
    </div>
  );
}