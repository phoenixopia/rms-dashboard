"use client";

import LocaleSwitcher from "@/components/custome/LocalSwitcher";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

export default function Page2() {
  const t = useTranslations("full");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale; // Replace the current locale in path
    const newPath = segments.join("/");
    router.push(newPath);
  };
  return (
    <div>
      <h2>{t("language")}</h2>
      <div className="mt-4 flex gap-2">
        <LocaleSwitcher />
      </div>
      <Link href="/">Back to Home</Link>
    </div>
  );
}
