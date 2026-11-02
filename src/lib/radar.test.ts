import { describe, it, expect } from "vitest";
import { matchesMood, withinRadius, formatDistance } from "./radar";

describe("radar", () => {
  it("club moment only keeps clubbing", () => {
    expect(matchesMood("clubbing", "club", "all")).toBe(true);
    expect(matchesMood("concert", "club", "all")).toBe(false);
  });
  it("radius 2 km excludes 3 km venue", () => {
    expect(withinRadius(3, 2)).toBe(false);
    expect(withinRadius(1.5, 2)).toBe(true);
  });
  it("toute la Suisse keeps everything", () => {
    expect(withinRadius(250, "ch")).toBe(true);
  });
  it("formats meters under 1 km", () => {
    expect(formatDistance(0.8)).toBe("800 m");
    expect(formatDistance(12.4)).toBe("12 km");
  });
});
