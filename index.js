import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./images-raw";
const outputDir = "./images-optimized";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir);

async function optimizeImage(file) {
  const inputPath = path.join(inputDir, file);

  const baseName = path.parse(file).name;

  const image = sharp(inputPath)
    .rotate() // respeta orientación EXIF
    .resize({
      width: 1920,
      withoutEnlargement: true,
      fit: "inside",
    });

  // AVIF
  await image
    .clone()
    .avif({
      quality: 50,
      effort: 6,
    })
    .toFile(path.join(outputDir, `${baseName}.avif`));

  // WebP
  await image
    .clone()
    .webp({
      quality: 75,
    })
    .toFile(path.join(outputDir, `${baseName}.webp`));

  // JPG optimizado
  await image
    .clone()
    .jpeg({
      quality: 80,
      mozjpeg: true,
    })
    .toFile(path.join(outputDir, `${baseName}.jpg`));

  console.log(`Optimizada: ${file}`);
}

Promise.all(files.map(optimizeImage))
  .then(() => console.log("Todo listo"))
  .catch(console.error);
