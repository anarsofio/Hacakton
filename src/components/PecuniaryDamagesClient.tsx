"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/PageShell";
import { financials } from "@/lib/mockData";

type Filter =
  | "all"
  | "medical"
  | "lost-wages"
  | "property"
  | "out-of-pocket";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "medical", label: "Medical Bills" },
  { id: "lost-wages", label: "Lost Wages" },
  { id: "property", label: "Property Damage" },
  { id: "out-of-pocket", label: "Out-of-Pocket" },
];

export default function PecuniaryDamagesClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  const medicalTotal = financials.medicalBills.reduce((a, b) => a + b.amount, 0);
  const otherTotal = financials.otherEconomic.reduce((a, b) => a + b.amount, 0);
  const grandTotal =
    medicalTotal + financials.lostWages.amount + financials.propertyDamage.amount + otherTotal;

  const visibleTotal = useMemo(() => {
    switch (filter) {
      case "medical":
        return medicalTotal;
      case "lost-wages":
        return financials.lostWages.amount;
      case "property":
        return financials.propertyDamage.amount;
      case "out-of-pocket":
        return otherTotal;
      default:
        return grandTotal;
    }
  }, [filter, medicalTotal, otherTotal, grandTotal]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === f.id
                  ? "bg-accent text-navy"
                  : "border border-navy/15 text-navy/70 hover:border-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="mb-3 font-serif-display text-lg font-semibold text-navy">Summary</h2>
          <p className="text-[15px] leading-relaxed text-navy/80">
            Confirmed economic damages total {fmt(grandTotal)} across medical providers, lost
            wages, vehicle property damage, and incidental treatment costs.
          </p>
          <p className="mt-3 font-serif-display text-2xl font-semibold text-navy">
            {fmt(visibleTotal)}
            <span className="ml-2 text-sm font-normal text-muted">
              {filter === "all" ? "total" : filters.find((f) => f.id === filter)?.label}
            </span>
          </p>
        </Card>

        {(filter === "all" || filter === "medical") && (
          <Card className="overflow-hidden">
            <div className="border-b border-line/70 px-6 py-4">
              <h3 className="font-serif-display text-base font-semibold text-navy">Medical bills</h3>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line/60">
                {financials.medicalBills.map((b) => (
                  <tr key={b.provider}>
                    <td className="px-6 py-3 text-navy/80">{b.provider}</td>
                    <td className="px-6 py-3 text-right font-medium text-navy">{fmt(b.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-navy/[0.03]">
                  <td className="px-6 py-3 font-semibold text-navy">Medical specials total</td>
                  <td className="px-6 py-3 text-right font-semibold text-navy">{fmt(medicalTotal)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        )}

        {(filter === "all" ||
          filter === "lost-wages" ||
          filter === "property" ||
          filter === "out-of-pocket") && (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line/60">
                {(filter === "all" || filter === "lost-wages") && (
                  <tr>
                    <td className="px-6 py-3 text-navy/80">
                      Lost wages
                      <p className="text-xs text-muted">{financials.lostWages.description}</p>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-navy">
                      {fmt(financials.lostWages.amount)}
                    </td>
                  </tr>
                )}
                {(filter === "all" || filter === "property") && (
                  <tr>
                    <td className="px-6 py-3 text-navy/80">
                      Property damage
                      <p className="text-xs text-muted">{financials.propertyDamage.description}</p>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-navy">
                      {fmt(financials.propertyDamage.amount)}
                    </td>
                  </tr>
                )}
                {(filter === "all" || filter === "out-of-pocket") &&
                  financials.otherEconomic.map((o) => (
                    <tr key={o.label}>
                      <td className="px-6 py-3 text-navy/80">{o.label}</td>
                      <td className="px-6 py-3 text-right font-medium text-navy">{fmt(o.amount)}</td>
                    </tr>
                  ))}
                {filter === "all" && (
                  <tr className="bg-navy text-cream">
                    <td className="px-6 py-3 font-semibold">Total economic damages (confirmed)</td>
                    <td className="px-6 py-3 text-right font-serif-display text-lg font-semibold text-accent">
                      {fmt(grandTotal)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-wide text-muted">Source document</p>
          <p className="mt-2 text-sm text-navy">St_Marys_Billing_Statement.pdf</p>
        </Card>
      </div>
    </div>
  );
}
