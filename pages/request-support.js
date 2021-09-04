import React from "react";
import { withRouter, useRouter } from "next/router";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { NoData, SupportPage } from "../components/request-support";

const requestSupport = withRouter((props) => {
  const query = props.router.query;

  const addonName = query.addon_name ? query.addon_name : "[Your Addon]";
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
});

export default requestSupport;
