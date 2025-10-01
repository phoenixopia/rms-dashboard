"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/types/tickets";

export default function TicketStats({ tickets }: { tickets: Ticket[] }) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Total</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{total}</CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Open</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-red-500">
          {open}
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>In Progress</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-yellow-500">
          {inProgress}
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Resolved</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-green-500">
          {resolved}
        </CardContent>
      </Card>
    </div>
  );
}
