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

export const NoData = ({ exampleBlenderVersion, latestSPMVersion }) => {
  const intl = useIntl();
  const [validated, setValidated] = useState(false);

  // Form Variables
  const issueTypes = [
    "sam_not_supported",
    "bl_info_version_problems",
    "url_invalid",
    "endpoint_offline",
    "invalid_endpoint",
    "endpoint_invalid_schema",
    "unknown_error",
  ];
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
      <section className="form" style={{ marginBottom: "50vh" }}>
        <Form
          noValidate
          onSubmit={handleSubmit}
          className={validated ? "sam-validation" : ""}
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
                    {issueTypes.map((el) => (
                      <option key={el} value={el}>
                        {el}
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
              {issueType == "sam_not_supported" ? (
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
                "url_invalid",
                "invalid_endpoint",
                "endpoint_invalid_schema",
                "endpoint_offline",
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

            {/* ERROR MESSAGE */}
            <>
              {["endpoint_offline", "unknown_error"].includes(issueType) ? (
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
              <Button variant="primary" type="submit">
                <FormattedMessage id="request_support.no_data.request_support" />
              </Button>
            </Col>
          </Container>
        </Form>
      </section>
    </>
  );
};
