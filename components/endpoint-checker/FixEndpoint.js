import React, { useEffect, useState } from "react";

// Bootstrap
import { Button, Col, Form, Row } from "react-bootstrap";

// Schema
import SCHEMA, { SCHEMA_PARTS } from "./Schema";
const Ajv = require("ajv");
const ajv = new Ajv();

// Components
import { COMPONENTS } from "../endpoint-builder/EndpointBuilderInputs";

// Functions
import { padAddonVersion, padBlenderVersion } from "../../functions";

// Translations
// TODO: Properly name all ID's!!
import { FormattedMessage } from "react-intl";

export const FixEndpoint = ({
  inputData,
  callbackFunction,
  latestSPMVersion,
  exampleBlenderLTSVersion,
}) => {
  const [data, setData] = useState(inputData);
  const [changedData, setChangedData] = useState(0); // Workaround to trigger a re-render after the data changes
  const [validated, setValidated] = useState(false);

  // Error Data
  const [errorLocation, setErrorLocation] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [schemaPart, setSchemaPart] = useState();
  const [showComponent, setShowComponent] = useState(<></>);
  const [showMessage, setShowMessage] = useState(<></>);
  const [showFixButton, setShowFixButton] = useState(true);

  // Component Data
  const [allowAutomaticDownload, setAllowAutomaticDownload] = useState(true);
  const [addonVersion, setAddonVersion] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [minimumBlenderVersion, setMinimumBlenderVersion] = useState("");
  const [apiBreakingBlenderVersion, setApiBreakingBlenderVersion] =
    useState("");
  const [hasCompatibilityIssues, setHasCompatibilityIssues] = useState(true);

  // Check the data for issues, if the data changes.
  useEffect(() => {
    setValidated(false);
    const errors = checkSchemaErrors(data);
    // console.log("===Errors===");
    // console.log(errors);
    // console.log("======");

    // Return and invoke the callback function (This will result in the component beeing changed)
    if (errors.length == 0) {
      callbackFunction(data);
      return;
    }

    // Get the path to the property that needs to be changed.
    let path = errors.instancePath;
    if (errors.keyword === "required") {
      path = path + "/" + errors.params.missingProperty;
    }

    // Set the Path and the Error Message of the Error.
    setErrorLocation(path);
    setErrorMessage(errors.message);

    // Set the schema part (e.g. version, download_url, minimum_blender_version) that is affected by the error to determine,
    // which message and input to display.
    let path_arr = path.split("/");
    setSchemaPart(path_arr[path_arr.length - 1]);
  }, [changedData]);

  // Update the components that are displayed
  useEffect(() => {
    setShowFixButton(true);
    const errorMessageIntro = (
      <FormattedMessage
        id="endpoint_checker.fix_endpoint.error_message_intro"
        values={{ errorLocation: errorLocation }}
      />
    );
    switch (schemaPart) {
      case SCHEMA_PARTS.SCHEMA_VERSION:
        setShowComponent(<></>);
        setShowMessage(
          <FormattedMessage id="endpoint_checker.fix_endpoint.isvTQQvhTRMU" />
        );
        break;
      case SCHEMA_PARTS.VERSIONS:
        setShowComponent(<></>);
        setShowMessage(
          <FormattedMessage id="endpoint_checker.fix_endpoint.VVNIvfJFSdZNKfNa3sM" />
        );
        break;
      case SCHEMA_PARTS.VERSION:
        setShowComponent(
          <COMPONENTS.version
            latestSPMVersion={latestSPMVersion}
            addonVersion={addonVersion}
            onChange={(e) => {
              setAddonVersion(e.target.value);
            }}
            required
          />
        );
        setShowMessage(
          <FormattedMessage
            id="endpoint_checker.fix_endpoint.please_enter_a_valid_addon_version"
            values={{ errorMessageIntro: errorMessageIntro }}
          />
        );
        break;
      case SCHEMA_PARTS.DOWNLOAD_URL:
        setShowComponent(
          <>
            <COMPONENTS.allow_automatic_download
              onChange={(e) => {
                setAllowAutomaticDownload(e.target.checked);
              }}
              allowAutomaticDownload={allowAutomaticDownload}
            />
            <COMPONENTS.download_url
              allowAutomaticDownload={allowAutomaticDownload}
              downloadUrl={downloadUrl}
              onChange={(e) => {
                setDownloadUrl(e.target.value);
              }}
              required
            />
          </>
        );
        setShowMessage(
          <FormattedMessage
            id="endpoint_checker.fix_endpoint.please_enter_a_valid_download_url"
            values={{ errorMessageIntro: errorMessageIntro }}
          />
        );
        break;
      case SCHEMA_PARTS.MINIMUM_BLENDER_VERSION:
        setShowComponent(
          <COMPONENTS.minimum_blender_version
            minimumBlenderVersion={minimumBlenderVersion}
            exampleBlenderLTSVersion={exampleBlenderLTSVersion}
            onChange={(e) => {
              setMinimumBlenderVersion(e.target.value);
            }}
            required
          />
        );
        setShowMessage(
          <FormattedMessage
            id="endpoint_checker.fix_endpoint.yfdsg"
            values={{ errorMessageIntro: errorMessageIntro }}
          />
        );
        break;
      case SCHEMA_PARTS.API_BREAKING_BLENDER_VERSION:
        setShowComponent(
          <>
            <COMPONENTS.show_api_breaking_blender_version
              showApiBreakingBlenderVersion={hasCompatibilityIssues}
              onChange={(e) => {
                setHasCompatibilityIssues(e.target.checked);
              }}
            />
            <COMPONENTS.api_breaking_blender_version
              apiBreakingBlenderVersion={apiBreakingBlenderVersion}
              exampleBlenderLTSVersion={exampleBlenderLTSVersion}
              onChange={(e) => {
                setApiBreakingBlenderVersion(e.target.value);
              }}
              required={hasCompatibilityIssues}
            />
          </>
        );
        setShowMessage(
          <FormattedMessage
            id="endpoint_checker.fix_endpoint.please_enter_a_valid_minimum_blender_version"
            values={{ errorMessageIntro: errorMessageIntro }}
          />
        );
        break;
      default:
        setShowMessage(
          <>
            <FormattedMessage id="endpoint_checker.fix_endpoint.unknown_error" />
            <a href="https://github.com/BlenderDefender/SuperAddonManager/issues/new?assignees=BlenderDefender">
              <FormattedMessage id="endpoint_checker.fix_endpoint.contact_us_on_github" />
            </a>{" "}
            <FormattedMessage id="endpoint_checker.fix_endpoint.SUfOOJe2zyRIeBKGbb7v" />
          </>
        );
        setShowComponent(<></>);
        setShowFixButton(false);
    }
  }, [
    schemaPart,
    addonVersion,
    allowAutomaticDownload,
    downloadUrl,
    minimumBlenderVersion,
    apiBreakingBlenderVersion,
    hasCompatibilityIssues,
  ]);

  const fixError = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();

      return;
    }

    let path = errorLocation.split("/").slice(1);

    let newData;
    switch (schemaPart) {
      case SCHEMA_PARTS.SCHEMA_VERSION:
        newData = fixEntryFromPath(
          "super-addon-manager-version-info-1.0.0",
          data,
          path
        );
        break;
      case SCHEMA_PARTS.VERSIONS:
        newData = fixEntryFromPath([{}], data, path);
        break;
      case SCHEMA_PARTS.VERSION:
        newData = fixEntryFromPath(padAddonVersion(addonVersion), data, path);
        break;
      case SCHEMA_PARTS.DOWNLOAD_URL:
        if (downloadUrl.startsWith("https://")) {
          newData = fixEntryFromPath(downloadUrl, data, path);
        } else {
          newData = fixEntryFromPath("https://" + downloadUrl, data, path);
        }

        path[path.length - 1] = SCHEMA_PARTS.ALLOW_AUTOMATIC_DOWNLOAD;
        newData = fixEntryFromPath(allowAutomaticDownload, data, path);
        break;
      case SCHEMA_PARTS.MINIMUM_BLENDER_VERSION:
        newData = fixEntryFromPath(
          padBlenderVersion(minimumBlenderVersion),
          data,
          path
        );
        break;
      case SCHEMA_PARTS.API_BREAKING_BLENDER_VERSION:
        newData = fixEntryFromPath(
          padBlenderVersion(apiBreakingBlenderVersion),
          data,
          path,
          SCHEMA_PARTS.API_BREAKING_BLENDER_VERSION
        );
        break;
    }

    console.log("===New Data===");
    console.log(newData);
    console.log("======");

    setData(newData);
    setChangedData(changedData + 1);
  };

  // Check the data for schema errors.
  const checkSchemaErrors = (data) => {
    const validate = ajv.compile(SCHEMA);

    const valid = validate(data);

    if (!valid) return validate.errors[0];

    // TODO: Add code to find out, whether the files (Download URL) actually exist.
    return [];
  };

  // Fix an entry in an object from a given Path (Array)
  const fixEntryFromPath = (newEntryData, data, path, type = "default") => {
    // Change the last part of the Path provided by AJV
    if (path.length <= 1) {
      data[path[0]] = newEntryData;

      if (
        type === SCHEMA_PARTS.API_BREAKING_BLENDER_VERSION &&
        (!hasCompatibilityIssues ||
          data[SCHEMA_PARTS.MINIMUM_BLENDER_VERSION] >= newEntryData)
      ) {
        delete data[path[0]];
      }

      return data;
    }

    /* Change the element of the data that is one branch down the path.
    Example: The path to the element that needs to be changed is /versions/1/download_url
    Assuming that we're on the root of the path, moving down one branch means going to /versions.
    In this case, data.versions would be assigned the result of test(data.versions, "/1/download_url")
    This procedure repeats until the final branch is reached and the data gets actually changed.
    */
    data[path[0]] = fixEntryFromPath(
      newEntryData,
      data[path[0]],
      path.slice(1),
      type
    );
    return data;
  };

  return (
    <>
      <h1>
        <FormattedMessage id="endpoint_checker.data_input.title" />
      </h1>
      {/* ERROR MESSAGE */}
      <div>{showMessage}</div>
      {/* INPUT FOR FIXING */}
      <section className="form">
        <Form
          noValidate
          onSubmit={fixError}
          className={validated ? "sam-validation" : ""}
        >
          <Row>
            <Col className="mb-3 mt-2">{showComponent}</Col>
          </Row>
          <Col className="d-grid">
            {showFixButton ? (
              <Button variant="primary" type="submit">
                <FormattedMessage id="endpoint_checker.fix_endpoint.fix_this" />
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Form>
      </section>
    </>
  );
};
