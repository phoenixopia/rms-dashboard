// import { getAllRoles } from "@/actions/role/api";
// import SuperAdminRoleTable from "@/components/dashboard/role/SuperAdminRoleTable";
import { getAllBranches } from "@/actions/branch/api";
import BranchTable from "@/components/restaurant/branch/BranchTable";
import SuperAdminRoleTable from "@/components/restaurant/role/RestaurantAdminRoleTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { RoleData, RoleResponse } from "@/types";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import MenuCategoryTable from "@/components/restaurant/menu-categories/MenuCategoryTable";
import { getAllMenuCategory } from "@/actions/menu/api";
import CateringTable from "@/components/restaurant/catering/CateringTable";
import { getAllMenuCatering } from "@/actions/catering/api";
import TransactionsTable from "@/components/restaurant/transactions/TransactionsTable";
import { getAllTransactions } from "@/actions/transactions/api";

export default async function TransactionPage({
  searchParams,
}: any)  {
  const params = await searchParams;
  let data:any = [];
  let error: string | null = null;
  
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);
  const search = params.search || "";
  const status = params.status || "";
  const branch_id = params.branch_id || "";
  const start_date = params.start_date || "";
  const end_date = params.end_date || "";

  try {
    
    data = await getAllTransactions(
      page,
      limit, 
      {
      search,
      status,
      branch_id,
      start_date,
      end_date
    });
  } catch (err: unknown) {
    console.error("Error fetching transaction data:", err);
    error = `Failed to load transactions. Please try again later.${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
   


  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
      
      {(!data || data?.data?.transactions.length === 0) ? (
        <div className="flex flex-row justify-between">
          <h1 className="flex items-center justify-center">Empty Record</h1>
        </div>
      ) : (
        <TransactionsTable 
          data={data?.data?.transactions} 
        
        />
      )}
      
      <div className="mt-4">
        <Pagination
          currentPage={data?.data?.page}
          totalPages={data?.data?.pages}
          limit={data?.data?.limit}
      
        />
      </div>
    </div>
  );
}