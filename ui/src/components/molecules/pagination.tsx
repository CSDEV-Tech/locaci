import * as React from "react";
import { Button } from "../atoms/button";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { getPageRange } from "../../lib/functions";

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

  const pages = getPageRange(currentPage, totalPages);

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
