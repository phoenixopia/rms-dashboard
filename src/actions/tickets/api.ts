"use server";

import { getAuthToken } from "@/auth/auth";
import { BackResponse, TicketFilters, TicketsResponse } from "@/types/tickets";
import { BASEURL } from "../api";

export async function fetchTickets(
  filters: TicketFilters,
): Promise<BackResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("No auth token found");

  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${BASEURL}/support-ticket/list-all-ticket?${queryParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}
