import React, { useState } from "react";

// Bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Translations
import { FormattedMessage } from "react-intl";

export const Version = ({ exampleText }) => {
  return (
    <>
      <div className="endpoint-form-example-container">{exampleText}</div>
      <div>
        <FormattedMessage id="endpoint_builder.help_texts.version.please_note_that" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.version.shouldnt_consist_of" />
        </strong>
        <FormattedMessage id="endpoint_builder.help_texts.version.because_any_version_number" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.version.might_lead_to_unexpected" />
        </strong>{" "}
        <FormattedMessage id="endpoint_builder.help_texts.version.when_checking_for_updates" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.version.major_minor_patch" />
        </strong>{" "}
        <FormattedMessage id="endpoint_builder.help_texts.version.versioning_scheme_that_blender" />
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
            </OverlayTrigger>
            <FormattedMessage id="endpoint_builder.help_texts.download_url.uncheck_allow_automatic_download" />
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className="endpoint-form-example-container"
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
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.please_type_in" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.know_for_sure" />
        </strong>{" "}
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.that_your_addon_is_compatible" />
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.we_would_suggest" />
      </div>
      <div className="endpoint-form-example-container">{exampleText}</div>
    </>
  );
};

export const MaxBlender = ({ exampleText }) => {
  return (
    <>
      <div>
        <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.if_you_are_making_an_update" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.for_an_older_blender_version" />
        </strong>
        <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.and_you_know_for_sure" />{" "}
        <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.if_your_addon_works" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.please_leave_this_field_empty" />
        </strong>
      </div>
      <div className="endpoint-form-example-container">{exampleText}</div>
    </>
  );
};
