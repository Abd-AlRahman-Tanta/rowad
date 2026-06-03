import fs from "fs";
import path from "path";
import subsetFont from "subset-font";
import { fileURLToPath } from "url";
import config from "./subset.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------
   Helpers
------------------------------------------------- */

// Recursively extract ONLY string values from JSON
function extractTextByLanguage(json, lang) {
  let result = "";

  if (typeof json === "string") {
    result += json;
  } else if (Array.isArray(json)) {
    for (const item of json) {
      result += extractTextByLanguage(item, lang);
    }
  } else if (typeof json === "object" && json !== null) {
    for (const key in json) {
      // Traverse everything, language filtering happens naturally
      result += extractTextByLanguage(json[key], lang);
    }
  }

  return result;
}

// Read all JSON files
function readAllJsonFiles(dir) {
  const files = fs.readdirSync(dir);
  const jsons = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(dir, file);
    jsons.push(
      JSON.parse(fs.readFileSync(filePath, "utf8"))
    );
  }

  return jsons;
}

/* -------------------------------------------------
   1. Read JSON
------------------------------------------------- */

console.log("🔍 Reading JSON files...");

const allJsonFiles = readAllJsonFiles(
  config.jsonSourceDir
);

// Ensure charset output dir exists
if (!fs.existsSync(config.charsetOutputDir)) {
  fs.mkdirSync(config.charsetOutputDir, {
    recursive: true,
  });
}

/* -------------------------------------------------
   2. Generate charsets per language
------------------------------------------------- */

const charsets = {};

for (const [lang, rules] of Object.entries(
  config.languages
)) {
  // 1. Start with base charset (letters + numbers)
  let chars = rules.baseCharset;

  // 2. Extract text from ALL JSON files
  for (const json of allJsonFiles) {
    chars += extractTextByLanguage(json, lang);
  }

  // 3. Deduplicate characters
  chars = [...new Set(chars)].join("");

  // 4. Save charset file
  const outputPath = path.join(
    config.charsetOutputDir,
    rules.outputFile
  );

  fs.writeFileSync(outputPath, chars, "utf8");
  charsets[lang] = chars;

  console.log(
    `✅ ${lang} charset generated (${chars.length} chars)`
  );
}

/* -------------------------------------------------
   3. Subset fonts
------------------------------------------------- */

for (const font of config.fonts) {
  let mergedChars = "";

  for (const lang of font.languages) {
    if (!charsets[lang]) continue;
    mergedChars += charsets[lang];
  }

  mergedChars = [...new Set(mergedChars)].join("");

  if (!mergedChars.length) {
    console.error(
      `❌ No characters for font: ${font.name}`
    );
    continue;
  }

  const fontBuffer = fs.readFileSync(font.src);

  const subset = await subsetFont(
    fontBuffer,
    mergedChars,
    { targetFormat: "woff2" }
  );

  fs.writeFileSync(font.dest, subset);

  console.log(`🎯 Subset created: ${font.name}`);
}
