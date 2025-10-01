import {
  SResponse,
  SubscriptionResponse,
} from "@/types/subscription/subscription";
import { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";

export async function fetchSubscriptions(query: string): Promise<SResponse> {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }
  const res = await fetch(`${BASEURL}/subscription/list-all?${query}`, {
    credentials: "include", // if using cookies for auth
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  // const result = res;

  // console.log(result, "Result from fetchSubscriptions");

  return res.json();
}
