import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  /* ---------------------------------------------
     Where JSON files live (Laravel storage)
  --------------------------------------------- */
  jsonSourceDir: path.join(
    __dirname,
    "../storage/app/private/json"
  ),

  /* ---------------------------------------------
     Where extracted charset files go
  --------------------------------------------- */
  charsetOutputDir: path.join(
    __dirname,
    "../subsets"
  ),

  /* ---------------------------------------------
     Language definitions
     Base charset = ALWAYS included
  --------------------------------------------- */
  languages: {
    en: {
      baseCharset:
        "abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "0123456789",
      outputFile: "en.txt",
    },

    ar: {
      baseCharset:
        "ابتثجحخدذرزسشصضطظعغفقكلمنهوي" +
        "٠١٢٣٤٥٦٧٨٩",
      outputFile: "ar.txt",
    },
  },

  /* ---------------------------------------------
    Fonts
    ONE OBJECT = ONE FONT FILE
  --------------------------------------------- */
  fonts: [
    {
      name: "English Font",
      src: path.join(
        __dirname,
        "../public/fonts/Inter/Inter-Regular.ttf"
      ),
      dest: path.join(
        __dirname,
        "../public/fonts/Inter/Inter-Regular-subset.woff2"
      ),
      languages: ["en"],
    },
  ],
};
