"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from 'next-intl';

export default function Language() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("full");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    
    startTransition(() => {
  
      let pathWithoutLocale = pathname;
      
  
      const locales = ['en', 'am'];
      for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`)) {
          pathWithoutLocale = pathname.replace(`/${locale}`, '');
          break;
        } else if (pathname === `/${locale}`) {
          pathWithoutLocale = '/';
          break;
        }
      }
      
  
      if (!pathWithoutLocale.startsWith('/')) {
        pathWithoutLocale = '/' + pathWithoutLocale;
      }
      
    
      const newPath = `/${nextLocale}${pathWithoutLocale}`;
      
  
      router.push(newPath);
    });
  };

  if (!mounted) {
    return (
      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[75%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option>{t("choose-language")}</option>
      </select>
    );
  }

  return (
    <div>
      <select
        value={localActive}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[75%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="" disabled>{t("choose-language")}</option>
        <option value="en">{t("english")}</option>
        <option value="am">{t("amharic")}</option>
      </select>
    </div>
  );
}