import React from "react";
import Link from "next/link";

// Bootstrap
import { Container } from "react-bootstrap";

// Components
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import InputsLayout from "../../components/endpoint-builder/InputsLayout";

// Functions
import { downloadJSONFile } from "../../functions";

// Translations
import { FormattedMessage, useIntl } from "react-intl";
import IntlWrapper from "../../components/IntlWrapper";

const EndpointBuilderPage = ({
  exampleBlenderLTSVersion,
  latestSPMVersion,
}) => {
  const intl = useIntl();

  const downloadFile = (currentVersion) => {
    // Make a local copy of the data and add the current version to it.
    let downloadData = {
      schema_version: "super-addon-manager-version-info-1.0.0",
      versions: [currentVersion],
    };

    // console.log(downloadData);

    downloadJSONFile(document, downloadData, "SuperAddonManager-Endpoint.json");
  };

  return (
    <IntlWrapper>
      <Header
        title={intl.formatMessage({ id: "endpoint_builder.title" })}
        description="You are a developer and want to support automatic addon updates with Super Addon Manager? Use this tool to generate/update a valid Endpoint in less than a minute!"
      />
      <Navbar />

      {/* INTRO */}
      <Container id="main" className="intro">
        <h1>
          <FormattedMessage id="endpoint_builder.title" />
        </h1>
      </Container>

      {/* ENDPOINT BUILDER */}
      <section className="form" style={{ marginBottom: "50vh" }}>
        <Container>
          <InputsLayout
            latestSPMVersion={latestSPMVersion}
            exampleBlenderLTSVersion={exampleBlenderLTSVersion}
            callbackFunction={downloadFile}
          />
          <div className="text-small pt-1">
            Already generated an endpoint?{" "}
            <Link href={"/endpoint-builder/update"}>
              <a className="no-underline">Click here to update it.</a>
            </Link>
          </div>
        </Container>
      </section>
    </IntlWrapper>
  );
};

export const getStaticProps = () => {
  const data = require("../../data/request-support.json");
  return {
    props: {
      exampleBlenderLTSVersion: data.exampleBlenderLTSVersion,
      latestSPMVersion: data.latestSPMVersion,
    },
  };
};

export default EndpointBuilderPage;
