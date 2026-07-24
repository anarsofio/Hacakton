import { NextResponse } from "next/server";
import { enrichMedicalRecords, isGeminiConfigured } from "@/lib/gemini";
import type { MedicalRecord } from "@/lib/medicalRecords";

const BATCH_SIZE = 5;

export async function POST(request: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { records: [], warning: "GEMINI_API_KEY not configured" },
      { status: 200 },
    );
  }

  let body: { records?: MedicalRecord[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const records = body.records ?? [];
  if (!Array.isArray(records) || records.length === 0) {
    return NextResponse.json({ records: [] });
  }

  const enriched: MedicalRecord[] = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const batchResult = await enrichMedicalRecords(batch);
    enriched.push(...batchResult);
  }

  return NextResponse.json({ records: enriched });
}
