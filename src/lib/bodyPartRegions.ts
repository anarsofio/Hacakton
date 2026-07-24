export type BodyRegion = {
  x: number;
  y: number;
  label: string;
  matchers: string[];
};

export const bodyPartRegions: BodyRegion[] = [
  { x: 150, y: 55, label: "Head / Neck", matchers: ["head", "neck", "cervical"] },
  { x: 130, y: 120, label: "Left Shoulder", matchers: ["left shoulder", "shoulder"] },
  { x: 170, y: 120, label: "Right Shoulder", matchers: ["right shoulder"] },
  { x: 150, y: 200, label: "Chest / Thoracic", matchers: ["chest", "thoracic", "rib"] },
  { x: 150, y: 280, label: "Lumbar Spine", matchers: ["lumbar", "l2", "l3", "l4", "l5", "spine", "back"] },
  { x: 115, y: 380, label: "Left Knee", matchers: ["left knee", "knee"] },
  { x: 185, y: 380, label: "Right Knee", matchers: ["right knee"] },
  { x: 115, y: 480, label: "Left Ankle", matchers: ["left ankle", "ankle", "foot"] },
  { x: 185, y: 480, label: "Right Ankle", matchers: ["right ankle"] },
];

export function matchBodyPart(part: string): BodyRegion | undefined {
  const lower = part.toLowerCase();
  return bodyPartRegions.find((r) =>
    r.matchers.some((m) => lower.includes(m)),
  );
}

export function buildInjuryLabels(
  bodyParts: string[],
  summary: string,
): { region: BodyRegion; label: string; severity?: string }[] {
  const labels: { region: BodyRegion; label: string; severity?: string }[] = [];
  const seen = new Set<string>();

  for (const part of bodyParts) {
    const region = matchBodyPart(part);
    if (!region || seen.has(region.label)) continue;
    seen.add(region.label);
    labels.push({ region, label: part });
  }

  const summaryLower = summary.toLowerCase();
  if (summaryLower.match(/l2|l3|fracture/) && !seen.has("Lumbar Spine")) {
    const region = bodyPartRegions.find((r) => r.label === "Lumbar Spine")!;
    labels.push({
      region,
      label: summaryLower.includes("fracture") ? "Fracture L2, L3" : "Lumbar injury",
    });
  }

  return labels;
}
