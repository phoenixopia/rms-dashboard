"use client";

import LocaleSwitcher from "@/components/custome/LocalSwitcher";
import { ModeToggle } from "@/components/custome/shared/ModeToggle";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { is } from "zod/v4/locales";

export default function Dashboard() {
  const t = useTranslations("full");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  console.log("IsAuthenticated", isAuthenticated);
  console.log("User", user);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale; // Replace the current locale in path
    const newPath = segments.join("/");
    router.push(newPath);
  };
  return (
    <div className="bg-sidebar p-8">
      <h2 className="mb-4 text-2xl font-bold">{t("language")}</h2>
      <div className="mt-4 flex gap-2">
        <LocaleSwitcher />
      </div>

      <Button onClick={logout} variant="outline" className="text-sm">
        Logout
      </Button>
      <ModeToggle />

      <div className="mt-8 rounded-md border p-4 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold">User Information</h3>
        {isAuthenticated && user ? (
          // Display user info if authenticated
          <div className="space-y-2">
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Role:</strong> {user.role || "N/A"}
            </p>
            <div>
              <strong>Permissions:</strong>
              {/* Check if permissions exist before trying to map */}
              {user.permissions && user.permissions.length > 0 ? (
                <ul className="mt-1 ml-4 list-inside list-disc">
                  {user.permissions.map((permission, index) => (
                    <li key={index}>{permission}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2">No permissions</span>
              )}
            </div>
          </div>
        ) : (
          // Show a message if not authenticated
          <p className="text-red-500">You are not authenticated.</p>
        )}
      </div>

      <div className="mt-8">
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}
