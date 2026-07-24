"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileStack, ShieldAlert, Stethoscope, Activity, HeartPulse, Receipt, FileSignature } from "lucide-react";

const steps = [
  { n: 1, path: "/documents", title: "Documents", subtitle: "Intake", icon: FileStack },
  { n: 2, path: "/police-report", title: "Police Report", subtitle: "Incident", icon: ShieldAlert },
  { n: 3, path: "/medical-reports", title: "Medical Reports", subtitle: "Records", icon: Stethoscope },
  { n: 4, path: "/treatment-timeline", title: "Treatment Timeline", subtitle: "Chronology", icon: Activity, anchor: true },
  { n: 5, path: "/quality-of-life", title: "Quality of Life", subtitle: "Impact", icon: HeartPulse },
  { n: 6, path: "/financial-reports", title: "Pecuniary Damages", subtitle: "Damages", icon: Receipt },
  { n: 7, path: "/negotiation-letter", title: "Settlement Demand Letter", subtitle: "Output", icon: FileSignature },
];

export default function CaseStepper({ clientId }: { clientId?: string }) {
  const pathname = usePathname();
  const matchedClientId =
    clientId ?? pathname.match(/^\/clients\/([^/]+)/)?.[1];
  const prefix = matchedClientId ? `/clients/${matchedClientId}` : "";

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[8.3%] right-[8.3%] top-[26px] h-px bg-navy/15 sm:top-[30px]"
      />
      <ol className="relative grid grid-cols-3 gap-y-10 sm:grid-cols-4 md:grid-cols-7 sm:gap-y-0">
        {steps.map((step) => {
          const href = `${prefix}${step.path}`;
          const isActive =
            pathname === href || pathname === step.path || pathname.endsWith(step.path);
          const Icon = step.icon;
          const big = step.anchor;
          return (
            <li key={step.path} className="flex flex-col items-center text-center">
              <Link
                href={href}
                className="group flex flex-col items-center gap-3 outline-none"
              >
                <span
                  className={[
                    "relative flex items-center justify-center rounded-full border transition-all",
                    big ? "h-16 w-16 sm:h-[68px] sm:w-[68px]" : "h-12 w-12 sm:h-14 sm:w-14",
                    isActive
                      ? "border-accent bg-navy text-accent ring-4 ring-accent/25"
                      : "border-navy/20 bg-cream text-navy group-hover:border-accent/60",
                  ].join(" ")}
                >
                  <Icon size={big ? 26 : 20} strokeWidth={1.75} />
                  <span
                    className={[
                      "absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                      isActive ? "bg-accent text-navy" : "bg-navy text-cream",
                    ].join(" ")}
                  >
                    {step.n}
                  </span>
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className={[
                      "font-serif-display text-[13px] font-semibold leading-tight sm:text-sm",
                      isActive ? "text-navy" : "text-navy/80",
                    ].join(" ")}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-muted">
                    {step.subtitle}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
