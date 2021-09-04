import React, { useState, useEffect } from "react";
import Link from "next/link";
import { withRouter } from "next/router";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const SupportPage = ({ query, addonName, issueType }) => {
  // === Page Elements ===
  const [samUpToDate, setSamUpToDate] = useState(false);
  const [addonUpToDate, setAddonUpToDate] = useState(false);
  const [noDuplicate, setNoDuplicate] = useState(false);
  const [internetWorks, setInternetWorks] = useState(false);

  const [copyButtonText, setCopyButtonText] = useState("Copy");
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
    query.addon_count >= threshold ? query.addon_count : "multiple";

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
    endpointURL = query.endpoint_url ? query.endpoint_url : "#undefined";
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
  Super Addon Manager can't understand the current version, so it can't compare it with the latest version. This means, that Super Addon Manager doesn't know, if there's a new version available and can't display any updates.
                  `;
      break;
    case "url_invalid":
      issueDescriptionText = `
  ${endpointIntroText} A valid URL looks like this: "https://www.example.com". The URL that the developer provided seems to be invalid. It looks like this: "${endpointURL}".
                  `;
      break;
    case "invalid_endpoint":
      issueDescriptionText = `
  ${endpointIntroText} This Endpoint is in a file format that Super Addon Manager can't understand, so Super Addon Manager can't check for updates.
                  `;
      break;
    case "endpoint_invalid_schema":
      issueDescriptionText = `
  ${endpointIntroText} This Endpoint is missing required information, so Super Addon Manager can't check for updates.
                  `;
      break;
    case "endpoint_offline":
      issueDescriptionText = `
  ${endpointIntroText} The server of this Endpoint seems to be offline, because it doesn't respond.
                  `;
      break;
    default:
      issueDescriptionText = `
  Your Addon ${addonName} doesn't support Super Addon Manager and can't be updated automatically. For Super Addon Manager to work, it's necessary that developers enable support for it. The developers of ${addonName} probably don't even know about Super Addon Manager yet, so it's time to tell them.
                  `;
      break;
  }
  issueDescriptionText = issueDescriptionText.trim();

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
      checkedInternet = `${checkboxChecked} Checked, that my Internet works.`;
    }

    // Intro text, that is the same for all issues
    const intro = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation:
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
In the bl_info dictionary, a parameter called 'version' should be set. This parameter is not set, misspelled, or contains an invalid datatype (Only integers, floats, and numbers in strings can be converted to integers), so Super Addon Manager can't check for new versions. More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting
${outro}
                    `;
        break;
      case "url_invalid":
        text = `
${intro}
In the bl_info dictionary, a parameter called 'endpoint_url' should be set. This parameter is set to an invalid URL ("${endpointURL}"), so Super Addon Manager can't check for new versions.
${outro}
                    `;
        break;
      case "invalid_endpoint":
        text = `
${intro}
The endpoint found under ${endpointURL} is not in the JSON format, so Super Addon Manager can't check for new versions.
${outro}
                    `;
        break;
      case "endpoint_invalid_schema":
        text = `
${intro}
The endpoint found under ${endpointURL} does not match the schema, so Super Addon Manager can't check for new versions. For more details, use our [schema checker.](SCHEMA CHECKER URL)
${outro}
                    `;
        break;
      case "endpoint_offline":
        text = `
${intro}
The specified Endpoint URL ("${endpointURL}") seems to be offline, so Super Addon Manager can't check for new versions. This is the bare error message that I get from Python: ${errorMessage}
${outro}
                    `;
        break;
      default:
        text = `
**Is your feature request related to a problem? Please describe.**
After using Blender for a while now (including your addon ${addonName}), I've noticed that addon maintenance is a mess. I have ${addonCount} addons installed, and I'm not able to keep track of new versions for all of them. I'm using the Super Addon Manager by Blender Defender (https://github.com/BlenderDefender/SuperAddonManager) to do the task of updating ALL of my Addons from a SINGLE PLACE, but it relies on addon developers enabling support for it.

**Describe the solution you'd like**
It would be great if you could activate support for it. Doing so is easy, 100% risk-free (no code added to your addon), and platform-independent. You can find a detailed description for enabling support for Super Addon Manager in the documentation: TODO: WIKI URL
${outro}
                    `;
        break;
    }
    setIssueTextArea(text.trim());
    return;
  }, [samUpToDate, addonUpToDate, noDuplicate, internetWorks]);

  // === Copy the generated issue text ===
  const copyIssueText = () => {
    navigator.clipboard.writeText(issueTextArea);

    let restore = copyButtonText;
    setCopyButtonText("Copied!");

    setTimeout(() => {
      setCopyButtonText(restore);
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
            {issueType == "endpoint_offline" ? (
              <p>
                Check, that your internet connection works. Then, try to reach
                the Endpoint found at{" "}
                <a target="_blank" rel="noopener noreferrer" href={endpointURL}>
                  {endpointURL}
                </a>
                . If you can reach the page, retry to check for updates. If it
                still doesn't work, or your browser also tells you, that this
                page can't be reached, it's the developers responsibility to fix
                this problem. Please report an issue to the developer. You can
                use our automatically generated text if you want to, but you
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

              {issueType == "endpoint_offline" ? (
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
              ) : (
                ""
              )}
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
                . Unsure, how to submit issues on different Platforms?{" "}
                <Link href="/docs/submitting-issues">
                  <a rel="noopener noreferrer" target="_blank">
                    Read this article on submitting good issue reports!
                  </a>
                </Link>
              </p>

              {/* TODO: Add issue title here */}

              {/* ISSUE TEXT */}
              <div className="issue_text">
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary copy_issue"
                    onClick={copyIssueText}
                  >
                    {copyButtonText}
                  </button>
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

const NoData = () => {
  const LATEST_BLENDER_VERSION = "2.93.4";
  const LATEST_SPM_VERSION = "1.3.1";
  const issueTypes = [
    "sam_not_supported",
    "bl_info_version_problems",
    "url_invalid",
    "endpoint_offline",
    "invalid_endpoint",
    "endpoint_invalid_schema",
  ];
  const operatingSystems = ["Windows", "Linux", "macOS", "Other"];
  const baseURL = "http://localhost:3000/request-support?";

  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState(false);
  const [redirectURI, setRedirectURI] = useState(baseURL);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.id]: e.target.value.trim(),
    });
  };

  const calcRedirectURI = () => {
    setRedirectURI(() => {
      return (
        baseURL +
        Object.keys(formData)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`
          )
          .join("&")
      );
    });
    console;
    return;
  };

  if (submitStatus)
    return (
      <>
        {/* INTRO SECTION */}
        <section className="intro">
          <div className="container">
            <div className="row">
              <h1>Request support for your addon</h1>
              <p>
                We have processed your data and we've set up a page for you,
                that explains, what you can do about your issue.
              </p>
              <a className="btn btn-outline-primary" href={redirectURI}>
                Take me there!
              </a>
            </div>
          </div>
        </section>
      </>
    );
  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <div className="container">
          <div className="row">
            <h1>Request support for your addon</h1>
            <p>
              Fill in the Form with all necessary data to get support, if Super
              Addon Manager doesn't work with your addon.
            </p>
          </div>
        </div>
      </section>

      {/* REQUEST SUPPORT */}
      <section className="request-support-form">
        <div className="container">
          <form
            className="row"
            onSubmit={() => {
              setSubmitStatus(true);
              calcRedirectURI();
            }}
          >
            {/* ISSUE TYPE */}
            <div className="col-6 form-floating mb-3 required">
              <select
                className="form-select"
                id="issue_type"
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an Option
                </option>
                {issueTypes.map((el) => (
                  <option key={el} value={el}>
                    {el}
                  </option>
                ))}
              </select>
              <label htmlFor="issue_type" className="form-label">
                Issue Type / Error Code
              </label>
            </div>
            {/* ADDON NAME */}
            <div className="col-6 form-floating mb-3 required">
              <input
                type="text"
                id="addon_name"
                className="form-control"
                placeholder="Super Project Manager"
                onChange={handleChange}
                required
              />
              <label htmlFor="addon_name">Addon Name</label>
            </div>

            {/* === SYSTEM INFORMATION === */}
            {/* OS */}
            <div className="col-6 form-floating mb-3 required">
              <select
                className="form-select"
                id="os_name"
                defaultValue=""
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an Option
                </option>
                {operatingSystems.map((el) => (
                  <option key={el} value={el}>
                    {el}
                  </option>
                ))}
              </select>
              <label htmlFor="os_name">Operating System</label>
            </div>
            {/* BLENDER VERSION */}
            <div className="col-3 form-floating mb-3 required">
              <input
                type="text"
                id="blender_version"
                placeholder="*"
                pattern="\d+\.\d+\.\d+"
                className="form-control"
                onChange={handleChange}
                required
              />
              <label htmlFor="blender_version">
                Blender Version (e.g. {LATEST_BLENDER_VERSION})
              </label>
            </div>
            {/* ADDON VERSION */}
            <div className="col-3 form-floating mb-3 required">
              <input
                type="text"
                id="addon_version"
                placeholder="*"
                pattern="\d+\.\d+\.\d+"
                className="form-control"
                onChange={handleChange}
                required
              />
              <label htmlFor="addon_version">
                Addon Version (e.g. {LATEST_SPM_VERSION})
              </label>
            </div>

            {/* === ISSUE DEPENDENT PARAMETERS === */}
            {/* ADDON COUNT */}
            {formData.issue_type == "sam_not_supported" ? (
              <div className="form-floating mb-3 required">
                <input
                  type="number"
                  id="addon_count"
                  className="form-control"
                  placeholder="42"
                  onChange={handleChange}
                  required
                />
                <label for="addon_count">
                  Estimated Number of installed Addons
                </label>
              </div>
            ) : (
              ""
            )}
            {/* ENDPOINT URL */}
            {[
              "url_invalid",
              "invalid_endpoint",
              "endpoint_invalid_schema",
              "endpoint_offline",
            ].includes(formData.issue_type) ? (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="endpoint_url"
                  className="form-control"
                  onChange={handleChange}
                  placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                />
                <label htmlFor="endpoint_url">Endpoint URL</label>
              </div>
            ) : (
              ""
            )}
            {/* ERROR MESSAGE */}
            {formData.issue_type == "endpoint_offline" ? (
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Error Message"
                  id="error_message"
                ></textarea>
                <label for="error_message">Error Message</label>
              </div>
            ) : (
              ""
            )}
            {/* TRACKER URL */}
            <div className="form-floating mb-3">
              <input
                type="text"
                id="tracker_url"
                className="form-control"
                onChange={handleChange}
                placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                pattern="(https?://)?.+\..+"
              />
              <label htmlFor="tracker_url">Tracker URL</label>
            </div>

            <div className="d-grid col-12">
              <button className="btn btn-primary" type="submit">
                Request Support
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

const requestSupport = withRouter((props) => {
  const query = props.router.query;

  const addonName = query.addon_name ? query.addon_name : "[Your Addon]";
  const issueType = query.issue_type;

  return (
    <>
      <Header title={addonName + " - Error checking for updates"} />
      {/* NAVBAR SECTION */}
      <Navbar />
      {issueType ? (
        <SupportPage
          query={query}
          addonName={addonName}
          issueType={issueType}
        />
      ) : (
        <NoData />
      )}
    </>
  );
});

export default requestSupport;
