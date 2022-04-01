import React from "react";

// Bootstrap
import { FloatingLabel, Form } from "react-bootstrap";

// Translations
import { FormattedMessage } from "react-intl";

export const INPUTID = {
  VERSION: "version",
  DOWNLOAD_URL: "download_url",
  MINIMUM_BLENDER_VERSION: "minimum_blender_version",
  API_BREAKING_BLENDER_VERSION: "api_breaking_blender_version",
  RELEASE_DESCRIPTION: "release_description",
};

export const AddonVersion = ({ addonVersion, latestSPMVersion, ...props }) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.VERSION}
        label={<FormattedMessage id="endpoint_builder.addon_version" />}
      >
        <Form.Control
          type="text"
          className="sam-form-control"
          value={addonVersion}
          placeholder={latestSPMVersion}
          pattern="(\d+\.?){0,2}\d+"
          accessKey="A"
          {...props}
        />
      </FloatingLabel>
    </>
  );
};

export const DownloadUrl = ({
  downloadUrl,
  allowAutomaticDownload,
  ...props
}) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.DOWNLOAD_URL}
        label={<FormattedMessage id="endpoint_builder.download_url" />}
      >
        <Form.Control
          type="text"
          className="sam-form-control"
          value={downloadUrl}
          placeholder="https://github.com/BlenderDefender/SuperEasyAnalytics/releases/download/1_2_1/SuperEasyAnalytics.zip"
          pattern={
            allowAutomaticDownload
              ? "(https:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*\\.zip"
              : "(https:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*"
          }
          accessKey="D"
          {...props}
        />
      </FloatingLabel>
    </>
  );
};

export const MinimumBlenderVersion = ({
  minimumBlenderVersion,
  exampleBlenderLTSVersion,
  ...props
}) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.MINIMUM_BLENDER_VERSION}
        label={
          <FormattedMessage id="endpoint_builder.minimum_blender_version" />
        }
      >
        <Form.Control
          type="text"
          className="sam-form-control"
          value={minimumBlenderVersion}
          placeholder={exampleBlenderLTSVersion}
          pattern="(\d+\.){1,2}\d+"
          accessKey="M"
          {...props}
        />
      </FloatingLabel>
    </>
  );
};

export const ApiBreakingBlenderVersion = ({
  apiBreakingBlenderVersion,
  exampleBlenderLTSVersion,
  ...props
}) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.API_BREAKING_BLENDER_VERSION}
        label={
          <FormattedMessage id="endpoint_builder.api_breaking_blender_version" />
        }
      >
        <Form.Control
          type="text"
          className="sam-form-control"
          value={apiBreakingBlenderVersion}
          placeholder={exampleBlenderLTSVersion}
          pattern="(\d+\.){1,2}\d+"
          accessKey="B"
          {...props}
        />
      </FloatingLabel>
    </>
  );
};

export const ShowApiBreakingBlenderVersion = ({
  showApiBreakingBlenderVersion,
  ...props
}) => {
  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          id="update_for_older_blender_version"
          className="form-check-input sam-form-check-input"
          accessKey="C"
          {...props}
          checked={showApiBreakingBlenderVersion}
        />
        <label
          htmlFor="update_for_older_blender_version"
          className="form-checked-label"
        >
          <FormattedMessage id="endpoint_builder.has_compatibility_issues" />
        </label>
      </div>
    </>
  );
};

export const AllowAutomaticDownload = ({
  allowAutomaticDownload,
  ...props
}) => {
  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          id="allow_automatic_download"
          className="form-check-input sam-form-check-input"
          accessKey="L"
          {...props}
          checked={allowAutomaticDownload}
        />
        <label
          htmlFor="allow_automatic_download"
          className="form-checked-label"
        >
          <FormattedMessage id="endpoint_builder.allow_automatic_download" />
        </label>
      </div>
    </>
  );
};

export const ReleaseDescription = ({ releaseDescription, ...props }) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.RELEASE_DESCRIPTION}
        label={<FormattedMessage id="endpoint_builder.release_description" />}
      >
        <Form.Control
          as="textarea"
          className="sam-form-control"
          value={releaseDescription}
          placeholder="Example Release Notes: Feature 1; Feature 2; Feature 3"
          accessKey="R"
          style={{ height: "8rem" }}
          {...props}
        />
      </FloatingLabel>
    </>
  );
};

export const COMPONENTS = {
  allow_automatic_download: AllowAutomaticDownload,
  version: AddonVersion,
  minimum_blender_version: MinimumBlenderVersion,
  api_breaking_blender_version: ApiBreakingBlenderVersion,
  show_api_breaking_blender_version: ShowApiBreakingBlenderVersion,
  download_url: DownloadUrl,
  release_description: ReleaseDescription,
};
