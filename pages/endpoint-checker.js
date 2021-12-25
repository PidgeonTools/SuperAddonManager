import React, { useEffect } from "react";
import { Container, Row } from "react-bootstrap";

// Schema
import SCHEMA from "../components/endpoint-checker/Schema";
import { COMPONENTS } from "../components/endpoint-builder/EndpointBuilderInputs";
const Ajv = require("ajv");
const ajv = new Ajv();

// Components
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const EndpointChecker = ({ exampleBlenderLTSVersion, latestSPMVersion }) => {
  useEffect(() => {
    const validate = ajv.compile(SCHEMA);
  }, []);
  return (
    <>
      <Header title="Endpoint Checker" />
      <Navbar />
      <Container className="intro">
        <Row>
          <h1>Check your Endpoint JSON file for issues</h1>
        </Row>
      </Container>
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
