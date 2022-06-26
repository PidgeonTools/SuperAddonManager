import React, { useEffect, useState } from "react";

// Bootstrap
import { Container, Row } from "react-bootstrap";

// Components
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import {
  DataInput,
  FixEndpoint,
  DownloadFixedFile,
} from "../components/endpoint-checker";

// Translations
import IntlWrapper from "../components/IntlWrapper";
import { FormattedMessage } from "react-intl";

const EndpointChecker = ({ exampleBlenderLTSVersion, latestSPMVersion }) => {
  const [hasData, setHasData] = useState(false);
  const [dataIsValid, setDataIsValid] = useState(false);

  const [data, setData] = useState({
    schema_version: "super-addon-manager-version-info-1.0.0",
    versions: [{}],
  });
  const [filename, setFilename] = useState("SuperAddonManager-Endpoint.json");

  const [displayComponent, setDisplayComponent] = useState(<></>);

  // Change the display component depending on the data.
  useEffect(() => {
    if (!hasData) {
      setDisplayComponent(
        <>
          {/* INTRO INFORMATION */}
          <Row>
            <h1>
              <FormattedMessage id="endpoint_checker.data_input.title" />
            </h1>
            <p>
              <FormattedMessage id="endpoint_checker.data_input.description_text" />
            </p>
          </Row>
          {/* INPUT */}
          <DataInput
            callbackFunction={(d, filename) => {
              setData(d);
              setFilename(filename);
              setHasData(true);
            }}
          />
        </>
      );
      return;
    }

    if (!dataIsValid) {
      setDisplayComponent(
        <FixEndpoint
          inputData={data}
          callbackFunction={(d) => {
            setData(d), setDataIsValid(true);
          }}
          latestSPMVersion={latestSPMVersion}
          exampleBlenderLTSVersion={exampleBlenderLTSVersion}
        />
      );
      return;
    }

    setDisplayComponent(<DownloadFixedFile data={data} filename={filename} />);
  }, [data, hasData, dataIsValid]);

  return (
    <IntlWrapper>
      <Header title="Endpoint JSON Checker" />
      <Navbar />
      <Container id="main" className="intro" style={{ marginBottom: "24rem" }}>
        {displayComponent}
      </Container>
    </IntlWrapper>
  );
};

export const getStaticProps = () => {
  const data = require("../data/request-support.json");
  return {
    props: {
      exampleBlenderLTSVersion: data.exampleBlenderLTSVersion,
      latestSPMVersion: data.latestSPMVersion,
    },
  };
};

export default EndpointChecker;
