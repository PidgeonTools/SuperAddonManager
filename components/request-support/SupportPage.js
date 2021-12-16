import React, { useState, useEffect } from "react";
import Link from "next/link";

// Bootstrap
import { Container, Row } from "react-bootstrap";

// Components
import {
  ERROR_CODES,
  BlInfoVersionProblems,
  SamNotSupported,
  UrlInvalid,
  EndpointOffline,
  InvalidEndpoint,
  EndpointInvalidSchema,
  UnknownError,
} from "./ErrorCodes";

export const SupportPage = ({ query, addonName, issueType }) => {
  // === Page Elements ===
  const [samUpToDate, setSamUpToDate] = useState(false);
  const [addonUpToDate, setAddonUpToDate] = useState(false);
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [internetWorks, setInternetWorks] = useState(false);

  const [issueTextBoxes, setIssueTextBoxes] = useState();

  // === Issue independent Parameters ===
  let url = new URL("https://www.ecosia.org/search");
  url.search = `?q=${addonName} Blender Addon`;

  let trackerURL = url.toString();
  if (query.tracker_url) {
    let protocolPrefix = trackerURL.match("https?://") ? "" : "https://";
    trackerURL = protocolPrefix + query.tracker_url;
  }

  if (issueType === ERROR_CODES.UNKNOWN_ERROR) {
    trackerURL = `https://github.com/BlenderDefender/SuperAddonManager/issues/new?assignees=BlenderDefender&labels=bug&title=[${addonName}]+Unknown+Error`;
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
  if (["unknown_error", "endpoint_offline"].includes(issueType)) {
    errorMessage = query.error_message;
  }

  // === Update the non-developer friendly issue description. ===
  let issueDescriptionText;
  let endpointIntroText = `
    To be able to check for updates, the developers of ${addonName} have to provide a link to an online resource (the "Endpoint"), which contains information about new versions (if available).
  `.trim();
  switch (issueType) {
    case ERROR_CODES.BL_INFO_VERSION_PROBLEMS:
      issueDescriptionText = `
  Super Addon Manager can't understand the current version, so it can't compare it with the latest version. This means that Super Addon Manager doesn't know if there's a new version available, and can't display any updates.
      `;
      break;
    case ERROR_CODES.URL_INVALID:
      issueDescriptionText = `
  ${endpointIntroText} A valid URL looks like this: "https://www.example.com". The URL that the developer provided seems to be invalid. It looks like this: "${endpointURL}".
      `;
      break;
    case ERROR_CODES.INVALID_ENDPOINT:
      issueDescriptionText = `
  ${endpointIntroText} This endpoint is in a file format that Super Addon Manager can't understand, so Super Addon Manager can't check for updates.
      `;
      break;
    case ERROR_CODES.ENDPOINT_INVALID_SCHEMA:
      issueDescriptionText = `
  ${endpointIntroText} This endpoint is missing required information, so Super Addon Manager can't check for updates.
      `;
      break;
    case ERROR_CODES.ENDPOINT_OFFLINE:
      issueDescriptionText = `
  ${endpointIntroText} The server of this endpoint seems to be offline, because it didn't respond.
      `;
      break;
    case ERROR_CODES.UNKNOWN_ERROR:
      issueDescriptionText = `
We don't know what is causing the issue. All that you can do is reporting the issue to us.
      `;
      break;
    default:
      issueDescriptionText = `
  Your Addon ${addonName} doesn't support Super Addon Manager and can't be updated automatically. For Super Addon Manager to work, it's necessary that developers enable support for it. The developers of ${addonName} probably don't even know about Super Addon Manager yet, so it's time to tell them.
      `;
      break;
  }
  issueDescriptionText = issueDescriptionText.trim();

  // === Update the issue text boxes ===
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
    let checkedAddonUpdated = `${addonUpdated} ${addonName} is up to date.\n`;
    if (issueType == "unknown_error") {
      checkedAddonUpdated = "";
    }

    // Outro text, that is the same for all issues
    const outro = `
Thank you for having a look at this :)

**Steps I have taken**
${addonManagerUpdated} Super Addon Manager is up to date.
${checkedAddonUpdated}${issueReported} Checked that this issue hasn't been reported already.
${checkedInternet}

**System Information**
- OS: ${systemOS}
- Blender Version: ${systemBlenderVersion}
- Version of ${addonName}: ${systemAddonVersion}
    `.trim();

    let defaultProps = {
      disabled: !(addonUpToDate && samUpToDate && noDuplicate),
      outroText: outro,
    };

    switch (issueType) {
      case ERROR_CODES.BL_INFO_VERSION_PROBLEMS:
        setIssueTextBoxes(<BlInfoVersionProblems {...defaultProps} />);
        break;
      case ERROR_CODES.URL_INVALID:
        setIssueTextBoxes(
          <UrlInvalid {...defaultProps} endpoint_url={endpointURL} />
        );
        break;
      case ERROR_CODES.ENDPOINT_OFFLINE:
        setIssueTextBoxes(
          <EndpointOffline
            {...defaultProps}
            endpoint_url={endpointURL}
            error_message={errorMessage}
            disabled={
              !(addonUpToDate && samUpToDate && noDuplicate && internetWorks)
            }
          />
        );
        break;
      case ERROR_CODES.INVALID_ENDPOINT:
        setIssueTextBoxes(
          <InvalidEndpoint {...defaultProps} endpoint_url={endpointURL} />
        );
        break;
      case ERROR_CODES.ENDPOINT_INVALID_SCHEMA:
        setIssueTextBoxes(
          <EndpointInvalidSchema {...defaultProps} endpoint_url={endpointURL} />
        );
        break;
      case ERROR_CODES.UNKNOWN_ERROR:
        setIssueTextBoxes(
          <UnknownError
            {...defaultProps}
            addon_name={addonName}
            error_message={errorMessage}
            disabled={!(samUpToDate && noDuplicate)}
          />
        );
        break;

      default:
        setIssueTextBoxes(
          <SamNotSupported
            {...defaultProps}
            addon_count={addonCount}
            addon_name={addonName}
          />
        );
        break;
    }
  }, [samUpToDate, addonUpToDate, noDuplicate, internetWorks]);


  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <Container>
          <Row>
            <h1>Issue with your addon {addonName}</h1>
            <p>
              Super Addon Manager can't check for updates for your addon{" "}
              {addonName}.
            </p>
          </Row>
        </Container>
      </section>

      {/* NON DEVELOPER FRIENDLY ISSUE DESCRIPTION */}
      <section className="problem-description">
        <Container>
          <Row className="mt-3 mb-3">
            <h2>What's the problem?</h2>
            <p>{issueDescriptionText}</p>
          </Row>
        </Container>
      </section>

      {/* WHAT TO DO SECTION */}
      <section className="what-todo">
        <Container>
          <Row className="mt-3 mb-3">
            {/* HEADING */}
            <h2>What can you do to make it work?</h2>
            {/* TEXT */}
            <>
              {issueType === "endpoint_offline" ? (
                <>
                  <p>
                    Check, that your internet connection works. Then, try to
                    reach the Endpoint found at{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={endpointURL}
                    >
                      {endpointURL}
                    </a>
                    . If you can reach the page, retry to check for updates. If
                    it still doesn't work, or your browser also tells you that
                    this page can't be reached, it's the developer's
                    responsibility to fix this problem. If the issue has already
                    been reported, you can upvote it (for example, with an
                    emoji) if the site provides such a feature.
                  </p>
                  <p>
                    You can use our automatically generated text if you want to,
                    but you should first check a few things:
                  </p>
                </>
              ) : (
                <>
                  <p>
                    It looks like the developer has to fix this problem. Please
                    report an issue to the developer. If the issue has already
                    been reported, you can upvote it (for example, with an
                    emoji) if the site provides such a feature.
                  </p>
                  <p>
                    You can use our automatically generated text if you want to,
                    but you should first check a few things:
                  </p>
                </>
              )}
            </>

            {/* CHECKLIST */}
            <form className="mb-3">
              {/* SAM UP TO DATE CHECKBOX */}
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

              {/* ADDON UP TO DATE CHECKBOX */}
              <>
                {issueType === ERROR_CODES.UNKNOWN_ERROR ? null : (
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
                )}
              </>

              {/* NO ISSUE DUPLICATE CHECKBOX */}
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

              {/* INTERNET WORKS CHECKBOX */}
              <>
                {issueType === ERROR_CODES.ENDPOINT_OFFLINE ? (
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
              </>
            </form>

            {/* SUBMIT ISSUE */}
            <Row className="mt-3 mb-3">
              {/* HEADING */}
              <h3>Submit an issue</h3>
              <p>
                Once you have checked the items above, you can copy the
                following text into a new issue on the{" "}
                <a href={trackerURL} target="_blank" rel="noopener noreferrer">
                  developer's website
                </a>
                . Unsure how to submit issues on different platforms?{" "}
                <Link href="/docs/submitting-issues">
                  <a rel="noopener noreferrer" target="_blank">
                    Read this article on submitting good issue reports!
                  </a>
                </Link>
              </p>

              {/* AUTOMATICALLY GENERATED TEXTS */}
              {issueTextBoxes}
            </Row>
          </Row>
        </Container>
      </section>
    </>
  );
};
