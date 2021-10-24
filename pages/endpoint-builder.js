import React from "react";

// Bootstrap
import { Container } from "react-bootstrap";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const EndpointBuilderPage = () => {
  return (
    <>
      <Header title="Endpoint Builder" />
      <Navbar />

      <Container className="intro">
        <h1>Endpoint Builder</h1>

        <p>TODO</p>
      </Container>
    </>
  );
};

export default EndpointBuilderPage;
