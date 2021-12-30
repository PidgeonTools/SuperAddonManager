import React, { useEffect } from "react";

// Bootstrap
import { Col, Container, Row } from "react-bootstrap";

// Translations
import IntlWrapper from "./IntlWrapper";
import { FormattedMessage } from "react-intl";

const Footer = () => {
  useEffect(() => {
    document.documentElement.className = "light";
  }, []);
  return (
    <IntlWrapper>
      <footer className="footer">
        <Container>
          {/* HELPFUL LINKS */}
          <Row className="text-white pt-3 pb-2">
            <Col className="footer__items">
              {/* <Col className="align-self-center footer__items"> */}
              {/* <Col className="justify-content-center d-flex"> */}
              <a href="/request-support" className="px-2">
                <FormattedMessage id="footer.request_support" />
              </a>

              <a href="/endpoint-builder" className="px-2">
                <FormattedMessage id="footer.endpoint_builder" />
              </a>

              <a href="/endpoint-checker" className="px-2">
                <FormattedMessage id="footer.endpoint_schema_checker" />
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
                <FormattedMessage id="footer.created_by" />{" "}
                <a href="#TODO">
                  <FormattedMessage id="footer.blender_defender" />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </IntlWrapper>
  );
};

export default Footer;
