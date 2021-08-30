// This script should be loaded with the "defer" attribute.
(function initialise() {
  const urlParameters = new URLSearchParams(window.location.search);
  let addonName = urlParameters.get("addon_name");
  let issueType = urlParameters.get("issue_type");
  let trackerURL = urlParameters.get("tracker_url");

  // === System Information ===
  let systemOS = urlParameters.get("os_name");
  let systemBlenderVersion = urlParameters.get("blender_version");
  let systemAddonVersion = urlParameters.get("addon_version");

  if (!addonName) {
    console.warn("Could not find addon name in search parameters");
    addonName = "[Your addon]";
  }

  if (!issueType) {
    issueType = "sam_not_supported";
  }

  // === Issue Specific Variables ===
  let addonCount;
  let endpointURL;
  let errorMessage;
  if (issueType == "sam_not_supported") {
    let threshold = 15;
    addonCount =
      urlParameters.get("addon_count") >= threshold
        ? urlParameters.get("addon_count")
        : "multiple";
  }
  if (
    [
      "url_invalid",
      "invalid_endpoint",
      "endpoint_invalid_schema",
      "endpoint_offline",
    ].includes(issueType)
  ) {
    endpointURL = urlParameters.get("endpoint_url");
  }
  if (issueType == "endpoint_offline") {
    errorMessage = urlParameters.get("error_message");
  }

  // === Page elements ===
  const nonDevIssueDescription = document.getElementById(
    "non-dev-friendly-issue-description"
  );

  const whatToDo = document.getElementById("what-to-do");

  const checklistForm = document.getElementById("checklist_form");
  const checklistAddonManagerUpdatedCheckbox = document.getElementById(
    "checklist_addon_manager_updated"
  );
  const checklistAddonUpdatedCheckbox = document.getElementById(
    "checklist_addon_updated"
  );
  const checklistIssueReportedCheckbox = document.getElementById(
    "checklist_issue_reported"
  );
  const checklistInternetChecked = document.getElementById(
    "internet_connection_checked"
  );
  const checklistInternetCheckedCheckbox = document.getElementById(
    "checkbox_internet_connection_checked"
  );

  const issuePage = document.getElementById("issue_page");

  const issueTextArea = document.getElementById("issue_text");
  const copyIssueButton = document.getElementById("copy_issue");
  const copyIssueLabel = copyIssueButton.innerText;

  // === Functions ===
  function setupPage() {
    // === Update Title ===
    document.title = `${addonName} - Error checking for updates`;

    // === Update addon name ===
    const addonNameElements = document.getElementsByClassName("addon_name");

    for (addonNameElement of addonNameElements) {
      addonNameElement.innerText = addonName;
    }

    // === Add tracker URL ===
    if (trackerURL) {
      const issuePageLink = document.createElement("a");
      issuePageLink.target = "_blank"; // open in a new tab/window
      issuePageLink.rel = "noopener noreferrer"; // prevent malicious code accessing back to this tab
      issuePageLink.href = trackerURL; // safely assign the href
      issuePageLink.innerText = issuePage.innerText; // copy the original text from the <span>

      issuePage.parentNode.replaceChild(issuePageLink, issuePage);
    }

    // === Show the hidden Form Parameter and add a sentence to "What can you do to make it work" ===
    if (issueType == "endpoint_offline") {
      checklistInternetChecked.classList.toggle("hide", false);
      whatToDo.innerHTML = `
Check, that your internet connection works. Then, try to reach the Endpoint found at <a target="_blank" rel="noopener noreferrer" href="#" id="endpoint_offline_url">#</a>. If you can reach the page, retry to check for updates. If it still doesn't work, or your browser also tells you, that this page can't be reached, it's the developers responsibility to fix this problem. Please report an issue to the developer. You can use our automatically generated text if you want to, but you should first check a few things:
            `.trim();
      let endpointOfflineUrl = document.getElementById("endpoint_offline_url");
      endpointOfflineUrl.innerText = endpointURL;
      endpointOfflineUrl.href = endpointURL;
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
    nonDevIssueDescription.innerText = issueDescriptionText.trim();

    // Change the issue text
    updateIssueText();
  }

  // Generates the issue text
  function updateIssueText() {
    const unchecked = "- [ ]";
    const checked = "- [x]";

    const addonManagerUpdated = checklistAddonManagerUpdatedCheckbox.checked
      ? checked
      : unchecked;
    const addonUpdated = checklistAddonUpdatedCheckbox.checked
      ? checked
      : unchecked;
    const issueReported = checklistIssueReportedCheckbox.checked
      ? checked
      : unchecked;
    let checkedInternet = "";
    if (issueType == "endpoint_offline") {
      let checkboxChecked = checklistInternetCheckedCheckbox.checked
        ? checked
        : unchecked;
      checkedInternet = `${checkboxChecked} Checked, that my Internet works.`;
    }

    const intro = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation:
        `.trim();
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
It would be great if you could activate support for it. Doing so is easy, 100% risk-free (no code added to your addon), and platform-independent. You can find a detailed description for enabling support for Super Addon Manager in the documentation: https://github.com/BlenderDefender/SuperAddonManager/wiki/implementation/

${outro}
                `;
        break;
    }
    issueTextArea.value = text.trim();
  }

  function listenForChanges() {
    checklistForm.addEventListener("submit", function (event) {
      // prevent form submitting
      event.preventDefault();
    });
    checklistForm.addEventListener("change", function () {
      // update issue text when any form control changes
      updateIssueText();
    });

    copyIssueButton.addEventListener("click", function (event) {
      event.preventDefault();

      // select all text
      issueTextArea.select();
      // copy to clipboard
      document.execCommand("copy");

      // notify user for 3 seconds
      copyIssueButton.innerText = "Copied!";
      setTimeout(function () {
        // restore button text
        copyIssueButton.innerText = copyIssueLabel;
      }, 3 * 1000);
    });
  }

  // === Bootstrap the page ===
  setupPage();

  listenForChanges();
})();
