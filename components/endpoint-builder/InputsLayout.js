import React, { useEffect, useState } from "react";
import Link from "next/link";

// Bootstrap
import { Col, Container, Form, Row, Button } from "react-bootstrap";

// Components
import {
  AddonVersion,
  AllowAutomaticDownload,
  ApiBreakingBlenderVersion,
  DownloadUrl,
  INPUTID,
  MinimumBlenderVersion,
  ReleaseDescription,
  ShowApiBreakingBlenderVersion,
} from "./EndpointBuilderInputs";

import {
  DownloadURL,
  MaxBlender,
  MinBlender,
  RelDescription,
  Version,
} from "./HelpTexts";

// Translations
import IntlWrapper from "../IntlWrapper";
import { FormattedMessage, useIntl } from "react-intl";
import { padAddonVersion, padBlenderVersion } from "../../functions";

const InputsLayout = ({
  latestSPMVersion,
  exampleBlenderLTSVersion,
  callbackFunction = (currentVersion) => {
    console.log(currentVersion);
  },
}) => {
  const intl = useIntl();
  const [validated, setValidated] = useState(false);

  // Form Values
  const [allowAutomaticDownload, setAllowAutomaticDownload] = useState();
  const [showApiBreakingBlenderVersion, setShowApiBreakingBlenderVersion] =
    useState();
  const [addonVersion, setAddonVersion] = useState();
  const [downloadUrl, setDownloadUrl] = useState();
  const [minimumBlenderVersion, setMinimumBlenderVersion] = useState();
  const [apiBreakingBlenderVersion, setApiBreakingBlenderVersion] = useState();
  const [releaseDescription, setReleaseDescription] = useState();

  const [focusedElement, setFocusedElement] = useState();
  const [helpText, setHelpText] = useState(
    <Version exampleText={latestSPMVersion} />
  );

  useEffect(() => {
    switch (focusedElement) {
      case INPUTID.VERSION:
        setHelpText(<Version exampleText={latestSPMVersion} />);
        break;
      case INPUTID.DOWNLOAD_URL:
        setHelpText(
          <DownloadURL
            allowAutomaticDownload={allowAutomaticDownload}
            exampleText={"https://www.example.com/download-my-addon"}
          />
        );
        break;
      case INPUTID.MINIMUM_BLENDER_VERSION:
        setHelpText(<MinBlender exampleText={exampleBlenderLTSVersion} />);
        break;
      case INPUTID.API_BREAKING_BLENDER_VERSION:
        setHelpText(<MaxBlender exampleText={"3.0.0"} />);
        break;
      case INPUTID.RELEASE_DESCRIPTION:
        setHelpText(
          <RelDescription
            exampleText={
              <FormattedMessage id="endpoint_builder.help_texts.release_description.example" />
            }
          />
        );
        break;
    }
  }, [focusedElement, allowAutomaticDownload]);

  const handleSubmit = (e) => {
    // Prevent a page reload.
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();

      return;
    }

    setValidated(false);

    let current_version = {};

    current_version.version = padAddonVersion(addonVersion);

    current_version.allow_automatic_download = allowAutomaticDownload;
    if (downloadUrl.startsWith("https://")) {
      current_version.download_url = downloadUrl;
    } else {
      current_version.download_url = "https://" + downloadUrl;
    }

    let minBlender = padBlenderVersion(minimumBlenderVersion);
    current_version.minimum_blender_version = minBlender;

    if (showApiBreakingBlenderVersion) {
      let apiBreakingBlender = padBlenderVersion(apiBreakingBlenderVersion);

      if (apiBreakingBlender > minBlender) {
        current_version.api_breaking_blender_version = apiBreakingBlender;
      }
    }

    current_version.release_description = releaseDescription;

    callbackFunction(current_version);
  };

  // Initialize form content on page load.
  useEffect(() => {
    setAllowAutomaticDownload(true);
    setShowApiBreakingBlenderVersion(false);
    setAddonVersion("");
    setDownloadUrl("");
    setMinimumBlenderVersion("");
    setApiBreakingBlenderVersion("");
    setReleaseDescription("");
  }, []);

  return (
    <IntlWrapper>
      {/* ENDPOINT BUILDER */}
      <Row>
        {/* ENDPOINT BUILDER FORM */}
        <Col lg={6}>
          <Form
            noValidate
            onSubmit={handleSubmit}
            className={validated ? "sam-validation" : ""}
          >
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
                  showApiBreakingBlenderVersion={showApiBreakingBlenderVersion}
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
            <>
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
            </>

            {/* RELEASE DESCRIPTION */}
            <Row>
              <Col className="mb-3">
                <ReleaseDescription
                  releaseDescription={releaseDescription}
                  onChange={(e) => {
                    setReleaseDescription(String(e.target.value));
                  }}
                  onFocus={(e) => {
                    setFocusedElement(e.target.id);
                  }}
                />
              </Col>
            </Row>

            <Col className="d-grid">
              <Button
                variant="primary"
                className="sam-btn-primary"
                type="submit"
                accessKey="G"
              >
                <FormattedMessage id="endpoint_builder.generate" />
              </Button>
            </Col>
          </Form>
        </Col>
        {/* HELP TEXTS */}
        <Col lg={6} className="help-text">
          {helpText}
        </Col>
      </Row>
    </IntlWrapper>
  );
};

export default InputsLayout;
