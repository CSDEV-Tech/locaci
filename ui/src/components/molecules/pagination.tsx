import * as React from "react";
import { Button } from "../atoms/button";
import { ArrowLeft, ArrowRight } from "phosphor-react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChangePage: (newPage: number) => void;
};

export function Pagination({
  currentPage,
  onChangePage,
  totalPages,
}: PaginationProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // FIXME: Always show 5 pages
  // Always show 4 pages/buttons
  // Ex:
  //    if `currentPage` === 5, we show `4, 5, 6, 7`, with `5` as "active".
  const pages: number[] = [];
  if (currentPage >= 3) {
    pages.push(currentPage - 2);
    pages.push(currentPage - 1);
  } else if (currentPage === 2) {
    pages.push(1);
  }
  pages.push(currentPage);

  for (
    let i = 1;
    i < 5 && currentPage + i <= totalPages && pages.length < 5;
    i++
  ) {
    pages.push(currentPage + i);
  }

  return (
    <div className={`flex items-center gap-4`}>
      {hasPreviousPage && (
        <Button
          onClick={() => onChangePage(currentPage - 1)}
          renderLeadingIcon={(cls) => <ArrowLeft className={cls} />}
        >
          Précédent
        </Button>
      )}
      <ul className={`flex gap-2 items-center`}>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? `primary` : `hollow`}
            onClick={() => onChangePage(currentPage)}
          >
            {p}
          </Button>
        ))}
      </ul>
      {hasNextPage && (
        <Button
          onClick={() => onChangePage(currentPage + 1)}
          renderTrailingIcon={(cls) => <ArrowRight className={cls} />}
        >
          Suivant
        </Button>
      )}
    </div>
  );
}
