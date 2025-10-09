// import { getAllCreatedUsers } from "@/actions/user/api";
// import AdminsTable from "@/components/dashboard/admins/AdminsTable";
// import Pagination from "@/components/dashboard/restaurant/Pagination";
// import { BackendAdminResponse, UsersResponse } from "@/types";

// interface AdminsPageProps {
//   searchParams: {
//     page?: string;
//     limit?: string;
//   };
// }

// export default async function AdminsPages({ searchParams }: AdminsPageProps) {
//   const page = parseInt(searchParams.page || "1", 10);
//   const limit = parseInt(searchParams.limit || "10", 10);

//   let data: BackendAdminResponse | null = null;
//   let error: string | null = null;

//   try {
//     data = await getAllCreatedUsers(page, limit);
//   } catch (err: unknown) {
//     console.error("Error fetching admins data:", err);
//     error = "Failed to load admins. Please try again later.";
//   }

//   const totalPages = data ? Math.ceil(data.data.total / data.data.pages) : 1;

//   if (error) {
//     return <div className="p-4 text-center text-red-500">{error}</div>;
//   }

//   if (!data) {
//     return <div className="p-4 text-center">No admins found.</div>;
//   }
//   return (
//     <div className="container mx-auto py-5">
//       <h1 className="mb-4 text-2xl font-bold">Admins</h1>
//       <AdminsTable users={data.data.data} />
//       <div className="mt-4">
//         <Pagination
//           currentPage={data.data.page}
//           totalPages={totalPages}
//           limit={data.data.pages}
//         />
//       </div>
//     </div>
//   );
// }

import { getAllCreatedUsers } from "@/actions/user/api";
import AdminsTable from "@/components/dashboard/admins/AdminsTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import { BackendAdminResponse } from "@/types";

// ✅ FIX: In Next.js 15+, searchParams is a Promise
interface AdminsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminsPages({ searchParams }: AdminsPageProps) {
  // ✅ Await it (required in Next.js 15)
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);

  let data: BackendAdminResponse | null = null;
  let error: string | null = null;

  try {
    data = await getAllCreatedUsers(page, limit);
  } catch (err: unknown) {
    console.error("Error fetching admins data:", err);
    error = "Failed to load admins. Please try again later.";
  }

  const totalPages = data ? Math.ceil(data.data.total / data.data.pages) : 1;

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-4 text-center">No admins found.</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Admins</h1>
      <AdminsTable users={data.data.data} />
      <div className="mt-4">
        <Pagination
          currentPage={data.data.page}
          totalPages={totalPages}
          limit={data.data.pages}
        />
      </div>
    </div>
  );
}
