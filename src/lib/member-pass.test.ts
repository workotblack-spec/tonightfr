import { test, expect } from "vitest";
import { ENTRY_RESULT, passError, isUuid } from "./member-pass";
test("seul 'ok' accorde l'accès", () => {
  expect(ENTRY_RESULT.ok.ok).toBe(true);
  for (const k of ["already_used", "expired", "invalid"]) expect(ENTRY_RESULT[k].ok).toBe(false);
});
test("erreurs traduites", () => { expect(passError("x recipient_invalid")).toBe("Aucun membre Tonight avec cet e-mail."); });
test("soirées démo sans Pass", () => { expect(isUuid("6")).toBe(false); });
