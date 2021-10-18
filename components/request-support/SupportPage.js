import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const SupportPage = ({ query, addonName, issueType }) => {
  // === Page Elements ===
  const [samUpToDate, setSamUpToDate] = useState(false);
  const [addonUpToDate, setAddonUpToDate] = useState(false);
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [internetWorks, setInternetWorks] = useState(false);

  const [textCopied, setTextCopied] = useState(false);
  const [titleCopied, setTitleCopied] = useState(false);
  const [issueTextArea, setIssueTextArea] = useState("");

  // === Issue independent Parameters ===
  let trackerURL = query.tracker_url;
  if (trackerURL && !trackerURL.match("https?://")) {
    trackerURL = "https://" + trackerURL;
  }

  // === System Information ===
  let systemOS = query.os_name;
  let systemBlenderVersion = query.blender_version;
  let systemAddonVersion = query.addon_version;

  // === Issue Specific Variables ===
  // Addon Count
  let threshold = 15;
  let addonCount =
    query.addon_count < threshold ? "multiple" : query.addon_count;

  // Endpoint URL
  let endpointURL;
  if (
    [
      "url_invalid",
      "invalid_endpoint",
      "endpoint_invalid_schema",
      "endpoint_offline",
    ].includes(issueType)
  ) {
    endpointURL = query.endpoint_url ?? "#undefined";
  }

  // Error Message
  let errorMessage;
  if (issueType == "endpoint_offline") {
    errorMessage = query.error_message;
  }

  // === Update the non-developer friendly issue description. ===
  let issueDescriptionText;
  let endpointIntroText = `
    To be able to check for updates, the developers of ${addonName} have to provide a link to an online resource (the "Endpoint"), which contains information about new versions (if available).
  `.trim();
  switch (issueType) {
    case "bl_info_version_problems":
      issueDescriptionText = `
  Super Addon Manager can't understand the current version, so it can't compare it with the latest version. This means that Super Addon Manager doesn't know if there's a new version available, and can't display any updates.
      `;
      break;
    case "url_invalid":
      issueDescriptionText = `
  ${endpointIntroText} A valid URL looks like this: "https://www.example.com". The URL that the developer provided seems to be invalid. It looks like this: "${endpointURL}".
      `;
      break;
    case "invalid_endpoint":
      issueDescriptionText = `
  ${endpointIntroText} This endpoint is in a file format that Super Addon Manager can't understand, so Super Addon Manager can't check for updates.
      `;
      break;
    case "endpoint_invalid_schema":
      issueDescriptionText = `
  ${endpointIntroText} This endpoint is missing required information, so Super Addon Manager can't check for updates.
      `;
      break;
    case "endpoint_offline":
      issueDescriptionText = `
  ${endpointIntroText} The server of this endpoint seems to be offline, because it didn't respond.
      `;
      break;
    default:
      issueDescriptionText = `
  Your Addon ${addonName} doesn't support Super Addon Manager and can't be updated automatically. For Super Addon Manager to work, it's necessary that developers enable support for it. The developers of ${addonName} probably don't even know about Super Addon Manager yet, so it's time to tell them.
      `;
      break;
  }
  issueDescriptionText = issueDescriptionText.trim();

  // === Update the issue title Area ===
  let issueTitleArea;
  switch (issueType) {
    case "bl_info_version_problems":
      issueTitleArea = `Super Addon Manager: Problems with the Current Version`;
      break;
    case "url_invalid":
      issueTitleArea = `Super Addon Manager: Invalid Endpoint URL`;
      break;
    case "invalid_endpoint":
      issueTitleArea = `Super Addon Manager: Invalid Endpoint`;
      break;
    case "endpoint_invalid_schema":
      issueTitleArea = `Super Addon Manager: Endpoint doesn't match the schema`;
      break;
    case "endpoint_offline":
      issueTitleArea = `Super Addon Manager: Endpoint URL can't be reached`;
      break;
    default:
      issueTitleArea = `Super Addon Manager Support for ${addonName}`;
      break;
  }

  // === Update the issue text Area ===
  useEffect(() => {
    const checked = "- [x]";
    const unchecked = "- [ ]";

    const addonManagerUpdated = samUpToDate ? checked : unchecked;
    const addonUpdated = addonUpToDate ? checked : unchecked;
    const issueReported = noDuplicate ? checked : unchecked;
    let checkedInternet = "";
    if (issueType == "endpoint_offline") {
      let checkboxChecked = internetWorks ? checked : unchecked;
      checkedInternet = `${checkboxChecked} Checked that my internet works.`;
    }

    // Intro text, that is the same for all issues
    const intro = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the implementation:
    `.trim();
    // Outro text, that is the same for all issues
    const outro = `
Thank you for having a look at this :)

**Steps I have taken**
${addonManagerUpdated} Super Addon Manager is up to date.
${addonUpdated} ${addonName} is up to date.
${issueReported} Checked that this issue hasn't been reported already.
${checkedInternet}

**System Information**
- OS: ${systemOS}
- Blender Version: ${systemBlenderVersion}
- Version of ${addonName}: ${systemAddonVersion}

This issue report was automatically generated by Super Addon Manager.
    `.trim();

    let text;
    switch (issueType) {
      case "bl_info_version_problems":
        text = `
${intro}
In the bl_info dictionary, a parameter called \`version\` should be set. This parameter is not set, misspelled, or contains an invalid datatype (Only integers, floats, and numbers in strings can be converted to integers), so Super Addon Manager can't check for new versions. More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting
${outro}
        `;
        break;
      case "url_invalid":
        text = `
${intro}
In the bl_info dictionary, a parameter called \`endpoint_url\` should be set. This parameter is set to an invalid URL ("${endpointURL}"), so Super Addon Manager can't check for new versions.
${outro}
        `;
        break;
      case "invalid_endpoint":
        text = `
${intro}
The endpoint found under ${endpointURL} did not respond with JSON data, so Super Addon Manager can't check for new versions.
${outro}
        `;
        break;
      case "endpoint_invalid_schema":
        text = `
${intro}
The endpoint found under ${endpointURL} does not match the schema, so Super Addon Manager can't check for new versions. For more details, use our [schema checker](TODO: SCHEMA CHECKER URL).
${outro}
        `;
        break;
      case "endpoint_offline":
        text = `
${intro}
The specified endpoint URL ("${endpointURL}") seems to be offline, so Super Addon Manager can't check for new versions. This is the bare error message that I got from Python: ${errorMessage}
${outro}
        `;
        break;
      default:
        text = `
**Is your feature request related to a problem? Please describe.**
After using Blender for a while now (including your addon ${addonName}), I've noticed that addon maintenance is a mess. I have ${addonCount} addons installed, and I'm not able to keep track of new versions for all of them. I'm using the Super Addon Manager by Blender Defender (https://github.com/BlenderDefender/SuperAddonManager) to do the task of updating ALL of my Addons from a SINGLE PLACE, but it relies on addon developers enabling support for it.

**Describe the solution you'd like**
It would be great if you could activate support for it. Doing so is easy, 100% risk-free (no code added to your addon), and platform-independent. You can find a detailed description for [enabling support for Super Addon Manager](TODO: WIKI URL) in the documentation.
${outro}
        `;
        break;
    }
    setIssueTextArea(text.trim());
    return;
  }, [samUpToDate, addonUpToDate, noDuplicate, internetWorks]);

  // === Show the user the generated issue text has been copied ===
  const onCopyIssueText = (callback) => {
    callback(true);

    setTimeout(() => {
      callback(false);
    }, 3 * 1000);
  };

  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <div className="container">
          <div className="row">
            <h1 className="">Issue with your addon {addonName}</h1>
            <p>
              Super Addon Manager can't check for updates for your addon{" "}
              {addonName}.
            </p>
          </div>
        </div>
      </section>

      {/* NON DEVELOPER FRIENDLY ISSUE DESCRIPTION */}
      <section className="problem-description">
        <div className="container">
          <div className="row mt-3 mb-3">
            <h2>What's the problem?</h2>
            <p>{issueDescriptionText}</p>
          </div>
        </div>
      </section>

      {/* WHAT TO DO SECTION */}
      <section className="what-todo">
        <div className="container">
          <div className="row mt-3 mb-3">
            {/* HEADING */}
            <h2>What can you do to make it work?</h2>
            {/* TEXT */}
            {issueType === "endpoint_offline" ? (
              <p>
                Check, that your internet connection works. Then, try to reach
                the Endpoint found at{" "}
                <a target="_blank" rel="noopener noreferrer" href={endpointURL}>
                  {endpointURL}
                </a>
                . If you can reach the page, retry to check for updates. If it
                still doesn't work, or your browser also tells you that this
                page can't be reached, it's the developer's responsibility to
                fix this problem. Please report an issue to the developer. You
                can use our automatically generated text if you want to, but you
                should first check a few things:
              </p>
            ) : (
              <p>
                It looks like the developer has to fix this problem. Please
                report an issue to the developer. You can use our automatically
                generated text if you want to, but you should first check a few
                things:
              </p>
            )}

            {/* CHECKLIST */}
            <form className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="checklist_addon_manager_updated"
                  className="form-check-input"
                  onClick={() => setSamUpToDate(!samUpToDate)}
                  value={samUpToDate}
                />
                <label
                  htmlFor="checklist_addon_manager_updated"
                  className="form-checked-label"
                >
                  Super Addon Manager is up to date.
                </label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="checklist_addon_updated"
                  className="form-check-input"
                  onClick={() => setAddonUpToDate(!addonUpToDate)}
                  value={addonUpToDate}
                />
                <label
                  htmlFor="checklist_addon_updated"
                  className="form-checked-label"
                >
                  {addonName} is up to date.
                </label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="checklist_issue_reported"
                  className="form-check-input"
                  onClick={() => setNoDuplicate(!noDuplicate)}
                  value={noDuplicate}
                />
                <label
                  htmlFor="checklist_issue_reported"
                  className="form-checked-label"
                >
                  The issue hasn't been reported already.
                </label>
              </div>

              {issueType === "endpoint_offline" ? (
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="checkbox_internet_connection_checked"
                    className="form-check-input"
                    onClick={() => setInternetWorks(!internetWorks)}
                    value={internetWorks}
                  />
                  <label
                    htmlFor="checkbox_internet_connection_checked"
                    className="form-checked-label"
                  >
                    There's no problem with your internet connection.
                  </label>
                </div>
              ) : null}
            </form>

            {/* SUBMIT ISSUE */}
            <div className="row mt-3 mb-3">
              {/* HEADING */}
              <h3>Submit an issue</h3>
              <p>
                Once you have checked the items above, you can copy the
                following text into a new issue on the{" "}
                {trackerURL ? (
                  <a
                    href={trackerURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    developer's website
                  </a>
                ) : (
                  "developer's website"
                )}
                . Unsure how to submit issues on different platforms?{" "}
                <Link href="/docs/submitting-issues">
                  <a rel="noopener noreferrer" target="_blank">
                    Read this article on submitting good issue reports!
                  </a>
                </Link>
              </p>

              {/* ISSUE TITLE */}
              <div>Title:</div>
              <div className="issue_text mb-4">
                <div className="d-flex justify-content-end">
                  <CopyToClipboard
                    text={issueTitleArea}
                    onCopy={() => onCopyIssueText(setTitleCopied)}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary copy_issue"
                      disabled={!(addonUpToDate && samUpToDate && noDuplicate)}
                    >
                      {titleCopied ? "Copied!" : "Copy"}
                    </button>
                  </CopyToClipboard>
                </div>
                <div id="issue_text" className="issue_text_area">
                  {issueTitleArea}
                </div>
              </div>

              {/* ISSUE TEXT */}
              <div>Issue Text:</div>
              <div className="issue_text mb-4">
                <div className="d-flex justify-content-end">
                  <CopyToClipboard
                    text={issueTextArea}
                    onCopy={() => onCopyIssueText(setTextCopied)}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary copy_issue"
                      disabled={!(addonUpToDate && samUpToDate && noDuplicate)}
                    >
                      {textCopied ? "Copied!" : "Copy"}
                    </button>
                  </CopyToClipboard>
                </div>
                <div id="issue_text" className="issue_text_area">
                  {issueTextArea}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};