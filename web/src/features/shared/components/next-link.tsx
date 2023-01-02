"use client";
import * as React from "react";
// components
import Link from "next/link";
import {
  LinkButton,
  type LinkButtonProps,
} from "@locaci/ui/components/atoms/link-button";

// utils
import { useRouter } from "next/navigation";

// types
import type { CustomLink } from "@locaci/ui/components/atoms/link";

export const NextLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
  (props, ref) => {
    return <Link {...props} ref={ref} />;
  }
);

export function NextLinkButton(props: Omit<LinkButtonProps, "Custom">) {
  return <LinkButton {...props} Custom={NextLink} />;
}

export const NextDynamicLink = React.forwardRef<HTMLAnchorElement, CustomLink>(
  ({ href, children, ...props }, ref) => {
    const router = useRouter();
    const [hasBeenPrefetched, setHasBeenPrefetched] = React.useState(false);
    const [isPrefetching, startTransition] = React.useTransition();

    React.useEffect(() => {
      let options = {
        rootMargin: "0px",
        threshold: 0.5,
      };

      let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasBeenPrefetched && !isPrefetching) {
              // eagerly prefetch route for faster route transition, when link is visible
              startTransition(() => {
                router.prefetch(href);
                setHasBeenPrefetched(true);

                // remove IntersectionObserver on finish
                observer.unobserve(ref);
              });
            }
          }
        });
      }, options);

      observer.observe(ref);

      return () => {
        // remove IntersectionObserver on unMount
        observer.unobserve(ref);
      };
    }, []);

    return (
      <a
        {...props}
        ref={ref}
        href={href}
        onClick={(e) => {
          if (!href.startsWith(`#`)) {
            e.preventDefault();
            router.push(href);
          }
        }}
      >
        {children}
      </a>
    );
  }
);
