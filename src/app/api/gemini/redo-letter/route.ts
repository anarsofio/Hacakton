import { NextResponse } from "next/server";
import { isGeminiConfigured, redoSettlementLetter } from "@/lib/gemini";

export async function POST(request: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }
  const body = (await request.json()) as {
    currentDraft?: string;
    customNotes?: string;
    caseContext?: string;
  };
  if (!body.currentDraft) {
    return NextResponse.json({ error: "currentDraft required" }, { status: 400 });
  }
  const letter = await redoSettlementLetter(
    body.currentDraft,
    body.customNotes ?? "",
    body.caseContext ?? "",
  );
  if (!letter) {
    return NextResponse.json({ error: "Could not regenerate letter" }, { status: 500 });
  }
  return NextResponse.json({ letter });
}
