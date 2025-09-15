import { getAllCreatedUsers } from "@/actions/user/api";
// import AdminsTable from "@/components/dashboard/admins/AdminsTable";
import AdminsTable from "@/components/restaurant/admins/AdminsTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { BackendAdminResponse, UsersResponse } from "@/types";
import Link from "next/link";
interface AdminsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function AdminsPages({ searchParams }: AdminsPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  let data: BackendAdminResponse | null = null;
  let error: string | null = null;

  try {
    data = await getAllCreatedUsers(page, limit);
  } catch (err: any) {
    console.error("Error fetching admins data:", err);
    error = "Failed to load users. Please try again later.";
  }
  console.log(data, "Data from getAllCreatedUsers");
  const totalPages = data ? Math.ceil(data.data.total / data.data.pages) : 1;

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }


  console.log(data,'staff data')
  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Staffs</h1>
         {(!data || data.data?.data?.length === 0)? (<>
      <div className="flex flex-row justify-between">
        <h1 className="flex items-center justify-center">Empty Record</h1>
        <Link className="flex p-2 rounded-md bg-gray-200" href="/dashboard/restaurant/staff/new"> Create New Staff</Link>
      
      </div>
    
      </>
       
      ) :<>
      <AdminsTable users={data.data.data} />
      <div className="mt-4">
        <Pagination
          currentPage={data.data.page}
          totalPages={data.data.pages}
          limit={data.data.pages}
        />
      </div>
      </>}
    </div>
  );
}
