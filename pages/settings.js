import React, { useState, useEffect } from "react";

// Hooks
import useLocalStorage from "../hooks/useLocalStorage";

// Bootstrap
import { Dropdown } from "react-bootstrap";

// Languages
import { FormattedMessage } from "react-intl";
import { locales } from "../lib/i18n/getLocaleData";
import { getLanguage, setLanguage } from "../functions";

// Theme
import { setTheme, THEMES } from "../functions/getTheme";
import IntlWrapper from "../components/IntlWrapper";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    className="sam-toggle-button"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </div>
));

const Settings = () => {
  const [language, setLanguageHook] = useState("en");
  const [minifyEndpointData, setMinifyEndpointData] = useLocalStorage(
    "minify_endpoint_data",
    false
  );

  useEffect(() => {
    setLanguageHook(getLanguage(window));
  }, []);

  return (
    <IntlWrapper>
      <div>Settings</div>
      <Dropdown className="theme-switcher">
        <Dropdown.Toggle as={CustomToggle}>
          <span>asdf</span>
        </Dropdown.Toggle>
        <Dropdown.Menu aria-labelledby="dropdownMenuButton1">
          {Object.keys(THEMES).map((key) => {
            let theme = THEMES[key];
            return (
              <Dropdown.Item
                key={theme}
                onClick={(e) => {
                  document.documentElement.className = theme.class;
                  setTheme(theme.class, window);
                }}
              >
                <FormattedMessage id={theme.id} />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown className="language-switcher">
        <Dropdown.Toggle as={CustomToggle}>
          <span>{locales[language].flag}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu aria-labelledby="dropdownMenuButton1">
          {Object.keys(locales).map((key) => {
            let locale = locales[key];
            return (
              <Dropdown.Item
                key={locale}
                onClick={(e) => {
                  setLanguage(locale.locale, window);
                  location.reload();
                }}
              >
                {locale.flag} <FormattedMessage id={locale.id} />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <div className="form-check">
        <input
          type="checkbox"
          id="checkbox_minify_endpoint_data"
          className="form-check-input sam-form-check-input"
          onClick={({ target }) => {
            setMinifyEndpointData(target.checked);
          }}
          value={minifyEndpointData}
        />
        <label
          htmlFor="checkbox_minify_endpoint_data"
          className="form-checked-label"
        >
          <FormattedMessage
            id="settings.minify_endpoint_data"
            defaultMessage={"Minify endpoint data."}
          />
        </label>
      </div>
    </IntlWrapper>
  );
};

export default Settings;
