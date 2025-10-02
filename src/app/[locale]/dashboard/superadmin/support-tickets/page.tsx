"use client";
import {
  Ticket,
  TicketsResponse,
  TicketFilters as Filters,
  BackResponse,
} from "@/types/tickets/index";
import TicketTable from "@/components/dashboard/support-tickets/TicketTable";
import { useEffect, useState } from "react";
import { fetchTickets } from "@/actions/tickets/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketFilters from "@/components/dashboard/support-tickets/TicketFilters";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/dashboard/support-tickets/TicketPagination";
// import { Link } from "@/i18n/navigation";

export default function TicketsPage() {
  // Later: replace with backend fetch
  // const tickets = mockTickets;
  const [data, setData] = useState<TicketsResponse | null>(null);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "created_at",
    order: "DESC",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoading(true);
        const result: BackResponse = await fetchTickets(filters);
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, [filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-destructive text-center">Error: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TicketFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {isLoading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data && data.tickets.length > 0 ? (
        <>
          <div className="mt-6">
            <TicketTable tickets={data.tickets} />
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-muted-foreground mt-6 text-center">
          No tickets found
        </div>
      )}

      {/* <TicketTable tickets={tickets} /> */}
    </div>
  );
}
