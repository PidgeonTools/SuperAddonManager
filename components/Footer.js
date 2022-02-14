import React, { useEffect } from "react";
import Link from "next/link";

// Bootstrap
import { Col, Container, Row } from "react-bootstrap";

// Translations
import IntlWrapper from "./IntlWrapper";
import { FormattedMessage } from "react-intl";
import { getLanguage } from "../functions";
import { getTheme } from "../functions/getTheme";

const Footer = () => {
  useEffect(() => {
    console.log(getTheme(window));
    document.documentElement.className = getTheme(window);
    document.documentElement.lang = getLanguage(window);
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
              {/* REQUEST SUPPORT */}
              <Link passHref href="/request-support">
                <a className="px-2">
                  <FormattedMessage id="footer.request_support" />
                </a>
              </Link>

              {/* ENDPOINT BUILDER */}
              <Link passHref href="/endpoint-builder">
                <a className="px-2">
                  <FormattedMessage id="footer.endpoint_builder" />
                </a>
              </Link>

              {/* ENDPOINT CHECKER */}
              <Link passHref href="/endpoint-checker">
                <a className="px-2">
                  <FormattedMessage id="footer.endpoint_schema_checker" />
                </a>
              </Link>

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
