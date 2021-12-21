import React from "react";
import { Container, Row } from "react-bootstrap";

// Schema
import SCHEMA from "../components/endpoint-checker/Schema";
const Ajv = require("ajv");

// Components
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const EndpointChecker = () => {
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

export default EndpointChecker;
