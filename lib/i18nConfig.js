import { I18n } from "i18n";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18n = new I18n({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true,
  syncFiles: true,
  cookie: "nodepop-locale",
});

export default i18n;
