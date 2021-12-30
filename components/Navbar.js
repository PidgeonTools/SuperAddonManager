import React, { useEffect, useState } from "react";
import Link from "next/link";

// Bootstrap
import { Container, Nav, Navbar } from "react-bootstrap";

// Translations
import { getLanguage } from "../functions";
import { FormattedMessage } from "react-intl";

const SiteNavbar = () => {
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    setLanguage(getLanguage(window));
  }, []);
  return (
    <>
      <Navbar
        bg="menu"
        variant="dark"
        expand="lg"
        fixed="top"
        className="shadow"
      >
        <Container>
          <Navbar.Brand as={Link} href="/">
            <img src="/images/logo.png" alt="Home" />
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav as="ul">
              <Nav.Item as="li">
                <Nav.Link href="#ABOUT">
                  <FormattedMessage id="navbar.about" />
                </Nav.Link>
              </Nav.Item>

              <Nav.Item as="li">
                <Nav.Link href="/download">
                  <FormattedMessage id="navbar.download" />
                </Nav.Link>
              </Nav.Item>

              <Nav.Item as="li">
                <Nav.Link href={`/docs/${language}/`}>
                  <FormattedMessage id="navbar.docs" />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default SiteNavbar;
