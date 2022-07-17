export const THEMES = {
  light: { class: "light", id: "themes.light" },
  "colorblind-light": {
    class: "colorblind-light",
    id: "themes.colorblind_light",
  },
  dark: { class: "dark", id: "themes.dark" },
  "colorblind-dark": {
    class: "colorblind-dark",
    id: "themes.colorblind_dark",
  },
};

export const getTheme = (window, themeType = "day") => {
  // Read the language from Local Storage
  let theme = window.localStorage.getItem(`${themeType}_theme`);

  // Check the language is stored in Local Storage and supported by the site.
  if (theme && theme in THEMES) {
    return theme;
  }

  // Read the theme from the Browser
  theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.dark
    : THEMES.light;

  // If the theme is not supported by the site, default to light.
  if (!theme in THEMES) {
    theme = THEMES.light;
  }

  // Write the new Language to Local Storage
  setTheme(theme.class, window, themeType);
  return theme.class;
};

export const setTheme = (data, window, themeType = "day") => {
  window.localStorage.setItem(`${themeType}_theme`, data);
};
