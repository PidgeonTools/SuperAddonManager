import React, { useState } from "react";

// Bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Translations
import { FormattedMessage } from "react-intl";
import I18nFormatters from "../../lib/i18n/I18nFormatters";

export const Version = ({ exampleText }) => {
  return (
    <>
      <div className="endpoint-form-example-container round-border-small">
        {exampleText}
      </div>
      <div>
        <FormattedMessage
          id="endpoint_builder.help_texts.version.please_note_that"
          values={I18nFormatters}
        />{" "}
        <FormattedMessage
          id="endpoint_builder.help_texts.version.we_suggest_using"
          values={I18nFormatters}
        />{" "}
      </div>
    </>
  );
};

export const DownloadURL = ({ allowAutomaticDownload, exampleText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  if (allowAutomaticDownload) {
    exampleText = "https://www.example.com/my-addon-0.0.0.zip";
  }

  return (
    <>
      <div
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
      >
        <FormattedMessage id="endpoint_builder.help_texts.download_url.please_fill_in_the_link" />{" "}
        {allowAutomaticDownload ? (
          <>
            <FormattedMessage id="endpoint_builder.help_texts.download_url.since_you_checked" />{" "}
            <FormattedMessage id="endpoint_builder.help_texts.download_url.cannot_link_to_a_file" />{" "}
            <OverlayTrigger
              placement="top"
              show={showTooltip}
              overlay={
                <Tooltip>
                  <FormattedMessage id="endpoint_builder.help_texts.download_url.if_your_addon_is_paid" />
                </Tooltip>
              }
            >
              <span
                onMouseEnter={() => {
                  setShowTooltip(true);
                }}
                style={{ textDecoration: "underline" }}
              >
                <FormattedMessage id="endpoint_builder.help_texts.download_url.your_product_is_paid" />
              </span>
            </OverlayTrigger>{" "}
            <FormattedMessage id="endpoint_builder.help_texts.download_url.uncheck_allow_automatic_download" />{" "}
            <FormattedMessage
              id="endpoint_builder.help_texts.download_url.uniqueness_notice"
              values={I18nFormatters}
            />{" "}
            <FormattedMessage id="endpoint_builder.help_texts.download_url.avoid_github_main" />
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className="endpoint-form-example-container round-border-small"
        key={allowAutomaticDownload}
      >
        {exampleText}
      </div>
    </>
  );
};

export const MinBlender = ({ exampleText }) => {
  return (
    <>
      <div>
        <FormattedMessage
          id="endpoint_builder.help_texts.minimum_blender_version.please_type_in"
          values={I18nFormatters}
        />{" "}
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.we_would_suggest" />
      </div>
      <div className="endpoint-form-example-container round-border-small">
        {exampleText}
      </div>
    </>
  );
};

export const MaxBlender = ({ exampleText }) => {
  return (
    <>
      <div>
        <FormattedMessage
          id="endpoint_builder.help_texts.maximum_blender_version.if_you_are_making_an_update"
          values={I18nFormatters}
        />{" "}
        <FormattedMessage
          id="endpoint_builder.help_texts.maximum_blender_version.if_your_addon_works"
          values={I18nFormatters}
        />{" "}
      </div>
      <div className="endpoint-form-example-container round-border-small">
        {exampleText}
      </div>
    </>
  );
};

export const RelDescription = ({ exampleText }) => {
  return (
    <>
      <div>
        <FormattedMessage
          id="endpoint_builder.help_texts.release_description.inform_your_users"
          values={I18nFormatters}
        />{" "}
        <FormattedMessage
          id="endpoint_builder.help_texts.release_description.this_is_optional"
          values={I18nFormatters}
        />{" "}
        <FormattedMessage
          id="endpoint_builder.help_texts.release_description.filling_it_in"
          values={I18nFormatters}
        />{" "}
      </div>
      <div className="endpoint-form-example-container round-border-small">
        {exampleText}
      </div>
    </>
  );
};
