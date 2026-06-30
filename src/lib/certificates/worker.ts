import { workerData, parentPort } from "worker_threads";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { PDFDocument } from "pdf-lib";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { AppreciationTemplate } from "./templates/appreciation";
import { TrainingCompletionTemplate } from "./templates/training-completion";

function loadFont(relativePath: string): Buffer | null {
  const fullPath = join(process.cwd(), relativePath);
  if (existsSync(fullPath)) return readFileSync(fullPath);
  return null;
}

const interRegular = loadFont("src/assets/fonts/Inter-Regular.ttf");
const interBold = loadFont("src/assets/fonts/Inter-Bold.ttf");
const interExtraBold = loadFont("src/assets/fonts/Inter-ExtraBold.ttf");

const fonts: { name: string; data: Buffer; weight: number; style: string }[] = [];
if (interRegular) fonts.push({ name: "Inter", data: interRegular, weight: 400, style: "normal" });
if (interBold) fonts.push({ name: "Inter", data: interBold, weight: 700, style: "normal" });
if (interExtraBold) fonts.push({ name: "Inter", data: interExtraBold, weight: 800, style: "normal" });

async function generate() {
  const { templateType, data } = workerData as { templateType: string; data: Record<string, unknown> };

  let element: ReturnType<typeof AppreciationTemplate>;

  if (templateType === "appreciation") {
    element = AppreciationTemplate(data as any);
  } else if (templateType === "training_completion") {
    element = TrainingCompletionTemplate(data as any);
  } else {
    throw new Error(`Unknown template: ${templateType}`);
  }

  const svg = await satori(element as any, {
    width: 1123,
    height: 794,
    fonts: fonts.length > 0 ? fonts : [
      // Fallback: satori requires at least one font
      { name: "sans-serif", data: Buffer.alloc(0), weight: 400, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1123 } });
  const pngBuffer = resvg.render().asPng();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([1123, 794]);
  const pngImage = await pdfDoc.embedPng(pngBuffer);
  page.drawImage(pngImage, { x: 0, y: 0, width: 1123, height: 794 });
  const pdfBuffer = await pdfDoc.save();

  parentPort?.postMessage({ pdfBuffer: Buffer.from(pdfBuffer) });
}

generate().catch((err) => {
  parentPort?.postMessage({ error: err.message });
});
