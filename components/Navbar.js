import React from "react";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";

const SiteNavbar = () => (
  <>
    <Navbar bg="menu" variant="dark" expand="lg" fixed="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <img src="./images/logo.png" alt="Home" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            <Nav.Link href="#ABOUT">About</Nav.Link>
            <Nav.Link href="/docs">Docs</Nav.Link>
            <Nav.Link href="#GET">Get Super Addon Manager</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>
);

export default SiteNavbar;
