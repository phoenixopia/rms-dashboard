import { fetchSubscriptions } from "@/actions/subscription/api";
import { SResponse } from "@/types/subscription/subscription";
import SubscriptionsTable from "@/components/dashboard/subscription/SubscriptionTable";

export const dynamic = "force-dynamic"; // ensures SSR

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // Extract and format query parameters
  const {
    status = "all",
    billing_cycle = "all",
    restaurant_name = "",
    page = "1",
    limit = "10",
    sort = "created_at",
    order = "DESC",
  } = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : (v ?? ""),
    ]),
  );

  // Build query string
  const queryParams = new URLSearchParams();
  if (status && status !== "all") queryParams.append("status", status);
  if (billing_cycle && billing_cycle !== "all")
    queryParams.append("billing_cycle", billing_cycle);
  if (restaurant_name) queryParams.append("restaurant_name", restaurant_name);
  queryParams.append("page", page);
  queryParams.append("limit", limit);
  queryParams.append("sort", sort);
  queryParams.append("order", order);

  const queryString = queryParams.toString();

  let data: SResponse | null = null;

  try {
    data = await fetchSubscriptions(queryString);
  } catch (error) {
    console.error("Failed to load subscriptions", error);
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Subscriptions</h1>
      {data ? (
        <>
          <SubscriptionsTable
            subscriptions={data.data.data}
            totalPages={data.data.totalPages}
            totalItems={data.data.totalItems}
            currentPage={data.data.currentPage}
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Page {data.data.currentPage} of {data.data.totalPages} (
              {data.data.totalItems} total items)
            </p>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Failed to fetch subscriptions.</p>
      )}
    </div>
  );
}
