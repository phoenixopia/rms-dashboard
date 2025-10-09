
import { getAllCreatedUsers } from "@/actions/user/api";
import AdminsTable from "@/components/restaurant/admins/AdminsTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { BackendAdminResponse } from "@/types";

// eslint-disable-next-line no-restricted-imports
import Link from "next/link";

// FIX: mark searchParams as a Promise
interface AdminsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminsPages({ searchParams }: AdminsPageProps) {
  // ✅ await searchParams (it’s a Promise in Next.js 15)
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);

  let data: BackendAdminResponse | null = null;
  let error: string | null = null;

  try {
    data = await getAllCreatedUsers(page, limit);
} catch (err: unknown) {
    console.error("Error fetching admins data:", err);
    error = "Failed to load users. Please try again later.";
  }

  // const totalPages = data ? Math.ceil(data.data.total / data.data.pages) : 1;

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Staffs</h1>

      {(!data || data.data?.data?.length === 0) ? (
        <div className="flex flex-row justify-between">
          <h1 className="flex items-center justify-center">Empty Record</h1>
          <Link
            className="flex p-2 rounded-md bg-gray-200"
            href="/dashboard/restaurant/staff/new"
          >
            Create New Staff
          </Link>
        </div>
      ) : (
        <>
          <AdminsTable users={data.data.data} />
          <div className="mt-4">
            <Pagination
              currentPage={data.data.page}
              totalPages={data.data.pages}
              limit={data.data.pages}
            />
          </div>
        </>
      )}
    </div>
  );
}
