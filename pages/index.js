import { useEffect, useState } from "react";
import Link from "next/link";

// Bootstrap
import { Container, Nav } from "react-bootstrap";

// Components
import Header from "../components/Header";
import Navbar from "../components/Navbar";

// Translations
import IntlWrapper from "../components/IntlWrapper";

export default function Home() {
  return (
    <IntlWrapper>
      <Header title="Home" />
      <Navbar />
      <Container className="intro" style={{ marginBottom: "80vh" }}>
        <Nav as="ul" className="flex-column">
          <Nav.Item as="li">
            <Nav.Link as={Link} href="/request-support">
              Request Support
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link as={Link} href="/endpoint-builder">
              Endpoint Builder
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </IntlWrapper>
  );
}
