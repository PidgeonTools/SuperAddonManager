import React from "react";
import Link from "next/link";

// Bootstrap
import { Container, Nav, Navbar } from "react-bootstrap";

const SiteNavbar = () => (
  <>
    <Navbar bg="menu" variant="dark" expand="lg" fixed="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <img src="/images/logo.png" alt="Home" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav as="ul">
            <Nav.Item as="li">
              <Nav.Link href="#ABOUT">About</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link href="/download">Download</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link href="/docs/en/">Docs</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>
);

export default SiteNavbar;
