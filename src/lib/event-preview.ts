// Only reference images actually generated and shipped with the application.
const eventPreviewIds = new Set([
  "0a1b8d18-d35c-4912-a0e3-0155ed90b8a8",
  "cdfb528b-23fc-4a8b-9245-242c445559e5",
]);

export function eventPreviewUrl(id: string): string | null {
  return eventPreviewIds.has(id)
    ? `https://tonightfr.lovable.app/event-previews/${id}.jpg`
    : null;
}