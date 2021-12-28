import React from "react";

// Bootstrap
import { FloatingLabel, Form } from "react-bootstrap";

export const INPUTID = {
  VERSION: "version",
  MINIMUM_BLENDER_VERSION: "minimum_blender_version",
  API_BREAKING_BLENDER_VERSION: "api_breaking_blender_version",
  DOWNLOAD_URL: "download_url",
};

export const AddonVersion = ({ addonVersion, latestSPMVersion, ...props }) => {
  return (
    <>
      <FloatingLabel controlId={INPUTID.VERSION} label={`Addon Version`}>
        <Form.Control
          type="text"
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
      <FloatingLabel controlId={INPUTID.DOWNLOAD_URL} label="Download URL">
        <Form.Control
          type="text"
          value={downloadUrl}
          placeholder="https://github.com/BlenderDefender/SuperEasyAnalytics/releases/download/1_2_1/SuperEasyAnalytics.zip"
          pattern={
            allowAutomaticDownload
              ? "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*\\.zip"
              : "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*"
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
        label={`Minimum Blender Version`}
      >
        <Form.Control
          type="text"
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
        label="Newer Blender version that has compatibility issues"
      >
        <Form.Control
          type="text"
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
          className="form-check-input"
          accessKey="C"
          {...props}
          checked={showApiBreakingBlenderVersion}
        />
        <label
          htmlFor="update_for_older_blender_version"
          className="form-checked-label"
        >
          This addon has compatibility issues with a newer Blender version.
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
          className="form-check-input"
          accessKey="L"
          {...props}
          checked={allowAutomaticDownload}
        />
        <label
          htmlFor="allow_automatic_download"
          className="form-checked-label"
        >
          Allow Automatic Download
        </label>
      </div>
    </>
  );
};

export const COMPONENTS = {
  allow_automatic_download: AllowAutomaticDownload,
  version: AddonVersion,
  minimum_blender_version: MinimumBlenderVersion,
  api_breaking_blender_version: ApiBreakingBlenderVersion,
  download_url: DownloadUrl,
};
