import React from "react";

// Bootstrap
import { FloatingLabel, Form } from "react-bootstrap";

export const INPUTID = {
  VERSION: "version",
  MINIMUM_BLENDER_VERSION: "minimum_blender_version",
  API_BREAKING_BLENDER_VERSION: "api_breaking_blender_version",
  DOWNLOAD_URL: "download_url",
};

export const AddonVersion = ({
  addonVersion,
  latestSPMVersion,
  onChange,
  onFocus,
}) => {
  return (
    <>
      <FloatingLabel controlId={INPUTID.VERSION} label={`Addon Version`}>
        <Form.Control
          type="text"
          required
          value={addonVersion}
          placeholder={latestSPMVersion}
          pattern="(\d+\.?){0,2}\d+"
          onChange={onChange}
          onFocus={onFocus}
          autoFocus
        />
      </FloatingLabel>
    </>
  );
};

export const DownloadUrl = ({
  downloadUrl,
  allowAutomaticDownload,
  onChange,
  onFocus,
}) => {
  return (
    <>
      <FloatingLabel controlId={INPUTID.DOWNLOAD_URL} label="Download URL">
        <Form.Control
          type="text"
          required
          value={downloadUrl}
          placeholder="https://github.com/BlenderDefender/SuperEasyAnalytics/releases/download/1_2_1/SuperEasyAnalytics.zip"
          pattern={
            allowAutomaticDownload
              ? "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*\\.zip"
              : "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*"
          }
          onChange={onChange}
          onFocus={onFocus}
        />
      </FloatingLabel>
    </>
  );
};

export const MinimumBlenderVersion = ({
  minimumBlenderVersion,
  exampleBlenderLTSVersion,
  onChange,
  onFocus,
}) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.MINIMUM_BLENDER_VERSION}
        label={`Minimum Blender Version`}
      >
        <Form.Control
          type="text"
          required
          value={minimumBlenderVersion}
          placeholder={exampleBlenderLTSVersion}
          pattern="(\d+\.?){1,2}\d+"
          onChange={onChange}
          onFocus={onFocus}
        />
      </FloatingLabel>
    </>
  );
};

export const ApiBreakingBlenderVersion = ({
  apiBreakingBlenderVersion,
  exampleBlenderLTSVersion,
  onChange,
  onFocus,
}) => {
  return (
    <>
      <FloatingLabel
        controlId={INPUTID.API_BREAKING_BLENDER_VERSION}
        label="Newer Blender version that has compatibility issues"
      >
        <Form.Control
          type="text"
          required
          value={apiBreakingBlenderVersion}
          placeholder={exampleBlenderLTSVersion}
          pattern="(\d+\.?){1,2}\d+"
          onChange={onChange}
          onFocus={onFocus}
        />
      </FloatingLabel>
    </>
  );
};

export const ShowApiBreakingBlenderVersion = ({
  showApiBreakingBlenderVersion,
  onChange,
}) => {
  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          id="update_for_older_blender_version"
          className="form-check-input"
          onChange={onChange}
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
  onChange,
}) => {
  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          id="allow_automatic_download"
          className="form-check-input"
          onChange={onChange}
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
