import { getAllRestaurantsWithSubscriptions } from "@/actions/restaurant/api";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import RestaurantsTable from "@/components/dashboard/restaurant/RestaurantsTable";
export const dynamic = "force-dynamic";

import { RestaurantsResponse } from "@/types";

interface RestaurantsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function SuperAdminRestaurantPage({
  searchParams,
}: RestaurantsPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  let data: RestaurantsResponse | null = null;
  let error: string | null = null;

  try {
    data = await getAllRestaurantsWithSubscriptions(page, limit);
  } catch (err: any) {
    console.error("Error fetching restaurant data:", err);
    error = "Failed to load restaurants. Please try again later.";
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-4 text-center">No restaurants found.</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Restaurants</h1>
      <RestaurantsTable restaurants={data.data} />
      <div className="mt-4">
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          limit={data.limit}
        />
      </div>
    </div>
  );
}
