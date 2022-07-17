import React, { useState, useEffect } from "react";

// Components
import Header from "../components/Header";
import SiteNavbar from "../components/Navbar";
import ThemeSelector from "../components/settings/ThemeSelector";

// Hooks
import useLocalStorage from "../hooks/useLocalStorage";

// Bootstrap
import { Container, Row, Col, Form } from "react-bootstrap";

// Languages
import IntlWrapper from "../components/IntlWrapper";
import { FormattedMessage, useIntl } from "react-intl";
import { locales } from "../lib/i18n/getLocaleData";
import { getLanguage, setLanguage } from "../functions";

const SettingsLayout = () => {
  const intl = useIntl();
  const [language, setLanguageHook] = useState("en");

  const [minifyEndpointData, setMinifyEndpointData] = useLocalStorage(
    "minify_endpoint_data",
    false
  );

  useEffect(() => {
    setLanguageHook(getLanguage(window));
  }, []);

  return (
    <>
      <Header title="Settings" />
      <SiteNavbar />
      <Container className="intro mb-2">
        <h1>
          <FormattedMessage
            id="settings.settings"
            defaultMessage={"Settings"}
          />
        </h1>
        <p className="mb-1">
          <FormattedMessage
            id="settings.customize_your_experience"
            defaultMessage={"Customize your website experience."}
          />
        </p>
      </Container>
      <>
        {/* THEME */}
        {/* <Form.Select
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
        </Form.Select> */}
      </>

      {/* LANGUAGE */}
      <Container className="mb-4">
        <Row>
          <h3>
            <FormattedMessage
              id="settings.language.heading"
              defaultMessage={"Language"}
            />
          </h3>
          <p className="mb-1">
            <FormattedMessage
              id="settings.language.change"
              defaultMessage={"Change the website language."}
            />
          </p>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
      </Container>

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

      {/* THEME */}
      <Container className="mb-4">
        <Row>
          <h3>
            <FormattedMessage
              id="settings.theme.heading"
              defaultMessage={"Theme"}
            />
          </h3>
          <p className="mb-1">
            <FormattedMessage
              id="settings.theme.choose_your_theme"
              defaultMessage={"Choose your Website theme."}
            />
          </p>
        </Row>
        <Row>
          <ThemeSelector
            themeType="day"
            themeTitleId="settings.day_theme"
            // active={true}
          />
          <ThemeSelector
            themeType="night"
            themeTitleId="settings.night_theme"
          />
        </Row>
      </Container>

      {/* ENDPOINT BUILDER */}
      <Container className="mb-4">
        <Row>
          <h3>
            <FormattedMessage
              id="settings.endpoint_builder.heading"
              defaultMessage={"Endpoint Builder"}
            />
          </h3>
          <p className="mb-1">
            <FormattedMessage
              id="settings.endpoint_builder.adjust_the_settings"
              defaultMessage={
                "Adjust the settings for the endpoint builder page."
              }
            />
          </p>
        </Row>
        <Row>
          <Col>
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
                  id="settings.endpoint_builder.minify_endpoint_data"
                  defaultMessage={"Minify endpoint data."}
                />
              </label>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

// Wrap the settings layout in an IntlWrapper.
const Settings = () => {
  return (
    <IntlWrapper>
      <SettingsLayout />
    </IntlWrapper>
  );
};

export default Settings;
