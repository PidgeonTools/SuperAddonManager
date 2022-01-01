import React, { useEffect, useState } from "react";

// Translations
import { IntlProvider } from "react-intl";
import { getLocaleData } from "../lib/i18n/getLocaleData";
import { getLanguage } from "../functions";

const IntlWrapper = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setLanguage(getLanguage(window));
  }, []);

  return <IntlProvider {...getLocaleData(language)}>{children}</IntlProvider>;
};

export default IntlWrapper;
