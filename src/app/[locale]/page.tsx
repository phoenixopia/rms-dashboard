import { ModeToggle } from "@/components/custome/shared/ModeToggle";
import Header from "@/components/landing/Header";
import MidMain from "@/components/landing/MainSection";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import React from "react";

export default function HomePage() {
  const t = useTranslations("full");
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="w-screen flex-grow">
        <MidMain />
        {/* <h1> {t("admin-dashboard")}</h1>
        <ModeToggle /> */}
      </main>
    </div>
  );
}
