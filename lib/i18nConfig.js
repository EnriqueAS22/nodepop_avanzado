import { I18n } from "i18n";
import path from "node:path";

const i18n = new I18n({
  locales: ["en", "es"],
  directory: path.join(import.meta.dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true,
  syncFiles: true,
  cookie: "nodepop-locale",
});

export default i18n;
