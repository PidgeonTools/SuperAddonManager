import en_Messages from "./languages/en.json";
import de_Messages from "./languages/de.json";

export const locales = {
  en: {
    locale: "en",
    messages: en_Messages,
    flag: "🇬🇧",
    id: "languages.english",
  },
  de: {
    locale: "de",
    messages: de_Messages,
    flag: "🇩🇪",
    id: "languages.german",
  },
};

export const getLocaleData = (locale) => locales[locale] ?? locales["en"];
