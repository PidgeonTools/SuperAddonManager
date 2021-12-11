import React from "react";

// BOOTSTRAP
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => (
  <footer className="footer">
    <Container>
      {/* HELPFUL LINKS */}
      <Row className="text-white pt-3 pb-2">
        <Col className="footer__items">
          {/* <Col className="align-self-center footer__items"> */}
          {/* <Col className="justify-content-center d-flex"> */}
          <a href="/request-support" className="px-2">
            Request Support
          </a>
          <a href="/endpoint-builder" className="px-2">
            Endpoint Builder
          </a>
          <a href="/endpoint-checker" className="px-2">
            Endpoint Schema Checker
          </a>
        </Col>
      </Row>
      {/* COPYRIGHT */}
      <Row className="text-white pb-2">
        <Col className="footer__items">
          <div className="footer__copyright">
            &copy; Copyright 2021 Super Addon Manager
          </div>
          <div>
            Created by <a href="#TODO">Blender Defender</a>
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
