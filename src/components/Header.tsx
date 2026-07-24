"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, ChevronLeft } from "lucide-react";

export default function Header({
  showBack = false,
  backLabel,
  backHref,
}: {
  showBack?: boolean;
  backLabel?: string;
  backHref?: string;
}) {
  const pathname = usePathname();
  const clientMatch = pathname.match(/^\/clients\/([^/]+)(?:\/(.*))?$/);
  const onClientStage = Boolean(clientMatch?.[2]);
  const clientId = clientMatch?.[1];

  const resolvedHref =
    backHref ??
    (onClientStage && clientId ? `/clients/${clientId}` : "/");
  const resolvedLabel =
    backLabel ?? (onClientStage ? "Case" : clientMatch ? "Clients" : "Dashboard");

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link
              href={resolvedHref}
              className="flex items-center gap-1 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy/70 transition hover:border-gold hover:text-navy"
            >
              <ChevronLeft size={14} />
              {resolvedLabel}
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-accent">
              <Scale size={16} strokeWidth={2.25} />
            </span>
            <span className="font-serif-display text-lg font-semibold tracking-tight text-navy">
              CaseFlow
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
