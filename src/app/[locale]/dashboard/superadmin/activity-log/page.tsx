// import { getActivityLogs } from "@/actions/log/api";
// import ActivityLogTable from "@/components/dashboard/logs/ActivityLogTable";
// import Pagination from "@/components/dashboard/restaurant/Pagination";
// export const dynamic = "force-dynamic";
// import { LogBackResponse } from "@/types/activity";

// interface ActivityLogPageProps {
//   searchParams: {
//     page?: string;
//     limit?: string;
//   };
// }

// export default async function ActivityLogPage({
//   searchParams,
// }: ActivityLogPageProps) {
//   const page = parseInt(searchParams.page || "1", 10);
//   const limit = parseInt(searchParams.limit || "10", 10);

//   let data: LogBackResponse | null = null;
//   let error: string | null = null;

//   try {
//     data = await getActivityLogs(page, limit);
//     console.log(data, "Activity Log data");
//   } catch (err: unknown) {
//     console.error("Error fetching restaurant data:", err);
//     error = `Failed to load restaurants. Please try again later. ${err}`;
//   }

//   if (error) {
//     return <div className="p-4 text-center text-red-500">{error}</div>;
//   }

//   if (!data) {
//     return <div className="p-4 text-center">No Logs found.</div>;
//   }

//   return (
//     <div className="container mx-auto py-5">
//       <h1 className="mb-4 text-2xl font-bold">Restaurants</h1>
//       <ActivityLogTable logs={data.data.data} />
//       <div className="mt-4">
//         <Pagination
//           currentPage={data.data.page}
//           totalPages={data.data.pages}
//           limit={data.data.limit}
//         />
//       </div>
//     </div>
//   );
// }

import { getActivityLogs } from "@/actions/log/api";
import ActivityLogTable from "@/components/dashboard/logs/ActivityLogTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
export const dynamic = "force-dynamic";
import { LogBackResponse } from "@/types/activity";

// ✅ FIX: searchParams must be a Promise in Next.js 15
interface ActivityLogPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function ActivityLogPage({ searchParams }: ActivityLogPageProps) {
  // ✅ Await it — because searchParams is now a Promise
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10);

  let data: LogBackResponse | null = null;
  let error: string | null = null;

  try {
    data = await getActivityLogs(page, limit);
    console.log(data, "Activity Log data");
  } catch (err: unknown) {
    console.error("Error fetching restaurant data:", err);
    error = `Failed to load restaurants. Please try again later. ${err}`;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-4 text-center">No Logs found.</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Activity Logs</h1>
      <ActivityLogTable logs={data.data.data} />
      <div className="mt-4">
        <Pagination
          currentPage={data.data.page}
          totalPages={data.data.pages}
          limit={data.data.limit}
        />
      </div>
    </div>
  );
}
