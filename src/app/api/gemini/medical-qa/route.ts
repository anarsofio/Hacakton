import { NextResponse } from "next/server";
import { answerMedicalQuestion, isGeminiConfigured } from "@/lib/gemini";
import type { MedicalRecord } from "@/lib/medicalRecords";

export async function POST(request: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 503 });
  }
  const body = (await request.json()) as { question?: string; records?: MedicalRecord[] };
  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "Question required" }, { status: 400 });
  }
  const answer = await answerMedicalQuestion(question, body.records ?? []);
  if (!answer) {
    return NextResponse.json({ error: "Could not generate answer" }, { status: 500 });
  }
  return NextResponse.json({ answer });
}
