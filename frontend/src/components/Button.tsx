import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type SharedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-7 py-3.5 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const primaryClasses =
  "border border-orange-600 text-orange-600 hover:bg-orange-600/10";

const secondaryClasses =
  "border border-neutral-700 bg-neutral-900 text-neutral-100 hover:border-white/90 hover:text-white";

function buildClasses(
  size: ButtonSize,
  variantClasses: string,
  className?: string,
) {
  return [baseClasses, sizeClasses[size], variantClasses, className]
    .filter(Boolean)
    .join(" ");
}

export function PrimaryButton({
  children,
  className,
  size = "sm",
  ...props
}: SharedButtonProps) {
  return (
    <button
      {...props}
      className={buildClasses(size, primaryClasses, className)}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  size = "sm",
  ...props
}: SharedButtonProps) {
  return (
    <button
      {...props}
      className={buildClasses(size, secondaryClasses, className)}
    >
      {children}
    </button>
  );
}
