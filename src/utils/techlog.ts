// Mongo limita cada documento a 16 MB; dejamos margen para el resto de campos
export const MAX_TECHLOG_BYTES = 8 * 1024 * 1024;

/**
 * "ec-abc", "EC ABC" o "ECABC" -> { display: "EC-ABC" / "ECABC", key: "ECABC" }.
 * La clave (sin guiones) es la que se usa para buscar y bloquear, para que
 * escribir la matrícula de otra forma no permita saltarse el bloqueo.
 */
export function normalizeRegistration(
  input: string
): { display: string; key: string } | null {
  const display = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z0-9]+(-[A-Z0-9]+)?$/.test(display)) return null;
  const key = display.replace(/-/g, "");
  if (key.length < 3 || key.length > 8) return null;
  return { display, key };
}

export async function downloadAttachment(
  url: string,
  maxBytes: number
): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Descarga fallida (HTTP ${response.status})`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > maxBytes) throw new Error("El archivo es demasiado grande");
  return buffer;
}
