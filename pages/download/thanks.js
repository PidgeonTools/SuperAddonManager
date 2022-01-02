import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Bootstrap
import { Col, Container, Form, Row } from "react-bootstrap";

// Components
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

// Animations
import { motion } from "framer-motion";

// Translations
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import IntlWrapper from "../../components/IntlWrapper";

const Thanks = ({ data }) => {
  const router = useRouter();
  const [amount, setAmount] = useState("5");

  // === Pick an item from the list of comparison texts ===
  let item = {};
  data.productComparisons.forEach((e, index) => {
    if (
      e.price == amount ||
      (e.price >= amount && data.productComparisons[index - 1].price < amount)
    ) {
      item = e;
    }
  });

  const floor = (number, decimal) => {
    return Math.floor(number * 10 ** decimal) / 10 ** decimal;
  };

  // === Handle a change in the donation form ===
  const handleChange = (value, callback) => {
    value = value == "" ? "0" : value;
    value = floor(Number(value), 2);
    value = value <= 9999 ? value : 9999;

    callback(String(value));
  };

  // === Download the file on pageload. ===
  useEffect(() => {
    if (window.sessionStorage.getItem("file_downloaded") != "true") {
      router.push(data.downloadLink);
      window.sessionStorage.setItem("file_downloaded", true);
    }

    setAmount(5);
  }, []);

  return (
    <IntlWrapper>
      <Header
        title="Thanks"
        description="I've just downloaded Super Addon Manager to make updating all of my addons easier. Do you want to try it out? Visit their site!"
      />
      <Navbar />
      {/* SUCCESS MESSAGE */}
      <section id="main" className="intro thanks-success-message pb-3">
        <Container>
          <Row>
            <div>
              <FormattedMessage id="download.thanks.thank_you_for_downloading" />{" "}
              <FormattedMessage id="download.thanks.your_download_should_start_soon" />{" "}
              <FormattedMessage id="download.thanks.what_if_the_download_does_not_start" />
            </div>
            <Link href={data.downloadLink}>{data.downloadLink}</Link>
          </Row>
        </Container>
      </section>
      {/* DONATION FORM */}
      <section className="thanks-donate-box">
        {/* TOP WAVE */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 50 1440 315">
          <path
            className="waves"
            fillOpacity="1"
            d="M 0 0 L 0 160 L 34.300781 144 C 68.600781 128 137 96 206 112 C 274.3 128 343 192.00078 411 229.30078 C 480 267.00078 549 276.99922 617 234.69922 C 685.7 191.99922 754 95.999219 823 90.699219 C 891.4 84.999219 960 171.00078 1029 197.30078 C 1097.1 224.00078 1166 191.99922 1234 170.69922 C 1302.9 148.99922 1371 139.00078 1406 133.30078 L 1440 128 L 1440 0 L 0 0 z "
          />
        </svg>
        {/* TEXT CONTENT */}
        <Container>
          {/* HEADING */}
          <Row>
            <h1>
              <FormattedMessage id="download.thanks.help_us" />
            </h1>
          </Row>
          <div className="thanks-donate-box--form">
            {/* AMOUNT FORM */}
            <Form className="row">
              {/* AMOUNT SLIDER */}
              <Col lg="10" md="9">
                <input
                  type="range"
                  className="form-range"
                  id="customRange1"
                  min="0"
                  max="100"
                  value={amount}
                  onChange={({ target }) => {
                    handleChange(target.value, setAmount);
                  }}
                />
              </Col>
              {/* AMOUNT INPUT FIELD */}
              <Col lg="2" md="3">
                <input
                  type="number"
                  className="form-control number-textfield text-center"
                  step="5"
                  min="0"
                  max="9999"
                  value={amount}
                  onChange={({ target }) => {
                    handleChange(target.value, setAmount);
                  }}
                />
              </Col>
            </Form>
            {/* AMOUNT COMPARISON TEXT */}
            <Row>
              <Col md="11">
                <div>
                  <FormattedMessage id="download.thanks.the_same_price_as" />{" "}
                  <FormattedMessage id={item.id} />
                </div>
                <div>
                  <FormattedMessage id="download.thanks.your_contribution" />{" "}
                  <FormattedNumber
                    value={amount}
                    style="currency"
                    currency="EUR"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        {/* BOTTOM WAVE */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 315">
          <path
            className="waves"
            fillOpacity="1"
            d="M0,160L34.3,144C68.6,128,137,96,206,112C274.3,128,343,192,411,229.3C480,267,549,277,617,234.7C685.7,192,754,96,823,90.7C891.4,85,960,171,1029,197.3C1097.1,224,1166,192,1234,170.7C1302.9,149,1371,139,1406,133.3L1440,128L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          />
        </svg>
      </section>
    </IntlWrapper>
  );
};

export const getStaticProps = () => {
  const data = require("../../data/download.json");

  return {
    props: {
      data,
    },
  };
};

export default Thanks;
