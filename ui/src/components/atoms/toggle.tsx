import * as React from "react";
import { Switch } from "@headlessui/react";
import { clsx } from "../../lib/functions";

export type ToggleProps = {
  value?: boolean;
  onChange: (newValue: boolean) => void;
  title?: string;
  variant?: "primary" | "secondary";
};

export function Toggle({
  value = false,
  onChange,
  title,
  variant = "primary",
}: ToggleProps) {
  return (
    <Switch
      checked={value}
      onChange={onChange}
      className={clsx(
        `relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-2 items-center`,
        `border-transparent transition-colors duration-200 ease-in-out`,
        `focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
        {
          "bg-lightgray": !value,
          "bg-primary": value && variant === "primary",
          "bg-secondary": value && variant === "secondary",
        }
      )}
    >
      <span className="sr-only">{title}</span>
      <span
        aria-hidden="true"
        className={clsx(
          `pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full`,
          `shadow-lg ring-0 transition duration-200 ease-in-out`,
          {
            "translate-x-5 bg-white": value,
            "translate-x-[0.125rem] bg-gray": !value,
          }
        )}
      />
    </Switch>
  );
}
