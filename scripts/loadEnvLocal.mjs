import { readFileSync, existsSync } from "fs";
import { join } from "path";

/** Load KEY=VALUE pairs from .env.local into process.env (does not overwrite existing). */
export function loadEnvLocal(cwd = process.cwd()) {
  const path = join(cwd, ".env.local");
  if (!existsSync(path)) return;

  const text = readFileSync(path, "utf-8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
