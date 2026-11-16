import { describe, expect, it } from "vitest";
import { eventPreviewUrl } from "./event-preview";

describe("event preview assets", () => {
  it("maps each existing event to its own shipped image", () => {
    const first = "0a1b8d18-d35c-4912-a0e3-0155ed90b8a8";
    const second = "cdfb528b-23fc-4a8b-9245-242c445559e5";
    expect(eventPreviewUrl(first)).toBe(
      `https://tonightfr.lovable.app/event-previews/${first}.jpg`,
    );
    expect(eventPreviewUrl(second)).toBe(
      `https://tonightfr.lovable.app/event-previews/${second}.jpg`,
    );
    expect(eventPreviewUrl(first)).not.toBe(eventPreviewUrl(second));
  });

  it("does not advertise an image that has not been generated", () => {
    expect(eventPreviewUrl("00000000-0000-4000-8000-000000000000")).toBeNull();
    expect(eventPreviewUrl("../../private")).toBeNull();
  });
});