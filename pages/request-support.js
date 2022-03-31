import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { NoData, SupportPage } from "../components/request-support";

// Translations
import IntlWrapper from "../components/IntlWrapper";

// Error Codes
import { ERROR_CODES } from "../components/request-support/ErrorCodes";

const getQueryParameters = (query) => {
  const addonName = query.addon_name ?? "[Your Addon]";

  let defaultParameters = {
    success: false,
    addonName: addonName,
  };

  if (!query.issue_type) {
    return defaultParameters;
  }

  /*
   * Set the minimum number of installed addons.
   * If less addons are installed, the page defaults to "multiple"
   */
  let threshold = 15;

  // Default to Ecosia search.
  let defaultUrl = new URL("https://www.ecosia.org/search");
  defaultUrl.search = `?q=${addonName} Blender Addon prefer:github`;

  let parameters = {
    success: true,
    issueType: query.issue_type,
    addonName: query.addon_name ?? "[Your Addon]",
    trackerURL: defaultUrl.toString(),
    systemOS: query.os_name,
    systemBlenderVersion: query.blender_version,
    systemAddonVersion: query.addon_version,
    newAddonVersion: query.new_addon_version,
    addonCount:
      query.addon_count < threshold ? "multiple" : String(query.addon_count),
    downloadUrl: query.download_url ?? "#undefined",
  };

  if (query.tracker_url) {
    let protocolPrefix = query.tracker_url.match("https?://") ? "" : "https://";
    parameters.trackerURL = protocolPrefix + query.tracker_url;
  }

  if (parameters.issueType === ERROR_CODES.UNKNOWN_ERROR) {
    parameters.trackerURL = `https://github.com/BlenderDefender/SuperAddonManager/issues/new?assignees=BlenderDefender&labels=bug&title=[${addonName}]+Unknown+Error`;
  }

  // Endpoint URL
  // if (
  //   [
  //     ERROR_CODES.ENDPOINT_URL_INVALID,
  //     ERROR_CODES.INVALID_ENDPOINT,
  //     ERROR_CODES.ENDPOINT_INVALID_SCHEMA,
  //     ERROR_CODES.ENDPOINT_OFFLINE,
  //   ].includes(issueType)
  // ) {
  parameters.endpointURL = query.endpoint_url ?? "#undefined";
  // }

  // Error Message
  // if (
  //   [ERROR_CODES.ENDPOINT_OFFLINE, ERROR_CODES.UNKNOWN_ERROR].includes(
  //     issueType
  //   )
  // ) {
  parameters.errorMessage = query.error_message;
  // }

  return parameters;
};

const RequestSupport = ({
  exampleBlenderVersion,
  latestSPMVersion,
  nextSPMVersion,
}) => {
  const parameters = getQueryParameters(useRouter().query);

  return (
    <IntlWrapper>
      <Header
        title={parameters.addonName + " - Error checking for updates"}
        description="Do you have problems updating an addon with Super Addon Manager? We've got you covered! Request support for your favorite addons in a few clicks."
      />
      <Navbar />
      <section id="main">
        {parameters.success ? (
          <SupportPage parameters={parameters} />
        ) : (
          <NoData
            exampleBlenderVersion={exampleBlenderVersion}
            latestSPMVersion={latestSPMVersion}
            nextSPMVersion={nextSPMVersion}
          />
        )}
      </section>
    </IntlWrapper>
  );
};

export const getStaticProps = () => {
  const data = require("../data/request-support.json");
  return {
    props: {
      exampleBlenderVersion: data.exampleBlenderVersion,
      latestSPMVersion: data.latestSPMVersion,
      nextSPMVersion: data.nextSPMVersion,
    },
  };
};

export default RequestSupport;
