"use client"; 
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllBranches } from "@/actions/branch/api";
import TransactionTableFilters from "./TransactionTableFilters";

export default function TransactionsTable({ data }: any) {
  const [branches, setBranches] = useState<any[]>([]);
  const [detailTransaction, setDetailTransaction] = useState<any | null>(null);
  const [addFilter, setAddFilter] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchRes = await getAllBranches();
        setBranches(branchRes?.data || []);
      } catch (error) {
        toast.error("Failed to load branches data");
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(amount || '0'));
};
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-col w-full items-center justify-between gap-4">
        <div className="flex  w-full items-center justify-end">
          <Button
            variant="outline"
            onClick={() => setAddFilter(!addFilter)}
            className="h-11 px-5 font-medium rounded-lg shadow-sm hover:bg-accent transition-colors"
          >
            {addFilter ? "Close Filters" : "Add Filters"}
          </Button>
        </div>

        {addFilter && (
          <div className="flex w-full border rounded-xl bg-muted/40 shadow-sm animate-in fade-in-50">
            <TransactionTableFilters branches={branches} />
          </div>
        )}
      </div>
      
      {data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((transaction: any, index: any) => {
                const customerName = transaction.User 
                  ? `${transaction.User.first_name} ${transaction.User.last_name}`
                  : transaction.customer_id 
                    ? "Customer" 
                    : "Walk-in";
                
                return (
                  <TableRow
                    key={transaction.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell className="font-medium">
                      {transaction.order_id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell className="capitalize">
                      {transaction.payment_method}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${
                          transaction.status === 'completed' 
                            ? "bg-green-100 text-green-800" 
                            : transaction.status === 'pending'
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.createdAt ? formatDate(transaction.createdAt) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                            Action
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setDetailTransaction(transaction)}
                          >
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Transaction Detail Modal */}
          {detailTransaction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-bold">Transaction Details</h2>
                  <Button variant="ghost" onClick={() => setDetailTransaction(null)}>
                    Close
                  </Button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Transaction Information */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Transaction Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Transaction ID:</strong></p>
                        <p>{detailTransaction.id}</p>
                      </div>
                      <div>
                        <p><strong>Amount:</strong></p>
                        <p>{formatCurrency(detailTransaction.amount)}</p>
                      </div>
                      <div>
                        <p><strong>Payment Method:</strong></p>
                        <p className="capitalize">{detailTransaction.payment_method}</p>
                      </div>
                      <div>
                        <p><strong>Status:</strong></p>
                        <p className="capitalize">{detailTransaction.status}</p>
                      </div>
                      <div>
                        <p><strong>Created:</strong></p>
                        <p>{detailTransaction.createdAt ? formatDate(detailTransaction.createdAt) : 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Payment Date:</strong></p>
                        <p>{detailTransaction.payment_date ? formatDate(detailTransaction.payment_date) : 'Pending'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  {detailTransaction.Order && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Order Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Order ID:</strong></p>
                          <p>{detailTransaction.order_id}</p>
                        </div>
                        <div>
                          <p><strong>Order Type:</strong></p>
                          <p className="capitalize">{detailTransaction.Order.type}</p>
                        </div>
                        <div>
                          <p><strong>Order Status:</strong></p>
                          <p className="capitalize">{detailTransaction.Order.status}</p>
                        </div>
                        <div>
                          <p><strong>Total Amount:</strong></p>
                          <p>{formatCurrency(detailTransaction.Order.total_amount)}</p>
                        </div>
                        <div>
                          <p><strong>Order Date:</strong></p>
                          <p>{detailTransaction.Order.order_date ? formatDate(detailTransaction.Order.order_date) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Branch Information */}
                  {detailTransaction.Order?.Branch && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Branch Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Branch Name:</strong></p>
                          <p>{detailTransaction.Order.Branch.name}</p>
                        </div>
                        <div>
                          <p><strong>Opening Hours:</strong></p>
                          <p>{detailTransaction.Order.Branch.opening_time} - {detailTransaction.Order.Branch.closing_time}</p>
                        </div>
                        <div>
                          <p><strong>Status:</strong></p>
                          <p className="capitalize">{detailTransaction.Order.Branch.status}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {detailTransaction.User ? (
                        <>
                          <div>
                            <p><strong>Name:</strong></p>
                            <p>{detailTransaction.User.first_name} {detailTransaction.User.last_name}</p>
                          </div>
                          <div>
                            <p><strong>Email:</strong></p>
                            <p>{detailTransaction.User.email}</p>
                          </div>
                          {detailTransaction.User.phone_number && (
                            <div>
                              <p><strong>Phone:</strong></p>
                              <p>{detailTransaction.User.phone_number}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <p><strong>Type:</strong></p>
                          <p>{detailTransaction.customer_id ? "Registered Customer" : "Walk-in Customer"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  {detailTransaction.Order?.OrderItems && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Order Items</h3>
                      <div className="border rounded-lg">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left">Item</th>
                              <th className="px-4 py-2 text-right">Quantity</th>
                              <th className="px-4 py-2 text-right">Unit Price</th>
                              <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailTransaction.Order.OrderItems.map((item: any, idx: number) => (
                              <tr key={idx} className="border-t">
                                <td className="px-4 py-2">
                                  <div>
                                    <p className="font-medium">{item.MenuItem?.name || "Unknown Item"}</p>
                                    {item.MenuItem?.description && (
                                      <p className="text-sm text-gray-500">{item.MenuItem.description}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-right">{item.quantity}</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                <td className="px-4 py-2 text-right">
                                  {formatCurrency((parseFloat(item.unit_price) * item.quantity).toString())}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <td colSpan={3} className="px-4 py-2 text-right font-medium">Total:</td>
                              <td className="px-4 py-2 text-right font-medium">
                                {formatCurrency(detailTransaction.Order.total_amount)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}