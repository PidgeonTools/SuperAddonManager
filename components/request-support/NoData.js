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

import { getOS, OS } from "../../functions";

export const NoData = ({ exampleBlenderVersion, latestSPMVersion }) => {
  const [formData, setFormData] = useState({});
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
  const [operatingSystem, setOperatingSystem] = useState();

  // Router specific variables
  const router = useRouter();
  const baseURL = "/request-support";

  // Set the Operating System at page load.
  useEffect(() => {
    setOperatingSystem(getOS().display);
    setFormData({ ...formData, os_name: getOS().display });
  }, []);

  // Handle the change of a form component.
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.id]: e.target.value.trim(),
    });
  };

  // Handle Submitting the form.
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();

      return;
    }

    router.push({
      pathname: baseURL,
      query: formData,
    });
  };

  return (
    <>
      {/* INTRO SECTION */}
      <section className="intro">
        <Container>
          <Row>
            <h1>Request support for your addon</h1>
            <p>
              Fill in the Form with all necessary data to get support, if Super
              Addon Manager doesn't work with your addon.
            </p>
          </Row>
        </Container>
      </section>

      {/* REQUEST SUPPORT */}
      <section className="form" style={{ marginBottom: "50vh" }}>
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
          <Container>
            <Row>
              {/* ISSUE TYPE */}
              <Col lg={4} className="mb-3">
                <FloatingLabel
                  controlId="issue_type"
                  label="Issue Type / Error Code"
                >
                  <Form.Select
                    defaultValue=""
                    onChange={handleChange}
                    required
                    accessKey="I"
                  >
                    <option value="" disabled>
                      Select an Option
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
                <FloatingLabel controlId="addon_name" label="Addon Name">
                  <Form.Control
                    type="text"
                    placeholder="Super Project Manager"
                    onChange={handleChange}
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
                <FloatingLabel controlId="os_name" label="Operating System">
                  <Form.Select
                    onChange={(e) => {
                      setOperatingSystem(e.target.value);
                      handleChange(e);
                    }}
                    value={operatingSystem}
                    required
                    accessKey="O"
                  >
                    <option value="" disabled>
                      Select an Option
                    </option>
                    {operatingSystems.map((el) => (
                      <option key={el} value={el.display}>
                        {el.display}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              {/* BLENDER VERSION */}
              <Col lg={4} md={6} className="mb-3">
                <FloatingLabel
                  controlId="blender_version"
                  label={`Blender Version (e.g. ${exampleBlenderVersion})`}
                >
                  <Form.Control
                    type="text"
                    placeholder={exampleBlenderVersion}
                    pattern="\d+\.\d+\.\d+"
                    onChange={handleChange}
                    required
                    accessKey="B"
                  />
                </FloatingLabel>
              </Col>
              {/* ADDON VERSION */}
              <Col lg={4} md={6} className="mb-3">
                <FloatingLabel
                  controlId="addon_version"
                  label={`Addon Version (e.g. ${latestSPMVersion})`}
                >
                  <Form.Control
                    type="text"
                    placeholder={latestSPMVersion}
                    pattern="\d+\.\d+\.\d+"
                    onChange={handleChange}
                    required
                    accessKey="A"
                  />
                </FloatingLabel>
              </Col>
            </Row>

            {/* === ISSUE-DEPENDENT PARAMETERS === */}
            {/* ADDON COUNT */}
            <>
              {formData.issue_type == "sam_not_supported" ? (
                <Row>
                  <Col lg={12} className="mb-3">
                    <FloatingLabel
                      controlId="addon_count"
                      label="Estimated Number of installed Addons"
                    >
                      <Form.Control
                        type="number"
                        min="1"
                        max="9000"
                        placeholder="42"
                        onChange={handleChange}
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
              ].includes(formData.issue_type) ? (
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId="endpoint_url"
                      label="Endpoint URL"
                    >
                      <Form.Control
                        type="text"
                        onChange={handleChange}
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
              {["endpoint_offline", "unknown_error"].includes(
                formData.issue_type
              ) ? (
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId="error_message"
                      label="Error Message"
                    >
                      <Form.Control
                        as="textarea"
                        onChange={handleChange}
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
                <FloatingLabel controlId="tracker_url" label="Tracker URL">
                  <Form.Control
                    type="text"
                    onChange={handleChange}
                    placeholder="https://github.com/BlenderDefender/SuperProjectManager"
                    pattern="(https?://)?.+\..+"
                    accessKey="T"
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Col className="d-grid">
              <Button variant="primary" type="submit">
                Request Support
              </Button>
            </Col>
          </Container>
        </Form>
      </section>
    </>
  );
};
