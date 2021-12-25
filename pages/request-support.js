import React from "react";
import { useRouter } from "next/router";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { NoData, SupportPage } from "../components/request-support";

const RequestSupport = ({ exampleBlenderVersion, latestSPMVersion }) => {
  const { query } = useRouter();

  const addonName = query.addon_name ?? "[Your Addon]";
  const issueType = query.issue_type;

  return (
    <>
      <Header
        title={addonName + " - Error checking for updates"}
        description="Do you have problems updating an addon with Super Addon Manager? We've got you covered! Request support for your favorite addons in a few clicks."
      />
      <Navbar />
      {issueType ? (
        <SupportPage
          query={query}
          addonName={addonName}
          issueType={issueType}
        />
      ) : (
        <NoData
          exampleBlenderVersion={exampleBlenderVersion}
          latestSPMVersion={latestSPMVersion}
        />
      )}
    </>
  );
};

export const getStaticProps = () => {
  const data = require("../data/request-support.json");
  return {
    props: {
      exampleBlenderVersion: data.exampleBlenderVersion,
      latestSPMVersion: data.latestSPMVersion,
    },
  };
};

export default RequestSupport;
