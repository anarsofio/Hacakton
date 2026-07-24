import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function PrimaryButton({ children, className = "", ...props }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-navy transition hover:brightness-95 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
