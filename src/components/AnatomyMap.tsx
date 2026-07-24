"use client";

import { buildInjuryLabels } from "@/lib/bodyPartRegions";
import type { MedicalRecord } from "@/lib/medicalRecords";

function badgeColor(severity?: string) {
  if (severity === "Urgent") return "border-critical bg-critical/10 text-critical";
  if (severity === "Requires Follow-up") return "border-warning bg-warning/15 text-navy";
  return "border-accent bg-accent/10 text-navy";
}

export default function AnatomyMap({ records }: { records: MedicalRecord[] }) {
  const markers = records.flatMap((r) =>
    buildInjuryLabels(r.bodyParts, r.summary).map((m) => ({
      ...m,
      severity: r.severityFlag,
    })),
  );

  const unique = markers.filter(
    (m, i, arr) => arr.findIndex((x) => x.region.label === m.region.label) === i,
  );

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg viewBox="0 0 300 560" className="w-full text-navy/20" aria-hidden>
        <ellipse cx="150" cy="45" rx="28" ry="32" fill="currentColor" opacity="0.15" />
        <rect x="138" y="75" width="24" height="30" rx="8" fill="currentColor" opacity="0.12" />
        <path
          d="M95 105 Q150 95 205 105 L195 250 Q150 240 105 250 Z"
          fill="currentColor"
          opacity="0.12"
        />
        <path
          d="M95 105 L75 200 L95 210 Z M205 105 L225 200 L205 210 Z"
          fill="currentColor"
          opacity="0.1"
        />
        <path
          d="M115 250 L110 400 L130 400 L135 250 Z M165 250 L170 400 L190 400 L185 250 Z"
          fill="currentColor"
          opacity="0.12"
        />
        <ellipse cx="120" cy="430" rx="18" ry="12" fill="currentColor" opacity="0.1" />
        <ellipse cx="180" cy="430" rx="18" ry="12" fill="currentColor" opacity="0.1" />
      </svg>
      {unique.map((m) => (
        <span
          key={m.region.label}
          className={`absolute max-w-[7rem] -translate-x-1/2 rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-sm ${badgeColor(m.severity)}`}
          style={{
            left: `${(m.region.x / 300) * 100}%`,
            top: `${(m.region.y / 560) * 100}%`,
          }}
        >
          {m.label}
        </span>
      ))}
      {unique.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-center text-xs text-muted">
          Import records to map injuries
        </p>
      )}
    </div>
  );
}
