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
  const [lightThemeActive, setLightThemeActive] = useState(true);

  const [minifyEndpointData, setMinifyEndpointData] = useLocalStorage(
    "minify_endpoint_data",
    false
  );

  useEffect(() => {
    let lightThemeQuery = window.matchMedia("(prefers-color-scheme: light)");

    const updateLightThemeActive = (queryRes) => {
      setLightThemeActive(queryRes.matches);
    };

    lightThemeQuery.addEventListener("change", updateLightThemeActive);

    setLanguageHook(getLanguage(window));
    setLightThemeActive(lightThemeQuery.matches);

    return () => {
      lightThemeQuery.removeEventListener("change", updateLightThemeActive);
    };
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
            className="col-12 col-md-6"
            themeType="day"
            themeTitleId="settings.day_theme"
            active={lightThemeActive}
          />
          <ThemeSelector
            className="col-12 col-md-6"
            themeType="night"
            themeTitleId="settings.night_theme"
            active={!lightThemeActive}
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
