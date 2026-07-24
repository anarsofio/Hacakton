import { GoogleGenAI } from "@google/genai";
import type { MedicalRecord, SeverityFlag } from "@/lib/medicalRecords";

export type EnrichmentResult = {
  executiveSummary: string;
  aiTags: string[];
  severityFlag: SeverityFlag;
};

const MODEL = "gemini-2.5-flash";

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function parseEnrichment(text: string): EnrichmentResult | null {
  try {
    const parsed = JSON.parse(text) as EnrichmentResult;
    const validFlags: SeverityFlag[] = [
      "Normal",
      "Requires Follow-up",
      "Urgent",
    ];
    if (
      typeof parsed.executiveSummary !== "string" ||
      !Array.isArray(parsed.aiTags) ||
      !validFlags.includes(parsed.severityFlag)
    ) {
      return null;
    }
    return {
      executiveSummary: parsed.executiveSummary.trim(),
      aiTags: parsed.aiTags.map(String),
      severityFlag: parsed.severityFlag,
    };
  } catch {
    return null;
  }
}

export async function enrichMedicalRecord(
  record: MedicalRecord,
): Promise<EnrichmentResult | null> {
  const client = getClient();
  if (!client) return null;

  const prompt = `You are a medical-legal case assistant. Analyze this clinical encounter record and return ONLY valid JSON with these fields:
- executiveSummary: one concise sentence for a timeline card
- aiTags: array of short labels; infer recordType and bodyParts if missing or poorly formatted in the source
- severityFlag: exactly one of "Normal", "Requires Follow-up", "Urgent" based on the summary

Record:
- Date: ${record.encounterDate}
- Provider: ${record.primaryProvider}
- Facility: ${record.facility}
- Body parts: ${record.bodyParts.join(", ") || "unknown"}
- Medicine types: ${record.medicineTypes.join(", ") || "none"}
- Record type: ${record.recordType}
- Summary: ${record.summary}`;

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) return null;
    return parseEnrichment(text);
  } catch {
    return null;
  }
}

export async function enrichMedicalRecords(
  records: MedicalRecord[],
): Promise<MedicalRecord[]> {
  const enriched: MedicalRecord[] = [];

  for (const record of records) {
    const result = await enrichMedicalRecord(record);
    if (!result) {
      enriched.push(record);
      continue;
    }

    enriched.push({
      ...record,
      executiveSummary: result.executiveSummary,
      aiTags: result.aiTags,
      severityFlag: result.severityFlag,
      recordType:
        record.recordType === "Other" && result.aiTags.length > 0
          ? result.aiTags[0]
          : record.recordType,
      bodyParts:
        record.bodyParts.length === 0
          ? result.aiTags.filter((t) => !t.toLowerCase().includes("urgent"))
          : record.bodyParts,
      enrichedAt: new Date().toISOString(),
    });
  }

  return enriched;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

async function generateText(prompt: string, json = false): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: json ? { responseMimeType: "application/json" } : undefined,
    });
    return response.text ?? null;
  } catch {
    return null;
  }
}

export async function answerMedicalQuestion(
  question: string,
  records: MedicalRecord[],
): Promise<string | null> {
  const context = records
    .map(
      (r) =>
        `[${r.encounterDate}] ${r.recordType} — ${r.primaryProvider} @ ${r.facility}: ${r.summary}`,
    )
    .join("\n");
  const prompt = `You are a medical-legal assistant. Answer the user's question using ONLY the medical records below. Be concise and professional.

Records:
${context || "No records available."}

Question: ${question}`;
  return generateText(prompt);
}

export type MedicalCitation = {
  term: string;
  sourceUrl?: string;
  pageHint?: string;
};

export async function extractMedicalCitations(
  records: MedicalRecord[],
): Promise<MedicalCitation[]> {
  const context = records
    .map(
      (r, i) =>
        `Record ${i + 1}: type=${r.recordType}, summary=${r.summary}, pdf=${r.pdfUrl ?? "none"}`,
    )
    .join("\n");
  const prompt = `Extract key medical terms (diagnoses, procedures, findings) from these records. Return ONLY JSON array of objects: { "term": string, "sourceUrl": string or null, "pageHint": string or null }. Estimate pageHint from context when possible.

Records:
${context}`;
  const text = await generateText(prompt, true);
  if (!text) return [];
  try {
    const parsed = JSON.parse(text) as MedicalCitation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function redoSettlementLetter(
  currentDraft: string,
  customNotes: string,
  caseContext: string,
): Promise<string | null> {
  const prompt = `Rewrite this settlement demand letter incorporating the attorney's custom notes. Keep professional legal tone. Return ONLY the letter text, no markdown.

Case context:
${caseContext}

Custom notes to incorporate:
${customNotes || "None"}

Current draft:
${currentDraft}`;
  return generateText(prompt);
}
