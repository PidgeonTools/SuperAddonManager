import React, { useState, useEffect } from "react";

// Hooks
import useLocalStorage from "../hooks/useLocalStorage";

// Bootstrap
import { Container, Dropdown, Form } from "react-bootstrap";

// Languages
import { FormattedMessage, useIntl } from "react-intl";
import { locales } from "../lib/i18n/getLocaleData";
import { getLanguage, setLanguage } from "../functions";

// Theme
import { getTheme, setTheme, THEMES } from "../functions/getTheme";
import IntlWrapper from "../components/IntlWrapper";

//// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
////   <div
////     ref={ref}
////     className="sam-toggle-button"
////     onClick={(e) => {
////       e.preventDefault();
////       onClick(e);
////     }}
////   >
////     {children}
////   </div>
//// ));

const Settings = () => {
  const intl = useIntl();
  const [language, setLanguageHook] = useState("en");
  const [theme, setThemeHook] = useState("light");
  const [minifyEndpointData, setMinifyEndpointData] = useLocalStorage(
    "minify_endpoint_data",
    false
  );

  useEffect(() => {
    setLanguageHook(getLanguage(window));
    setThemeHook(getTheme(window));
  }, []);

  return (
    <IntlWrapper>
      <Container>
        <div>Settings</div>
        {/* THEME */}
        <Form.Select
          className="sam-form-select"
          onChange={({ target }) => {
            document.documentElement.className = target.value;
            setTheme(target.value, window);
            setThemeHook(target.value);
          }}
          value={theme}
        >
          {Object.keys(THEMES).map((key) => {
            let theme = THEMES[key];
            return (
              <option key={theme} value={theme.class}>
                {intl.formatMessage({ id: theme.id })}
              </option>
            );
          })}
        </Form.Select>

        {/* LANGUAGE */}
        <Form.Select
          className="sam-form-select"
          value={language}
          onChange={({ target }) => {
            setLanguage(target.value, window);
            location.reload();
          }}
        >
          {Object.keys(locales).map((key) => {
            let locale = locales[key];
            return (
              <option key={locale} value={locale.locale}>
                {locale.flag} {intl.formatMessage({ id: locale.id })}
              </option>
            );
          })}
        </Form.Select>
        <>
          {
            /////* <Dropdown className="theme-switcher">
            ////<Dropdown.Toggle as={CustomToggle}>
            ////        <span>asdf</span>
            ////      </Dropdown.Toggle>
            ////      <Dropdown.Menu aria-labelledby="dropdownMenuButton1">
            ////        {Object.keys(THEMES).map((key) => {
            ////          let theme = THEMES[key];
            ////          return (
            ////            <Dropdown.Item
            ////              key={theme}
            ////              onClick={(e) => {
            ////                document.documentElement.className = theme.class;
            ////                setTheme(theme.class, window);
            ////              }}
            ////            >
            ////              <FormattedMessage id={theme.id} />
            ////            </Dropdown.Item>
            ////          );
            ////        })}
            ////      </Dropdown.Menu>
            ////    </Dropdown>
            ////    <Dropdown className="language-switcher">
            ////      <Dropdown.Toggle as={CustomToggle}>
            ////        <span>{locales[language].flag}</span>
            ////      </Dropdown.Toggle>
            ////      <Dropdown.Menu aria-labelledby="dropdownMenuButton1">
            ////        {Object.keys(locales).map((key) => {
            ////          let locale = locales[key];
            ////          return (
            ////            <Dropdown.Item
            ////              key={locale}
            ////              onClick={(e) => {
            ////                setLanguage(locale.locale, window);
            ////                location.reload();
            ////              }}
            ////            >
            ////              {locale.flag} <FormattedMessage id={locale.id} />
            ////            </Dropdown.Item>
            ////          );
            ////        })}
            ////      </Dropdown.Menu>
            ////    </Dropdown> */
          }
        </>
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

        <div className="theme-selector round-border-large">
          <div className="theme-body">
            <div className="theme-text">Select the theme</div>
            <div className="theme-preview round-border-large">
              <img
                className="theme-preview-img round-border-large-top"
                src="/images/settings/light_theme_preview.svg"
              />
              <p className="theme-name round-border-large-bottom">Light</p>
            </div>
            <div className="theme-form">form here</div>
          </div>
        </div>
      </Container>
    </IntlWrapper>
  );
};

export default Settings;
