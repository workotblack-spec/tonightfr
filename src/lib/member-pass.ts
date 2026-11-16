// Messages affichés pour chaque réponse du contrôle à l'entrée.
export const ENTRY_RESULT: Record<string, { ok: boolean; label: string }> = {
  ok: { ok: true, label: "Accès accordé — Pass validé" },
  already_used: { ok: false, label: "Refusé — ce Pass a déjà été utilisé" },
  expired: { ok: false, label: "Refusé — code expiré, demandez au membre de rafraîchir" },
  invalid: { ok: false, label: "Refusé — code inconnu ou Pass d’une autre soirée" },
};
export const PASS_ERRORS: Record<string, string> = {
  recipient_invalid: "Aucun membre Tonight avec cet e-mail.",
  recipient_has_pass: "Ce membre a déjà un Pass pour cette soirée.",
  pass_unavailable: "Ce Pass n’est plus disponible.",
  event_unavailable: "Cette soirée n’est plus disponible.",
  not_authenticated: "Connectez-vous d’abord.",
};
export function passError(message?: string) {
  const key = Object.keys(PASS_ERRORS).find((k) => message?.includes(k));
  return key ? PASS_ERRORS[key] : "Une erreur est survenue, réessayez.";
}
export const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
