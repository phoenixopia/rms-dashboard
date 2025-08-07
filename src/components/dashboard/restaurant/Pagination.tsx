"use client";

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        {/* Render a few page links around the current page */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => {
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          },
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
