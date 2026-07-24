import ngrok from "@ngrok/ngrok";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { loadEnvLocal } from "./loadEnvLocal.mjs";

loadEnvLocal();

function getNgrokAuthtoken() {
  if (process.env.NGROK_AUTHTOKEN) return process.env.NGROK_AUTHTOKEN;

  const candidates = [
    join(process.env.LOCALAPPDATA ?? "", "ngrok", "ngrok.yml"),
    join(
      process.env.LOCALAPPDATA ?? "",
      "Packages",
      "ngrok.ngrok_1g87z0zv29zzc",
      "LocalCache",
      "Local",
      "ngrok",
      "ngrok.yml",
    ),
    join(homedir(), ".ngrok2", "ngrok.yml"),
    join(homedir(), "AppData", "Local", "ngrok", "ngrok.yml"),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const match = readFileSync(path, "utf-8").match(/authtoken:\s*(\S+)/);
    if (match) return match[1];
  }

  return null;
}

async function main() {
  const PORT = Number(process.env.PORT ?? 3000);
  const token = getNgrokAuthtoken();

  if (!token) {
    console.error(`
Missing NGROK authtoken.

Either add NGROK_AUTHTOKEN to .env.local, or run once:
  ngrok config add-authtoken YOUR_TOKEN

Get a free token: https://dashboard.ngrok.com/get-started/your-authtoken
`);
    process.exit(1);
  }

  console.log(`Waiting for Next.js on port ${PORT}…`);
  await new Promise((r) => setTimeout(r, 4000));

  const listener = await ngrok.forward({ addr: PORT, authtoken: token });
  const url = listener.url();
  console.log(`
╔══════════════════════════════════════════════════╗
║  CaseFlow is public on the internet              ║
╠══════════════════════════════════════════════════╣
║  ${url}
║
║  Share that link with anyone — no Tailscale needed.
║  Press Ctrl+C to stop.
╚══════════════════════════════════════════════════╝
`);

  await new Promise(() => {});
}

main().catch((err) => {
  console.error("ngrok failed to start:", err?.message ?? err);
  process.exit(1);
});
