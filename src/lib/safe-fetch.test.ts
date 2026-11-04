import { describe, it, expect } from "vitest";
import { validateOutboundUrl, validateImageUrl, safeFetchHtml, bearerMatches } from "./safe-fetch";

const html = (body: string, extra: Record<string, string> = {}) =>
  new Response(body, { status: 200, headers: { "content-type": "text/html", ...extra } });

describe("validateOutboundUrl", () => {
  it("accepts allowlisted https host", () => {
    expect(validateOutboundUrl("https://www.fri-son.ch/programme/")).not.toBeNull();
  });
  it.each([
    "http://fri-son.ch/",
    "https://127.0.0.1/",
    "https://[::ffff:127.0.0.1]/",
    "https://169.254.169.254/latest",
    "https://localhost/",
    "https://evil.com/",
    "https://fri-son.ch.evil.com/",
    "https://user:pw@fri-son.ch/",
    "https://fri-son.ch:8443/",
    "https://2130706433/",
  ])("rejects %s", (u) => {
    expect(validateOutboundUrl(u)).toBeNull();
  });
});

describe("validateImageUrl", () => {
  it("rejects private / non-https images", () => {
    expect(validateImageUrl("http://cdn.example.com/a.jpg")).toBeNull();
    expect(validateImageUrl("https://10.0.0.1/a.jpg")).toBeNull();
    expect(validateImageUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
  });
});

describe("safeFetchHtml", () => {
  it("blocks redirect to a private IP", async () => {
    const f = (async () =>
      new Response(null, { status: 302, headers: { location: "https://127.0.0.1/" } })) as typeof fetch;
    expect(await safeFetchHtml("https://fri-son.ch/", { fetchImpl: f })).toBeNull();
  });
  it("follows allowlisted redirect", async () => {
    let n = 0;
    const f = (async () =>
      n++ === 0
        ? new Response(null, { status: 301, headers: { location: "https://www.fri-son.ch/x" } })
        : html("<html>ok</html>")) as typeof fetch;
    expect((await safeFetchHtml("https://fri-son.ch/", { fetchImpl: f }))?.finalUrl).toBe("https://www.fri-son.ch/x");
  });
  it("truncates oversized body at maxBytes", async () => {
    const f = (async () => html("a".repeat(5000))) as typeof fetch;
    const r = await safeFetchHtml("https://fri-son.ch/", { fetchImpl: f, maxBytes: 100 });
    expect(r?.html.length).toBe(100);
  });
  it("rejects declared oversized body and non-html", async () => {
    const big = (async () => html("x", { "content-length": "999999999" })) as typeof fetch;
    expect(await safeFetchHtml("https://fri-son.ch/", { fetchImpl: big })).toBeNull();
    const json = (async () => new Response("{}", { headers: { "content-type": "application/json" } })) as typeof fetch;
    expect(await safeFetchHtml("https://fri-son.ch/", { fetchImpl: json })).toBeNull();
  });
});

describe("bearerMatches", () => {
  it("requires exact secret", () => {
    expect(bearerMatches("Bearer abc123", "abc123")).toBe(true);
    expect(bearerMatches("Bearer abc124", "abc123")).toBe(false);
    expect(bearerMatches("Bearer abc", "abc123")).toBe(false);
    expect(bearerMatches(null, "abc123")).toBe(false);
    expect(bearerMatches("Bearer abc123", undefined)).toBe(false);
  });
});
