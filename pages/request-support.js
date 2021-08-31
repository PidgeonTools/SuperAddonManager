import React from "react";
import { withRouter } from "next/router";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const SupportPage = ({ query, addonName, issueType }) => {
  // === Issue independent Parameters ===
  const trackerURL = query.tracker_url;

  // === System Information ===
  let systemOS = query.os_name;
  let systemBlenderVersion = query.blender_version;
  let systemAddonVersion = query.addon_version;

  // === Issue Specific Variables ===
  let addonCount;
  let endpointURL;
  let errorMessage;

  // Addon Count
  if (issueType == "sam_not_supported") {
    let threshold = 15;
    addonCount =
      query.addon_count >= threshold ? query.addon_count : "multiple";
  }

  // Endpoint URL
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
            <form id="checklist_form" className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="checklist_addon_manager_updated"
                  className="form-check-input"
                />
                <label
                  for="checklist_addon_manager_updated"
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
                />
                <label
                  for="checklist_addon_updated"
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
                />
                <label
                  for="checklist_issue_reported"
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
                  />
                  <label
                    for="checkbox_internet_connection_checked"
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
                <a
                  href="https://www.github.com/BlenderDefender/SuperAddonManager"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Read this article on submitting good issue reports!
                </a>
              </p>

              {/* ISSUE TEXT */}
              <div className="issue_text">
                <div className="issue_label_row">
                  <button
                    type="button"
                    id="copy_issue"
                    className="btn btn-outline-primary copy_issue"
                  >
                    Copy text
                  </button>
                </div>
                <textarea id="issue_text" className="issue_text_area" readonly>
                  **Is your feature request related to a problem? Please
                  describe.** After using Blender for a while now (including
                  your addon), I've noticed that addon maintenance is a mess. I
                  have multiple addons installed, and I'm not able to keep track
                  of new versions for all of them. I'm using the Super Addon
                  Manager by Blender Defender
                  (https://github.com/BlenderDefender/SuperAddonManager) to do
                  the task of updating ALL of my Addons from a SINGLE PLACE, but
                  it relies on addon developers enabling support for it.
                  **Describe the solution you'd like** It would be great if you
                  could activate support for it. Doing so is easy, 100%
                  risk-free (no code added to your addon), and
                  platform-independent. You can find a detailed description for
                  enabling support for Super Addon Manager in the documentation:
                  https://github.com/BlenderDefender/SuperAddonManager/wiki/implementation/
                  **Steps I have taken** - [ ] Super Addon Manager is up to
                  date. - [ ] Your addon is up to date. - [ ] Checked that this
                  issue hasn't been reported already. This issue report was
                  automatically generated by Super Addon Manager.
                </textarea>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const NoData = () => {
  return (
    <>
      <div className="mt-5 pt-5">No issue Type selected!</div>
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
