import React from "react";

// COMPONENTS
import CopyButton from "../CopyButton";

// Translations
import { FormattedMessage } from "react-intl";

export const ERROR_CODES = {
  SAM_NOT_SUPPORTED: "sam_not_supported",
  BL_INFO_VERSION_PROBLEMS: "bl_info_version_problems",
  ENDPOINT_URL_INVALID: "endpoint_url_invalid",
  ENDPOINT_OFFLINE: "endpoint_offline",
  INVALID_ENDPOINT: "invalid_endpoint",
  ENDPOINT_INVALID_SCHEMA: "endpoint_invalid_schema",
  INVALID_FILE_TYPE: "invalid_file_type",
  INVALID_DOWNLOAD_URL: "invalid_download_url",
  DOWNLOAD_URL_OFFLINE: "download_url_offline",
  NOT_AN_ADDON: "not_an_addon",
  UNKNOWN_ERROR: "unknown_error",
};

const IssueTextBox = ({
  disabled = false,
  title,
  text,
  outroText = "Thank you for having a look at this :)",
  ...props
}) => {
  text = `
${text} ${outroText}

This issue report was automatically generated by Super Addon Manager. We're doing everything we can to prevent users from spamming/duplicating issue reports and are not responsible if users abuse our tools for spamming.
`.trim();

  return (
    <>
      {/* ISSUE TITLE */}
      <div>
        <FormattedMessage id="request_support.error_codes.title" />
      </div>
      <div className="issue_text mb-4">
        <CopyButton disabled={disabled} text={title} />
        <div id="issue_text" className="issue_text_area round-border-large">
          {title}
        </div>
      </div>

      {/* ISSUE TEXT */}
      <div>
        <FormattedMessage id="request_support.error_codes.issue_text" />
      </div>
      <div className="issue_text mb-4">
        <CopyButton text={text} {...props} disabled={disabled} />
        <div id="issue_text" className="issue_text_area round-border-large">
          {text}
        </div>
      </div>
    </>
  );
};

export const SamNotSupported = ({
  addon_name = "{addon_name}",
  addon_count = "{addon_count}",
  ...props
}) => {
  const title =
    `[Super Addon Manager] Support checking ${addon_name} for updates`.trim();

  const text = `
**Is your feature request related to a problem? Please describe.**
After using Blender for a while now (including your addon), I've noticed that addon maintenance is a mess. I have ${addon_count} addons installed, and I'm not able to keep track of new versions for all of them. I'm using the Super Addon Manager by Blender Defender (https://github.com/BlenderDefender/SuperAddonManager) to do the task of updating ALL of my Addons from a SINGLE PLACE, but it relies on the developers enabling support for it.

**Describe the solution you'd like**
It would be great if you could activate support for it. Doing so is easy, 100% code-free (no risk of accidentally breaking your addon), and platform-independent. You can find a detailed description for enabling support for Super Addon Manager on their documentation: https//TODO
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const BlInfoVersionProblems = ({ ...props }) => {
  const title =
    `[Super Addon Manager] Problems with the Current Version`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'version' should be set. This parameter is not set, misspelled or contains an invalid datatype (Only integers, floats and numbers in strings can be converted to integers), so Super Addon Manager can't check for new versions.
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const UrlInvalid = ({ endpoint_url = "{endpoint_url}", ...props }) => {
  const title = `[Super Addon Manager] Invalid Endpoint URL`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'update_endpoint' should be set. This parameter is set to an invalid URL (${endpoint_url}), so Super Addon Manager can't check for new versions.
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const EndpointOffline = ({
  endpoint_url = "{endpoint_url}",
  error_message = "{error_message}",
  ...props
}) => {
  const title = `[Super Addon Manager] Endpoint URL can't be reached`.trim();

  const text = `**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The specified endpoint URL ("${endpoint_url}") seems to be offline, so Super Addon Manager can't check for new versions. This is the bare error message that I got from Python:

\`\`\`bash
${error_message}
\`\`\`
`;

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const InvalidEndpoint = ({
  endpoint_url = "{endpoint_url}",
  ...props
}) => {
  const title = `[Super Addon Manager] Invalid Endpoint`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The endpoint found under ${endpoint_url} is not in the JSON format, so Super Addon Manager can't check for new versions.
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const EndpointInvalidSchema = ({
  endpoint_url = "{endpoint_url}",
  ...props
}) => {
  const title =
    `[Super Addon Manager] Endpoint doesn't match the schema`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The endpoint found under ${endpoint_url} does not match the schema, so Super Addon Manager can't check for new versions. For more details, use our [schema checker.](TODO SCHEMA CHECKER URL)
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const InvalidFileType = ({
  addon_name = "{addon_name}",
  new_addon_version = "{new_addon_version}",
  ...props
}) => {
  const title =
    `[Super Addon Manager] Error downloading Version ${new_addon_version}: No Zip file found`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: When trying to install version ${new_addon_version}, the file that Super Addon Manager downloaded was not a Zip file. Super Addon Manager can only handle Zip files for updating addons. If you accidentaly enabled "allow_automatic_download", please disable it. Otherwise, please provide a link to the Zip file of ${addon_name}, Version ${new_addon_version}.
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const InvalidDownloadUrl = ({
  addon_name = "{addon_name}",
  new_addon_version = "{new_addon_version}",
  download_url = "{download_url}",
  ...props
}) => {
  const title =
    `[Super Addon Manager] Error downloading Version ${new_addon_version}: Invalid download URL`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: When trying to install version ${new_addon_version}, the download URL is set to an invalid URL (${download_url}). Please provide a valid download URL for ${addon_name}, Version ${new_addon_version}.
`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const DownloadUrlOffline = ({
  addon_name = "{addon_name}",
  new_addon_version = "{new_addon_version}",
  error_message = "{error_message}",
  download_url = "{download_url}",
  ...props
}) => {
  const title =
    `[Super Addon Manager] Error downloading Version ${new_addon_version}: Download URL can't be reached`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: When trying to install version ${new_addon_version}, the specified download URL ("${download_url}") seems to be offline, so Super Addon Manager can't update the addon. This is the bare error message that I got from Python:

\`\`\`bash
${error_message}
\`\`\`
`;

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const NotAnAddon = ({
  addon_name = "{addon_name}",
  new_addon_version = "{new_addon_version}",
  download_url = "{download_url}",
  ...props
}) => {
  const title =
    `[Super Addon Manager] Error downloading Version ${new_addon_version}: The downloaded file is not an addon`.trim();

  const text = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: When trying to install version ${new_addon_version}, the file downloaded from "${download_url}" does not contain a Blender addon, so Super Addon Manager can't update the addon.`.trim();

  return <IssueTextBox text={text} title={title} {...props} />;
};

export const UnknownError = ({
  addon_name = "{addon_name}",
  error_message = "{error_message}",
  traceback_context = "",
  ...props
}) => {
  const title = `[${addon_name}] ${
    traceback_context !== "" ? traceback_context : "Unknown Error"
  }`.trim();

  const text = `**Describe the bug**
An unknown error occurred with the addon ${addon_name}:

\`\`\`bash
${error_message}
\`\`\`
`;

  return <IssueTextBox text={text} title={title} {...props} />;
};
