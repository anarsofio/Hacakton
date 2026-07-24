import { NextResponse } from "next/server";
import { extractMedicalCitations, isGeminiConfigured } from "@/lib/gemini";
import type { MedicalRecord } from "@/lib/medicalRecords";

export async function POST(request: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }
  const body = (await request.json()) as { records?: MedicalRecord[] };
  const citations = await extractMedicalCitations(body.records ?? []);
  return NextResponse.json({ citations });
}
