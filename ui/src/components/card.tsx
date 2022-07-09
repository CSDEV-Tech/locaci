import * as React from "react";
import { clsx } from "../lib/functions";

export type CardProps = {
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export type DefaultCardProps = CardProps & {
  href: never;
  asLink: never;
};

export type LinkCardProps = CardProps & {
  href: string;
  asLink?: React.ComponentType<Omit<LinkCardProps, "asLink">>;
};

export function Card({
  className,
  children,
  animated = false,
  ...restProps
}: DefaultCardProps | LinkCardProps) {
  let Tag: React.ComponentType<any> | string = "div";

  if (restProps.href) {
    Tag = restProps.asLink ? restProps.asLink : "a";
  }

  return (
    <Tag
      href={restProps.href}
      className={clsx(
        `bg-white rounded-md border border-lightgray`,
        `inline-flex p-8`,
        className,
        {
          "transition duration-300 ease-in-out hover:scale-105 active:scale-105":
            animated,
          "hover:border-none hover:shadow-card": animated,
        }
      )}
    >
      {children}
    </Tag>
  );
}
