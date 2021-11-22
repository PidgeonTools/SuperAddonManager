import React from "react";

// BOOTSTRAP
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => (
  <footer className="footer">
    {/* COMPANY INFO */}
    {/* <Container className="mt-5">
      <Row className="text-white justify-content-center mt-3 pb-3">
        <Col md={3}>
          <ul className="list-inline">
            <li>
              <a href="/legal/imprint">Imprint</a>
            </li>
            <li>
              <a href="/legal/privacy">Privacy Policy</a>
            </li>
          </ul>
        </Col>
        <Col md={3}>
          <a href="/request-support">Request Support</a>
        </Col>
        <Col md={3}>
          <a href="/endpoint-builder">Endpoint Builder</a>
        </Col>
        <Col md={3}>
          <a href="#TODO">Endpoint Schema Checker</a>
        </Col>
      </Row>
    </Container> */}
    {/* COPYRIGHT INFO */}
    {/* <div class="footer-bottom pt-5 pb-5">
      <Container>
        <Row className="text-white text-center">
          <Col>
            <div class="footer-bottom__copyright">
              &copy; Copyright 2021 Super Addon Manager | Created by{" "}
              <a href="#TODO">Blender Defender</a>
            </div>
          </Col>
        </Row>
      </Container>
    </div> */}
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
          <a href="#TODO" className="px-2">
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
