// import { getAllOrders } from "@/actions/order/api";
// // import AdminsTable from "@/components/dashboard/admins/AdminsTable";
// import OrdersTable from "@/components/restaurant/orders/OrdersTable";
// import Pagination from "@/components/dashboard/restaurant/Pagination";

// interface AdminsPageProps {
//   searchParams: {
//     page?: string;
//     limit?: string;
//   };
// }

// export default async function OrdersPages({ searchParams }: AdminsPageProps) {
//   const page = parseInt(searchParams.page || "1", 10);
//   const limit = parseInt(searchParams.limit || "5", 5);

//   let data: any | null = null;
//   let error: string | null = null;

//   try {
//     data = await getAllOrders(page, 5);
//   } catch (err: unknown) {
//     console.error("Error fetching orders data:", err);
//     error = "Failed to load orders. Please try again later.";
//   }
//   console.log(data, "Data from getAllorders");
//   const totalPages = data ? Math.ceil(data.data.pagination.totalPages) : 1;

//   if (error) {
//     return <div className="p-4 text-center text-red-500">{error}</div>;
//   }

//   if (!data) {
//     return <div className="p-4 text-center">No orders found.</div>;
//   }
//   return (
//     <div className="container">
//       <h1 className="mb-4 text-2xl font-bold">orders</h1>
//       <div className=" flex w-full flex-wrap items-center justify-center flex-col">
//       <OrdersTable orders={data.data.orders} categories={Array.isArray(data.data.categories) ? data.data.categories : []} />
//         <div className="mt-3">
//         <Pagination
//           currentPage={data.data.pagination.page}
//           totalPages={totalPages}
//           limit={data.data.pagination.limit}
//         />
//         </div>
//         </div>
//       </div>
    
//   );
// }


import { getAllOrders } from "@/actions/order/api";
import OrdersTable from "@/components/restaurant/orders/OrdersTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function OrdersPages({ searchParams }: OrdersPageProps) {
  const params = await searchParams; // must await it
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "5", 10);

  let data: any | null = null;
  let error: string | null = null;

  try {
    data = await getAllOrders(page, limit);
  } catch (err: unknown) {
    console.error("Error fetching orders data:", err);
    error = "Failed to load orders. Please try again later.";
  }

  const totalPages = data ? Math.ceil(data.data.pagination.totalPages) : 1;

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-4 text-center">No orders found.</div>;
  }

  return (
    <div className="container">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <div className="flex w-full flex-col items-center justify-center">
        <OrdersTable
          orders={data.data.orders}
          categories={Array.isArray(data.data.categories) ? data.data.categories : []}
        />
        <div className="mt-3">
          <Pagination
            currentPage={data.data.pagination.page}
            totalPages={totalPages}
            limit={data.data.pagination.limit}
          />
        </div>
      </div>
    </div>
  );
}
