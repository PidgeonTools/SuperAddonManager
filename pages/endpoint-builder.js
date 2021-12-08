import React, { useEffect, useState } from "react";

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
import {
  DownloadURL,
  MaxBlender,
  MinBlender,
  Version,
} from "../components/endpoint-builder/HelpTexts";

const INPUTID = {
  VERSION: "version",
  MINIMUM_BLENDER_VERSION: "minimum_blender_version",
  API_BREAKING_BLENDER_VERSION: "api_breaking_blender_version",
  DOWNLOAD_URL: "download_url",
};
const PAGE_TITLE = "Endpoint JSON Builder";

const EndpointBuilderPage = ({
  exampleBlenderLTSVersion,
  latestSPMVersion,
}) => {
  // Form Values
  const [allowAutomaticDownload, setAllowAutomaticDownload] = useState();
  const [showApiBreakingBlenderVersion, setShowApiBreakingBlenderVersion] =
    useState();
  const [addonVersion, setAddonVersion] = useState();
  const [downloadUrl, setDownloadUrl] = useState();
  const [minimumBlenderVersion, setMinimumBlenderVersion] = useState();
  const [apiBreakingBlenderVersion, setApiBreakingBlenderVersion] = useState();

  // Data
  const [data, setData] = useState({
    schema_version: "super-addon-manager-version-info-1.0.0",
    versions: [],
  });

  const [focusedElement, setFocusedElement] = useState();
  const [helpText, setHelpText] = useState(
    <Version exampleText={latestSPMVersion} />
  );

  useEffect(() => {
    switch (focusedElement) {
      case INPUTID.VERSION:
        setHelpText(<Version exampleText={latestSPMVersion} />);
        console.log(helpText);
        break;
      case INPUTID.DOWNLOAD_URL:
        setHelpText(
          <DownloadURL
            allowAutomaticDownload={allowAutomaticDownload}
            exampleText={"https://www.example.com/download-my-addon"}
          />
        );
        console.log(helpText);
        break;
      case INPUTID.MINIMUM_BLENDER_VERSION:
        setHelpText(<MinBlender exampleText={exampleBlenderLTSVersion} />);
        break;
      case INPUTID.API_BREAKING_BLENDER_VERSION:
        setHelpText(<MaxBlender exampleText={"3.0.0"} />);
        break;
    }
  }, [focusedElement, allowAutomaticDownload]);

  const downloadEndpoint = (e) => {
    // Prevent a page reload.
    e.preventDefault();

    let current_version = {};

    current_version.version = addonVersion.split(".").map(Number);

    current_version.allow_automatic_download = allowAutomaticDownload;
    current_version.download_url = downloadUrl;

    let minBlender = minimumBlenderVersion.split(".").map(Number);
    if (minBlender[0] < 3 && minBlender[1] < 10) minBlender[1] *= 10;
    if (minBlender.length < 3) minBlender[2] = 0;
    current_version.minimum_blender_version = minBlender;

    if (showApiBreakingBlenderVersion) {
      let apiBreakingBlender = apiBreakingBlenderVersion.split(".").map(Number);
      if (apiBreakingBlender[0] < 3 && apiBreakingBlender[1] < 10)
        apiBreakingBlender[1] *= 10;
      if (apiBreakingBlender.length < 3) apiBreakingBlender[2] = 0;

      if (apiBreakingBlender > minBlender) {
        current_version.api_breaking_blender_version = apiBreakingBlender;
      }
    }

    // Make a local copy of the data and add the current version to it.
    let downloadData = {
      schema_version: data.schema_version,
      versions: [current_version, ...data.versions],
    };

    console.log(downloadData);

    // Create a new file with the contents of the current data.
    const file = new Blob([JSON.stringify(downloadData)], {
      type: "text/json",
    });

    // Create and click a temporary link to download the file.
    const el = document.createElement("a");
    el.href = URL.createObjectURL(file);
    el.download = "SuperAddonManager-Endpoint.json";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  // Initialize form content on page load.
  useEffect(() => {
    setAllowAutomaticDownload(true);
    setShowApiBreakingBlenderVersion(false);
    setAddonVersion("");
    setDownloadUrl("");
    setMinimumBlenderVersion("");
    setApiBreakingBlenderVersion("");
  }, []);

  return (
    <>
      <Header title={PAGE_TITLE} />
      <Navbar />

      {/* INTRO */}
      <Container className="intro">
        <h1>{PAGE_TITLE}</h1>
      </Container>

      {/* ENDPOINT BUILDER */}
      <section className="form" style={{ marginBottom: "50vh" }}>
        <Container>
          <Row>
            {/* ENDPOINT BUILDER FORM */}
            <Col lg={6}>
              <Form onSubmit={downloadEndpoint}>
                {/* ALLOW AUTOMATIC DOWNLOAD */}
                <Row>
                  <Col>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="allow_automatic_download"
                        className="form-check-input"
                        onChange={(e) => {
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

                {/* SHOW API BREAKING BLENDER VERSION */}
                <Row>
                  <Col className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="update_for_older_blender_version"
                        className="form-check-input"
                        onChange={(e) => {
                          setShowApiBreakingBlenderVersion(e.target.checked);
                        }}
                        checked={showApiBreakingBlenderVersion}
                      />
                      <label
                        htmlFor="update_for_older_blender_version"
                        className="form-checked-label"
                      >
                        This addon has compatibility issues with a newer Blender
                        version.
                      </label>
                    </div>
                  </Col>
                </Row>

                {/* ADDON VERSION */}
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId={INPUTID.VERSION}
                      label={`Addon Version`}
                    >
                      <Form.Control
                        type="text"
                        required
                        value={addonVersion}
                        placeholder={latestSPMVersion}
                        pattern="(\d+\.?){0,2}\d+"
                        onChange={(e) => {
                          setAddonVersion(String(e.target.value));
                        }}
                        onFocus={(e) => {
                          setFocusedElement(e.target.id);
                        }}
                        autoFocus
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* DOWNLOAD URL */}
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId={INPUTID.DOWNLOAD_URL}
                      label="Download URL"
                    >
                      <Form.Control
                        type="text"
                        required
                        value={downloadUrl}
                        placeholder="https://github.com/BlenderDefender/SuperEasyAnalytics/releases/download/1_2_1/SuperEasyAnalytics.zip"
                        pattern={
                          allowAutomaticDownload
                            ? "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*\\.zip"
                            : "(https?:\\/\\/)?([a-zA-Z0-9]+\\.)+([a-zA-Z0-9]+)(\\/[\\d\\w\\.\\-]*)*"
                        }
                        onChange={(e) => {
                          setDownloadUrl(e.target.value);
                        }}
                        onFocus={(e) => {
                          setFocusedElement(e.target.id);
                        }}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* MINIMUM BLENDER VERSION */}
                <Row>
                  <Col className="mb-3">
                    <FloatingLabel
                      controlId={INPUTID.MINIMUM_BLENDER_VERSION}
                      label={`Minimum Blender Version`}
                    >
                      <Form.Control
                        type="text"
                        required
                        value={minimumBlenderVersion}
                        placeholder={exampleBlenderLTSVersion}
                        pattern="(\d+\.?){1,2}\d+"
                        onChange={(e) => {
                          setMinimumBlenderVersion(String(e.target.value));
                        }}
                        onFocus={(e) => {
                          setFocusedElement(e.target.id);
                        }}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* API BREAKING BLENDER VERSION */}
                {showApiBreakingBlenderVersion ? (
                  <Row>
                    <Col className="mb-3">
                      <FloatingLabel
                        controlId={INPUTID.API_BREAKING_BLENDER_VERSION}
                        label="Newer Blender version that has compatibility issues"
                      >
                        <Form.Control
                          type="text"
                          required
                          value={apiBreakingBlenderVersion}
                          placeholder={exampleBlenderLTSVersion}
                          pattern="(\d+\.?){1,2}\d+"
                          onChange={(e) => {
                            setApiBreakingBlenderVersion(
                              String(e.target.value)
                            );
                          }}
                          onFocus={(e) => {
                            setFocusedElement(e.target.id);
                          }}
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}

                <Col className="d-grid">
                  <Button variant="primary" type="submit">
                    Generate Endpoint JSON
                  </Button>
                </Col>
              </Form>
            </Col>
            {/* HELP TEXTS */}
            <Col lg={6} className="help-text">
              {helpText}
            </Col>
            {/* <Col lg={6} dangerouslySetInnerHTML={{ __html: helpText }}></Col> */}
          </Row>
        </Container>
      </section>
    </>
  );
};

export const getStaticProps = () => {
  const data = require("../data/request-support.json");
  return {
    props: {
      exampleBlenderLTSVersion: data.exampleBlenderLTSVersion,
      latestSPMVersion: data.latestSPMVersion,
    },
  };
};

export default EndpointBuilderPage;
