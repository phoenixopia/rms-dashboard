"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { ChangeEvent, ReactNode, useTransition } from "react";

type Props = {
  children: ReactNode;
  defaultValue: string;
  lable: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  lable,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();
  const localActive = useLocale();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;

    const pathWithoutLocale = pathName.startsWith(`/${localActive}`)
      ? pathName.replace(`/${localActive}`, "")
      : pathName;

    const newPath = `/${nextLocale}${pathWithoutLocale}`;

    window.location.assign(newPath);
  }
  return (
    <label
      className={clsx(
        "relative text-gray-400",
        isPending && "transition-opacity [&:disabled]:opacity-30",
      )}
    >
      <p className="sr-only">{lable}</p>
      <select
        className="inline-flex appearance-none bg-transparent py-3 pr-6 pl-2"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute top-[8px] right-2">^</span>
    </label>
  );
}
