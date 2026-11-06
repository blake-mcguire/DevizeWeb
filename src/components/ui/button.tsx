import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "white" | "outline" | "outlineLight" | "secondary" | "ghost" | "glass";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-[-0.01em] transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "text-white bg-[var(--color-panel)] hover:bg-[#4A17A3] hover:-translate-y-[1px]",
  white: "text-[#330099] bg-white hover:bg-[#EDE6FF] hover:-translate-y-[1px]",
  outline:
    "text-[var(--color-brand)] border-2 border-[var(--color-brand)] bg-transparent hover:bg-[var(--color-brand)] hover:text-white",
  outlineLight: "text-white border-2 border-white/80 bg-transparent hover:bg-white hover:text-[#330099]",
  secondary:
    "text-[var(--color-ink)] bg-white border-2 border-[var(--color-border)] hover:border-[var(--color-ink)]/40 hover:-translate-y-[1px]",
  ghost: "text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5",
  glass: "text-white bg-white/10 border-2 border-white/25 hover:bg-white/15 hover:border-white/40 hover:-translate-y-[1px]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-[1.0625rem]",
};

type LinkButtonProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
    /**
     * Render a plain <a> instead of next/link. For a mailto link, and for an
     * anchor that has to behave as the browser's own: it sets the URL's :target,
     * fires hashchange, and scrolls on every click, where next/link does none of
     * those and scrolls only the first time. The header's "Get in touch" uses it
     * to reach /#contact.
     */
    native?: boolean;
  };

type NativeButtonProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, native, ...linkRest } = rest as LinkButtonProps;
    if (native) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as NativeButtonProps)}>
      {children}
    </button>
  );
}
