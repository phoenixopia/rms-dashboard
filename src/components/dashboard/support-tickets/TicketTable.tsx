"use client";

import { Ticket } from "@/types/tickets/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import TicketStats from "./TicketStats";

interface TicketsTableProps {
  tickets: Ticket[];
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "default",
  in_progress: "secondary",
  resolved: "outline",
  closed: "destructive",
};

const priorityVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  low: "outline",
  medium: "default",
  high: "secondary",
  urgent: "destructive",
};

export default function TicketTable({ tickets }: TicketsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Support Tickets</h1>

      {/* Ticket Stats */}
      <TicketStats tickets={tickets} />

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Requester</TableHead>
              {/* <TableHead>Restaurant</TableHead>
              <TableHead>Branch</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <TableRow key={ticket.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {ticket.title}
                    {/* <Link
                      href={`/dashboard/support-tickets/${ticket.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {ticket.title}
                    </Link> */}
                  </TableCell>
                  <TableCell>
                    {ticket.User.first_name} {ticket.User.last_name}
                    <div className="text-sm text-gray-500">
                      {ticket.User.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[ticket.status]}>
                      {ticket.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant[ticket.priority]}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                  </TableCell>

                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
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
                        <DropdownMenuItem className="cursor-pointer">
                          <Link href="#">Detail</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Link href="#">Mark as Resolved</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground text-center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
