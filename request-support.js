// This script should be loaded with the "defer" attribute.
(function initialise() {
    const urlParameters = new URLSearchParams(window.location.search);
    let addonName = urlParameters.get("addon_name");
    let issueType = urlParameters.get("issue_type");
    let trackerURL = urlParameters.get("tracker_url");

    // === System Information ===
    let systemOS = urlParameters.get("os_name");
    let systemBlenderVersion = urlParameters.get("blender_version")
    let systemAddonVersion = urlParameters.get("addon_version")

    if (!addonName) {
        console.warn("Could not find addon name in search parameters");
        addonName = "[Your addon]";
    }

    if (!issueType){
        issueType = "sam_not_supported"
    }

    // === Issue Specific Variables ===
    let addonCount;
    let endpointURL;
    let errorMessage;
    if (issueType == "sam_not_supported"){
        let threshold = 15
        addonCount = urlParameters.get("addon_count") >= threshold ? urlParameters.get("addon_count") : "multiple";
    }
    if (["url_invalid", "invalid_endpoint", "endpoint_invalid_schema", "endpoint_offline"].includes(issueType)){
        endpointURL = urlParameters.get("endpoint_url");
    }
    if (issueType == "endpoint_offline") {
        errorMessage = urlParameters.get("issue_text")
    }

    // === Page elements ===
    const issuePage = document.getElementById("issue_page")
    const checklistForm = document.getElementById("checklist_form");
    const checklistAddonManagerUpdatedCheckbox = document.getElementById("checklist_addon_manager_updated");
    const checklistAddonUpdatedCheckbox = document.getElementById("checklist_addon_updated");
    const checklistIssueReportedCheckbox = document.getElementById("checklist_issue_reported");

    const issueTextArea = document.getElementById("issue_text");
    const copyIssueButton = document.getElementById("copy_issue");


    // === Functions ===
    // Update the title of the page
    function updateTitle() {
        document.title = `${addonName} - Error checking for updates`;
    }

    // Add the name of the Addon into the page
    function updateAddonName() {
        const addonNameElements = document.getElementsByClassName("addon_name");

        for (addonNameElement of addonNameElements) {
            addonNameElement.innerHTML = addonName;
        }
    }

    function addFormParameter() {
        if (issueType == "endpoint_offline"){
            // TODO: Codestyle!
            // Create a new checkbox.
            const checklistInternetConnectionCheckedCheckbox = document.createElement("input");
            checklistInternetConnectionCheckedCheckbox.type = "checkbox";
            checklistInternetConnectionCheckedCheckbox.id = "checkbox_internet_connection_checked";

            checklistForm.appendChild(checklistInternetConnectionCheckedCheckbox);

            // Create a label for the newly created checkbox.
            const checklistInternetConnectionCheckedLabel = document.createElement("label");
            checklistInternetConnectionCheckedLabel.setAttribute("for", "checkbox_internet_connection_checked");
            checklistInternetConnectionCheckedLabel.innerHTML = "There's no problem with your internet connection.";

            checklistForm.appendChild(checklistInternetConnectionCheckedLabel);

            // Create a line break.
            checklistForm.appendChild(document.createElement("br"));


        }
    }

    // Change the elements inside the body tag
    function updateBody() {
        if (trackerURL) {
            issuePage.innerHTML = `<a href="${trackerURL}">developer's website.</a>`;
        }

        updateAddonName();
        addFormParameter();

    }

    // Generates the issue text
    function updateIssueText() {
        const unchecked = "- [ ]";
        const checked = "- [x]";

        const addonManagerUpdated = checklistAddonManagerUpdatedCheckbox.checked ? checked : unchecked;
        const addonUpdated = checklistAddonUpdatedCheckbox.checked ? checked : unchecked;
        const issueReported = checklistIssueReportedCheckbox.checked ? checked : unchecked;
        let checkedInternet =  "";
        if (issueType == "endpoint_offline"){  // TODO: Codestyle.
            let checkboxChecked = document.getElementById("checkbox_internet_connection_checked").checked ? checked : unchecked;
            checkedInternet = `${checkboxChecked} Checked, that my Internet works.`
        }

        const intro = `
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation:
        `;
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
            // TODO: Rewrite error codes FIRST!
            // TODO: Add all other cases
            case "bl_info_version_problems":
                text = `
${intro}

In the bl_info dictionary, a parameter called 'version' should be set. This parameter is not set, misspelled or contains an invalid datatype (Only integers, floats and numbers in strings can be converted to integers), so Super Addon Manager can't check for new versions. More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting

${outro}`
                break;
            case "url_invalid":
                text = `
${intro}

In the bl_info dictionary, a parameter called 'update_endpoint' should be set. This parameter is set to an invalid URL ("${endpointURL}"), so Super Addon Manager can't check for new versions.

${outro}
`
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

${outro}`;
                break;
        }
        issueTextArea.value = text.trim();
    }

    function listenForChanges() {
        checklistForm.addEventListener("submit", function(event) {
            // prevent form submitting
            event.preventDefault();
        });
        checklistForm.addEventListener("change", function() {
            // update issue text when any form control changes
            updateIssueText();
        });

        copyIssueButton.addEventListener("click", function(event) {
            event.preventDefault();

            // select all text
            issueTextArea.select();
            // copy to clipboard
            document.execCommand("copy");

            // notify user for 3 seconds
            copyIssueButton.innerText = "Copied!";
            setTimeout(function() {
                // restore button text
                copyIssueButton.innerText = "Copy";
            }, 3 * 1000);
        });
    }


    // === Bootstrap the page ===
    updateTitle();
    updateBody();
    updateIssueText();

    listenForChanges();
})();
