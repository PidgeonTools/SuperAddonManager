import React, { useState } from "react";

// Bootstrap
import {
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Button,
} from "react-bootstrap";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const EndpointBuilderPage = ({ latestBlenderLTSVersion, latestSPMVersion }) => {
  const [allowAutomaticDownload, setAllowAutomaticDownload] = useState(true);
  const [data, setData] = useState({
    schema_version: "super-addon-manager-version-info-1.0.0",
    versions: [
      {
        version: null,
        allow_automatic_download: true,
        download_url: "",
        minimum_blender_version: null,
      },
    ],
  });

  const updateData = ({ target }, split = null, splitType = Number) => {
    // Assign the new value to a temporary variable.
    let newData = target.value;

    // Assign the checked value, if an input is a checkbox.
    if (target.type == "checkbox") {
      newData = target.checked;
    }

    // Split an object into an array, if it should be split.
    if (split) {
      newData = target.value.split(split).map(splitType);
    }

    let tempData = data;
    tempData.versions[0][target.id] = newData;
    setData(tempData);
    console.log(data);
  };

  const downloadEndpoint = (e) => {
    // Prevent a page reload.
    e.preventDefault();

    // Create a new file with the contents of the current data.
    const file = new Blob([JSON.stringify(data)], { type: "text/json" });

    // Create and click a temporary link to download the file.
    const el = document.createElement("a");
    el.href = URL.createObjectURL(file);
    el.download = "SuperAddonManager-Endpoint.json";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  return (
    <>
      <Header title="Endpoint Builder" />
      <Navbar />

      {/* INTRO */}
      <Container className="intro">
        <h1>Endpoint Builder</h1>
      </Container>

      {/* ENDPOINT BUILDER */}
      <section className="form" style={{ marginBottom: "50vh" }}>
        <Container>
          {/* ENDPOINT BUILDER FORM */}
          <Col lg={6}>
            <Form onSubmit={downloadEndpoint}>
              {/* ALLOW AUTOMATIC DOWNLOAD */}
              <Row>
                <Col className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="allow_automatic_download"
                      className="form-check-input"
                      onChange={(e) => {
                        updateData(e);
                        setAllowAutomaticDownload(e.target.checked);
                      }}
                      checked={allowAutomaticDownload}
                    />
                    <label
                      htmlFor="allow_automatic_download"
                      className="form-checked-label"
                    >
                      Allow Automatic Download
                    </label>
                  </div>
                </Col>
              </Row>

              {/* ADDON VERSION */}
              <Row>
                <Col className="mb-3">
                  <FloatingLabel
                    controlId="version"
                    label={`Addon Version (e.g. ${latestSPMVersion})`}
                  >
                    <Form.Control
                      type="text"
                      placeholder={latestSPMVersion}
                      onChange={(e) => {
                        updateData(e, ".");
                      }}
                      pattern="(\d+\.?){0,2}\d+"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* DOWNLOAD URL */}
              <Row>
                <Col className="mb-3">
                  <FloatingLabel controlId="download_url" label="Download URL">
                    <Form.Control
                      type="text"
                      onChange={updateData}
                      placeholder="https://github.com/BlenderDefender/SuperEasyAnalytics/releases/download/1_2_1/SuperEasyAnalytics.zip"
                      pattern={
                        allowAutomaticDownload
                          ? "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*\\.zip"
                          : "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*"
                      }
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* MINIMUM BLENDER VERSION */}
              <Row>
                <Col className="mb-3">
                  <FloatingLabel
                    controlId="minimum_blender_version"
                    label={`Minimum Blender Version (e.g. ${latestBlenderLTSVersion})`}
                  >
                    <Form.Control
                      type="text"
                      placeholder={latestBlenderLTSVersion}
                      onChange={(e) => {
                        updateData(e, ".");
                      }}
                      pattern="(\d+\.?){2}\d+"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* API BREAKING BLENDER VERSION */}
              <Row>
                <Col className="mb-3">
                  <FloatingLabel
                    controlId="api_breaking_blender_version"
                    label="API breaking Blender Version"
                  >
                    <Form.Control
                      type="text"
                      placeholder={latestBlenderLTSVersion}
                      onChange={(e) => {
                        updateData(e, ".");
                      }}
                      pattern="(\d+\.?){2}\d+"
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Col className="d-grid">
                <Button variant="primary" type="submit">
                  Download Endpoint
                </Button>
              </Col>
            </Form>
          </Col>
        </Container>
      </section>
    </>
  );
};

export const getStaticProps = () => {
  const data = require("../data/request-support.json");
  return {
    props: {
      latestBlenderLTSVersion: data.latestBlenderLTSVersion,
      latestSPMVersion: data.latestSPMVersion,
    },
  };
};

export default EndpointBuilderPage;
