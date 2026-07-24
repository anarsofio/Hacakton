"use client";

import { Card, KeyPointsList, SourceViewer } from "@/components/PageShell";
import { PhotoGallery } from "@/components/PhotoLightbox";
import { policeReport } from "@/lib/mockData";
import { Gauge } from "lucide-react";

export default function PoliceReportClient() {
  const reportUrl = policeReport.fullReportUrl ?? "#";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif-display text-lg font-semibold text-navy">Summary</h2>
            {policeReport.vehicleSpeed && (
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-accent bg-accent/10 px-4 py-2 text-sm font-bold text-navy">
                <Gauge size={16} className="text-accent" />
                Impact speed: {policeReport.vehicleSpeed}
              </span>
            )}
          </div>
          <p className="text-[15px] leading-relaxed text-navy/80">{policeReport.summary}</p>
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-navy transition hover:brightness-95"
          >
            View Full Report
          </a>
        </Card>

        <Card className="p-6">
          <h2 className="mb-2 font-serif-display text-lg font-semibold text-navy">Key Points</h2>
          <KeyPointsList points={policeReport.keyPoints} />
        </Card>

        {policeReport.photos.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4 font-serif-display text-lg font-semibold text-navy">
              Photographic evidence
            </h2>
            <PhotoGallery photos={policeReport.photos} />
          </Card>
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <SourceViewer filename={policeReport.sourceDocument} />
      </div>
    </div>
  );
}
