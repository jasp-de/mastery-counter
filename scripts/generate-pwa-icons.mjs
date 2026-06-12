import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = path.join(import.meta.dirname, "..");
const svgPath = path.join(root, "scripts/icon.svg");
const outDir = path.join(root, "public/icons");

const sizes = [192, 512, 180];

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const svg = fs.readFileSync(svgPath);

  for (const size of sizes) {
    const name =
      size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, name));
    console.log(`Wrote public/icons/${name}`);
  }

  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(path.join(root, "public/favicon.png"));
  console.log("Wrote public/favicon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
