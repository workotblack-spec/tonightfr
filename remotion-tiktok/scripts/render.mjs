import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const variants = [
  { voice: "fr", out: "/mnt/documents/tonight-tiktok-fr.mp4", muted: false },
  { voice: "de", out: "/mnt/documents/tonight-tiktok-de.mp4", muted: false },
  { voice: "mute", out: "/mnt/documents/tonight-tiktok-mute.mp4", muted: true },
];

for (const v of variants) {
  console.log(`Rendering ${v.voice}...`);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "main",
    puppeteerInstance: browser,
    inputProps: { voice: v.voice },
  });
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: v.out,
    puppeteerInstance: browser,
    inputProps: { voice: v.voice },
    muted: v.muted,
    concurrency: 1,
  });
  console.log(`Done ${v.out}`);
}

await browser.close({ silent: false });
console.log("ALL DONE");
