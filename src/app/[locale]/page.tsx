import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import React from "react";

export default function HomePage() {
  const t = useTranslations("full");
  return (
    <div className="flex h-20 flex-col justify-center bg-red-400 text-blue-300">
      <h1> {t("admin-dashboard")};</h1>

      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
