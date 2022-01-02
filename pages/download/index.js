import React from "react";
import { useRouter } from "next/router";

// Bootstrap
import { Col, Container, Row } from "react-bootstrap";

// Animations
import { motion } from "framer-motion";
import AnimatedNumber from "react-animated-number";

// Components
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

// Translations
import { FormattedMessage } from "react-intl";
import IntlWrapper from "../../components/IntlWrapper";

const Download = ({ addons }) => {
  const router = useRouter();

  const counterDuration = addons.length * 65 < 1500 ? addons.length * 65 : 1500;

  const downloadCallback = () => {
    window.sessionStorage.setItem("file_downloaded", false);
    router.push("/download/thanks");
  };

  return (
    <IntlWrapper>
      <Header
        title="Download"
        description="Finally keep track of new versions for your addons. Download Super Addon Manager!"
      />
      <Navbar />
      {/* DOWNLOAD SECTION */}
      <section className="intro download-box">
        <Container>
          <Row>
            {/* DOWNLOAD BUTTON */}
            <Col md="6" className="text-center">
              <h1>
                <FormattedMessage id="download.super_addon_manager" />
              </h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCallback}
                className="btn btn-secondary"
              >
                <FormattedMessage id="download.download" />
              </motion.button>
            </Col>
            {/* SAM FEATURES */}
            <Col md="6" className="text-left pt-3">
              <ul>
                <li>
                  <FormattedMessage id="download.sam_features_list_one" />
                </li>
                <li>
                  <FormattedMessage id="download.sam_features_list_two" />
                </li>
                <li>
                  <FormattedMessage id="download.sam_features_list_three" />
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        {/* BOTTOM WAVES */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 315">
          <path
            className="waves"
            fillOpacity="1"
            d="M0,160L34.3,144C68.6,128,137,96,206,112C274.3,128,343,192,411,229.3C480,267,549,277,617,234.7C685.7,192,754,96,823,90.7C891.4,85,960,171,1029,197.3C1097.1,224,1166,192,1234,170.7C1302.9,149,1371,139,1406,133.3L1440,128L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          ></path>
        </svg>
      </section>
      {/* SUPPORTED ADDONS SECTION */}
      <section className="supported-addons-box">
        <Container>
          <Row className="text-center">
            {/* HEADING */}
            <h2>
              <FormattedMessage id="download.you_can_use_super_addon_manager_with" />{" "}
              <AnimatedNumber
                value={addons.length}
                formatValue={(n) => n.toFixed(0)}
                duration={counterDuration}
              />
              <FormattedMessage id="download.addons" />
            </h2>
            {/* ADDONS LISTING */}
            {addons.map((addon) => (
              <Col
                md="4"
                sm="6"
                key={addon.id}
                className="supported-addons-box--addon"
              >
                {addon.link ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={addon.link}
                  >
                    {addon.name}
                  </a>
                ) : (
                  <p>{addon.name}</p>
                )}
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </IntlWrapper>
  );
};

export const getStaticProps = () => {
  const data = require("../../data/supported-addons.json");
  return {
    props: { addons: data },
  };
};

export default Download;
