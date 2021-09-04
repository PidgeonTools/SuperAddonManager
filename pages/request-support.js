import React from "react";
import { useRouter } from "next/router";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { NoData, SupportPage } from "../components/request-support";

const RequestSupport = () => {
  const { query } = useRouter();

  const addonName = query.addon_name ?? "[Your Addon]";
  const issueType = query.issue_type;

  return (
    <>
      <Header title={addonName + " - Error checking for updates"} />
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
};

export default RequestSupport;
