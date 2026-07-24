export function extractDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const filePath = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (filePath?.[1]) return filePath[1];

  const idParam = trimmed.match(/[?&#]id=([a-zA-Z0-9_-]+)/);
  if (idParam?.[1]) return idParam[1];

  const openId = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openId?.[1]) return openId[1];

  return null;
}

export function toDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export function isImportableDriveUrl(url: string): boolean {
  return extractDriveFileId(url) !== null;
}
