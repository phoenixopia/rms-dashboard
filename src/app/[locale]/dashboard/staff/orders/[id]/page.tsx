'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/actions/order/api";
import { toast } from "sonner";

// Mock API call for demonstration
// Replace with your real API call like getOrderById(orderId)
async function fetchOrderById(orderId: string) {
  return {
    success: true,
    message: "Order fetched successfully.",
    data: {
      kds_id: "b2feb072-4ee5-41bd-819a-3b4d26431f2f",
      order_id: orderId,
      type: "takeaway",
      status: "Pending",
      total_amount: "1.06",
      payment_status: "Unpaid",
      order_date: "2025-08-30T11:50:26.103Z",
      restaurant_name: "Gourmet Delight",
      branch_name: "Bole Branch",
      customer_name: "Sif Mekonnen",
      table_number: null,
      delivery_location: null,
    },
  };
}



export default function OrderDetailPage() {
  const { id } = useParams(); // Get order id from URL
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);




  const handlePaymentUpdate = async(order_id:string)=>{
    setLoading(true);
    try{
      const response = await updatePaymentStatus(order_id);
      
      const result = await getOrderById(id as string);
      if (result.success) {
        setOrder(result.data);
      }
      setLoading(false);
      toast.success("successfully updated order");
    }
    catch(error){
      toast.error("there was some error");
    }
    finally{
      setLoading(false)
    }
  }

  const handleStatusUpdate = async(order_status:string)=>{
    setLoading(true);
    try{
      const response = await updateOrderStatus(id as string,order_status);
      
      const result = await getOrderById(id as string);
      if (result.success) {
        setOrder(result.data);
      }
      setLoading(false);
      toast.success("successfully updated order");
    }
    catch(error){
      toast.error("there was some error");
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const result = await getOrderById(id as string);
      if (result.success) {
        setOrder(result.data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center text-gray-500 py-10">Order not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold">
            Order <span className="text-blue-600">#{order?.kds_id?.slice(0, 8)}</span>
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "Completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
          <p><span className="font-medium">Restaurant:</span> {order.restaurant_name}</p>
          <p><span className="font-medium">Branch:</span> {order.branch_name}</p>
          <p><span className="font-medium">Type:</span> {order.type}</p>
          <p><span className="font-medium">Payment Status:</span> {order.payment_status}</p>
          <p><span className="font-medium">Order Date:</span> {new Date(order.order_date).toLocaleString()}</p>
          {order.table_number && <p><span className="font-medium">Table:</span> {order.table_number}</p>}
          {order.delivery_location && <p><span className="font-medium">Delivery:</span> {order.delivery_location.address}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t gap-4">
          <p className="text-lg font-semibold">
            Total: <span className="text-green-600">{order.total_amount} Birr</span>
          </p>
          <button onClick={()=>handlePaymentUpdate(order.kds_id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500">
            {loading?"Loading":"Mark as Paid"}
          </button>
          <button onClick={()=>handleStatusUpdate("Ready")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500">
            {loading?"Loading":"Mark as ready"}
          </button>
          <button onClick={()=>handleStatusUpdate("Served")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500">
            {loading?"Loading":"Mark as served"}
          </button>
          <button onClick={()=>handleStatusUpdate("Cancelled")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500">
            {loading?"Loading":"Cancel"}
          </button>

          

        </div>
      </div>
    </div>
  );
}
