
import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { generateImage } from "../services/imageGen.js";
import { generateCopy } from "../services/textGen.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_URL = process.env.SERVER_URL || "https://gen-ai-rxym.onrender.com";

router.post("/", async (req, res) => {
  try {
    const { prompt, tone } = req.body;

    // Generate image
    const imageBuffer = await generateImage(prompt);

    // Save image file
    const filename = `${uuidv4()}.png`;
    const outputPath = path.join(__dirname, "../output", filename);
    fs.writeFileSync(outputPath, imageBuffer);

    // Generate text copy
    let copy;
    try {
      copy = await generateCopy(prompt, tone);
    } catch (err) {
      copy = {
        caption: `${prompt}`,
        hashtags: "#AIAds #MEngineAI #CreativeMarketing"
      };
    }

    // Return response with 'text' field (matches App.jsx) and live imageUrl
    res.json({
      text: `${copy.caption}\n\n${copy.hashtags}`,
      imageUrl: `${SERVER_URL}/output/${filename}`
    });

  } catch (err) {
    console.error("Generate API error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
