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
        <FormattedMessage id="endpoint_builder.help_texts.version.K7itFDF" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.version.qudfuQGi8WJsXPOY" />
        </strong>
        <FormattedMessage id="endpoint_builder.help_texts.version.llf6Ax7" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.version.SOcdAep1NVi" />
        </strong>{" "}
        <FormattedMessage id="endpoint_builder.help_texts.version.LPbEqS" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.version.major_minor_patch" />
        </strong>{" "}
        <FormattedMessage id="endpoint_builder.help_texts.version.xVvFS8ZQ2ha0X" />
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
        <FormattedMessage id="endpoint_builder.help_texts.download_url.IRlgnfgj5Du7Vr" />{" "}
        {allowAutomaticDownload ? (
          <>
            <FormattedMessage id="endpoint_builder.help_texts.download_url.w8mOYtqm6dM" />{" "}
            <FormattedMessage id="endpoint_builder.help_texts.download_url.ELe3d2" />{" "}
            <OverlayTrigger
              placement="top"
              show={showTooltip}
              overlay={
                <Tooltip>
                  <FormattedMessage id="endpoint_builder.help_texts.download_url.ezjNiOYcanfb025UX8dN" />
                </Tooltip>
              }
            >
              <span
                onMouseEnter={() => {
                  setShowTooltip(true);
                }}
                style={{ textDecoration: "underline" }}
              >
                <FormattedMessage id="endpoint_builder.help_texts.download_url.6ThpyMAmfl6rrSpjK" />
              </span>
            </OverlayTrigger>
            <FormattedMessage id="endpoint_builder.help_texts.download_url.FecRvZglbZFp6" />
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
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.KxAoQ" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.know_for_sure" />
        </strong>{" "}
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.79Lc31YaS5Ex3mvnc8W9" />
        <FormattedMessage id="endpoint_builder.help_texts.minimum_blender_version.fc6Hp3mBTQXAOg5OJb" />
      </div>
      <div className="endpoint-form-example-container">{exampleText}</div>
    </>
  );
};

export const MaxBlender = ({ exampleText }) => {
  return (
    <>
      <div>
        <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.ARnHLK8Q" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.for_an_older_blender_version" />
        </strong>
        <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.PVEu0gdDpqmHjF" />{" "}
        <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.yX2gEaB" />{" "}
        <strong>
          <FormattedMessage id="endpoint_builder.help_texts.maximum_blender_version.please_leave_this_field_empty" />
        </strong>
      </div>
      <div className="endpoint-form-example-container">{exampleText}</div>
    </>
  );
};
