import cote from "cote";
import * as Jimp from "jimp";
import path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const responder = new cote.Responder({ name: "Thumbnail Service" });

responder.on("create-thumbnail", async (req) => {
  const inputPath = path.join(__dirname, "..", req.imagePath);
  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "avatars",
    "thumb_" + req.filename
  );

  try {
    const image = await Jimp.read(inputPath);
    await image.resize(100, 100).writeAsync(outputPath);
    console.log(`Thumbnail creado: ${outputPath}`);
  } catch (error) {
    console.error("Error al crear thumbnail", error);
  }
});
