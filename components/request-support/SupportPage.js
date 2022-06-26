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
  InvalidFileType,
  InvalidDownloadUrl,
  DownloadUrlOffline,
  NotAnAddon,
} from "./ErrorCodes";

// Translations
import { FormattedMessage } from "react-intl";
import { getI18nLink } from "../../lib/i18n/I18nFormatters";
import { getLanguage } from "../../functions/getLanguage";
import ExternalLink from "../ExternalLink";
import FormattedMessages from "../FormattedMessages";

export const SupportPage = ({ parameters }) => {
  const { addonName, issueType } = parameters;

  const [language, setLanguage] = useState("en");

  // === Page Elements ===
  const [samUpToDate, setSamUpToDate] = useState(false);
  const [addonUpToDate, setAddonUpToDate] = useState(false);
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [internetWorks, setInternetWorks] = useState(false);

  const [issueTextBoxes, setIssueTextBoxes] = useState();

  // === Update the intro text, depending on the type of issue ===
  // TODO: #97 Find a better name, make the code more readable.
  let firstLine = (
    <>
      <FormattedMessage
        id="request_support.support_page.sam_cannot_check_for_updates"
        values={{ addonName }}
      />
    </>
  );

  switch (issueType) {
    case ERROR_CODES.INVALID_FILE_TYPE:
    case ERROR_CODES.INVALID_DOWNLOAD_URL:
    case ERROR_CODES.DOWNLOAD_URL_OFFLINE:
    case ERROR_CODES.NOT_AN_ADDON:
      firstLine = (
        <>
          <FormattedMessage
            id="request_support.support_page.sam_cannot_install_update"
            values={{ addonName }}
          />
        </>
      );
      break;
    case ERROR_CODES.UNKNOWN_ERROR:
      firstLine = (
        <>
          <FormattedMessage id="request_support.support_page.there_is_an_unknown_error" />
        </>
      );
      break;
  }

  // === Update the non-developer friendly issue description. ===
  let issueDescriptionText;
  let endpointIntroText = (
    <>
      {/* To be able to check for updates, the developers of {addonName} have to
      provide a link to an online resource (the "Endpoint"), which contains
      information about new versions (if available). */}
      <FormattedMessage
        id="request_support.support_page.endpoint_needed"
        values={{ addonName }}
      />
    </>
  );
  switch (issueType) {
    case ERROR_CODES.BL_INFO_VERSION_PROBLEMS:
      issueDescriptionText = (
        <>
          <FormattedMessage id="request_support.support_page.cannot_understand_current_version" />{" "}
          <FormattedMessage id="request_support.support_page.sam_does_not_know_if_there_is_an_update" />
        </>
      );
      break;
    case ERROR_CODES.ENDPOINT_URL_INVALID:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.a_valid_url_looks_like"
            values={{ endpointIntroText }}
          />{" "}
          <FormattedMessage id="request_support.support_page.the_url_is_invalid" />{" "}
          <FormattedMessage
            id="request_support.support_page.it_looks_like_this"
            values={{ endpointURL: parameters.endpointURL }}
          />
        </>
      );
      break;
    case ERROR_CODES.INVALID_ENDPOINT:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.endpoint_has_wrong_file_format"
            values={{ endpointIntroText }}
          />
        </>
      );
      break;
    case ERROR_CODES.ENDPOINT_INVALID_SCHEMA:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.endpoint_is_incomplete"
            values={{ endpointIntroText }}
          />
        </>
      );
      break;
    case ERROR_CODES.ENDPOINT_OFFLINE:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.server_seems_offline"
            values={{ endpointIntroText }}
          />
        </>
      );
      break;
    case ERROR_CODES.INVALID_FILE_TYPE:
      issueDescriptionText = (
        <>
          <FormattedMessage id="request_support.support_page.downloaded_file_is_not_a_zip" />{" "}
          <FormattedMessage id="request_support.support_page.sam_addons_need_to_be_packed" />
        </>
      );
      break;
    case ERROR_CODES.INVALID_DOWNLOAD_URL:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.download_url_needed"
            values={{ addonName }}
          />{" "}
          <FormattedMessage id="request_support.support_page.a_valid_download_url_looks_like" />{" "}
          <FormattedMessage id="request_support.support_page.the_url_is_invalid" />{" "}
          <FormattedMessage
            id="request_support.support_page.it_looks_like_this"
            values={{ endpointURL: parameters.downloadUrl }}
          />
        </>
      );
      break;
    case ERROR_CODES.DOWNLOAD_URL_OFFLINE:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.download_url_needed"
            values={{ addonName }}
          />{" "}
          <FormattedMessage id="request_support.support_page.download_link_seems_offline" />
        </>
      );
      break;
    case ERROR_CODES.NOT_AN_ADDON:
      issueDescriptionText = (
        <>
          <FormattedMessage id="request_support.support_page.not_an_addon" />{" "}
          <FormattedMessage id="request_support.support_page.sam_can_only_install_blender_addons" />
        </>
      );
      break;
    case ERROR_CODES.UNKNOWN_ERROR:
      issueDescriptionText = (
        <>
          <FormattedMessage id="request_support.support_page.we_do_not_know" />{" "}
          <FormattedMessage id="request_support.support_page.all_that_you" />
        </>
      );
      break;

    default:
      issueDescriptionText = (
        <>
          <FormattedMessage
            id="request_support.support_page.addon_does_not_support_sam"
            values={{ addonName }}
          />{" "}
          <FormattedMessage id="request_support.support_page.developers_have_to_enable_support" />{" "}
          <FormattedMessage
            id="request_support.support_page.it_is_time_to_tell_the_developers"
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
    if (issueType == ERROR_CODES.ENDPOINT_OFFLINE) {
      let checkboxChecked = internetWorks ? checked : unchecked;
      checkedInternet = `${checkboxChecked} Checked that my internet works.`;
    }
    let checkedAddonUpdated = `${addonUpdated} ${addonName} is up to date.\n`;
    if (
      [
        ERROR_CODES.INVALID_FILE_TYPE,
        ERROR_CODES.INVALID_DOWNLOAD_URL,
        ERROR_CODES.DOWNLOAD_URL_OFFLINE,
        ERROR_CODES.NOT_AN_ADDON,
        ERROR_CODES.UNKNOWN_ERROR,
      ].includes(issueType)
    ) {
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
- OS: ${parameters.systemOS}
- Blender Version: ${parameters.systemBlenderVersion}
- Version of ${addonName}: ${parameters.systemAddonVersion}
    `.trim();

    let defaultProps = {
      disabled: !(addonUpToDate && samUpToDate && noDuplicate),
      outroText: outro,
    };

    switch (issueType) {
      case ERROR_CODES.BL_INFO_VERSION_PROBLEMS:
        setIssueTextBoxes(<BlInfoVersionProblems {...defaultProps} />);
        break;
      case ERROR_CODES.ENDPOINT_URL_INVALID:
        setIssueTextBoxes(
          <UrlInvalid {...defaultProps} endpoint_url={parameters.endpointURL} />
        );
        break;
      case ERROR_CODES.ENDPOINT_OFFLINE:
        setIssueTextBoxes(
          <EndpointOffline
            {...defaultProps}
            endpoint_url={parameters.endpointURL}
            error_message={parameters.errorMessage}
            disabled={
              !(addonUpToDate && samUpToDate && noDuplicate && internetWorks)
            }
          />
        );
        break;
      case ERROR_CODES.INVALID_ENDPOINT:
        setIssueTextBoxes(
          <InvalidEndpoint
            {...defaultProps}
            endpoint_url={parameters.endpointURL}
          />
        );
        break;
      case ERROR_CODES.ENDPOINT_INVALID_SCHEMA:
        setIssueTextBoxes(
          <EndpointInvalidSchema
            {...defaultProps}
            endpoint_url={parameters.endpointURL}
          />
        );
        break;
      case ERROR_CODES.INVALID_FILE_TYPE:
        setIssueTextBoxes(
          <InvalidFileType
            {...defaultProps}
            addon_name={addonName}
            new_addon_version={parameters.newAddonVersion}
            disabled={!(samUpToDate && noDuplicate)}
          />
        );
        break;
      case ERROR_CODES.INVALID_DOWNLOAD_URL:
        setIssueTextBoxes(
          <InvalidDownloadUrl
            {...defaultProps}
            addon_name={addonName}
            new_addon_version={parameters.newAddonVersion}
            download_url={parameters.downloadUrl}
            disabled={!(samUpToDate && noDuplicate)}
          />
        );
        break;
      case ERROR_CODES.DOWNLOAD_URL_OFFLINE:
        setIssueTextBoxes(
          <DownloadUrlOffline
            {...defaultProps}
            addon_name={addonName}
            new_addon_version={parameters.newAddonVersion}
            download_url={parameters.downloadUrl}
            error_message={parameters.errorMessage}
            disabled={!(samUpToDate && noDuplicate)}
          />
        );
        break;
      case ERROR_CODES.NOT_AN_ADDON:
        setIssueTextBoxes(
          <NotAnAddon
            {...defaultProps}
            addon_name={addonName}
            new_addon_version={parameters.newAddonVersion}
            disabled={!(samUpToDate && noDuplicate)}
          />
        );
        break;
      case ERROR_CODES.UNKNOWN_ERROR:
        setIssueTextBoxes(
          <UnknownError
            {...defaultProps}
            addon_name={addonName}
            error_message={parameters.errorMessage}
            disabled={!(samUpToDate && noDuplicate)}
          />
        );
        break;

      default:
        setIssueTextBoxes(
          <SamNotSupported
            {...defaultProps}
            addon_count={parameters.addonCount}
            addon_name={addonName}
          />
        );
        break;
    }
  }, [samUpToDate, addonUpToDate, noDuplicate, internetWorks]);

  // === Update the "What can you do"-Text ===
  let whatToDoMessages = [
    {
      id: "request_support.support_page.the_developer_has_to_fix_this_problem",
    },
    {
      id: "request_support.support_page.please_report_an_issue",
    },
    {
      id: "request_support.support_page.what_if_the_issue_has_already_been_reported",
    },
  ];

  if (issueType === ERROR_CODES.ENDPOINT_OFFLINE) {
    whatToDoMessages = [
      {
        id: "request_support.support_page.check_that_your_internet_connection_works",
      },
      {
        id: "request_support.support_page.try_to_reach_the_endpoint",
        values: {
          link: getI18nLink({
            href: parameters.endpointURL,
            target: "_blank",
          }),
          endpointURL: parameters.endpointURL,
        },
      },
      {
        id: "request_support.support_page.retry_to_check_for_updates",
      },
      {
        id: "request_support.support_page.what_if_the_url_still_cannot_be_reached",
      },
      {
        id: "request_support.support_page.what_if_the_issue_has_already_been_reported",
      },
    ];
  }

  if (issueType === ERROR_CODES.DOWNLOAD_URL_OFFLINE) {
    whatToDoMessages = [
      {
        id: "request_support.support_page.check_that_your_internet_connection_works",
      },
      {
        id: "request_support.support_page.try_to_reach_the_download_url",
        values: {
          link: getI18nLink({
            href: parameters.downloadUrl,
            target: "_blank",
          }),
          downloadUrl: parameters.downloadUrl,
        },
      },
      {
        id: "request_support.support_page.install_from_file",
      },
      {
        id: "request_support.support_page.what_if_the_url_still_cannot_be_reached",
      },
      {
        id: "request_support.support_page.what_if_the_issue_has_already_been_reported",
      },
    ];
  }

  if (issueType === ERROR_CODES.NOT_AN_ADDON) {
    whatToDoMessages = [
      {
        id: "request_support.support_page.make_sure_you_selected_the_right_file",
      },
      {
        id: "request_support.support_page.what_if_it_still_does_not_work",
      },
      {
        id: "request_support.support_page.what_if_the_issue_has_already_been_reported",
      },
    ];
  }

  if (issueType === ERROR_CODES.UNKNOWN_ERROR) {
    whatToDoMessages = [
      {
        id: "request_support.support_page.please_report_an_issue_to_us",
      },
      {
        id: "request_support.support_page.what_if_the_issue_has_already_been_reported",
      },
    ];
  }

  // Initialize the page
  useEffect(() => {
    setLanguage(getLanguage(window));
  }, []);

  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <Container>
          <Row>
            <h1>
              <FormattedMessage
                id="request_support.support_page.issue_with_your_addon"
                values={{ addonName }}
              />
            </h1>
            <p>{firstLine}</p>
          </Row>
        </Container>
      </section>

      {/* NON DEVELOPER FRIENDLY ISSUE DESCRIPTION */}
      <section className="problem-description">
        <Container>
          <Row className="mt-3 mb-3">
            <h2>
              <FormattedMessage id="request_support.support_page.what_is_the_problem" />
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
              <FormattedMessage id="request_support.support_page.what_can_you_do_to_make_it_work" />
            </h2>
            {/* TEXT */}
            <>
              <p>
                <FormattedMessages messages={whatToDoMessages} />
              </p>
              <p>
                <FormattedMessage id="request_support.support_page.you_can_use_our_automatically_generated_text" />
              </p>
            </>

            {/* CHECKLIST */}
            <form className="mb-3">
              {/* SAM UP TO DATE CHECKBOX */}
              <div className="form-check">
                <input
                  type="checkbox"
                  id="checklist_addon_manager_updated"
                  className="form-check-input sam-form-check-input"
                  onClick={() => setSamUpToDate(!samUpToDate)}
                  value={samUpToDate}
                />
                <label
                  htmlFor="checklist_addon_manager_updated"
                  className="form-checked-label"
                >
                  <FormattedMessage id="request_support.support_page.sam_is_up_to_date" />
                </label>
              </div>

              {/* ADDON UP TO DATE CHECKBOX */}
              <>
                {![
                  ERROR_CODES.INVALID_FILE_TYPE,
                  ERROR_CODES.INVALID_DOWNLOAD_URL,
                  ERROR_CODES.DOWNLOAD_URL_OFFLINE,
                  ERROR_CODES.NOT_AN_ADDON,
                  ERROR_CODES.UNKNOWN_ERROR,
                ].includes(issueType) ? (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="checklist_addon_updated"
                      className="form-check-input sam-form-check-input"
                      onClick={() => setAddonUpToDate(!addonUpToDate)}
                      value={addonUpToDate}
                    />
                    <label
                      htmlFor="checklist_addon_updated"
                      className="form-checked-label"
                    >
                      <FormattedMessage
                        id="request_support.support_page.addon_is_up_to_date"
                        values={{ addonName }}
                      />
                    </label>
                  </div>
                ) : null}
              </>

              {/* NO ISSUE DUPLICATE CHECKBOX */}
              <div className="form-check">
                <input
                  type="checkbox"
                  id="checklist_issue_reported"
                  className="form-check-input sam-form-check-input"
                  onClick={() => setNoDuplicate(!noDuplicate)}
                  value={noDuplicate}
                />
                <label
                  htmlFor="checklist_issue_reported"
                  className="form-checked-label"
                >
                  <FormattedMessage id="request_support.support_page.the_issue_hasnt_been_reported_already" />
                </label>
              </div>

              {/* INTERNET WORKS CHECKBOX */}
              <>
                {issueType === ERROR_CODES.ENDPOINT_OFFLINE ? (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="checkbox_internet_connection_checked"
                      className="form-check-input sam-form-check-input"
                      onClick={() => setInternetWorks(!internetWorks)}
                      value={internetWorks}
                    />
                    <label
                      htmlFor="checkbox_internet_connection_checked"
                      className="form-checked-label"
                    >
                      <FormattedMessage id="request_support.support_page.theres_no_problem_with_your_internet_connection" />
                    </label>
                  </div>
                ) : null}
              </>
            </form>

            {/* SUBMIT ISSUE */}
            <Row className="mt-3 mb-3">
              {/* HEADING */}
              <h3>
                <FormattedMessage id="request_support.support_page.submit_an_issue" />
              </h3>
              <p>
                <FormattedMessage
                  id="request_support.support_page.you_can_copy_the_following_text"
                  values={{
                    link: getI18nLink({
                      href: parameters.trackerURL,
                      target: "_blank",
                    }),
                  }}
                />{" "}
                <FormattedMessage id="request_support.support_page.are_you_unsure_how_to_submit_issues" />{" "}
                <Link href={`/docs/${language}/submitting-issues`} passHref>
                  <ExternalLink>
                    <FormattedMessage id="request_support.support_page.read_this_article" />
                  </ExternalLink>
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
