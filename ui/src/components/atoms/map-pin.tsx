import * as React from "react";
import { clsx, formatNumberToFCFA } from "../../lib/functions";

export type MapPinProps = {
  price: number;
  className?: string;
  title?: string;
};

export function MapPin({ price, className, title }: MapPinProps) {
  return (
    <button
      aria-label={title}
      className={clsx(
        className,
        `inline-flex flex-col gap-2 items-center group`
      )}
    >
      <div
        className={clsx(
          `rounded-full bg-white text-sm font-bold`,
          `py-2 px-4`,
          `group-hover:bg-primary group-hover:text-white`,
          `transition duration-300 group-hover:scale-105`
        )}
      >
        {formatNumberToFCFA(price)}
      </div>
    </button>
  );
}
