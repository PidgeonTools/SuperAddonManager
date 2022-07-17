import React, { useState, useEffect } from "react";

// Components
import RadioInput from "./RadioInput";

// Theme
import { getTheme, setTheme, THEMES } from "../../functions/getTheme";

// Translations
import { FormattedMessage } from "react-intl";

// Classes
var classNames = require("classnames");

const ThemeSelector = ({
  themeType = "day",
  active = false,
  themeTitleId = "none",
}) => {
  const [theme, setThemeHook] = useState("light");
  const [hoveredTheme, setHoveredTheme] = useState("");

  useEffect(() => {
    let t = getTheme(window, themeType);
    console.log(t);
    setThemeHook(t);
  }, [themeType]);

  return (
    <>
      <div
        className={classNames("theme-selector", "round-border-large", {
          "border-active": active,
        })}
      >
        <div
          className={classNames(
            "theme-body",
            "theme-text",
            "round-border-large-top",
            "py-3",
            {
              "border-active": active,
              "theme-text--active": active,
            }
          )}
        >
          <FormattedMessage id={themeTitleId} defaultMessage={"Theme"} />
        </div>
        <div className="theme-body">
          <div className="theme-preview round-border-large">
            {Object.keys(THEMES).map((key) => {
              let t = THEMES[key];
              return (
                <div
                  key={themeType + theme.id}
                  // The following conditions explained:
                  // First, hide the current item, if the user selected theme AND the hovered theme are not equal to the current item.
                  // Second, hide the current item, if there is a hovered theme and the hovered theme is not equal to the current item. In this case, the user selected theme is irrelevant.
                  className={classNames({
                    "d-none":
                      (theme !== t.class && hoveredTheme !== t.class) ||
                      (hoveredTheme !== "" && hoveredTheme !== t.class),
                  })}
                >
                  <img
                    className="theme-preview-img round-border-large-top"
                    src={`/images/settings/${t.class}_theme_preview.svg`}
                  />
                  <p className="theme-name round-border-large-bottom">
                    <FormattedMessage id={t.id} />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="theme-body theme-form"
          onMouseLeave={() => {
            setHoveredTheme("");
          }}
        >
          {Object.keys(THEMES).map((key) => {
            let t = THEMES[key];
            return (
              <RadioInput
                key={themeType + theme.class}
                className="asdf"
                name={`${themeType}_theme`}
                id={`${t.class}-${themeType}`}
                value={t.class}
                onChange={({ target }) => {
                  document.documentElement.setAttribute(
                    `data-${themeType}-theme`,
                    target.value
                  );
                  setTheme(target.value, window, themeType);
                  /**/ setThemeHook(target.value);
                }}
                labelClassName="theme-radio-item"
                hidden={true}
              >
                <div
                  className={classNames("label-outer", {
                    "label-outer--selected": theme === t.class,
                  })}
                  onMouseEnter={() => {
                    console.log("asdf");
                    setHoveredTheme(t.class);
                  }}
                >
                  <div
                    className={classNames("label-inner", {
                      "label-inner--selected": theme === t.class,
                    })}
                  ></div>
                </div>
              </RadioInput>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ThemeSelector;
