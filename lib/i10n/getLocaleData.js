import en_Messages from "./en.json";
import de_Messages from "./de.json";

const locales = {
  en: {
    locale: "en",
    messages: en_Messages,
  },
  de: {
    locale: "de",
    messages: de_Messages,
  },
};

export const getLocaleData = (locale) => locales[locale] ?? locales["en"];
