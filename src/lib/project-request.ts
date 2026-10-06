import { z } from "zod";
import { LOCALES } from "./site";
const controls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069<>]/;
export function projectOfficialUrl(value: string): string | null {
  try {
    if (value.length > 500 || /[\s<>?#]/.test(value)) return null;
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    )
      return null;
    // Public domain links only. Submitted links are stored as text, never fetched.
    if (
      !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,62}$/.test(url.hostname) ||
      /\.(localhost|local|internal|test|invalid)$/.test(url.hostname)
    )
      return null;
    return url.toString().length <= 500 ? url.toString() : null;
  } catch {
    return null;
  }
}
export const projectRequestSchema = z
  .object({
    requestId: z.string().max(36).uuid(),
    name: z
      .string()
      .max(160)
      .trim()
      .min(1)
      .max(80)
      .refine((v) => !controls.test(v) && !/[\t\n\r]/.test(v)),
    url: z
      .string()
      .trim()
      .max(500)
      .refine((v) => projectOfficialUrl(v) !== null)
      .transform((v) => projectOfficialUrl(v)!),
    description: z
      .string()
      .max(2000)
      .transform((v) => v.replace(/\r\n?/g, "\n").trim())
      .pipe(
        z
          .string()
          .max(1000)
          .refine((v) => !controls.test(v)),
      ),
    locale: z.enum(LOCALES),
  })
  .strict();
export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;
export type ProjectRequestStatus = { canSubmit: boolean; nextAt: string };
export type ProjectRequestResult = {
  status: "submitted" | "daily-limit" | "unavailable";
  nextAt: string | null;
};
