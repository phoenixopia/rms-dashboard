"use server";
import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  console.log(authToken, "Token");

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  return authToken;
}
