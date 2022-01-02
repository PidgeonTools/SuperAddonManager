import React from "react";

// COMPONENTS
import CopyButton from "../CopyButton";

// Translations
import { FormattedMessage } from "react-intl";

export const ERROR_CODES = {
  SAM_NOT_SUPPORTED: "sam_not_supported",
  BL_INFO_VERSION_PROBLEMS: "bl_info_version_problems",
  URL_INVALID: "url_invalid",
  ENDPOINT_OFFLINE: "endpoint_offline",
  INVALID_ENDPOINT: "invalid_endpoint",
  ENDPOINT_INVALID_SCHEMA: "endpoint_invalid_schema",
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
        <div id="issue_text" className="issue_text_area">
          {title}
        </div>
      </div>

      {/* ISSUE TEXT */}
      <div>
        <FormattedMessage id="request_support.error_codes.issue_text" />
      </div>
      <div className="issue_text mb-4">
        <CopyButton text={text} {...props} disabled={disabled} />
        <div id="issue_text" className="issue_text_area">
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

export const UnknownError = ({
  addon_name = "{addon_name}",
  error_message = "{error_message}",
  ...props
}) => {
  const title = `[${addon_name}] Unknown Error`.trim();

  const text = `**Describe the bug**
An unknown error occurred with the addon ${addon_name}:

\`\`\`bash
${error_message}
\`\`\`
`;

  return <IssueTextBox text={text} title={title} {...props} />;
};
