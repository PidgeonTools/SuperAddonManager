import React, { useEffect, useState } from "react";

// Bootstrap
import { Col, Container, Form, Row, Button } from "react-bootstrap";

// Components
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import {
  DownloadURL,
  MaxBlender,
  MinBlender,
  Version,
} from "../components/endpoint-builder/HelpTexts";

import {
  AddonVersion,
  ApiBreakingBlenderVersion,
  DownloadUrl,
  MinimumBlenderVersion,
  INPUTID,
  ShowApiBreakingBlenderVersion,
  AllowAutomaticDownload,
} from "../components/endpoint-builder/EndpointBuilderInputs";

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
                    <AllowAutomaticDownload
                      onChange={(e) => {
                        setAllowAutomaticDownload(e.target.checked);
                      }}
                      allowAutomaticDownload={allowAutomaticDownload}
                    />
                  </Col>
                </Row>

                {/* SHOW API BREAKING BLENDER VERSION */}
                <Row>
                  <Col className="mb-3">
                    <ShowApiBreakingBlenderVersion
                      onChange={(e) => {
                        setShowApiBreakingBlenderVersion(e.target.checked);
                      }}
                      showApiBreakingBlenderVersion={
                        showApiBreakingBlenderVersion
                      }
                    />
                  </Col>
                </Row>

                {/* ADDON VERSION */}
                <Row>
                  <Col className="mb-3">
                    <AddonVersion
                      addonVersion={addonVersion}
                      latestSPMVersion={latestSPMVersion}
                      onChange={(e) => {
                        setAddonVersion(String(e.target.value));
                      }}
                      onFocus={(e) => {
                        setFocusedElement(e.target.id);
                      }}
                      required
                      autoFocus
                    />
                  </Col>
                </Row>

                {/* DOWNLOAD URL */}
                <Row>
                  <Col className="mb-3">
                    <DownloadUrl
                      downloadUrl={downloadUrl}
                      allowAutomaticDownload={allowAutomaticDownload}
                      onChange={(e) => {
                        setDownloadUrl(String(e.target.value));
                      }}
                      onFocus={(e) => {
                        setFocusedElement(e.target.id);
                      }}
                      required
                    />
                  </Col>
                </Row>

                {/* MINIMUM BLENDER VERSION */}
                <Row>
                  <Col className="mb-3">
                    <MinimumBlenderVersion
                      minimumBlenderVersion={minimumBlenderVersion}
                      exampleBlenderLTSVersion={exampleBlenderLTSVersion}
                      onChange={(e) => {
                        setMinimumBlenderVersion(String(e.target.value));
                      }}
                      onFocus={(e) => {
                        setFocusedElement(e.target.id);
                      }}
                      required
                    />
                  </Col>
                </Row>

                {/* API BREAKING BLENDER VERSION */}
                {showApiBreakingBlenderVersion ? (
                  <Row>
                    <Col className="mb-3">
                      <ApiBreakingBlenderVersion
                        exampleBlenderLTSVersion={exampleBlenderLTSVersion}
                        apiBreakingBlenderVersion={apiBreakingBlenderVersion}
                        onChange={(e) => {
                          setApiBreakingBlenderVersion(String(e.target.value));
                        }}
                        onFocus={(e) => {
                          setFocusedElement(e.target.id);
                        }}
                        required
                      />
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
