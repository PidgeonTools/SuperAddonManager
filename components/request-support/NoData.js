import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Bootstrap
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";

// Functions
import {
  getOS,
  getOSByID,
  OS,
  padAddonVersion,
  padBlenderVersion,
} from "../../functions";

// Translations
import { FormattedMessage, useIntl } from "react-intl";

// Classnames
var classNames = require("classnames");

import { ERROR_CODES } from "./ErrorCodes";

export const NoData = ({
  exampleBlenderVersion,
  latestSPMVersion,
  nextSPMVersion,
}) => {
  const intl = useIntl();
  const [validated, setValidated] = useState(false);

  // Form Variables
  const operatingSystems = [OS.WINDOWS, OS.LINUX, OS.MACOS, OS.OTHER];

  // Input Data
  const [issueType, setIssueType] = useState("");
  const [addonName, setAddonName] = useState("");
  const [operatingSystem, setOperatingSystem] = useState(OS.WINDOWS);
  const [blenderVersion, setBlenderVersion] = useState("");
  const [addonVersion, setAddonVersion] = useState("");
  const [addonCount, setAddonCount] = useState(15);
  const [endpointURL, setEndpointURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [newAddonVersion, setNewAddonVersion] = useState("");
  const [trackerURL, setTrackerURL] = useState("");

  // Router specific variables
  const router = useRouter();
  const baseURL = "/request-support";

  // Set the Operating System at page load.
  useEffect(() => {
    setOperatingSystem(getOS());
  }, []);

  // Handle Submitting the form.
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();

      return;
    }

    let BlenderVersion = padBlenderVersion(blenderVersion).join(".");

    let AddonVersion = padAddonVersion(addonVersion).join(".");
    let NewAddonVersion = padAddonVersion(newAddonVersion).join(".");

    router.push({
      pathname: baseURL,
      query: {
        issue_type: issueType,
        addon_name: addonName,
        blender_version: BlenderVersion,
        addon_version: AddonVersion,
        os_name: operatingSystem.englishName,
        addon_count: addonCount,
        endpoint_url: endpointURL,
        error_message: errorMessage,
        tracker_url: trackerURL,
        download_url: downloadUrl,
        new_addon_version:
          NewAddonVersion > AddonVersion ? NewAddonVersion : "Unknown",
      },
    });
  };

  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <Container>
          <Row>
            <h1>
              <FormattedMessage id="request_support.no_data.request_support_for_your_addon" />
            </h1>
            <p>
              <FormattedMessage id="request_support.no_data.fill_in_the_form" />
            </p>
          </Row>
        </Container>
      </section>

      {/* REQUEST SUPPORT */}
      <section className="form">
        <Form
          noValidate
          onSubmit={handleSubmit}
          className={classNames({ "sam-validation": validated })}
        >
          <Container>
            <Row>
              {/* ISSUE TYPE */}
              <Col lg={4} className="mb-3">
                <FloatingLabel
                  controlId="issue_type"
                  label={
                    <FormattedMessage id="request_support.no_data.error_code" />
                  }
                >
                  <Form.Select
                    className="sam-form-select"
                    value={issueType}
                    onChange={(e) => {
                      setIssueType(e.target.value);
                    }}
                    required
                    accessKey="I"
                  >
                    <option value="" disabled>
                      {intl.formatMessage({
                        id: "request_support.no_data.select_an_option",
                      })}
                    </option>
                    {Object.keys(ERROR_CODES).map((key) => (
                      <option key={key} value={ERROR_CODES[key]}>
                        {ERROR_CODES[key]}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              {/* ADDON NAME */}
              <Col lg={8} className="mb-3">
                <FloatingLabel
                  controlId="addon_name"
                  label={
                    <FormattedMessage id="request_support.no_data.addon_name" />
                  }
                >
                  <Form.Control
                    type="text"
                    className="sam-form-control"
                    placeholder="Super Project Manager"
                    value={addonName}
                    onChange={(e) => {
                      setAddonName(e.target.value);
                    }}
                    required
                    accessKey="N"
                  />
                </FloatingLabel>
              </Col>
            </Row>

            {/* === SYSTEM INFORMATION === */}
            <Row>
              {/* OS */}
              <Col lg={4} className="mb-3">
                <FloatingLabel
                  controlId="os_name"
                  label={
                    <FormattedMessage id="request_support.no_data.operating_system" />
                  }
                >
                  <Form.Select
                    className="sam-form-select"
                    value={operatingSystem.displayID}
                    onChange={(e) => {
                      setOperatingSystem(getOSByID(e.target.value));
                    }}
                    required
                    accessKey="O"
                  >
                    <option value="" disabled>
                      {intl.formatMessage({
                        id: "request_support.no_data.select_an_option",
                      })}
                    </option>
                    {operatingSystems.map((el) => (
                      <option key={el} value={el.displayID}>
                        {intl.formatMessage({ id: el.displayID })}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              {/* BLENDER VERSION */}
              <Col lg={4} md={6} className="mb-3">
                <FloatingLabel
                  controlId="blender_version"
                  label={
                    <FormattedMessage
                      id="request_support.no_data.blender_version"
                      values={{ exampleBlenderVersion }}
                    />
                  }
                >
                  <Form.Control
                    type="text"
                    className="sam-form-control"
                    placeholder={exampleBlenderVersion}
                    pattern="(\d+\.){1,2}\d+"
                    value={blenderVersion}
                    onChange={(e) => {
                      setBlenderVersion(e.target.value);
                    }}
                    required
                    accessKey="B"
                  />
                </FloatingLabel>
              </Col>
              {/* ADDON VERSION */}
              <Col lg={4} md={6} className="mb-3">
                <FloatingLabel
                  controlId="addon_version"
                  label={
                    <FormattedMessage
                      id="request_support.no_data.addon_version"
                      values={{ latestSPMVersion }}
                    />
                  }
                >
                  <Form.Control
                    type="text"
                    className="sam-form-control"
                    placeholder={latestSPMVersion}
                    pattern="(\d+\.)*\d+"
                    value={addonVersion}
                    onChange={(e) => {
                      setAddonVersion(e.target.value);
                    }}
                    required
                    accessKey="A"
                  />
                </FloatingLabel>
              </Col>
            </Row>

            {/* === ISSUE-DEPENDENT PARAMETERS === */}
            {/* ADDON COUNT */}
            <>
              {issueType == ERROR_CODES.SAM_NOT_SUPPORTED ? (
                <Row>
                  <Col lg={12} className="mb-3">
                    <FloatingLabel
                      controlId="addon_count"
                      label={
                        <FormattedMessage id="request_support.no_data.estimated_number_of_installed_addons" />
                      }
                    >
                      <Form.Control
                        type="number"
                        className="number-textfield sam-form-control"
                        min="1"
                        max="9000"
                        placeholder="42"
                        value={addonCount}
                        onChange={(e) => {
                          setAddonCount(e.target.value);
                        }}
                        required
                        accessKey="C"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              ) : null}
            </>

            {/* ENDPOINT URL */}
            <>
              {[
                ERROR_CODES.ENDPOINT_URL_INVALID,
                ERROR_CODES.INVALID_ENDPOINT,
                ERROR_CODES.ENDPOINT_INVALID_SCHEMA,
                ERROR_CODES.ENDPOINT_OFFLINE,
              ].includes(issueType) ? (
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId="endpoint_url"
                      label={
                        <FormattedMessage id="request_support.no_data.endpoint_url" />
                      }
                    >
                      <Form.Control
                        type="text"
                        className="sam-form-control"
                        value={endpointURL}
                        onChange={(e) => {
                          setEndpointURL(e.target.value);
                        }}
                        placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                        accessKey="U"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              ) : null}
            </>

            {/* NEW ADDON VERSION */}
            <>
              {[
                ERROR_CODES.INVALID_FILE_TYPE,
                ERROR_CODES.INVALID_DOWNLOAD_URL,
                ERROR_CODES.DOWNLOAD_URL_OFFLINE,
                ERROR_CODES.NOT_AN_ADDON,
              ].includes(issueType) ? (
                <Col className="mb-3">
                  <FloatingLabel
                    controlId="new_addon_version"
                    label={
                      <FormattedMessage
                        id="request_support.no_data.new_addon_version"
                        values={{ nextSPMVersion }}
                      />
                    }
                  >
                    <Form.Control
                      type="text"
                      className="sam-form-control"
                      placeholder={nextSPMVersion}
                      pattern="(\d+\.)*\d+"
                      value={newAddonVersion}
                      onChange={(e) => {
                        setNewAddonVersion(e.target.value);
                      }}
                      required
                      accessKey="V"
                    />
                  </FloatingLabel>
                </Col>
              ) : null}
            </>

            {/* DOWNLOAD URL */}
            <>
              {[
                ERROR_CODES.INVALID_DOWNLOAD_URL,
                ERROR_CODES.DOWNLOAD_URL_OFFLINE,
              ].includes(issueType) ? (
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId="download_url"
                      label={
                        <FormattedMessage id="request_support.no_data.download_url" />
                      }
                    >
                      <Form.Control
                        type="text"
                        className="sam-form-control"
                        value={downloadUrl}
                        onChange={(e) => {
                          setDownloadUrl(e.target.value);
                        }}
                        placeholder="https://github.com/BlenderDefender/SuperProjectManager/releases/download/1.3.1/SuperProjectManager.zip"
                        accessKey="D"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              ) : null}
            </>

            {/* ERROR MESSAGE */}
            <>
              {[
                ERROR_CODES.ENDPOINT_OFFLINE,
                ERROR_CODES.UNKNOWN_ERROR,
              ].includes(issueType) ? (
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId="error_message"
                      label={
                        <FormattedMessage id="request_support.no_data.error_message" />
                      }
                    >
                      <Form.Control
                        as="textarea"
                        className="sam-form-control"
                        value={errorMessage}
                        onChange={(e) => {
                          setErrorMessage(e.target.value);
                        }}
                        placeholder="Error Message"
                        style={{ height: "8rem" }}
                        accessKey="M"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              ) : null}
            </>

            {/* TRACKER URL */}
            <Row>
              <Col className="mb-3">
                <FloatingLabel
                  controlId="tracker_url"
                  label={
                    <FormattedMessage id="request_support.no_data.tracker_url" />
                  }
                >
                  <Form.Control
                    type="text"
                    className="sam-form-control"
                    value={trackerURL}
                    onChange={(e) => {
                      setTrackerURL(e.target.value);
                    }}
                    placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                    pattern="(https?://)?.+\..+"
                    accessKey="T"
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Col className="d-grid">
              <Button
                variant="primary"
                className="sam-btn-primary"
                type="submit"
              >
                <FormattedMessage id="request_support.no_data.request_support" />
              </Button>
            </Col>
          </Container>
        </Form>
      </section>
    </>
  );
};
