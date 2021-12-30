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

// Translations
import { FormattedMessage } from "react-intl";

export const SupportPage = ({ query, addonName, issueType }) => {
  // === Page Elements ===
  const [samUpToDate, setSamUpToDate] = useState(false);
  const [addonUpToDate, setAddonUpToDate] = useState(false);
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [internetWorks, setInternetWorks] = useState(false);

  const [issueTextBoxes, setIssueTextBoxes] = useState();

  // === Issue independent Parameters ===
  let url = new URL("https://www.ecosia.org/search");
  url.search = `?q=${addonName} Blender Addon prefer:github`;

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
  let endpointIntroText = (
    <>
      {/* To be able to check for updates, the developers of {addonName} have to
      provide a link to an online resource (the "Endpoint"), which contains
      information about new versions (if available). */}
      <FormattedMessage
        id="request_support.support_page.1OMs4Spov56B"
        values={{ addonName }}
      />
    </>
  );
  switch (issueType) {
    case ERROR_CODES.BL_INFO_VERSION_PROBLEMS:
      issueDescriptionText = (
        <>
          <FormattedMessage id="request_support.support_page.E1IJemfSNBxsPYvB3Hf" />{" "}
          <FormattedMessage id="request_support.support_page.2zhPVh" />
        </>
      );
      break;
    case ERROR_CODES.URL_INVALID:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.LdPe1V2"
            values={{ endpointIntroText }}
          />{" "}
          <FormattedMessage id="request_support.support_page.F6iScya" />{" "}
          <FormattedMessage
            id="request_support.support_page.L340OhQ"
            values={{ endpointURL }}
          />
        </>
      );
      break;
    case ERROR_CODES.INVALID_ENDPOINT:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.OGtfrsa5REX9Aycs4GJf"
            values={{ endpointIntroText }}
          />
        </>
      );
      break;
    case ERROR_CODES.ENDPOINT_INVALID_SCHEMA:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.pLiRTlAns3ysHtQPmWj"
            values={{ endpointIntroText }}
          />
        </>
      );
      break;
    case ERROR_CODES.ENDPOINT_OFFLINE:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.Ri2VdsuOOwNu3rO7aTeU"
            values={{ endpointIntroText }}
          />
        </>
      );
      break;
    case ERROR_CODES.UNKNOWN_ERROR:
      issueDescriptionText = (
        <>
          <FormattedMessage id="request_support.support_page.qlnUG" />{" "}
          <FormattedMessage id="request_support.support_page.sMtbUqHgqKsGz" />
        </>
      );
      break;
    default:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.8HhKBa3"
            values={{ addonName }}
          />{" "}
          <FormattedMessage id="request_support.support_page.gZqnkihrktzIW6He1" />{" "}
          <FormattedMessage
            id="request_support.support_page.dbIUtWj8AxVZ5"
            values={{ addonName }}
          />
        </>
      );
      break;
  }

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
            <h1>
              <FormattedMessage
                id="request_support.support_page.5GqcRfryAYt"
                values={{ addonName }}
              />
            </h1>
            <p>
              <FormattedMessage
                id="request_support.support_page.wETvq7xS4Cnfsg"
                values={{ addonName }}
              />
            </p>
          </Row>
        </Container>
      </section>

      {/* NON DEVELOPER FRIENDLY ISSUE DESCRIPTION */}
      <section className="problem-description">
        <Container>
          <Row className="mt-3 mb-3">
            <h2>
              <FormattedMessage id="request_support.support_page.YJ0pza" />
            </h2>
            <p>{issueDescriptionText}</p>
          </Row>
        </Container>
      </section>

      {/* WHAT TO DO SECTION */}
      <section className="what-todo">
        <Container>
          <Row className="mt-3 mb-3">
            {/* HEADING */}
            <h2>
              <FormattedMessage id="request_support.support_page.yhlniNuyq" />
            </h2>
            {/* TEXT */}
            <>
              {issueType === "endpoint_offline" ? (
                <>
                  <p>
                    <FormattedMessage id="request_support.support_page.nz4icA96e4VVQ0YA" />{" "}
                    <FormattedMessage id="request_support.support_page.OLKYCqs4HzF" />{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={endpointURL}
                    >
                      {endpointURL}.
                    </a>{" "}
                    <FormattedMessage id="request_support.support_page.hJ8N6fSlu82xYLzPK3T" />{" "}
                    <FormattedMessage id="request_support.support_page.Y3vD1" />{" "}
                    <FormattedMessage id="request_support.support_page.qYtpKLi" />
                  </p>
                  <p>
                    <FormattedMessage id="request_support.support_page.wVgjyw82" />
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <FormattedMessage id="request_support.support_page.rNHXMGcM" />{" "}
                    <FormattedMessage id="request_support.support_page.jvNvoyohNY" />{" "}
                    <FormattedMessage id="request_support.support_page.V4HUA7rBjjr7kCAE" />
                  </p>
                  <p>
                    <FormattedMessage id="request_support.support_page.vJQAoHLaVtS" />
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
                  <FormattedMessage id="request_support.support_page.LHooErZI2OenSfGnS" />
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
                      <FormattedMessage
                        id="request_support.support_page.QvP7uVRQqHmaNO"
                        values={{ addonName }}
                      />
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
                  <FormattedMessage id="request_support.support_page.MgQT5vzKdyKq2R" />
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
                      <FormattedMessage id="request_support.support_page.rK4KRLFHD" />
                    </label>
                  </div>
                ) : null}
              </>
            </form>

            {/* SUBMIT ISSUE */}
            <Row className="mt-3 mb-3">
              {/* HEADING */}
              <h3>
                <FormattedMessage id="request_support.support_page.ze3zxggu0Fp" />
              </h3>
              <p>
                <FormattedMessage id="request_support.support_page.vzZIpZV" />{" "}
                <a href={trackerURL} target="_blank" rel="noopener noreferrer">
                  <FormattedMessage id="request_support.support_page.JFVwEbJqbyNM4SlZxpI" />
                </a>
                <FormattedMessage id="request_support.support_page.MwK6gYi" />{" "}
                <Link href="/docs/submitting-issues">
                  <a rel="noopener noreferrer" target="_blank">
                    <FormattedMessage id="request_support.support_page.qXmsNDX4zm" />
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
