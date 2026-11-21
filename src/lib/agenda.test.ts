import { describe, it, expect } from "vitest";
import { monthGrid, zurichDayKey, isValidFutureStart } from "./agenda";

describe("agenda", () => {
  it("starts December 2026 on a Tuesday (one Monday padding cell)", () => {
    const g = monthGrid(2026, 11);
    expect(g[0]).toBeNull();
    expect(g[1]).toBe("2026-12-01");
    expect(g.filter(Boolean)).toHaveLength(31);
  });
  it("puts a 23:30 UTC event on the next Zurich day", () => {
    expect(zurichDayKey("2026-12-11T23:30:00Z")).toBe("2026-12-12");
  });
  it("refuses past or invalid dates for club submissions", () => {
    const now = new Date("2026-11-21T10:00:00Z");
    expect(isValidFutureStart("2026-11-20T22:00", now)).toBe(false);
    expect(isValidFutureStart("pas une date", now)).toBe(false);
    expect(isValidFutureStart("2026-12-12T22:00", now)).toBe(true);
  });
});
