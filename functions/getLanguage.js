export const LANGUAGES = ["en"];

export const getLanguage = (window) => {
  // Read the language from Local Storage
  let language = window.localStorage.getItem("preferred_language");

  // Check the language is stored in Local Storage and supported by the site.
  if (language && LANGUAGES.includes(language)) {
    return language;
  }

  // Read the language from the Browser
  language = (navigator.language || navigator.userLanguage).substring(0, 2);

  // If the language is not supported by the site, default to English.
  if (!LANGUAGES.includes(language)) {
    language = LANGUAGES[0];
  }

  // Write the new Language to Local Storage
  setLanguage(language, window);
  return language;
};

export const setLanguage = (data, window) => {
  window.localStorage.setItem("preferred_language", data);
};
