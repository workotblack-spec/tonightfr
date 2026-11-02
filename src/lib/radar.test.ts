import { describe, it, expect } from "vitest";
import { matchesMood, withinRadius, formatDistance } from "./radar";
import { CANTONS, nearestCanton } from "@/data/cantons";

describe("radar", () => {
  it("club moment only keeps clubbing", () => {
    expect(matchesMood("clubbing", "club", "all")).toBe(true);
    expect(matchesMood("concert", "club", "all")).toBe(false);
  });
  it("radius 5 km excludes 6 km venue", () => {
    expect(withinRadius(6, 5)).toBe(false);
    expect(withinRadius(4.5, 5)).toBe(true);
  });
  it("radius 20 km excludes 25 km venue", () => {
    expect(withinRadius(25, 20)).toBe(false);
    expect(withinRadius(19, 20)).toBe(true);
  });
  it("toute la Suisse keeps everything", () => {
    expect(withinRadius(250, "ch")).toBe(true);
  });
  it("formats meters under 1 km", () => {
    expect(formatDistance(0.8)).toBe("800 m");
    expect(formatDistance(12.4)).toBe("12 km");
  });
  it("covers all 26 cantons", () => {
    expect(CANTONS.length).toBe(26);
  });
  it("detects Jura from Delémont and Valais from Sion", () => {
    expect(nearestCanton({ lat: 47.36, lng: 7.35 })?.code).toBe("JU");
    expect(nearestCanton({ lat: 46.23, lng: 7.36 })?.code).toBe("VS");
  });
  it("returns no canton outside Switzerland (Paris)", () => {
    expect(nearestCanton({ lat: 48.85, lng: 2.35 })).toBeNull();
  });
});
