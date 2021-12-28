import React, { useEffect, useState } from "react";

// Bootstrap
import { Container } from "react-bootstrap";

// Components
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { DataInput, FixEndpoint } from "../components/endpoint-checker";

const EndpointChecker = ({ exampleBlenderLTSVersion, latestSPMVersion }) => {
  const [hasData, setHasData] = useState(true); // TODO: Set to false in procuction!
  const [dataIsValid, setDataIsValid] = useState(false);
  const [data, setData] = useState({
    schema_version: "super-addon-manager-version-info-1.0.0",
    versions: [{}],
  });

  const [displayComponent, setDisplayComponent] = useState(<></>);

  useEffect(() => {
    if (!hasData) {
      setDisplayComponent(
        <DataInput
          callbackFunction={(d) => {
            setData(d);
            setHasData(true);
          }}
        />
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

    setDisplayComponent(
      <>
        <p>Valid. Hurray!</p>
      </>
    );
  }, [data, hasData, dataIsValid]);

  return (
    <>
      <Header title="Endpoint JSON Checker" />
      <Navbar />
      <Container className="intro">{displayComponent}</Container>
    </>
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
