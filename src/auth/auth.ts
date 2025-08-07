"use server";
import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  console.log("Token", authToken);

  return authToken;
}
